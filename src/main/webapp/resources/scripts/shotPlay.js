window.addEventListener("DOMContentLoaded", () => {

    const shots = [
        document.getElementById("shot1"),
        document.getElementById("shot2"),
        document.getElementById("shot3"),
        document.getElementById("shot4")
    ];

    let savedShotCount = 1;
    window.shotsEnabled = false;

    function playRandomShot() {
        const sound = shots[Math.floor(Math.random() * shots.length)];
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    // --- Выстрел по графику ---
    const svg = document.getElementById("mainSvg");
    if (svg) {
        svg.addEventListener("click", () => {
           if (checkR()) playRandomShot();  // ← главное изменение
        });
    }

    // --- Счёт X из hiddenX ---
    window.saveShotCount = function () {
        const hiddenX = document.getElementById("hiddenX").value;

        if (!hiddenX || hiddenX.trim() === "") {
            savedShotCount = 1;
            return;
        }

        const arr = hiddenX.split(",").filter(v => v.trim() !== "");
        savedShotCount = arr.length > 0 ? arr.length : 1;
    };

    // --- Одновременные выстрелы ---
    window.playShotsInstant = function () {
        for (let i = 0; i < savedShotCount; i++) {
            playRandomShot();
        }
    };

});
