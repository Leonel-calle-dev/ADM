// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js"; // 👈 Opcional

const firebaseConfig = {
  apiKey: "AIzaSyD2wpaEAQzrcfCoSnjBSavOTTJ1xnv2k2M",
  authDomain: "campus-palmas.firebaseapp.com",
  databaseURL: "https://campus-palmas-default-rtdb.firebaseio.com",
  projectId: "campus-palmas",
  storageBucket: "campus-palmas.firebasestorage.app",  // ✅ ¡Mantén la que te dio Firebase!
  messagingSenderId: "1042297524028",
  appId: "1:1042297524028:web:100618ff445a4134871839",
  measurementId: "G-H192H191PX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
