// =========================================================
// FIREBASE IMPORTS
// =========================================================

import { db } from "./firebase.js";

import {
    doc,
    setDoc,
    onSnapshot
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    subjectRegistry
}
from
"./subject-registry.js?v=3";


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

if(
    examCards &&
    examCards.children.length === 0
){

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

}


// =========================================================
// SUBJECT PROGRESS
// =========================================================

function updateSubjectProgress(
    subjectData,
    progressBarId,
    progressTextId
){

    let percent = 0;

    let total = 0;

    let completed = 0;

    if(
        subjectData &&
        Array.isArray(subjectData.chapters)
    ){

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

}

function watchSubjectProgress(
    firestoreName,
    progressBarId,
    progressTextId,
    seedData = null
){

    const docRef =
        doc(
            db,
            "subjects",
            firestoreName
        );

    return onSnapshot(
        docRef,
        async snapshot => {

            if(snapshot.exists()){

                updateSubjectProgress(
                    snapshot.data(),
                    progressBarId,
                    progressTextId
                );

                return;

            }

            if(seedData){

                try{

                    await setDoc(
                        docRef,
                        seedData
                    );

                }catch(error){

                    console.error(
                        "Progress Seed Error:",
                        firestoreName,
                        error
                    );

                }

            }

            updateSubjectProgress(
                null,
                progressBarId,
                progressTextId
            );

        },
        error => {

            console.error(
                "Progress Sync Error:",
                firestoreName,
                error
            );

        }
    );

}

window.addEventListener(
    "error",
    event => {
        console.error(
            "Dashboard Runtime Error:",
            event.error || event.message
        );
    }
);


// =========================================================
// START
// =========================================================

const subjectsWithoutSeed =
    subjectRegistry.filter(subject =>
        !subject.loadSeed
    );

const subjectsWithSeed =
    subjectRegistry.filter(subject =>
        subject.loadSeed
    );

subjectsWithoutSeed.forEach(subject =>
    watchSubjectProgress(
        subject.id,
        subject.progressBarId,
        subject.progressTextId
    )
);

import("./subject.js?v=11")
    .then(subjectData => {

        subjectsWithSeed.forEach(subject =>
            watchSubjectProgress(
                subject.id,
                subject.progressBarId,
                subject.progressTextId,
                subjectData[subject.seedExport]
            )
        );

    })
    .catch(error => {

        console.error(
            "Subject Seed Load Error:",
            error
        );

        subjectsWithSeed.forEach(subject =>
            watchSubjectProgress(
                subject.id,
                subject.progressBarId,
                subject.progressTextId
            )
        );

    });
