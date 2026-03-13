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
excerpt: "Design and flight testing of an autonomous fixed-wing UAV built on the MFD Crosswind Mini platform, targeting GPS-guided waypoint missions for agricultural survey."
selected: false
priority: 5
links:
  - name: "paper"
    url: "/research/uav-build/UAVPaper_2021.pdf"
---

# Autonomous Fixed-Wing UAV

## Overview

This project built a fully autonomous fixed-wing UAV from airframe selection through first flight, targeting GPS-guided agricultural survey missions. The platform is a 1.6m MFD Crosswind Mini twin-motor pusher, running ArduPilot on a Pixhawk Cube Orange with RTK GPS.

## Design Decisions

**Airframe.** Fixed-wing over multirotor for endurance: the Crosswind Mini achieves roughly 40 minutes of flight on a 3120 mAh Li-ion pack, versus ~15 minutes for a comparable-weight quadcopter. The pusher configuration keeps the propellers behind the wing, leaving the nose clear for camera payloads.

**Navigation.** RTK GPS (Here2 module) provides centimeter-level position accuracy, which is necessary for the tight survey grids used in precision agriculture. Waypoint missions are planned in Mission Planner and uploaded over a 900 MHz telemetry link.

**Autonomy.** The system handles takeoff, waypoint following, loiter, and return-to-home without operator input. Fail-safes trigger RTH on signal loss, low battery, or geofence breach. The flight controller runs a tuned PID loop for attitude stabilization and L1 navigation for path following.

**Payload.** A Sony A6000 on a fixed mount captures high-resolution stills at timed intervals. A separate Foxeer Arrow FPV camera provides a live downlink for situational awareness. Images are geotagged post-flight and stitched into orthomosaics.

## Lessons

The hardest part of the project was not software but airframe integration: fitting the Pixhawk, GPS, telemetry radio, video transmitter, and two cameras into a 1.6m fuselage with acceptable center-of-gravity margins. Weight and CG are the binding constraints --- every component addition requires a corresponding ballast adjustment or relocation. The second hardest part was PID tuning in wind, which requires flight time that is expensive in terms of both battery cycles and risk.
