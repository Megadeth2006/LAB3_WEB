let soundEnabled = false;

function getAudio() {
    return document.getElementById("bgAudio");
}

window.addEventListener("load", () => {
    const audio = getAudio();
    if (audio) audio.loop = true;
});

function toggleSound() {
    const audio = getAudio();
    if (!audio) return;

    const text = document.getElementById("soundButtonText");

    if (!soundEnabled) {
        audio.play()
            .then(() => {
                soundEnabled = true;
                text.textContent = "Отключить звук";
            })
            .catch(err => {
                console.log("Автоплей заблокирован:", err);
            });
    } else {
        audio.pause();
        audio.currentTime = 0;

        soundEnabled = false;
        text.textContent = "Включить звук";
    }
}
