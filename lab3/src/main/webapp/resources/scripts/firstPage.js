window.onload = function() {


    const startGame = document.getElementById("startGame")
    const startGameAudio = document.getElementById("startGameAudio")

    if (startGame && startGameAudio) {
        startGame.addEventListener("click", function(event) {
            event.preventDefault()
            startGameAudio.currentTime = 0
            startGameAudio.play().then(() => {
                startGameAudio.onended = () => {
                    window.location = startGame.href
                };
            }).catch(err => {
                console.error("Ошибка воспроизведения:", err)
                window.location = startGame.href
            })
        })
    }

}