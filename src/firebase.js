// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, doc, Timestamp, startAfter, limit, orderBy, getCountFromServer } from "firebase/firestore";

// Your Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, query, where, getDocs, Timestamp, startAfter, limit, orderBy, doc, getCountFromServer };

