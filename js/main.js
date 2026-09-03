/*  MENU

        ÉLÉMENTS
        VARIABLES
        RÉGLAGES
        FORMAT TEMPS
        DATE DU JOUR
        AFFICHAGE
        POINTS
        INITIALISATION MOLETTES
        SYNCHRONISER SETTINGS
        DÉMARRER LA SESSION
        MODIFIER LE NOM
        PAUSE / REPRENDRE
        TERMINER LA SESSION
        ACCUEIL
        COULEUR
        COULEUR SAUVEGARDÉE
        NOM SAUVEGARDÉ
        INITIALISATION

*/

/* ─────────────────────────
   ÉLÉMENTS
───────────────────────── */

const home = document.getElementById("home");
const session = document.getElementById("session");
const preparationSession = document.getElementById("preparationSession");
const breakScreen = document.getElementById("breakScreen");
const finished = document.getElementById("finished");
const settings = document.getElementById("settings");
const timer = document.getElementById("timer");
const pauseButton = document.getElementById("pauseButton");
const finishButton = document.getElementById("finishButton");
const preparationTimer = document.getElementById("activePreparationTimer");
const breakTimer = document.getElementById("breakTimer");
const breakActions = document.getElementById("breakActions");

const preparationEnabled = document.getElementById("preparationEnabled");
const preparationOptions = document.getElementById("preparationOptions");
const preparationFrequency = document.getElementById("preparationFrequency");

const sessionNameEnabled = document.getElementById("sessionNameEnabled");
const sessionNameHome = document.getElementById("sessionNameHome");
const sessionNameInput = document.getElementById("sessionNameInput");

const sequenceMode = document.getElementById("sequenceMode");
const sessionsPerCycle = document.getElementById("sessionsPerCycle");

const sessionLabel = document.getElementById("sessionLabel");
const sessionNameDisplay = document.getElementById("sessionNameDisplay");
const sessionNameEdit = document.getElementById("sessionNameEdit");

const cyclePoints = document.getElementById("cyclePoints");
const finishedPoints = document.getElementById("finishedPoints");
const finishedTime = document.getElementById("finishedTime");

const pomodoroDurationLabel = document.getElementById("pomodoroDurationLabel");
const pomodoroProgressFill = document.getElementById("pomodoroProgressFill");

const workSound = document.getElementById("workSound");
const shortBreakSound = document.getElementById("shortBreakSound");
const longBreakSound = document.getElementById("longBreakSound");
const conditioningSound = document.getElementById("conditioningSound");

const workNotification = document.getElementById("workNotification");
const conditioningNotification = document.getElementById("conditioningNotification");
const shortBreakNotification = document.getElementById("shortBreakNotification");
const longBreakNotification = document.getElementById("longBreakNotification");

const resetCycleButton = document.getElementById("resetCycleButton");


/* ─────────────────────────
   VARIABLES
───────────────────────── */

let interval = null;
let preparationInterval = null;
let breakInterval = null;

let remainingSeconds = 0;
let elapsedSeconds = 0;
let preparationRemaining = 0;
let breakRemaining = 0;

let sessionType = null;

let currentScreen = "home";
let settingsReturnScreen = "home";

let isPaused = false;

let currentSessionNumber = 0;
let cycleCompleted = 0;

let currentBreakType = null;

let sessionName = "";
let sessionStartTime = null;

let wheels = {};



// ─────────────────────────
// CONNEXION NOTION
// ─────────────────────────

let studyRoomConnectionId =
    localStorage.getItem(
        "studyRoomConnectionId"
    );


// ─────────────────────────
// MISE À JOUR DU BOUTON
// ─────────────────────────

function updateNotionButton() {

    const notionConnectButton =
        document.getElementById(
            "notionConnectButton"
        );

    if (!notionConnectButton) {
        return;
    }

    if (studyRoomConnectionId) {

        notionConnectButton.textContent =
            "Se déconnecter de Notion";

    }
    else {

        notionConnectButton.textContent =
            "Connecter Notion";

    }

}


// ─────────────────────────
// RESTAURATION DE L'ÉTAT
// ─────────────────────────

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateNotionButton();

    }
);


// ─────────────────────────
// RETOUR DE LA CONNEXION NOTION
// ─────────────────────────

