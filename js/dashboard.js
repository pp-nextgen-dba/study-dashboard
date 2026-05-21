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
    getDoc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =========================================================
// FIREBASE CONFIG
// =========================================================

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

    const today =
        new Date();

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
// GENERIC SUBJECT LOADER
// =========================================================

async function loadSubjectProgress(
    firestoreName,
    progressBarId,
    progressTextId
){

    try{

        const docRef =
            doc(
                db,
                "subjects",
                firestoreName
            );

        const docSnap =
            await getDoc(docRef);

        let percent = 0;

        if(docSnap.exists()){

            const subjectData =
                docSnap.data();

            let total = 0;

            let completed = 0;

            if(subjectData.chapters){

                total =
                    subjectData.chapters.length;

                completed =
                    subjectData.chapters.filter(
                        chapter =>
                            chapter.status === "Mastered"
                    ).length;

            }

            if(total > 0){

                percent =
                    Math.round(
                        completed / total * 100
                    );

            }

        }

        const progressBar =
            document.getElementById(
                progressBarId
            );

        const progressText =
            document.getElementById(
                progressTextId
            );

        if(progressBar){

            progressBar.style.width =
                percent + "%";

        }

        if(progressText){

            progressText.innerText =
                percent + "% Completed";

        }

    }catch(error){

        console.error(
            "Progress Load Error:",
            firestoreName,
            error
        );

    }

}


// =========================================================
// START
// =========================================================

Promise.all([

    loadSubjectProgress(
    "science",
    "scienceProgressBar",
    "scienceProgressText"
    ),
    
    loadSubjectProgress(
        "maths",
        "mathsProgressBar",
        "mathsProgressText"
    ),

    loadSubjectProgress(
        "addmaths",
        "addMathsProgressBar",
        "addMathsProgressText"
    ),

    loadSubjectProgress(
        "physics",
        "physicsProgressBar",
        "physicsProgressText"
    ),

    loadSubjectProgress(
        "chemistry",
        "chemistryProgressBar",
        "chemistryProgressText"
    ),

    loadSubjectProgress(
        "biology",
        "biologyProgressBar",
        "biologyProgressText"
    ),

    loadSubjectProgress(
        "moral",
        "moralProgressBar",
        "moralProgressText"
    )

]).catch(error => {

    console.error(
        "Dashboard Startup Error:",
        error
    );

});
