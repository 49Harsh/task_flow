# AbleSpace Product Walkthrough — Caseload & Data Collection

## Overview

### Target Audience & Problem Statement
The **Caseload → Take Data** screen in **AbleSpace** is designed specifically for **Special Education Teachers, Speech-Language Pathologists (SLPs), Board Certified Behavior Analysts (BCBAs), and Occupational Therapists (OTs)** working in K-12 school environments and clinical therapy settings.

#### Core Problem Solved:
Special education providers are required by law (IEP — Individualized Education Program standards) to record real-time trial and observational data for students with special needs across multiple behavioral, academic, and IEP goal domains. Historically, providers relied on paper tally sheets, clipboards, or fragmented spreadsheets, leading to lost records, high clerical burden, and manual calculations. 

AbleSpace's **Take Data** workflow digitizes real-time data collection directly inside the classroom, eliminating manual graphing while maintaining high data accuracy for compliance reporting and IEP progress monitoring.

---

## Step-by-Step Workflow Description

1. **Caseload Selection**:
   - The provider accesses the **Caseload** tab from the primary navigation bar.
   - The screen lists active students assigned to the provider, showing key IEP status tags, primary grade level, and assigned IEP goals.

2. **Initiating Data Collection ("Take Data")**:
   - The provider clicks the prominent **"Take Data"** action button next to a student's profile.
   - This opens a focused, distraction-free data collection view specifically tailored for fast touch inputs on tablets or desktop screens during active therapy/classroom sessions.

3. **Goal & Data Type Selection**:
   - Active IEP goals for the selected student are displayed (e.g., *Expressive Language*, *Task Initiation*, *Behavioral Rate Tracking*).
   - Providers select the specific metric type suited for the trial:
     - **Trial / Accuracy (%)**: Plus/Minus counters (+ / -) for correct vs. incorrect responses.
     - **Frequency / Rate**: Tally counter measuring occurrences over a set duration.
     - **Duration**: Built-in stopwatch timer to measure time spent on/off task.
     - **Prompt Hierarchy Rating**: Level of prompting required (Independent, Gesture, Verbal, Physical).

4. **Recording Session Data**:
   - As the therapy trial progresses, the provider taps `+` (success) or `-` (incorrect/prompted) counters in real-time.
   - Immediate feedback indicators calculate current session percentage accuracy on-the-fly.

5. **Saving & Auto-Graphing**:
   - Clicking **"Save Session"** logs the data entries, attaches a timestamp, and updates the student's IEP progress trend graph automatically.

---

## 4 Concrete UX/UI & Functionality Recommendations

### 1. One-Tap Quick Tally & Haptic Feedback on Mobile/Tablet
- **Current Limitation**: Providers often hold a tablet or mobile device in one hand while guiding a student with the other. Small button targets increase tap error rates during active behavioral meltdowns or fast-paced trials.
- **Proposed UX Improvement**: Increase trial button tap targets to giant split-screen targets (Left side = Red `-` Prompted/Incorrect, Right side = Green `+` Independent) and trigger subtle haptic vibration upon registration.
- **Reasoning**: Reduces cognitive load and touch precision requirements during high-intensity classroom therapy.

### 2. Multi-Student Simultaneous Group Data Collection
- **Current Limitation**: Teachers frequently run group sessions (3–5 students at a reading table) but current flows require switching student contexts back and forth.
- **Proposed UX Improvement**: Introduce a "Group Session Grid" mode where goals for 3 students are displayed side-by-side on a single tablet screen.
- **Reasoning**: Prevents session interruption and enables seamless parallel data logging for small group instruction.

### 3. Voice-Assisted / Offline-First Hands-Free Logging
- **Current Limitation**: When conducting gross motor therapy (OT) or handling behavioral interventions, providers cannot physically touch screens without breaking physical contact with the student.
- **Proposed UX Improvement**: Add local offline voice trigger phrases (e.g., "Log trial correct", "Plus 1 prompt") utilizing browser SpeechRecognition API, queued locally for auto-sync when back online.
- **Reasoning**: Ensures zero data loss when therapists are moving around sensory gyms or playgrounds without steady internet connectivity.

### 4. Smart Trend Anomaly & Baseline Alerting
- **Current Limitation**: Providers only discover a student is regression-trending when preparing quarterly IEP reports.
- **Proposed UX Improvement**: Display an automated inline warning badge ("3 consecutive sessions below baseline") directly on the Take Data screen header.
- **Reasoning**: Enables early pedagogical interventions before quarterly deadlines.
