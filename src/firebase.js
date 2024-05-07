import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAR-4g5oDHAqC9XNMYW-Dr_LZj9SI_qDsc",
  authDomain: "abigailstodoapp.firebaseapp.com",
  projectId: "abigailstodoapp",
  storageBucket: "abigailstodoapp.appspot.com",
  messagingSenderId: "451648592201",
  appId: "1:451648592201:web:c75b8fe7c4bcecf46c2298",
  measurementId: "G-LNH9361JWJ"
};

const googleAuthProvider = new GoogleAuthProvider();

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  db,
  googleAuthProvider,
  storage
};