import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOwTjPkQRwXOTVKlteRm2GhBan-SFGJLg",
    authDomain: "uh-wifi-heatmap-42898.firebaseapp.com",
    projectId: "uh-wifi-heatmap-42898",
    storageBucket: "uh-wifi-heatmap-42898.firebasestorage.app",
    messagingSenderId: "1038019406746",
    appId: "1:1038019406746:web:9cbd55a4c78db805ee6823"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
