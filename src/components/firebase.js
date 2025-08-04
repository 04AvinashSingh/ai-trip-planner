// Import the functions you need
import { initializeApp,getApps  } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config object from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDZ0FKLpOrrVGbITPyEnsa3y8Se1WJKp6U",
  authDomain: "ai-travel-planner-682fc.firebaseapp.com",
  projectId: "ai-travel-planner-682fc",
  storageBucket: "ai-travel-planner-682fc.firebasestorage.app",
  messagingSenderId: "466435792800",
  appId: "1:466435792800:web:5e64cbae3142f723fdcec5",
  measurementId: "G-KGF28EWTY5"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);

