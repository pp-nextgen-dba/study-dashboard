import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyANWx-Uhq5uwgMqk1iaAB8NvBsQsUxAPjw",
    authDomain: "study-dashboard-7ca48.firebaseapp.com",
    projectId: "study-dashboard-7ca48",
    storageBucket: "study-dashboard-7ca48.firebasestorage.app",
    messagingSenderId: "745280498866",
    appId: "1:745280498866:web:39534ba9c4de40a7db6dab"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
