// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeGbMj4VIboeLTzUuJCvhIFUBvgmylt_U",
  authDomain: "routina-d9a63.firebaseapp.com",
  projectId: "routina-d9a63",
  storageBucket: "routina-d9a63.firebasestorage.app",
  messagingSenderId: "367461008958",
  appId: "1:367461008958:web:7a7e22f22f774be754736f",
  measurementId: "G-6SPW1PHJY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export default app;