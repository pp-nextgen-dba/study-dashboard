// =========================================================
// FILE: js/dashboard.js
// FULL REPLACEMENT VERSION
// =========================================================


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
// EXAM COUNTDOWN
// =========================================================

const examCards =
    document.getElementById("examCards");


exams.forEach(exam => {

    const today =
        new Date();

    const examDate =
        new Date(exam.date);

    const diffTime =
        examDate - today;

    const diffDays =
        Math.ceil(
            diffTime /
            (1000 * 60 * 60 * 24)
        );

    const card =
        document.createElement("div");

    card.className =
        "exam-card";

    card.innerHTML = `

        <h3>
            ${exam.name}
        </h3>

        <div class="days">
            ${diffDays}
        </div>

        <p>
            Days Remaining
        </p>

    `;

    examCards.appendChild(card);

});



// =========================================================
// MATHS PROGRESS
// =========================================================

let mathsData =
    JSON.parse(
        localStorage.getItem("mathsProgress")
    );


// =========================================================
// IF DATA EXISTS
// =========================================================

if(mathsData){

    let total =
        mathsData.chapters.length;

    let completed =
        mathsData.chapters.filter(
            chapter =>
                chapter.status === "Completed"
        ).length;

    let percent =
        Math.round(
            completed / total * 100
        );


    // =====================================================
    // UPDATE BAR
    // =====================================================

    document.getElementById(
        "mathsProgressBar"
    ).style.width =
        percent + "%";


    // =====================================================
    // UPDATE TEXT
    // =====================================================

    document.getElementById(
        "mathsProgressText"
    ).innerText =
        percent + "% Completed";


}else{


    // =====================================================
    // NO DATA YET
    // =====================================================

    document.getElementById(
        "mathsProgressBar"
    ).style.width = "0%";

    document.getElementById(
        "mathsProgressText"
    ).innerText =
        "0% Completed";

}