// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyD2wpaEAQzrcfCoSnjBSavOTTJ1xnv2k2M",
    authDomain: "campus-palmas.firebaseapp.com",
    databaseURL: "https://campus-palmas-default-rtdb.firebaseio.com",
    projectId: "campus-palmas",
    storageBucket: "campus-palmas.firebasestorage.app",
    messagingSenderId: "1042297524028",
    appId: "1:1042297524028:web:0af2592e782ab4ee871839",
    measurementId: "G-KZFTX9BXJZ"
  };

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { app, auth, db };
