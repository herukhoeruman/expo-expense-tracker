// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaTzwetXkFQSFUwf5EbJFZDO-T6PU2g2w",
  authDomain: "expences-tracker-53b35.firebaseapp.com",
  projectId: "expences-tracker-53b35",
  storageBucket: "expences-tracker-53b35.firebasestorage.app",
  messagingSenderId: "835325614567",
  appId: "1:835325614567:web:02e8437f2fdc9a5c098542",
  measurementId: "G-XYFCG60551",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);
