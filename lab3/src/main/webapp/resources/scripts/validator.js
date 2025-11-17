class Result {
    constructor(isValid, number, msg) {
        this.number = number
        this.isValid = isValid
        this.msg = msg
    }
}

function get(parent, element, left, right, errorMsg){
    try{
        const form = document.getElementsByClassName(parent)[0]
        let values = Array.from(form.querySelectorAll(element)).map(elem => elem.value.replace(",", "."))

        for (const elem of values) {
            if (!check(elem, left, right)) return new Result(false, null, errorMsg)
        }

        if (values.length !== 0) return new Result(true, values, "ok")
        else return new Result(false, null, "values can't be empty")
    } catch (err) {
        return new Result(false, null, "values can't be empty")
    }
}

function getCheckboxValues(parent, selector, left, right, errorMsg) {
    try {
        const form = document.getElementsByClassName(parent)[0]
        let checkboxes = Array.from(form.querySelectorAll(selector))
        let values = []

        checkboxes.forEach(cb => {
            if (cb.checked) {
                let val = parseFloat(cb.dataset.r)
                if (!check(val, left, right)) throw new Error(errorMsg)
                values.push(val)
            }
        })

        if (values.length === 0) return new Result(false, null, "values can't be empty")
        return new Result(true, values, "ok")
    } catch (err) {
        return new Result(false, null, errorMsg);
    }
}

function check(num, left, right) {
    if (num === undefined) return false
    let val = parseFloat(num)
    if (isNaN(val) || !isFinite(val)) return false
    if (val < left || val > right) return false
    return true
}

function validate() {
    let xH = get("mainCl", "#hiddenX", -4, 4, "value between -4 and 4")
    let yH = get("mainCl", "#hiddenY", -3, 5, "value between -3 and 5")
//    let x = get("main", "select-x", -4, 4, "value between -4 and 4")
//    let y = get("main", "yInput", -3, 5, "value between -3 and 5")


    let r = getCheckboxValues("input-r", "input[type=checkbox]", 1, 5, "value between 1 and 5");

    if (!(xH.isValid && yH.isValid && r.isValid)) {
        let errors = "errors"
        if (!xH.isValid) errors += "\n X " + xH.msg
        if (!yH.isValid) errors += "\n Y " + yH.msg
        if (!r.isValid) errors += "\n R " + r.msg
        showError(errors)
        return false
    }
    return true
}