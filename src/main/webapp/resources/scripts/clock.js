function drawClock() {
    const canvas = document.getElementById("clock")
    const ctx = canvas.getContext("2d")
    const radius = canvas.height / 2
    ctx.translate(radius, radius)

    setInterval(() => {
        ctx.clearRect(-radius, -radius, canvas.width, canvas.height)

        ctx.beginPath()
        ctx.arc(0, 0, radius - 5, 0, 2 * Math.PI)
        ctx.fillStyle = "rgba(0,0,0,0.6)"
        ctx.fill()
        ctx.stroke()

        drawMarks(ctx, radius)

        const now = new Date()
        const hour = now.getHours() % 12
        const minute = now.getMinutes()
        const second = now.getSeconds()

        drawHand(ctx, (hour + minute / 60) * 30 * Math.PI / 180, radius * 0.5, 6)
        drawHand(ctx, (minute + second / 60) * 6 * Math.PI / 180, radius * 0.8, 4)
        drawHand(ctx, second * 6 * Math.PI / 180, radius * 0.9, 2, "red")
    }, 1000);

    function drawHand(ctx, angle, length, width, color="black") {
        ctx.save()

        ctx.beginPath()
        ctx.lineWidth = width
        ctx.lineCap = "round"
        ctx.moveTo(0,0)
        ctx.rotate(angle)
        ctx.lineTo(0, -length)
        ctx.strokeStyle = color
        ctx.stroke()
        ctx.rotate(-angle)

        ctx.restore()
    }

    function drawMarks(ctx, radius) {
        for (let i = 0; i < 60; i++) {
            ctx.beginPath()
            ctx.rotate(Math.PI / 30)
            ctx.moveTo(0, -radius + 5)

            if (i % 5 === 0) {
                ctx.lineTo(0, -radius + 15)
                ctx.lineWidth = 3
            } else {
                ctx.lineTo(0, -radius + 10)
                ctx.lineWidth = 1
            }

            ctx.stroke()
        }
    }

}

window.onload = function() {
    drawClock()
    const video = document.getElementById('bgVideo')
    const audio = document.getElementById('bgAudio')
    const button = document.getElementById('unmuteButton')

    video.play().catch(e => console.log("Видео не запустилось:", e))

    button.addEventListener('click', function() {
        audio.play().then(() => {
            console.log("Аудио включено!")
            button.style.display = 'none'
        }).catch(err => console.log("Не удалось включить звук:", err))
    })

    const vBoiLink = document.getElementById("vBoiLink")
    const vBoiAudio = document.getElementById("vBoiAudio")

    if (vBoiLink && vBoiAudio) {
        vBoiLink.addEventListener("click", function(event) {
            event.preventDefault()
            vBoiAudio.currentTime = 0
            vBoiAudio.play().then(() => {
                vBoiAudio.onended = () => {
                    window.location = vBoiLink.href
                };
            }).catch(err => {
                console.error("Ошибка воспроизведения:", err)
                window.location = vBoiLink.href
            })
        })
    }

}










