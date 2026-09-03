/*  MENU 
        POMODORO
        TIMER POMODORO
        FIN SESSION
        RÉINITIALISER LE CYCLE
        PAUSE COURTE
        PAUSE LONGUE
        TIMER PAUSE
        FIN PAUSE
        SESSION SUIVANTE
        FIN DU CYCLE
        NOUVEAU CYCLE
*/

/* ─────────────────────────
    POMODORO
───────────────────────── */

document
    .getElementById("pomodoroButton")
    .addEventListener("click", () => {

        sessionType = "pomodoro";

        beginWork();

    });

/* ─────────────────────────
    TIMER POMODORO
───────────────────────── */

function startCountdown() {

    clearInterval(interval);

    interval = setInterval(() => {

        if (isPaused) {
            return;
        }

        if (remainingSeconds > 0) {

            remainingSeconds--;
            elapsedSeconds++;

            timer.textContent =
                formatTime(remainingSeconds);
            updatePomodoroProgress();

        } else {

            clearInterval(interval);

            finishWorkSession(true);

        }

    }, 1000);

}

function updatePomodoroProgress() {

    if (sessionType !== "pomodoro") {
        return;
    }

    const totalSeconds =
        settingsData.pomodoro * 60;

    const elapsed =
        totalSeconds - remainingSeconds;

    const progress =
        (elapsed / totalSeconds) * 100;

    pomodoroProgressFill.style.width =
        progress + "%";

}


/* ─────────────────────────
   FIN SESSION
───────────────────────── */

async function finishWorkSession(automatic) {

    clearInterval(interval);
    isPaused = false;

    playNotificationSound(
        "workNotification",
        "workSound"
    );
    const sessionEndTime = new Date();

    // ─────────────────────────
    // ENREGISTREMENT DE LA SESSION
    // ─────────────────────────

    try {

        const response = await fetch(
            "https://study-room-widget.batlili.workers.dev/api/session",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    connectionId:
                        studyRoomConnectionId,

                    sessionType:
                        sessionType,

                    sessionName:
                        settingsData.sessionNameEnabled
                            ? (
                                localStorage.getItem(
                                    "studyRoomSessionNameV6"
                                ) || ""
                            )
                            : "",

                    startTime:
                        sessionStartTime
                            ? sessionStartTime.toISOString()
                            : null,

                    endTime:
                        sessionEndTime.toISOString(),

                    automatic:
                        automatic

                })
            }
        );

        const result =
            await response.json();

        console.log(
            "Réponse du Worker :",
            result
        );

    } catch (error) {

        console.error(
            "Erreur lors de l'enregistrement de la session :",
            error
        );

    }

    // Le Flow ne gère pas les cycles
    if (sessionType === "flow") {

        startShortBreak();

        return;

    }

    currentSessionNumber++;

    updateCyclePoints();

    if (
        currentSessionNumber >=
        settingsData.sessionsPerCycle
    ) {

        finishCycle();

        return;

    }

    startShortBreak();

}

/* ─────────────────────────
   RÉINITIALISER LE CYCLE
───────────────────────── */

resetCycleButton.addEventListener(
    "click",
    function() {

        if (
            !window.confirm(
                "Réinitialiser le cycle ?\n\n" +
                "Les sessions déjà terminées seront remises à zéro."
            )
        ) {
            return;
        }

        currentSessionNumber = 0;
        updateCyclePoints();

    }
);


/* ─────────────────────────
   ACTIONS DE PAUSE
───────────────────────── */

function showBreakActions(breakStarted = false) {

    breakActions.innerHTML = "";

    if (
        settingsData.sequenceMode === "manual" &&
        !breakStarted
    ) {

        const startBreakButton =
            document.createElement("button");

        startBreakButton.className = "action-button";
        startBreakButton.textContent = "✦ Lancer la pause";

        startBreakButton.addEventListener(
            "click",
            function() {

                showBreakActions(true);
                startBreakCountdown();

            }
        );

        breakActions.appendChild(startBreakButton);
    }


    const skipButton =
        document.createElement("button");

    skipButton.className = "restart-button";
    skipButton.textContent = "Passer la pause";

    skipButton.addEventListener(
        "click",
        function() {

            clearInterval(breakInterval);

            breakTimer.style.display = "none";

            breakFinished(true);

        }
    );

    breakActions.appendChild(skipButton);


    const homeButton =
        document.createElement("button");

    homeButton.className = "restart-button";
    homeButton.textContent = "← Accueil";

    homeButton.addEventListener(
        "click",
        function() {

            clearInterval(breakInterval);
            goHome();

        }
    );

    breakActions.appendChild(homeButton);
}


/* ─────────────────────────
   PAUSE COURTE
───────────────────────── */

