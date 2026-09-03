/* ─────────────────────────
   SETTINGS
───────────────────────── */

// Ouvrir / fermer les réglages

document
    .getElementById("settingsButton")
    .addEventListener("click", function(event) {

        event.stopPropagation();

        colorPalette.classList.remove("visible");

        if (currentScreen === "settings") {

            showScreen(settingsReturnScreen);

            return;

        }

        settingsReturnScreen = currentScreen;

        syncSettingsUI();

        showScreen("settings");

    });


document
    .getElementById("settingsClose")
    .addEventListener("click", function() {

        showScreen(settingsReturnScreen);

    });


// Aperçu des sons

function setupSoundPreview(soundSelect, settingName) {

    soundSelect.addEventListener("change", function() {

        settingsData[settingName] =
            this.value;

        saveSettings();

        playPreviewSound(
            this.value
        );

    });

}

function playPreviewSound(soundName) {

    const sound =
        notificationSounds[soundName];

    if (!sound) {
        return;
    }

    sound.currentTime = 0;

    sound.play().catch(function(error) {

        console.log(
            "Impossible de jouer le son.",
            error
        );

    });

}

document
    .querySelectorAll(".sound-preview")
    .forEach(button => {

        button.addEventListener("click", function() {

            const soundSelect =
                document.getElementById(
                    this.dataset.sound
                );

            playPreviewSound(
                soundSelect.value
            );

        });

    });

setupSoundPreview(workSound, "workSound");

setupSoundPreview(
    conditioningSound,
    "conditioningSound"
);

setupSoundPreview(
    shortBreakSound,
    "shortBreakSound"
);

setupSoundPreview(
    longBreakSound,
    "longBreakSound"
);


// Notifications

workNotification.addEventListener("change", function() {

    settingsData.workNotification = this.checked;

    updateNotificationSelect(
        this,
        workSound
    );

    saveSettings();

});


conditioningNotification.addEventListener("change", function() {

    settingsData.conditioningNotification =
        this.checked;

    updateNotificationSelect(
        this,
        conditioningSound
    );

    saveSettings();

});


shortBreakNotification.addEventListener("change", function() {

    settingsData.shortBreakNotification =
        this.checked;

    updateNotificationSelect(
        this,
        shortBreakSound
    );

    saveSettings();

});


longBreakNotification.addEventListener("change", function() {

    settingsData.longBreakNotification =
        this.checked;

    updateNotificationSelect(
        this,
        longBreakSound
    );

    saveSettings();

});


// Préparation

preparationEnabled.addEventListener("change", function() {

    settingsData.preparationEnabled =
        this.checked;

    preparationOptions.classList.toggle(
        "hidden",
        !this.checked
    );

    saveSettings();

});


preparationFrequency.addEventListener("change", function() {

    settingsData.preparationFrequency =
        this.value;

    saveSettings();

});


// Nom de session

sessionNameEnabled.addEventListener("change", function() {

    settingsData.sessionNameEnabled =
        this.checked;

    sessionNameHome.classList.toggle(
        "visible",
        this.checked
    );

    saveSettings();

});


sessionNameInput.addEventListener("input", function() {

    sessionName =
        this.value.trim();

    localStorage.setItem(
        "studyRoomSessionNameV6",
        sessionName
    );

});


// Mode de séquence

sequenceMode.addEventListener("change", function() {

    settingsData.sequenceMode =
        this.value;

    saveSettings();

});


// Nombre de sessions par cycle

sessionsPerCycle.addEventListener("change", function() {

    settingsData.sessionsPerCycle =
        Number(this.value);

    updateCyclePoints();

    saveSettings();

});


// Activer / désactiver la liste des sons

function updateNotificationSelect(
    notification,
    soundSelect
) {

    const disabled =
        !notification.checked;

    soundSelect.classList.toggle(
        "disabled",
        disabled
    );

    soundSelect.disabled =
        disabled;

};



/* ─────────────────────────
   ICÔNE DES SESSIONS
───────────────────────── */

const sessionIconOptions =
    document.querySelectorAll(".session-icon-option");

sessionIconOptions.forEach(option => {

    option.addEventListener("click", () => {

        settingsData.sessionIcon =
            option.dataset.icon;

        sessionIconOptions.forEach(item => {
            item.classList.remove("selected");
        });

        option.classList.add("selected");

        updateCyclePoints();
        saveSettings();

    });

});