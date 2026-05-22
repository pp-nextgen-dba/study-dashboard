import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const rootDir =
    path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        ".."
    );

const readText = filePath =>
    fs.readFileSync(
        path.join(rootDir,filePath),
        "utf8"
    );

const errors = [];

const warnings = [];

function reportError(message){
    errors.push(message);
}

function reportWarning(message){
    warnings.push(message);
}

function camelDataName(subjectId){
    if(subjectId === "addmaths"){
        return "addMathsData";
    }

    if(subjectId === "rekabentuk"){
        return "rekaBentukData";
    }

    return `${subjectId}Data`;
}

function loadSubjectExports(){
    const source =
        readText("js/subject.js");

    const exportNames = [
        ...source.matchAll(/export\s+const\s+([A-Za-z0-9_]+)\s*=/g)
    ].map(match => match[1]);

    const executable =
        source.replace(
            /export\s+const\s+([A-Za-z0-9_]+)\s*=/g,
            "globalThis.$1 ="
        );

    const context =
        vm.createContext({});

    vm.runInContext(
        executable,
        context,
        {
            filename:"js/subject.js"
        }
    );

    return Object.fromEntries(
        exportNames.map(name => [
            name,
            context[name]
        ])
    );
}

function getSubjectIds(){
    const dashboard =
        readText("js/dashboard.js");

    const ids =
        new Set();

    for(const match of dashboard.matchAll(/\[\s*"([a-z0-9]+)"\s*,\s*"[^"]+ProgressBar"\s*,\s*"[^"]+ProgressText"/g)){
        ids.add(match[1]);
    }

    return [...ids];
}

function getActiveDashboardSubjectIds(){
    const index =
        readText("index.html");

    return [
        ...index.matchAll(/href="subjects\/([a-z0-9]+)\.html"/g)
    ].map(match => match[1]);
}

function validateSubjectData(subjectId, subjectData){
    if(!subjectData){
        reportError(
            `${subjectId}: missing ${camelDataName(subjectId)} export`
        );

        return;
    }

    if(!Array.isArray(subjectData.chapters)){
        reportError(
            `${subjectId}: chapters must be an array`
        );

        return;
    }

    if(subjectData.chapters.length === 0){
        reportError(
            `${subjectId}: chapters must not be empty`
        );
    }

    const keys =
        new Set();

    subjectData.chapters.forEach((chapter,index) => {
        const prefix =
            `${subjectId}.chapters[${index}]`;

        for(const field of [
            "form",
            "chapter",
            "status",
            "confidence",
            "last_updated"
        ]){
            if(chapter[field] === undefined || chapter[field] === ""){
                reportError(
                    `${prefix}: missing ${field}`
                );
            }
        }

        const key =
            `${chapter.form}|${chapter.chapter}`;

        if(keys.has(key)){
            reportError(
                `${subjectId}: duplicate chapter ${key}`
            );
        }

        keys.add(key);

        if(
            chapter.chinese === "" &&
            [
                "english",
                "rekabentuk"
            ].includes(subjectId)
        ){
            reportError(
                `${prefix}: chinese translation is required`
            );
        }
    });
}

function validateSubjectPage(subjectId){
    const pagePath =
        `subjects/${subjectId}.html`;

    if(!fs.existsSync(path.join(rootDir,pagePath))){
        reportError(
            `${subjectId}: missing ${pagePath}`
        );

        return;
    }

    const page =
        readText(pagePath);

    if(!page.includes(`doc(db,"subjects","${subjectId}")`)){
        reportError(
            `${subjectId}: page does not use Firestore subjects/${subjectId}`
        );
    }

    if(!page.includes(camelDataName(subjectId))){
        reportError(
            `${subjectId}: page does not import ${camelDataName(subjectId)}`
        );
    }
}

function validateDashboardCard(subjectId){
    const index =
        readText("index.html");

    if(!index.includes(`subjects/${subjectId}.html`)){
        reportError(
            `${subjectId}: dashboard is missing subject link`
        );
    }

    const progressId =
        subjectId === "addmaths"
            ? "addMaths"
            : subjectId === "rekabentuk"
                ? "rekaBentuk"
                : subjectId;

    if(!index.includes(`id="${progressId}ProgressBar"`)){
        reportError(
            `${subjectId}: dashboard missing progress bar id`
        );
    }

    if(!index.includes(`id="${progressId}ProgressText"`)){
        reportError(
            `${subjectId}: dashboard missing progress text id`
        );
    }
}

const subjectExports =
    loadSubjectExports();

const subjectIds =
    getSubjectIds();

const activeDashboardSubjectIds =
    getActiveDashboardSubjectIds();

if(subjectIds.length === 0){
    reportError(
        "No dashboard subjects found in js/dashboard.js"
    );
}

for(const subjectId of subjectIds){
    validateSubjectData(
        subjectId,
        subjectExports[camelDataName(subjectId)]
    );
}

for(const subjectId of activeDashboardSubjectIds){
    if(!subjectIds.includes(subjectId)){
        reportError(
            `${subjectId}: dashboard link is missing progress watcher`
        );
    }

    validateSubjectPage(subjectId);

    validateDashboardCard(subjectId);
}

for(const file of [
    "js/addmaths.js",
    "js/firebase.js",
    "subjects/maths_orig.html"
]){
    if(fs.existsSync(path.join(rootDir,file))){
        reportWarning(
            `${file}: appears to be legacy or unused`
        );
    }
}

for(const warning of warnings){
    console.warn(
        `WARN ${warning}`
    );
}

if(errors.length > 0){
    for(const error of errors){
        console.error(
            `ERROR ${error}`
        );
    }

    process.exit(1);
}

console.log(
    `Validated ${subjectIds.length} dashboard subjects.`
);
