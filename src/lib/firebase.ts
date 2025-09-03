// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// IMPORTANT: This object is automatically generated and should not be modified.
const firebaseConfig = {
  "projectId": "khui-companion",
  "appId": "1:370708290195:web:f81be08bc817c2fc128b66",
  "storageBucket": "khui-companion.appspot.com",
  "apiKey": "AIzaSyB-GvxNCHsG2mnnFEyc5NOpjOWGqp-g_x4",
  "authDomain": "khui-companion.firebaseapp.com",
  "messagingSenderId": "370708290195"
};

// Initialize Firebase
// We check if an app is already initialized to prevent errors during hot-reloading.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
