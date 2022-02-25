let row = 1;
let column = 1;
let activeBox = document.querySelector("#box" + row + column + " input");
let validWords = ["sword", "store", "pause", "graph"];
let validAns = ["sword", "pause"];
let answer = "sword";

activeBox.focus();
activeBox.onkeyup = nextInput;

function nextInput() {

    if (document.querySelector("#box" + row + column + " input").value.length === 1 && column < 5) {
        column += 1;
        document.querySelector("#box" + row + column + " input").focus();
        activeBox = document.querySelector("#box" + row + column + " input");
        activeBox.onkeyup = nextInput;
    }
}

document.addEventListener("keyup", function(keyPress) {
    if (keyPress.code === "Enter") {
        let attempt = document.querySelector("#box11 input").value + document.querySelector("#box12 input").value + document.querySelector("#box13 input").value + document.querySelector("#box14 input").value + document.querySelector("#box15 input").value;
        if (attempt === answer) {
            document.querySelector("#box11 input").style.backgroundColor = "green";
            document.querySelector("#box12 input").style.backgroundColor = "green";
            document.querySelector("#box13 input").style.backgroundColor = "green";
            document.querySelector("#box14 input").style.backgroundColor = "green";
            document.querySelector("#box15 input").style.backgroundColor = "green";
        }
        else {
            for (let i = 1; i < 6; i++) {
                for (let x of answer) {
                    if (document.querySelector("#box1" + i + " input").value === x) {
                        document.querySelector("#box1" + i + " input").style.backgroundColor = "yellow";
                    }
                    else {
                        document.querySelector("#box1" + i + " input").style.backgroundColor = "red";
                    }
                }
            }
        }
    }
})

