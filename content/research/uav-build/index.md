---
title: "Autonomous Fixed-Wing UAV"
tags:
  - "autonomous-systems"
  - "embedded"
  - "ardupilot"
  - "robotics"
date: 2021-04-04
venue: ""
authors:
  - name: "Liam Cawley"
excerpt: "A 1.6 m MFD Crosswind Mini build with a Pixhawk Cube Orange, camera payload, and autonomous takeoff and waypoint flights. The accompanying design report now separates the completed build from proposed SUAS mission capabilities."
selected: false
priority: 5
links:
  - name: "paper"
    url: "/research/uav-build/UAVPaper_2021.pdf"
---

## Overview

I built and flew a 1.6 m MFD Crosswind Mini with autonomous takeoff and waypoint navigation. The aircraft integrated a Pixhawk Cube Orange running ArduPilot, RTK GPS, telemetry, and a camera payload. The work included airframe integration, state-estimation and control tuning, and an object-detection pipeline using YOLOv5 with Sony A6000 imagery.

The AUVSI SUAS 2021 mission supplied design requirements: a four-mile waypoint course, imaging roughly 250,000 m², identifying ground targets, and delivering a payload within a 40-minute mission budget. Those figures describe the target mission. They are not measured endurance or mapping performance for this aircraft.

The linked report describes an earlier 1.9 m Crosswind/Nimbus Pro design. Its component estimates and Keras letter-classifier proposal should be distinguished from the later Mini build. The report now opens with corrections to those distinctions and to several unsupported engineering claims.

<figure>
  <img src="/research/uav-build/crosswind-mini.jpg" alt="MFD Crosswind Mini airframe" />
  <figcaption>The MFD Crosswind Mini airframe used for the build.</figcaption>
</figure>

## Design Decisions

**Airframe integration.** The flight controller, power distribution, radio equipment, and camera payload had to fit within the foam fuselage while leaving access for wiring and maintenance. The earlier design's 6.2 cm center-of-gravity target belongs to its larger airframe; it is not a measured balance specification for the Mini.

**Navigation.** ArduPilot handled the waypoint mission and flight-control loops. The build used EKF3 state estimation and PID/TECS control tuning, with telemetry available at the ground station. Autonomous flights demonstrated the takeoff and waypoint functions; the record does not provide a measured waypoint-error distribution or endurance curve.

<figure>
  <img src="/research/uav-build/gcs-bench.jpg" alt="Ground control station bench test" />
  <figcaption>Ground-station bench setup with the flight controller, GPS, receiver, and telemetry hardware connected.</figcaption>
</figure>

**Imaging.** The camera payload combined a video view with high-resolution imagery. The later object-detection work used YOLOv5 and Sony A6000 images. The earlier report's two-camera triggering scheme was a design description; it does not supply measured detection accuracy, imaging throughput, or geolocation error.

<figure>
  <img src="/research/uav-build/wiring-diagram.jpg" alt="Hand-drawn power and signal wiring diagram" />
  <figcaption>The wiring plan separates power rails, flight-control connections, telemetry, and video links.</figcaption>
</figure>

## Corrections to the design record

The report proposed a parachute-delivered LaTrax Teton ground vehicle and obstacle-avoidance work on a companion computer. It contains no drop-test results, demonstrated self-righting mechanism, or completed competition score. These remain proposed mission components in that document.

Several technical statements also needed correction. Motor $K_v$ is measured in rpm per volt. The quoted current calculation used a different motor and propeller from the selected design, and cannot establish its endurance. Image geolocation requires camera geometry and aircraft pose and altitude; elapsed time along a flight path alone is insufficient. A SUAS competition demonstration also does not confer federal “level-5 autonomy” certification.

## Integration photographs

<figure>
  <img src="/research/uav-build/airframe-integration.jpg" alt="Airframe interior during integration" />
  <figcaption>Airframe integration with the fuselage open and the wing sections detached.</figcaption>
</figure>

<figure>
  <img src="/research/uav-build/preflight-setup.jpg" alt="Assembled aircraft during preflight setup" />
  <figcaption>The assembled aircraft connected to the ground station for parameter checks.</figcaption>
</figure>

The [report](/research/uav-build/UAVPaper_2021.pdf) retains the original design after the correction note, so the distinction between the proposal and the later build remains visible.
