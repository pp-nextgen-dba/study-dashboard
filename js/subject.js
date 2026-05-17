// =========================================================
// DEFAULT DATA
// =========================================================

const defaultData = {

    subject: "Maths",

    chapters: [

        {
            form:"T2",
            chapter:"Patterns+Seq",
            chinese:"规律与数列",
            status:"Not Started",
            confidence:0,
            last_updated:"2026-05-17"
        },

        {
            form:"T2",
            chapter:"Factorisation",
            chinese:"因式分解",
            status:"Not Started",
            confidence:0,
            last_updated:"2026-05-17"
        },

        {
            form:"T4",
            chapter:"Quadratics Functions",
            chinese:"二次函数",
            status:"Not Started",
            confidence:0,
            last_updated:"2026-05-17"
        }

    ]
};


// =========================================================
// GLOBAL DATA
// =========================================================

let data = defaultData;


// =========================================================
// TABLE BODY
// =========================================================

const tableBody =
    document.getElementById("mathTableBody");


// =========================================================
// FIREBASE REFERENCES
// =========================================================

const db = window.db;

const docRef =
    window.firebaseDoc(
        db,
        "subjects",
        "maths"
    );


// =========================================================
// LOAD CLOUD DATA
// =========================================================

async function loadData(){

    const docSnap =
        await window.firebaseGetDoc(docRef);

    if(docSnap.exists()){

        data = docSnap.data();

    }else{

        await window.firebaseSetDoc(
            docRef,
            defaultData
        );

        data = defaultData;
    }

    renderTable();

}


// =========================================================
// REALTIME SYNC
// =========================================================

window.firebaseOnSnapshot(
    docRef,
    (snapshot) => {

        if(snapshot.exists()){

            data = snapshot.data();

            renderTable();
        }

    }
);


// =========================================================
// SAVE DATA
// =========================================================

async function saveData(){

    await window.firebaseSetDoc(
        docRef,
        data
    );

}


// =========================================================
// RENDER TABLE
// =========================================================

function renderTable(){

    tableBody.innerHTML = "";

    let completed = 0;

    data.chapters.forEach((chapter, index) => {

        if(chapter.status === "Completed"){
            completed++;
        }

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>${chapter.form}</td>

            <td>${chapter.chapter}</td>

            <td>${chapter.chinese}</td>

            <td>

                <select id="status-${index}">

                    <option value="Not Started"
                    ${chapter.status==="Not Started"?"selected":""}>
                    Not Started
                    </option>

                    <option value="Started"
                    ${chapter.status==="Started"?"selected":""}>
                    Started
                    </option>

                    <option value="In Progress"
                    ${chapter.status==="In Progress"?"selected":""}>
                    In Progress
                    </option>

                    <option value="Revision"
                    ${chapter.status==="Revision"?"selected":""}>
                    Revision
                    </option>

                    <option value="Completed"
                    ${chapter.status==="Completed"?"selected":""}>
                    Completed
                    </option>

                </select>

            </td>

            <td>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value="${chapter.confidence}"
                    id="confidence-${index}"
                >

                <span>
                    ${chapter.confidence}%
                </span>

            </td>

            <td>${chapter.last_updated}</td>

        `;

        tableBody.appendChild(row);


        // =============================================
        // STATUS CHANGE
        // =============================================

        const statusSelect =
            document.getElementById(
                `status-${index}`
            );

        statusSelect.addEventListener(
            "change",
            async () => {

                data.chapters[index].status =
                    statusSelect.value;

                data.chapters[index].last_updated =
                    new Date()
                    .toISOString()
                    .split("T")[0];

                await saveData();

            }
        );


        // =============================================
        // CONFIDENCE CHANGE
        // =============================================

        const confidenceSlider =
            document.getElementById(
                `confidence-${index}`
            );

        confidenceSlider.addEventListener(
            "change",
            async () => {

                data.chapters[index].confidence =
                    parseInt(
                        confidenceSlider.value
                    );

                data.chapters[index].last_updated =
                    new Date()
                    .toISOString()
                    .split("T")[0];

                await saveData();

            }
        );

    });


    // =================================================
    // SUMMARY
    // =================================================

    document.getElementById(
        "totalChapters"
    ).innerText =
        data.chapters.length;

    document.getElementById(
        "completedChapters"
    ).innerText =
        completed;

    document.getElementById(
        "completionPercent"
    ).innerText =
        Math.round(
            completed /
            data.chapters.length * 100
        ) + "%";

}


// =========================================================
// START
// =========================================================

loadData();
