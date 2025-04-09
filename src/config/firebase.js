// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8l_QqqnTgKA5-cQ3QM24q7HG3aXLvr2k",
  authDomain: "recipemealplanner-d7f92.firebaseapp.com",
  projectId: "recipemealplanner-d7f92",
  storageBucket: "recipemealplanner-d7f92.firebasestorage.app",
  messagingSenderId: "884688742411",
  appId: "1:884688742411:web:d9e88cc82a19441d88ff0e",
  measurementId: "G-1JVF56YJ23",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };

