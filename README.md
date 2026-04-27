# GEMINI LIFELINE - Crisis Intelligence Platform

GEMINI LIFELINE is a real-time emergency reporting and response coordination platform powered by Google Gemini AI and Firebase.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

## 🛠️ Prerequisites

- **Node.js**: 16+ LTS
- **Firebase Account**: Enable Firestore in Test Mode.
- **Google Maps API Key**: Enable "Maps JavaScript API" and "Places API".
- **Gemini API Key**: From Google AI Studio.

## ⚙️ Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=AIzaSyBsNXG41mzTMXp74mtiNOH6_mgP0KTf9Y8
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

## ✨ Key Features

- **AI-Powered Intake**: Gemini 1.5 Flash processes raw incident reports into structured data.
- **Duplicate Detection**: Smart AI analysis prevents redundant reports and merges data.
- **Real-Time Sync**: Firestore ensures all responders see the same data instantly.
- **Interactive Map**: High-fidelity Google Maps dashboard with severity-based markers.
- **Responder Tools**: Actionable dashboard to accept and resolve incidents.

## 📂 Project Structure

- `src/services`: Core logic for Gemini, Firebase, and Maps.
- `src/components`: Reusable UI modules (Forms, Maps, Lists).
- `src/hooks`: Real-time data synchronization hooks.
- `src/pages`: Main application views (Citizen Reporter, Responder Dashboard).
- `src/utils`: Validation, formatting, and demo data logic.

---
Built with ❤️ by Antigravity.
