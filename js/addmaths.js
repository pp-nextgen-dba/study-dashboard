// =========================================================
// DEFAULT DATA
// =========================================================

const defaultData = {

    subject: "Additional Maths",

    chapters: [

        {
        form:"T4",
        chapter:"Functions",
        chinese:"函数",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"Qua Functions",
        chinese:"二次函数",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"System of Equations",
        chinese:"方程组",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"Indices, Surds,Logarithms",
        chinese:"指数、根式与对数",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"Progressions",
        chinese:"数列",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"Linear Law",
        chinese:"线性规律",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"Coordinate Geometry",
        chinese:"坐标几何",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"Vectors",
        chinese:"向量",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"Solution of Triangles",
        chinese:"三角形求解",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T4",
        chapter:"index number",
        chinese:"指数号码",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T5",
        chapter:"Circular Measure",
        chinese:"弧度制",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T5",
        chapter:"Differentiation",
        chinese:"微分",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T5",
        chapter:"Integration",
        chinese:"积分",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T5",
        chapter:"Permutation + Combination",
        chinese:"排列与组合",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T5",
        chapter:"Probability Distribution",
        chinese:"概率分布",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T5",
        chapter:"Trigonometric Functions",
        chinese:"三角函数",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T5",
        chapter:"Linear programming",
        chinese:"线性规划",
        status:"Not Started",
        confidence:0,
        last_updated:"2026-05-17"
        },

        {
        form:"T5",
        chapter:"kinematics of linear motion",
        chinese:"直线运动学",
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
        "addmaths"
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
