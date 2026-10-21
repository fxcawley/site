"""Corrected evaluation/split handling for the archived super-resolution report.

Dependencies: numpy, pillow, scikit-image.
Run: python evaluation.py --self-test --output evaluation_checks.json

The original checkpoints are unavailable. The checks reproduce the range error
on synthetic images; they are not replacement DIV2K performance measurements.
Models supplied to train_and_evaluate must implement Keras-style fit/predict.
"""

import argparse
from dataclasses import dataclass
import json
from pathlib import Path

import numpy as np
from PIL import Image
from skimage.metrics import peak_signal_noise_ratio, structural_similarity


@dataclass
class Sample:
    image_id: str
    lr: np.ndarray
    hr: np.ndarray


def encode_pixels(image, convention):
    """Convert dataset RGB pixels in [0,255] to a declared model convention."""
    pixels = np.asarray(image, dtype=np.float32)
    if pixels.ndim != 3 or pixels.shape[-1] != 3:
        raise ValueError("Expected an H x W x 3 RGB image")
    if not np.isfinite(pixels).all() or pixels.min() < 0 or pixels.max() > 255:
        raise ValueError("Dataset pixels must be finite and lie in [0,255]")
    if convention == "uint8":
        return pixels
    if convention == "unit":
        return pixels / 255.0
    if convention == "signed":
        return pixels / 127.5 - 1.0
    raise ValueError("Use uint8, unit, or signed")


def decode_prediction(prediction, convention):
    """Return clipped RGB float pixels in [0,1], without premature uint8 casts."""
    pixels = np.asarray(prediction, dtype=np.float64)
    if not np.isfinite(pixels).all():
        raise ValueError("Prediction contains nonfinite values")
    if convention == "uint8":
        pixels = pixels / 255.0
    elif convention == "signed":
        pixels = (pixels + 1.0) / 2.0
    elif convention != "unit":
        raise ValueError("Use uint8, unit, or signed")
    return np.clip(pixels, 0.0, 1.0)


def image_metrics(reference_uint8, prediction_unit):
    reference = encode_pixels(reference_uint8, "unit").astype(np.float64)
    prediction = np.asarray(prediction_unit, dtype=np.float64)
    if prediction.shape != reference.shape:
        raise ValueError("Prediction and reference must have identical RGB dimensions")
    if not np.isfinite(prediction).all() or prediction.min() < 0 or prediction.max() > 1:
        raise ValueError("Metrics require predictions in [0,1]")
    if min(reference.shape[:2]) < 11:
        raise ValueError("The declared SSIM protocol uses an 11-pixel window")
    return {
        "psnr": float(peak_signal_noise_ratio(reference, prediction, data_range=1.0)),
        "ssim": float(structural_similarity(
            reference, prediction, data_range=1.0, channel_axis=-1, win_size=11,
        )),
    }


def evaluate(model, samples, input_convention, output_convention):
    """Evaluate every supplied image; report model and bicubic scores together."""
    if not samples:
        raise ValueError("Evaluation set is empty")
    rows = []
    for sample in samples:
        lr = encode_pixels(sample.lr, input_convention)
        output = np.asarray(model.predict(lr[None], verbose=0))
        if output.ndim != 4 or output.shape[0] != 1:
            raise ValueError("predict() must return one batched RGB image")
        prediction = decode_prediction(output[0], output_convention)
        bicubic = np.asarray(Image.fromarray(np.asarray(sample.lr, dtype=np.uint8)).resize(
            (sample.hr.shape[1], sample.hr.shape[0]), resample=Image.Resampling.BICUBIC,
        ), dtype=np.float64) / 255.0
        rows.append({
            "image_id": sample.image_id,
            "model": image_metrics(sample.hr, prediction),
            "bicubic": image_metrics(sample.hr, bicubic),
        })
    return {
        "protocol": "RGB float [0,1]; fixed data_range=1; SSIM channel_axis=-1, win_size=11",
        "n_images": len(rows),
        "rows": rows,
        "mean": {
            method: {
                metric: float(np.mean([row[method][metric] for row in rows]))
                for metric in ("psnr", "ssim")
            }
            for method in ("model", "bicubic")
        },
    }


