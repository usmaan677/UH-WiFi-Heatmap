# UH WiFi Heatmap

An interactive web app to visualize the WiFi strength at various locations on the University of Houston campus. Users can rate WiFi strength at specific campus spots or submit ratings from their current GPS location. These ratings are aggregated and displayed as a live heatmap.

## 🌐 Live Site

👉 [View the Live App](https://uh-wi-fi-heatmap-4g7c.vercel.app/)  

---

## 🚀 Features

- **📍 Submit WiFi Strength**: Choose a preset UH location or use your current GPS location to submit WiFi strength (scale of 1 to 5).
- **🔥 Heatmap Visualization**: A real-time Leaflet-based heatmap displays average strengths across campus.
- **📱 Mobile-Friendly**: Optimized layout for use on phones, tablets, and desktops.

---

## 🛠 Tech Stack

- **Frontend**: React + Tailwind CSS
- **Map Rendering**: Leaflet + `leaflet.heat`
- **Database**: Firebase Firestore
- **Deployment**: Vercel

---

## 🧑‍💻 How to Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/usmaan677/uh-wifi-heatmap.git
cd uh-wifi-heatmap
```
### 2. Install dependencies
```bash
npm install
```

### 3. Set up your Firebase config
Create a .env file in the root directory with the following:

```
VITE_FIREBASE_apiKey=your-api-key
VITE_FIREBASE_authDomain=your-auth-domain
VITE_FIREBASE_projectId=your-project-id
VITE_FIREBASE_storageBucket=your-storage-bucket
VITE_FIREBASE_messagingSenderId=your-messaging-sender-id
VITE_FIREBASE_appId=your-app-id
```
### 4. Run locally
```
npm run dev
```
Visit http://localhost:3000 to see the app.

## 🌍 Deployment Notes
This project is deployed via Vercel.
Environment variables used in .env must also be added in your Vercel project settings under:

Vercel Dashboard → Your Project → Settings → Environment Variables

Make sure each VITE_... variable is entered exactly as-is (they must begin with VITE_ for Vite to expose them to your frontend).


## 🙌 Acknowledgments
React

Leaflet.js

Firebase Firestore

Vercel

Tailwind CSS
