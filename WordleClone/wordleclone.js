

document.querySelector("#box11 input").onkeyup = nextInput;

function nextInput() {
    document.querySelector("#box12 input").focus();
}