function startShortBreak() {

    currentBreakType = "short";

    breakRemaining =
        settingsData.shortBreak * 60;

    breakTitle.textContent =
        "☕ Pause courte";

    breakSubtitle.textContent =
        "Respire, bouge un peu, puis reviens tranquillement.";

    breakTimer.style.display = "block";
    breakTimer.textContent =
        formatTime(breakRemaining);

    showBreakActions();
    showScreen("break");

    if (
        settingsData.sequenceMode ===
        "automatic"
    ) {
        startBreakCountdown();
    }

}


/* ─────────────────────────
   PAUSE LONGUE
───────────────────────── */

function startLongBreak() {

    currentBreakType = "long";

    breakRemaining =
        settingsData.longBreak * 60;

    breakTitle.textContent =
        "🌙 Pause longue";

    breakSubtitle.textContent =
        "Ton cycle est terminé. Profite de cette pause longue.";

    breakTimer.style.display = "block";
    breakTimer.textContent =
        formatTime(breakRemaining);

    showBreakActions();
    showScreen("break");

    if (
        settingsData.sequenceMode ===
        "automatic"
    ) {
        startBreakCountdown();
    }

}


/* ─────────────────────────
   TIMER PAUSE
───────────────────────── */

function startBreakCountdown() {

    clearInterval(breakInterval);

    breakInterval = setInterval(
        function() {

            breakRemaining--;

            breakTimer.textContent =
                formatTime(breakRemaining);

            if (breakRemaining <= 0) {

                clearInterval(
                    breakInterval
                );

                breakFinished();

            }

        },
        1000
    );

}


/* ─────────────────────────
   FIN PAUSE
───────────────────────── */

function breakFinished(skipped = false) {

    clearInterval(breakInterval);

    /*
     * FLOW
     */

    if (sessionType === "flow") {

        if (
            settingsData.sequenceMode ===
            "automatic"
        ) {

            startNextSession();

        }
        else {

            showManualBreakEnd(
                skipped,
                "☕ Pause",
                "✦ Nouveau Flow"
            );

        }

        return;
    }


    /*
     * PAUSE COURTE POMODORO
     */

    if (currentBreakType === "short") {

        if (!skipped) {

            playNotificationSound(
                "shortBreakNotification",
                "shortBreakSound"
            );

        }

        if (
            settingsData.sequenceMode ===
            "automatic"
        ) {

            startNextSession();

        }
        else {

            showManualBreakEnd(
                skipped,
                "☕ Pause",
                "✦ Nouvelle session"
            );

        }

        return;
    }


    /*
     * PAUSE LONGUE
     */

    if (!skipped) {

        playNotificationSound(
            "longBreakNotification",
            "longBreakSound"
        );

    }

    if (
        settingsData.sequenceMode ===
        "automatic"
    ) {

        startNewCycle();

    }
    else {

        showManualBreakEnd(
            skipped,
            "🌙 Pause",
            "✦ Nouveau cycle"
        );

    }

}


/* ─────────────────────────
   FIN DE PAUSE — MODE MANUEL
───────────────────────── */

function showManualBreakEnd(
    skipped,
    title,
    buttonText
) {

    breakTitle.textContent =
        skipped
            ? title + " passée"
            : title + " terminée";

    breakSubtitle.textContent =
        "On continue ?";

    breakActions.innerHTML = "";


    const nextButton =
        document.createElement("button");

    nextButton.className =
        "action-button";

    nextButton.textContent =
        buttonText;

    nextButton.addEventListener(
        "click",
        startNextSession
    );


    const homeButton =
        document.createElement("button");

    homeButton.className =
        "restart-button";

    homeButton.textContent =
        "← Accueil";

    homeButton.addEventListener(
        "click",
        goHome
    );


    breakActions.appendChild(
        nextButton
    );

    breakActions.appendChild(
        homeButton
    );

}


/* ─────────────────────────
   SESSION SUIVANTE
───────────────────────── */

function startNextSession() {

    clearInterval(breakInterval);

    startSelectedMode();

}


/* ─────────────────────────
   FIN DU CYCLE
───────────────────────── */

function finishCycle() {

    clearInterval(interval);

    cycleCompleted++;

    finishedTime.textContent =
        settingsData.sessionsPerCycle +
        " sessions terminées";

    updateCyclePoints();


    if (
        settingsData.sequenceMode ===
        "automatic"
    ) {

        startLongBreak();

    }
    else {

        showScreen("finished");

    }

}


/* ─────────────────────────
   NOUVEAU CYCLE
───────────────────────── */

function startNewCycle() {

    clearInterval(breakInterval);

    currentSessionNumber = 0;

    updateCyclePoints();


    if (
        settingsData.preparationEnabled &&
        settingsData.preparationFrequency ===
        "cycle"
    ) {

        startPreparation();

    }
    else {

        startSelectedMode();

    }

}


document
    .getElementById("newCycleButton")
    .addEventListener(
        "click",
        startNewCycle
    );
