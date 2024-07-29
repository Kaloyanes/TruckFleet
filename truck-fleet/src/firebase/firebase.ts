import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
import {
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const credentials = {
  apiKey: "AIzaSyBRU9KykZOPi_q7A9N2eD5EWQ9DZUwO-cE",
  authDomain: "truck-fleet.firebaseapp.com",
  projectId: "truck-fleet",
  storageBucket: "truck-fleet.appspot.com",
  messagingSenderId: "692358107394",
  appId: "1:692358107394:web:4350e781db354f2432321b",
  measurementId: "G-XFW2R9VHYY",
};

export const app = initializeApp(credentials);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    tabManager: persistentMultipleTabManager(),
  }),
});
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});
export const analytics = getAnalytics(app);
