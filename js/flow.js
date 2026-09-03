/* ─────────────────────────
    FLOW
───────────────────────── */

document
    .getElementById("flowButton")
    .addEventListener("click", () => {

        sessionType = "flow";

        beginWork();

    });

/* ─────────────────────────
    TIMER FLOW
───────────────────────── */

function startFlow() {

    clearInterval(interval);

    interval = setInterval(() => {

        if (isPaused) {
            return;
        }

        elapsedSeconds++;

        timer.textContent =
            formatTime(elapsedSeconds);

    }, 1000);

}