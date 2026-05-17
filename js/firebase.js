// =========================================================
// FIREBASE IMPORTS
// =========================================================

import {
    initializeApp
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    onSnapshot
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =========================================================
// FIREBASE CONFIG
// =========================================================
// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyANWx-Uhq5uwgMqk1iaAB8NvBsQsUxAPjw",
    authDomain: "study-dashboard-7ca48.firebaseapp.com",
    projectId: "study-dashboard-7ca48",
    storageBucket: "study-dashboard-7ca48.firebasestorage.app",
    messagingSenderId: "745280498866",
    appId: "1:745280498866:web:39534ba9c4de40a7db6dab"
  };



// =========================================================
// INITIALIZE FIREBASE
// =========================================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// =========================================================
// EXPORT TO WINDOW
// =========================================================

window.db = db;

window.firebaseDoc = doc;

window.firebaseGetDoc = getDoc;

window.firebaseSetDoc = setDoc;

window.firebaseOnSnapshot = onSnapshot;
