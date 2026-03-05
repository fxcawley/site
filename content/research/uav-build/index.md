---
title: "AutoUAV Build"
tags:
  - "autonomous-robotics"
  - "flight"
  - "ardupilot"
  - "embedded-systems"
date: 2021-04-04
venue: WRAM Field, Patterson, NY
authors:
  - name: "Liam Cawley"
excerpt: An autonomous UAV system built on the MFD Crosswind Mini platform, designed to achieve Level 5 autonomy for agricultural and mapping applications. This project demonstrates advanced autonomous flight capabilities through integration of computer vision, GPS navigation, and real-time telemetry.
selected: false
priority: 5
links:
  - name: "pdf"
    url: "/research/uav-build/UAVPaper_2021.pdf"
  - name: "website"
    url: "https://www.cawleyl.medium.com"
---

# Autonomous UAV Project

## Project Overview

An autonomous UAV system built on the MFD Crosswind Mini platform, designed to achieve Level 5 autonomy for agricultural and mapping applications. This project demonstrates advanced autonomous flight capabilities through integration of computer vision, GPS navigation, and real-time telemetry.

## Key Features

- Level 5 autonomous flight capabilities
- Real-time telemetry and mission control
- Advanced GPS navigation with RTK precision
- Computer vision-based obstacle avoidance
- Automated return-to-home functionality
- Dual-camera system for FPV and high-resolution imaging
- Custom ArduPilot-based flight algorithms

## Technical Specifications

### Airframe
- Model: MFD Crosswind Mini 1.6m
- Wingspan: 1600mm
- Length: 1080mm
- Flying Weight: 2829g (fully equipped)
- Wing Area: 33dm²

### Core Components
- Flight Controller: Pixhawk Cube Orange
- GPS: Here2 RTK GPS
- Telemetry: RFD 900 (900MHz)
- Motors: 2x Sunnysky 2216 800Kv
- ESCs: 2x Hobbywing 80A
- Battery: Sony Konion 3120mAh 30A Li-ion

### Camera System
- Primary Camera: Sony A6000 (High-res mapping)
- FPV Camera: Foxeer Arrow
- Video Transmission: MatekSys 1.3 GHz VTX

## Software Architecture

### Flight Control
The system utilizes a custom ArduPilot-based flight algorithm running on the Pixhawk Cube Orange:
- ArduPilot firmware for core flight operations
- Custom mission planning algorithms
- Real-time telemetry processing
- Fail-safe protocols and return-to-home functionality

### Navigation System
- GPS-guided waypoint navigation
- RTK-enhanced position accuracy
- Dynamic obstacle avoidance
- Automated landing protocols

## Development Timeline

- July 2020: Component selection and initial design
- September 2020: Airframe assembly and electronics integration
- October 2020: Software development and system testing
- November 2020: First test flight and system optimization
