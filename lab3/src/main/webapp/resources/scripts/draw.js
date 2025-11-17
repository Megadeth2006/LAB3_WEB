window.existingPoints = window.existingPoints || []

function handleRemoteCommandComplete(args) {
    if (args && args.pointsJson) {
        try {
            window.existingPoints = JSON.parse(args.pointsJson)
        } catch(e) {
            window.existingPoints = []
            console.error('parse pointsJson failed', e)
        }
    } else {
        window.existingPoints = []
    }
    const svg = document.getElementsByClassName('svg')[0]
    if (svg) {
        svg.querySelectorAll('circle').forEach(c => {
            if (c.id !== 'cursor-circle') c.remove()
        })
    }
    console.log(existingPoints)
    drawAll()
}

function playShotSound(wasProbitie) {
    let audioId;
    if (wasProbitie) {
        audioId = Math.random() < 0.5 ? 'good1' : 'good2';
        console.log("Было хотя бы одно попадание!");
    } else {
        audioId = Math.random() < 0.5 ? 'bad1' : 'bad2';
        console.log("Ни одного попадания нет");
    }

    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn("Не удалось проиграть звук:", e));
    }
}

function drawPoint(args) {
    console.log(args)
    if (!args.point) return
    const {x, y, inArea} = args.point
    draw(x, y, inArea)
}

function draw(x, y, inArea) {
    const cx = x * 30 + 150
    const cy = -y * 30 + 150

    const fillColor = inArea ? "#09a53d" : "#a50909"

    const svg = document.getElementsByClassName("svg")[0]
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
    circle.setAttribute("cx", cx)
    circle.setAttribute("cy", cy)
    circle.setAttribute("r", "5")
    circle.setAttribute("fill", fillColor)
    circle.setAttribute("fill-opacity", "0.9")
    circle.setAttribute("stroke", "firebrick")
    svg.appendChild(circle)
}

function syncHiddenWithRadio() {
    let radio = document.querySelector('input[name="select-x"]:checked');
    if (radio) {
        document.getElementById("hiddenX").value = radio.value.replace(",", ".");
    }
}

function syncHiddenWithText() {
    let yInput = document.getElementById("yInput");
    if (yInput) {
        document.getElementById("hiddenY").value = yInput.value.replace(",", ".");
    }
}

function drawAll() {
    existingPoints.forEach(p => {
        const { x, y, r, inArea } = p
        draw(x, y, inArea)
    })
}

function clearHiddenInputs() {
    const hiddenX = document.getElementById("hiddenX");
    let x = get("mainCl", "input[name='select-x']:checked", -4, 4, "value between -4 and 4")
    console.log(x)
    if (!(x.isValid && x.number.length !== 0)){
        hiddenX.value = '';
    }
}

function update() {
    PrimeFaces.ajax.Request.handle({
        source: 'responsesForm',
        update: 'responsesForm',
        process: 'responsesForm'
    })
}

function handleCheckboxChange(checkbox) {
    const rValue = checkbox.getAttribute('data-r') * 30
    const svg = document.getElementsByClassName('svg')[0]
    const elementId = `r-${rValue}-circle`

    if (checkbox.checked) {

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        group.setAttribute('id', elementId)

        const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
        triangle.setAttribute('points',
            `150,150 ${150 + rValue},150 150,${150 + rValue}`
        )
        triangle.setAttribute('fill-opacity', '0.4')
        triangle.setAttribute('stroke', 'navy')
        triangle.setAttribute('fill', 'blue')

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        const rectWidth = rValue
        const rectHeight = rValue/2
        rect.setAttribute('x', 150 - rectWidth)
        rect.setAttribute('y', 150)
        rect.setAttribute('width', rectWidth)
        rect.setAttribute('height', rectHeight)
        rect.setAttribute('fill-opacity', '0.4')
        rect.setAttribute('stroke', 'navy')
        rect.setAttribute('fill', 'blue')

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        const startX = 150 - rValue
        const startY = 150;
        path.setAttribute('d',
            `M ${startY} ${startX} A ${rValue} ${rValue} 0 0 0 ${startX} ${startY} L 150 150 Z`
        )
        path.setAttribute('fill-opacity', '0.4')
        path.setAttribute('stroke', 'navy')
        path.setAttribute('fill', 'blue')

        group.appendChild(triangle)
        group.appendChild(rect)
        group.appendChild(path)

        svg.appendChild(group)
    } else {
        const existingElement = document.getElementById(elementId)
        if (existingElement) {
            svg.removeChild(existingElement)
        }
    }

    updateRCommand([{ name: 'maxR', value: getMaxR() }]);

}

function getMaxR() {
    const allR = [0]
    if (document.getElementById('r1_input').checked) allR.push(parseInt(document.getElementById('r1').getAttribute('data-r')))
    if (document.getElementById('r2_input').checked) allR.push(parseInt(document.getElementById('r2').getAttribute('data-r')))
    if (document.getElementById('r3_input').checked) allR.push(parseInt(document.getElementById('r3').getAttribute('data-r')))
    if (document.getElementById('r4_input').checked) allR.push(parseInt(document.getElementById('r4').getAttribute('data-r')))
    if (document.getElementById('r5_input').checked) allR.push(parseInt(document.getElementById('r5').getAttribute('data-r')))
    return Math.max(...allR)
}


window.addEventListener("DOMContentLoaded", () => {

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

    const svg = document.getElementsByClassName("svg")[0]

    const cursorCircle = document.getElementById('cursor-circle')

    let checkboxes = Array.from(document.querySelectorAll(".input-r input[type=checkbox]"));
    checkboxes.forEach(cb => handleCheckboxChange(cb));


    svg.addEventListener("click", (event) => {
        checkboxes = Array.from(document.querySelectorAll(".input-r input[type=checkbox]"));
        const selectedR = checkboxes
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.dataset.r, 10));

        if (selectedR.length === 0) {
            showError("R must be selected");
            return;
        }

        processRValues(selectedR, event, 0, false);
    });

    function processRValues(rValues, event, index, wasProbitieParam) {
        if (index >= rValues.length){
            document.getElementById('hiddenR').value = ''
            resetHiddenRCommand()
            updateRCommand([{ name: 'maxR', value: Math.max(...rValues) }])
            playShotSound(wasProbitieParam)
            clearHiddenInputs()
            return
        }

        const rValue = rValues[index];
        const x = (event.offsetX - 125) / 30;
        const y = (125 - event.offsetY) / 30;

        document.getElementById("hiddenX").value = x;
        document.getElementById("hiddenY").value = y;
        document.getElementById('hiddenR').value = rValue;

        PrimeFaces.ab({
            source: 'submitBtn',
            process: '@form',
            update: 'input-form @form :responsesForm',
            oncomplete: function(xhr, status, args) {
                let temp = args.wasProbitie || wasProbitieParam
                processRValues(rValues, event, index + 1, temp);
            }
        });
    }

    updateRCommand([{ name: 'maxR', value: getMaxR() }])
});