window.addEventListener(
    "message",
    function(event) {

        if (
            event.origin !==
            "https://study-room-widget.batlili.workers.dev"
        ) {
            return;
        }

        if (
            !event.data ||
            event.data.type !==
            "STUDY_ROOM_OAUTH_SUCCESS"
        ) {
            return;
        }

        studyRoomConnectionId =
            event.data.connectionId;


        // Mémorise la connexion
        localStorage.setItem(
            "studyRoomConnectionId",
            studyRoomConnectionId
        );


        // Met à jour le bouton
        updateNotionButton();


        console.log(
            "Connexion Study Room reçue."
        );

    }
);


// ─────────────────────────
// BOUTON CONNEXION / DÉCONNEXION
// ─────────────────────────

const notionConnectButton =
    document.getElementById(
        "notionConnectButton"
    );

if (notionConnectButton) {

    notionConnectButton.addEventListener(
        "click",
        async function() {

            // ─────────────────
            // CONNEXION
            // ─────────────────

            if (!studyRoomConnectionId) {

                window.open(
                    "https://study-room-widget.batlili.workers.dev/oauth/start",
                    "studyRoomNotionOAuth",
                    "width=600,height=800"
                );

                return;

            }


            // ─────────────────
            // DÉCONNEXION
            // ─────────────────

            try {

                const response =
                    await fetch(
                        "https://study-room-widget.batlili.workers.dev/api/disconnect",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                connectionId:
                                    studyRoomConnectionId

                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    console.error(
                        "Erreur lors de la déconnexion :",
                        result
                    );

                    return;

                }


                // Supprime la connexion locale
                localStorage.removeItem(
                    "studyRoomConnectionId"
                );

                studyRoomConnectionId =
                    null;


                // Met à jour le bouton
                updateNotionButton();


                console.log(
                    "Déconnexion Notion réussie."
                );


            }
            catch (error) {

                console.error(
                    "Erreur lors de la déconnexion Notion :",
                    error
                );

            }

        }
    );

}

/* ─────────────────────────
   RÉGLAGES
───────────────────────── */

let settingsData = {

    pomodoro: 25,
    preparation: 5,
    shortBreak: 5,
    longBreak: 15,

    preparationEnabled: false,
    preparationFrequency: "daily",

    sessionNameEnabled: false,

    sequenceMode: "automatic",

    sessionsPerCycle: 4,
    sessionIcon: "circle",

    // 🔔 Notifications
    workNotification: true,
    workSound: "carillon",

    conditioningNotification: true,
    conditioningSound: "carillon",

    shortBreakNotification: true,
    shortBreakSound: "carillon",

    longBreakNotification: true,
    longBreakSound: "feerie"

};

/* ─────────────────────────
   FORMAT TEMPS
───────────────────────── */

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        String(minutes).padStart(2, "0")
        + ":"
        + String(secs).padStart(2, "0")
    );

}


/* ─────────────────────────
   DATE DU JOUR
───────────────────────── */

function getTodayDate() {

    return new Date().toISOString().slice(0, 10);

}

/* ─────────────────────────
   AFFICHAGE
───────────────────────── */

function showScreen(screenName) {

    currentScreen = screenName;

    home.style.display = "none";

    session.classList.remove("visible");
    preparationSession.classList.remove("visible");
    breakScreen.classList.remove("visible");
    finished.classList.remove("visible");
    settings.classList.remove("visible");

    if (screenName === "home") {
        home.style.display = "block";
    }

    if (screenName === "settings") {
        settings.classList.add("visible");
    }

    if (screenName === "preparation") {
        preparationSession.classList.add("visible");
    }

    if (screenName === "session") {
        session.classList.add("visible");
    }

    if (screenName === "break") {
        breakScreen.classList.add("visible");
    }

    if (screenName === "finished") {
        finished.classList.add("visible");
    }

}


/* ─────────────────────────
   POINTS
───────────────────────── */

function renderCyclePoints(container, completed) {

    container.innerHTML = "";

    const total = settingsData.sessionsPerCycle;

    const icons = {

        circle: {
            empty: "○",
            filled: "●"
        },

        heart: {
            empty: "♡",
            filled: "♥"
        },

        sparkle: {
            empty: "✧",
            filled: "✦"
        },

        clover: {
            empty: "♧",
            filled: "♣"
        },

        star: {
            empty: "☆",
            filled: "★"
        },

        flower: {
            empty: "❀",
            filled: "✿"
        }

    };

    const selectedIcon =  icons[settingsData.sessionIcon] || icons.circle;

    for (let i = 0; i < total; i++) {

        const point = document.createElement("span");

        point.className = "cycle-point";

        if (i < completed) {

            point.textContent = selectedIcon.filled;
            point.classList.add("completed");

        }
        else {

            point.textContent = selectedIcon.empty;

        }

        container.appendChild(point);

    }

}


