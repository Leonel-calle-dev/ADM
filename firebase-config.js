import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2wpaEAQzrcfCoSnjBSavOTTJ1xnv2k2M",
  authDomain: "campus-palmas.firebaseapp.com",
  databaseURL: "https://campus-palmas-default-rtdb.firebaseio.com",
  projectId: "campus-palmas",
  storageBucket: "campus-palmas.firebasestorage.app",
  messagingSenderId: "1042297524028",
  appId: "1:1042297524028:web:100618ff445a4134871839",
  measurementId: "G-H192H191PX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
