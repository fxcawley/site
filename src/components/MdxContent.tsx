import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypePrettyCode from 'rehype-pretty-code';
import { IclMechanism, WeightedVote, GdVsCg, KernelShift } from '@/components/figures/metarepicl';
import { RashomonSet, TwoUncertainties, FlatDirection, SignFlipCloud } from '@/components/figures/stableglm';
import { AmbiguityBars, TightnessVsDim, McrBars, EpsilonSweep } from '@/components/figures/stableglm-findings';
import {
  AnomalyLoop, BeliefToReturns, WhyMarkets,
  FakeAlpha, IterationLadder, RegimeEquity, CostByFrequency,
  AltPipelines, ValidationGates, KalshiCalibration, CostEatsAlpha,
} from '@/components/figures/ml-trading';
import { MstToSteiner, FaultTolerance, IntegralityGapLadder, Uncrossing } from '@/components/figures/steiner';

const components = {
  IclMechanism,
  WeightedVote,
  GdVsCg,
  KernelShift,
  RashomonSet,
  TwoUncertainties,
  FlatDirection,
  SignFlipCloud,
  AmbiguityBars,
  TightnessVsDim,
  McrBars,
  EpsilonSweep,
  AnomalyLoop,
  BeliefToReturns,
  WhyMarkets,
  FakeAlpha,
  IterationLadder,
  RegimeEquity,
  CostByFrequency,
  AltPipelines,
  ValidationGates,
  KalshiCalibration,
  CostEatsAlpha,
  MstToSteiner,
  FaultTolerance,
  IntegralityGapLadder,
  Uncrossing,
};

const mdxOptions = {
  remarkPlugins: [remarkMath, remarkGfm],
  rehypePlugins: [
    rehypeKatex as any,
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        theme: 'github-dark',
        keepBackground: true,
      },
    ],
  ],
};

interface MdxContentProps {
  source: string;
}

export default function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="prose">
      <MDXRemote source={source} components={components} options={{ mdxOptions: mdxOptions as any }} />
    </div>
  );
}
