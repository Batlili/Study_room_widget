/* ─────────────────────────
   SONS DES NOTIFICATIONS
───────────────────────── */

const notificationSounds = {

    carillon: new Audio("sounds/carillon.wav"),
    feerie: new Audio("sounds/feerie.wav"),
    joyeux: new Audio("sounds/joyeux.wav"),
    classique: new Audio("sounds/classique.wav"),
    serenite: new Audio("sounds/serenite.wav")

};


function playNotificationSound(enabledSetting, soundSetting) {

    if (!settingsData[enabledSetting]) {
        return;
    }

    const sound = notificationSounds[settingsData[soundSetting]];

    if (sound) {

        sound.currentTime = 0;

        sound.play().catch(function(error) {

            console.log("Impossible de jouer le son.", error);

        });

    }

}