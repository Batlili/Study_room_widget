/* ─────────────────────────
   SAUVEGARDE
───────────────────────── */

function saveSettings() {

    localStorage.setItem(
        "studyRoomSettingsV6",
        JSON.stringify(settingsData)
    );

}


function loadSettings() {

    const saved = localStorage.getItem("studyRoomSettingsV6");

    if (!saved) {
        return;
    }

    try {
        const parsed = JSON.parse(saved);

        settingsData = {
            ...settingsData,
            ...parsed
        };

    }
    catch (error) {

        console.log("Impossible de charger les réglages.");

    }

}