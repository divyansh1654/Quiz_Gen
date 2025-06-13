// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcj6Ie1Yo7O2_iOtUQR6sGAy9rroIheas",
  authDomain: "quizgen-7e57d.firebaseapp.com",
  projectId: "quizgen-7e57d",
  storageBucket: "quizgen-7e57d.firebasestorage.app",
  messagingSenderId: "449382024706",
  appId: "1:449382024706:web:6b7ce4d8c919edecafc91b",
  measurementId: "G-H65F3048FB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);