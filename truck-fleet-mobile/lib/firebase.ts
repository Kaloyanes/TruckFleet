// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { MMKV } from "react-native-mmkv";

const firebaseConfig = {
  apiKey: "AIzaSyBRU9KykZOPi_q7A9N2eD5EWQ9DZUwO-cE",
  authDomain: "truck-fleet.firebaseapp.com",
  projectId: "truck-fleet",
  storageBucket: "truck-fleet.appspot.com",
  messagingSenderId: "692358107394",
  appId: "1:692358107394:web:4350e781db354f2432321b",
  measurementId: "G-XFW2R9VHYY",
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(MMKV),
});
