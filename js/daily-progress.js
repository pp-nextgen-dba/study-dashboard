import {
    initializeApp
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    doc,
    onSnapshot,
    setDoc
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    subjectRegistry
}
from
"./subject-registry.js?v=3";

const firebaseConfig = {

    apiKey: "AIzaSyANWx-Uhq5uwgMqk1iaAB8NvBsQsUxAPjw",

    authDomain: "study-dashboard-7ca48.firebaseapp.com",

    projectId: "study-dashboard-7ca48",

    storageBucket: "study-dashboard-7ca48.firebasestorage.app",

    messagingSenderId: "745280498866",

    appId: "1:745280498866:web:39534ba9c4de40a7db6dab"

};

const app =
    initializeApp(firebaseConfig);

const db =
    getFirestore(app);

const progressRef =
    doc(db,"studyProgress","daily");

const dateInput =
    document.getElementById("studyDate");

const subjectPicker =
    document.getElementById("subjectPicker");

const saveStatus =
    document.getElementById("saveStatus");

const monthRange =
    document.getElementById("monthRange");

const monthGrid =
    document.getElementById("monthGrid");

const subjectMonthList =
    document.getElementById("subjectMonthList");

let progressData = {
    days:{}
};

function localDateKey(date){

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2,"0");

    const day =
        String(date.getDate()).padStart(2,"0");

    return `${year}-${month}-${day}`;

}

function dateFromKey(dateKey){

    const parts =
        dateKey.split("-").map(Number);

    return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
    );

}

function readableDate(date){

    return date.toLocaleDateString(
        "en-US",
        {
            month:"short",
            day:"numeric"
        }
    );

}

function monthName(date){

    return date.toLocaleDateString(
        "en-US",
        {
            month:"long",
            year:"numeric"
        }
    );

}

function getMonthDates(dateKey){

    const selectedDate =
        dateFromKey(dateKey);

    const year =
        selectedDate.getFullYear();

    const month =
        selectedDate.getMonth();

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    return Array.from(
        {
            length:daysInMonth
        },
        (_,index) => new Date(
            year,
            month,
            index + 1
        )
    );

}

function getDaySubjects(dateKey){

    const dayData =
        progressData.days[dateKey];

    if(
        dayData &&
        Array.isArray(dayData.subjects)
    ){
        return dayData.subjects;
    }

    return [];

}

function renderSubjectPicker(){

    subjectPicker.innerHTML = "";

    subjectRegistry.forEach(subject => {

        const button =
            document.createElement("button");

        button.className =
            "subject-check subject-button";

        button.type =
            "button";

        button.dataset.subjectId =
            subject.id;

        button.innerHTML = `
            <span>${subject.icon} ${subject.title}</span>
        `;

        button.addEventListener(
            "click",
            () => {
                toggleSubjectForDay(subject.id)
                    .catch(error => {
                        saveStatus.innerText =
                            "Save failed";

                        console.error(
                            "Daily progress save failed:",
                            error
                        );
                    });
            }
        );

        subjectPicker.appendChild(button);

    });

}

function setSelectedSubjects(subjectIds){

    subjectPicker
        .querySelectorAll(".subject-button")
        .forEach(button => {

            const isSelected =
                subjectIds.includes(
                    button.dataset.subjectId
                );

            button.classList.toggle(
                "selected",
                isSelected
            );

        });

}

function loadSelectedDay(){

    setSelectedSubjects(
        getDaySubjects(dateInput.value)
    );

}

async function toggleSubjectForDay(subjectId){

    const dateKey =
        dateInput.value;

    const currentSubjects =
        getDaySubjects(dateKey);

    const nextSubjects =
        currentSubjects.includes(subjectId)
            ? currentSubjects.filter(id => id !== subjectId)
            : [...currentSubjects,subjectId];

    saveStatus.innerText =
        "Saving...";

    progressData.days[dateKey] = {
        subjects:nextSubjects,
        updatedAt:new Date().toISOString()
    };

    setSelectedSubjects(nextSubjects);

    await setDoc(
        progressRef,
        progressData
    );

    saveStatus.innerText =
        "Saved";

}

function renderMonthProgress(){

    const monthDates =
        getMonthDates(dateInput.value);

    const firstDate =
        monthDates[0];

    const lastDate =
        monthDates[monthDates.length - 1];

    monthRange.innerText =
        `${monthName(firstDate)} · ${readableDate(firstDate)} - ${readableDate(lastDate)}`;

    monthGrid.innerHTML = "";

    let daysStudied = 0;
    let subjectTicks = 0;
    let bestDayCount = 0;

    monthDates.forEach(date => {

        const dateKey =
            localDateKey(date);

        const subjects =
            getDaySubjects(dateKey);

        if(subjects.length > 0){
            daysStudied++;
        }

        subjectTicks +=
            subjects.length;

        bestDayCount =
            Math.max(bestDayCount,subjects.length);

        const dayCard =
            document.createElement("button");

        dayCard.className =
            dateKey === dateInput.value
                ? "month-day active"
                : "month-day";

        dayCard.type =
            "button";

        dayCard.innerHTML = `
            <strong>${date.getDate()}</strong>
            <span>${subjects.length} done</span>
        `;

        dayCard.addEventListener(
            "click",
            () => {
                dateInput.value = dateKey;
                loadSelectedDay();
                renderMonthProgress();
            }
        );

        monthGrid.appendChild(dayCard);

    });

    document.getElementById("monthDaysCount").innerText =
        daysStudied;

    document.getElementById("monthSubjectCount").innerText =
        subjectTicks;

    document.getElementById("monthBestCount").innerText =
        bestDayCount;

    renderSubjectMonthlyList(monthDates);

}

function renderSubjectMonthlyList(monthDates){

    subjectMonthList.innerHTML = "";

    subjectRegistry.forEach(subject => {

        const doneCount =
            monthDates.filter(date =>
                getDaySubjects(
                    localDateKey(date)
                ).includes(subject.id)
            ).length;

        const percent =
            Math.round(
                doneCount / monthDates.length * 100
            );

        const row =
            document.createElement("div");

        row.className =
            "subject-month-row";

        row.innerHTML = `
            <div class="subject-month-title">
                <span>${subject.icon} ${subject.title}</span>
                <strong>${doneCount}/${monthDates.length} days</strong>
            </div>
            <div class="progress-bar compact">
                <div
                    class="progress-fill"
                    style="width:${percent}%"
                ></div>
            </div>
        `;

        subjectMonthList.appendChild(row);

    });

}

renderSubjectPicker();

dateInput.value =
    localDateKey(new Date());

dateInput.addEventListener(
    "change",
    () => {
        loadSelectedDay();
        renderMonthProgress();
    }
);

onSnapshot(
    progressRef,
    snapshot => {

        progressData =
            snapshot.exists()
                ? snapshot.data()
                : {
                    days:{}
                };

        if(!progressData.days){
            progressData.days = {};
        }

        loadSelectedDay();
        renderMonthProgress();

    },
    error => {
        saveStatus.innerText =
            "Sync failed";

        console.error(
            "Daily progress sync failed:",
            error
        );
    }
);