def train_and_evaluate(model, training_samples, evaluation_samples, *,
                       input_convention, output_convention, epochs=1):
    """Train on one manifest and evaluate on a disjoint manifest."""
    if not training_samples or not evaluation_samples:
        raise ValueError("Both training and evaluation samples are required")
    train_ids = {sample.image_id for sample in training_samples}
    eval_ids = {sample.image_id for sample in evaluation_samples}
    if len(train_ids) != len(training_samples) or len(eval_ids) != len(evaluation_samples):
        raise ValueError("Image IDs must be unique within each split")
    if train_ids & eval_ids:
        raise ValueError("Training and evaluation image IDs overlap")

    def batches():
        while True:
            for sample in training_samples:
                yield (
                    encode_pixels(sample.lr, input_convention)[None],
                    encode_pixels(sample.hr, output_convention)[None],
                )

    model.fit(batches(), epochs=epochs, steps_per_epoch=len(training_samples))
    return evaluate(model, evaluation_samples, input_convention, output_convention)


def verify():
    # A perfect signed-range prediction becomes almost black under the old cast.
    reference = np.linspace(0, 255, 32 * 32 * 3).reshape(32, 32, 3)
    signed = reference / 127.5 - 1.0
    old_cast = np.clip(signed, 0, 255).astype(np.uint8)
    legacy_psnr = float(peak_signal_noise_ratio(reference, old_cast, data_range=255.0))
    restored = decode_prediction(signed, "signed")
    np.testing.assert_allclose(restored, reference / 255.0, atol=1e-15)
    assert 4.7 < legacy_psnr < 4.9

    class PerfectUpsampler:
        def __init__(self):
            self.fit_calls = 0

        def fit(self, batches, **kwargs):
            self.fit_calls += 1
            lr, hr = next(batches)
            assert lr.min() >= -1 and lr.max() <= 1
            assert hr.min() >= -1 and hr.max() <= 1

        def predict(self, batch, **kwargs):
            assert batch.min() >= -1 and batch.max() <= 1
            return batch.repeat(2, axis=1).repeat(2, axis=2)

    lr = np.arange(16 * 16 * 3, dtype=np.uint16).reshape(16, 16, 3) % 256
    lr = lr.astype(np.uint8)
    hr = lr.repeat(2, axis=0).repeat(2, axis=1)
    model = PerfectUpsampler()
    train = [Sample("train-0001", lr, hr)]
    validation = [Sample("valid-0801", lr, hr)]
    try:
        train_and_evaluate(model, train, train, input_convention="signed", output_convention="signed")
        raise AssertionError("Overlapping splits were accepted")
    except ValueError:
        assert model.fit_calls == 0
    result = train_and_evaluate(
        model, train, validation, input_convention="signed", output_convention="signed",
    )
    assert model.fit_calls == 1
    assert result["mean"]["model"]["psnr"] > 140
    assert result["mean"]["model"]["ssim"] > 0.999999
    return {
        "scope": "synthetic regression checks; no recovered DIV2K checkpoint",
        "legacy_psnr_for_perfect_signed_prediction": legacy_psnr,
        "restored_max_pixel_error": float(abs(restored * 255.0 - reference).max()),
        "overlapping_split_rejected_before_training": True,
        "normalized_inputs_and_outputs_verified": True,
        "corrected_perfect_upsampler_psnr": result["mean"]["model"]["psnr"],
        "corrected_perfect_upsampler_ssim": result["mean"]["model"]["ssim"],
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--self-test", action="store_true", required=True)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    text = json.dumps(verify(), indent=2, allow_nan=False) + "\n"
    if args.output:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")
