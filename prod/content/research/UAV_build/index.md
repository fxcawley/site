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
path: "research/UAV_build"
excerpt: An autonomous UAV system built on the MFD Crosswind Mini platform, designed to achieve Level 5 autonomy for agricultural and mapping applications. This project demonstrates advanced autonomous flight capabilities through integration of computer vision, GPS navigation, and real-time telemetry.
selected: false
cover: "./UAV_preview.png"
links:
  - name: "pdf"
    file: "./UAVPaper_2021.pdf"
  - name: "website"
    url: "https://www.cawleyl.medium.com"
priority: 5
---

# Autonomous UAV Project 🛩️
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/cawley)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Project Overview 🎯

An autonomous UAV system built on the MFD Crosswind Mini platform, designed to achieve Level 5 autonomy for agricultural and mapping applications. This project demonstrates advanced autonomous flight capabilities through integration of computer vision, GPS navigation, and real-time telemetry.

## Key Features 🌟

- Level 5 autonomous flight capabilities
- Real-time telemetry and mission control
- Advanced GPS navigation with RTK precision
- Computer vision-based obstacle avoidance
- Automated return-to-home functionality
- Dual-camera system for FPV and high-resolution imaging
- Custom ArduPilot-based flight algorithms

## Technical Specifications 📊

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
- Propellers: APC Style 10x7E & 10x7EP

### Camera System
- Primary Camera: Sony A6000 (High-res mapping)
- FPV Camera: Foxeer Arrow
- Recording: Foxeer Box
- Video Transmission: MatekSys 1.3 GHz VTX
- Antennas: GepRC RHCP Pagoda & Triple Feed Patch Array

## Software Architecture 💻

### Flight Control
The system utilizes a custom ArduPilot-based flight algorithm running on the Pixhawk Cube Orange. The flight control stack includes:

- ArduPilot firmware for core flight operations
- Custom mission planning algorithms
- Real-time telemetry processing
- Fail-safe protocols and return-to-home functionality

### Navigation System
- GPS-guided waypoint navigation
- RTK-enhanced position accuracy
- Dynamic obstacle avoidance
- Automated landing protocols

## Setup Guide 🔧

1. **Airframe Assembly**
   - Follow MFD Crosswind Mini assembly guidelines
   - Pay special attention to wing spar alignment
   - Verify all control surfaces move freely

2. **Electronics Installation**
   - Mount Pixhawk Cube Orange centrally
   - Install GPS with clear sky view
   - Position cameras with unobstructed view
   - Route all cables with proper strain relief

3. **Software Configuration**
   - Flash Pixhawk with ArduPilot firmware
   - Configure flight parameters
   - Calibrate sensors and ESCs
   - Test all control systems on ground

## Flight Operations 🚁

### Pre-flight Checklist
- Battery voltage verification
- Control surface movement check
- GPS lock confirmation
- Telemetry link test
- Fail-safe testing
- Wind condition assessment

### Safety Protocols
- Always maintain visual line of sight
- Keep safety pilot on standby
- Monitor battery voltage
- Observe local flight regulations
- Maintain minimum safe altitude

## Development Timeline 📅

- July 2020: Component selection and initial design
- September 2020: Airframe assembly and electronics integration
- October 2020: Software development and system testing
- November 2020: First test flight and system optimization

## Contributing 🤝

We welcome contributions to this project! Please read our contributing guidelines and submit pull requests for any enhancements.

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 👏

- MFD for the excellent Crosswind Mini platform
- ArduPilot community for firmware support
- All contributors and testers

## Contact 📫

For questions or collaboration opportunities, please reach out through GitHub issues or email.

---
Built with ❤️ by Liam Cawley