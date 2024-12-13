import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZEMlmST2AOyeQwnbF3K6RRe3GQDhb_VA",
  authDomain: "swagger-f3ad8.firebaseapp.com",
  projectId: "swagger-f3ad8",
  storageBucket: "swagger-f3ad8.appspot.com",
  messagingSenderId: "292837661069",
  appId: "1:292837661069:web:6718f9f11bc238a21105c4",
  measurementId: "G-P436WQD4NH",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const FireStoreDatabase = getFirestore(app);
export const Auth = getAuth(app);
export const SignInWithPhoneNumber = signInWithPhoneNumber;
