// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
