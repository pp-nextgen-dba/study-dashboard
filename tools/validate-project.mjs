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

function loadSubjectRegistry(){
    const source =
        readText("js/subject-registry.js");

    const executable =
        source.replace(
            /export\s+const\s+subjectRegistry\s*=/,
            "globalThis.subjectRegistry ="
        );

    const context =
        vm.createContext({});

    vm.runInContext(
        executable,
        context,
        {
            filename:"js/subject-registry.js"
        }
    );

    return context.subjectRegistry;
}

function getActiveDashboardSubjectIds(){
    const index =
        readText("index.html");

    return [
        ...index.matchAll(/href="subjects\/([a-z0-9]+)\.html"/g)
    ].map(match => match[1]);
}

function validateSubjectData(subject, subjectData){
    const subjectId =
        subject.id;

    if(!subjectData){
        reportError(
            `${subjectId}: missing ${subject.seedExport} export`
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
                "chinese",
                "english",
                "malay",
                "rekabentuk"
            ].includes(subjectId)
        ){
            reportError(
                `${prefix}: chinese translation is required`
            );
        }
    });
}

function validateSubjectPage(subject){
    const subjectId =
        subject.id;

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

    if(!page.includes(subject.seedExport)){
        reportError(
            `${subjectId}: page does not import ${subject.seedExport}`
        );
    }
}

function validateDashboardCard(subject){
    const subjectId =
        subject.id;

    const index =
        readText("index.html");

    if(!index.includes(subject.href)){
        reportError(
            `${subjectId}: dashboard is missing subject link`
        );
    }

    if(!index.includes(`id="${subject.progressBarId}"`)){
        reportError(
            `${subjectId}: dashboard missing progress bar id`
        );
    }

    if(!index.includes(`id="${subject.progressTextId}"`)){
        reportError(
            `${subjectId}: dashboard missing progress text id`
        );
    }
}

const subjectExports =
    loadSubjectExports();

const subjectRegistry =
    loadSubjectRegistry();

const subjectIds =
    subjectRegistry.map(subject =>
        subject.id
    );

const activeDashboardSubjectIds =
    getActiveDashboardSubjectIds();

if(subjectIds.length === 0){
    reportError(
        "No dashboard subjects found in js/dashboard.js"
    );
}

for(const subjectId of subjectIds){
    const subject =
        subjectRegistry.find(item =>
            item.id === subjectId
        );

    validateSubjectData(
        subject,
        subjectExports[subject.seedExport]
    );
}

for(const subjectId of activeDashboardSubjectIds){
    const subject =
        subjectRegistry.find(item =>
            item.id === subjectId
        );

    if(!subject){
        reportError(
            `${subjectId}: dashboard link is missing from subject registry`
        );

        continue;
    }

    validateSubjectPage(subject);

    validateDashboardCard(subject);
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
