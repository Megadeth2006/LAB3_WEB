function updateClockMafia() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    document.getElementById(    "digitalClock").textContent =
        `${h}:${m}:${s}`;
}

setInterval(updateClockMafia, 7000);
updateClockMafia();
