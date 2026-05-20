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
// INITIALIZE
// =========================================================

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);


// =========================================================
// EXAMS
// =========================================================

const exams = [

    {
        name: "Form 2 Final Exams",
        date: "2026-11-01"
    },

    {
        name: "Form 3 Mid Exams",
        date: "2027-05-01"
    },

    {
        name: "Form 3 Final Exams",
        date: "2027-11-01"
    },

    {
        name: "Form 4 Mid Exams",
        date: "2028-05-01"
    },

    {
        name: "Form 4 Final Exams",
        date: "2028-11-01"
    },

    {
        name: "Form 5 Mid Exams",
        date: "2029-05-01"
    },

    {
        name: "Form 5 Final Exams",
        date: "2029-10-01"
    },

    {
        name: "SPM Exams",
        date: "2029-11-01"
    }

];


// =========================================================
// EXAM DISPLAY
// =========================================================

const examCards =
    document.getElementById("examCards");

exams.forEach(exam => {

    const today = new Date();

    today.setHours(0,0,0,0);

    const parts =
        exam.date.split("-");

    const examDate =
        new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        );

    examDate.setHours(0,0,0,0);

    const diffTime =
        examDate - today;

    const diffDays =
        Math.floor(
            diffTime /
            (1000 * 60 * 60 * 24)
        );

    const card =
        document.createElement("div");

    card.className =
        "exam-card";

    card.innerHTML = `

        <h3>${exam.name}</h3>

        <div class="days">
            ${diffDays}
        </div>

        <p>Days Remaining</p>

    `;

    examCards.appendChild(card);

});



// =========================================================
// LOAD CHEMISTRY PROGRESS
// =========================================================

async function loadChemistryProgress(){

    const docRef =
        doc(db, "subjects", "Chemistry");

    const docSnap =
        await getDoc(docRef);

    if(docSnap.exists()){

        const chemistryData =
            docSnap.data();

        let total =
            chemistryData.chapters.length;

        let completed =
            chemistryData.chapters.filter(
                chapter =>
                    chapter.status === "Mastered"
            ).length;

        let percent = 0;

        if(total > 0){

            percent =
                Math.round(
                    completed / total * 100
                );

        }

        document.getElementById(
            "chemistryProgressBar"
        ).style.width =
            percent + "%";

        document.getElementById(
            "chemistryProgressText"
        ).innerText =
            percent + "% Completed";

    }

}


// =========================================================
// LOAD PHYSICS PROGRESS
// =========================================================

async function loadPhysicsProgress(){

    const docRef =
        doc(db, "subjects", "physics");

    const docSnap =
        await getDoc(docRef);

    if(docSnap.exists()){

        const physicsData =
            docSnap.data();

        let total =
            physicsData.chapters.length;

        let completed =
            physicsData.chapters.filter(
                chapter =>
                    chapter.status === "Mastered"
            ).length;

        let percent = 0;

        if(total > 0){

            percent =
                Math.round(
                    completed / total * 100
                );

        }

        document.getElementById(
            "physicsProgressBar"
        ).style.width =
            percent + "%";

        document.getElementById(
            "physicsProgressText"
        ).innerText =
            percent + "% Completed";

    }

}

// =========================================================
// LOAD MATHS PROGRESS
// =========================================================

async function loadMathsProgress(){

    const docRef =
        doc(db, "subjects", "maths");

    const docSnap =
        await getDoc(docRef);

    if(docSnap.exists()){

        const mathsData =
            docSnap.data();

        let total =
            mathsData.chapters.length;

        let completed =
            mathsData.chapters.filter(
                chapter =>
                    chapter.status === "Mastered"
            ).length;

        let percent =
            Math.round(
                completed /
                total * 100
            );

        document.getElementById(
            "mathsProgressBar"
        ).style.width =
            percent + "%";

        document.getElementById(
            "mathsProgressText"
        ).innerText =
            percent + "% Completed";

    }

}
// =========================================================
// LOAD ADDITIONAL MATHS PROGRESS
// =========================================================

async function loadAddMathsProgress(){

    const docRef =
        doc(db, "subjects", "addmaths");

    const docSnap =
        await getDoc(docRef);

    if(docSnap.exists()){

        const addMathsData =
            docSnap.data();

        let total =
            addMathsData.chapters.length;

        let completed =
            addMathsData.chapters.filter(
                chapter =>
                    chapter.status === "Mastered"
            ).length;

        let percent = 0;

        if(total > 0){

            percent =
                Math.round(
                    completed / total * 100
                );

        }

        document.getElementById(
            "addMathsProgressBar"
        ).style.width =
            percent + "%";

        document.getElementById(
            "addMathsProgressText"
        ).innerText =
            percent + "% Completed";

    }

}

// =========================================================
// START
// =========================================================

loadChemistryProgress();

loadPhysicsProgress();

loadMathsProgress();

loadAddMathsProgress();