function updateCyclePoints() {

    renderCyclePoints(
        cyclePoints,
        currentSessionNumber
    );

    renderCyclePoints(
        finishedPoints,
        currentSessionNumber
    );

}


/* ─────────────────────────
   INITIALISATION MOLETTES DE TEMPS 
───────────────────────── */

function initializeWheels() {

    wheels.preparation = new DurationWheel(
        document.getElementById("preparationWheel"),
        1,
        30,
        settingsData.preparation,
        (value) => {

            settingsData.preparation = value;

            saveSettings()

        }
    );


    wheels.pomodoro = new DurationWheel(
        document.getElementById("pomodoroWheel"),
        1,
        180,
        settingsData.pomodoro,
        (value) => {

            settingsData.pomodoro = value;

            updatePomodoroLabel();

            saveSettings();

        }
    );


    wheels.shortBreak = new DurationWheel(
        document.getElementById("shortBreakWheel"),
        1,
        30,
        settingsData.shortBreak,
        (value) => {

            settingsData.shortBreak = value;

            saveSettings();

        }
    );


    wheels.longBreak = new DurationWheel(
        document.getElementById("longBreakWheel"),
        1,
        60,
        settingsData.longBreak,
        (value) => {

            settingsData.longBreak = value;

            saveSettings();

        }
    );

}


function updatePomodoroLabel() {

    pomodoroDurationLabel.textContent =
        settingsData.pomodoro + " min";

}

 /* ─────────────────────────
    SYNCHRONISER SETTINGS
 ───────────────────────── */

function syncSettingsUI() {

    // ⚙️ Réglages généraux

    preparationEnabled.checked =
        settingsData.preparationEnabled;

    preparationFrequency.value =
        settingsData.preparationFrequency;

    sessionNameEnabled.checked =
        settingsData.sessionNameEnabled;

    sequenceMode.value =
        settingsData.sequenceMode;

    sessionsPerCycle.value =
        settingsData.sessionsPerCycle;


    // 🔔 Sons

    workSound.value =
        settingsData.workSound;

    conditioningSound.value =
        settingsData.conditioningSound;

    shortBreakSound.value =
        settingsData.shortBreakSound;

    longBreakSound.value =
        settingsData.longBreakSound;


    // 🔔 Notifications

    workNotification.checked =
        settingsData.workNotification;

    conditioningNotification.checked =
        settingsData.conditioningNotification;

    shortBreakNotification.checked =
        settingsData.shortBreakNotification;

    longBreakNotification.checked =
        settingsData.longBreakNotification;


    // 🎛️ Affichage des options

    preparationOptions.classList.toggle(
        "hidden",
        !settingsData.preparationEnabled
    );

    sessionNameHome.classList.toggle(
        "visible",
        settingsData.sessionNameEnabled
    );


    // 🔔 Activation des listes de sons

    updateNotificationSelect(
        workNotification,
        workSound
    );

    updateNotificationSelect(
        conditioningNotification,
        conditioningSound
    );

    updateNotificationSelect(
        shortBreakNotification,
        shortBreakSound
    );

    updateNotificationSelect(
        longBreakNotification,
        longBreakSound
    );

    // 🔄 Mise à jour de l'affichage

    updatePomodoroLabel();

    updateCyclePoints();

};



/* ─────────────────────────
   DÉMARRER LA SESSION
───────────────────────── */

function startSelectedMode() {

    clearInterval(interval);

    isPaused = false;

    pauseButton.textContent = "Ⅱ Pause";

    elapsedSeconds = 0;
    // Heure réelle de début de la session
    sessionStartTime = new Date();


    /* Nom de la session */

    if (settingsData.sessionNameEnabled) {

        sessionNameDisplay.textContent =
            sessionName;

        sessionNameEdit.style.display =
            "inline-block";

    }
    else {

        sessionNameDisplay.textContent = "";

        sessionNameEdit.style.display =
            "none";

    }


    /* Affichage des points */

    if (sessionType === "pomodoro") {

        cyclePoints.style.display = "flex";
        resetCycleButton.style.display = "inline-block";

        updateCyclePoints();

    }
    else {

        cyclePoints.style.display = "none";
        resetCycleButton.style.display = "none";

    }


    showScreen("session");


    /* Lancement du mode choisi */

    if (sessionType === "pomodoro") {

        remainingSeconds = settingsData.pomodoro * 60;
        pomodoroProgressFill.style.width = "0%";

        timer.textContent = formatTime(remainingSeconds);
        startCountdown();

    }
    else {

        remainingSeconds = 0;

        timer.textContent = "00:00";

        startFlow();

    }

}


