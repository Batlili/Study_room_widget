/* ─────────────────────────
   PRÉPARATION
───────────────────────── */

function shouldPrepare() {

    if (!settingsData.preparationEnabled) {
        return false;
    }

    const frequency =
        settingsData.preparationFrequency;


    if (frequency === "session") {
        return true;
    }


    if (
        frequency === "cycle" &&
        currentSessionNumber === 0
    ) {
        return true;
    }


    if (
        frequency === "daily" &&
        currentSessionNumber === 0
    ) {

        const today = getTodayDate();

        const lastDate =
            localStorage.getItem(
                "studyRoomPreparationLastDate"
            );

        return lastDate !== today;
    }


    return false;
}


/* ─────────────────────────
   COMMENCER LE TRAVAIL
───────────────────────── */

function beginWork() {

    if (shouldPrepare()) {
        startPreparation();
    }
    else {
        startSelectedMode();
    }

}


/* ─────────────────────────
   DÉMARRER LA PRÉPARATION
───────────────────────── */

function startPreparation() {

    clearInterval(preparationInterval);

    preparationRemaining =
        settingsData.preparation * 60;

    localStorage.setItem(
        "studyRoomPreparationLastDate",
        getTodayDate()
    );

    preparationTimer.textContent =
        formatTime(preparationRemaining);

    showScreen("preparation");


    preparationInterval = setInterval(
        function() {

            preparationRemaining--;

            preparationTimer.textContent =
                formatTime(preparationRemaining);


            if (preparationRemaining <= 0) {

                clearInterval(
                    preparationInterval
                );

                playNotificationSound(
                    "conditioningNotification",
                    "conditioningSound"
                );

                startSelectedMode();

            }

        },
        1000
    );

}


/* ─────────────────────────
   PASSER LA PRÉPARATION
───────────────────────── */

document
    .getElementById("skipPreparation")
    .addEventListener(
        "click",
        function() {

            clearInterval(
                preparationInterval
            );

            startSelectedMode();

        }
    );
