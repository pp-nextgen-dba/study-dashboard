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

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_AUTH_DOMAIN",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_STORAGE_BUCKET",

    messagingSenderId: "YOUR_MESSAGING_ID",

    appId: "YOUR_APP_ID"

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
