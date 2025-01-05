import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
    apiKey: "AIzaSyDHazvo6wKQPc-N2fUFnYW6rS4CDPV2cpE",
    authDomain: "nannies-neighbour.firebaseapp.com",
    projectId: "nannies-neighbour",
    storageBucket: "nannies-neighbour.firebasestorage.app",
    messagingSenderId: "743164498994",
    appId: "1:743164498994:web:3aa35f612ced747c0ad82b",
    measurementId: "G-0KHFBPY80P"
  };

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;