/* ─────────────────────────
   MODIFIER LE NOM
───────────────────────── */

sessionNameEdit.addEventListener(
    "click",
    function(event) {

        event.stopPropagation();

        if (!settingsData.sessionNameEnabled) {
            return;
        }


        const currentName = sessionName;

        const input =
            document.createElement("input");

        input.type = "text";
        input.value = currentName;
        input.maxLength = 50;
        input.className = "session-name-edit-input";

        sessionNameDisplay.replaceWith(input);

        input.focus();
        input.select();


        function saveSessionName() {

            sessionName =
                input.value.trim();

            localStorage.setItem(
                "studyRoomSessionNameV6",
                sessionName
            );

            input.replaceWith(
                sessionNameDisplay
            );

            sessionNameDisplay.textContent =
                sessionName;

        }


        input.addEventListener(
            "keydown",
            function(event) {

                if (event.key === "Enter") {
                    saveSessionName();
                }

                if (event.key === "Escape") {

                    input.replaceWith(
                        sessionNameDisplay
                    );

                    sessionNameDisplay.textContent =
                        currentName;

                }

            }
        );


        input.addEventListener(
            "blur",
            saveSessionName
        );

    }
);


/* ─────────────────────────
   PAUSE / REPRENDRE
───────────────────────── */

pauseButton.addEventListener(
    "click",
    function() {

        isPaused = !isPaused;

        this.textContent =
            isPaused
                ? "▶ Reprendre"
                : "Ⅱ Pause";

    }
);


/* ─────────────────────────
   TERMINER LA SESSION
───────────────────────── */

finishButton.addEventListener(
    "click",
    function() {

        clearInterval(interval);

        finishWorkSession(false);

    }
);

/* ─────────────────────────
   ACCUEIL
───────────────────────── */

function goHome() {

    clearInterval(interval);
    clearInterval(preparationInterval);
    clearInterval(breakInterval);

    isPaused = false;

    cyclePoints.style.display = "flex";
    updateCyclePoints();

    sessionNameInput.value = sessionName;

    showScreen("home");

}


homeButton.addEventListener("click", goHome);
sessionHomeButton.addEventListener("click", goHome);

/* ─────────────────────────
   COULEUR
───────────────────────── */

const colorButton = document.getElementById("colorButton");
const colorPalette = document.getElementById("colorPalette");
const colorOptions = document.querySelectorAll(".color-option");


colorButton.addEventListener("click", function(event) {

    event.stopPropagation();

    colorPalette.classList.toggle("visible");

});


colorOptions.forEach(function(option) {

    option.addEventListener("click", function(event) {

        event.stopPropagation();

        const color = this.dataset.color;

        document.documentElement.style.setProperty(
            "--widget-color",
            color
        );

        localStorage.setItem(
            "studyRoomWidgetColor",
            color
        );

        colorOptions.forEach(function(item) {
            item.classList.remove("selected");
        });

        this.classList.add("selected");

        colorPalette.classList.remove("visible");

    });

});


document.addEventListener("click", function() {

    colorPalette.classList.remove("visible");

});


/* ─────────────────────────
   COULEUR SAUVEGARDÉE
───────────────────────── */

const savedColor =
    localStorage.getItem("studyRoomWidgetColor");

if (savedColor) {

    document.documentElement.style.setProperty(
        "--widget-color",
        savedColor
    );

    colorOptions.forEach(function(option) {

        if (option.dataset.color === savedColor) {
            option.classList.add("selected");
        }

    });

}


/* ─────────────────────────
   NOM SAUVEGARDÉ
───────────────────────── */

const savedSessionName =
    localStorage.getItem("studyRoomSessionNameV6");

if (savedSessionName) {

    sessionName = savedSessionName;
    sessionNameInput.value = savedSessionName;

};

/* ─────────────────────────
    INITIALISATION
───────────────────────── */

loadSettings();

initializeWheels();

syncSettingsUI();

updateCyclePoints();

updatePomodoroLabel();

showScreen("home");