let row = 0;
let column = 0;
let activeBox = document.querySelector("#box" + row + column + " input");
let validWords = ["sword", "store", "pause", "graph"];
let validAns = ["sword", "pause"];
let answer = "sword";

activeBox.focus();
activeBox.onkeyup = nextInput;

function nextInput() {

    if (document.querySelector("#box" + row + column + " input").value.length === 1 && column < 4) {
        column += 1;
        document.querySelector("#box" + row + column + " input").focus();
        activeBox = document.querySelector("#box" + row + column + " input");
        activeBox.onkeyup = nextInput;
    }
}

document.addEventListener("keyup", function(keyPress) {
    if (keyPress.code === "Enter") {
        let attempt = document.querySelector("#box00 input").value + document.querySelector("#box01 input").value + document.querySelector("#box02 input").value + document.querySelector("#box03 input").value + document.querySelector("#box04 input").value;
        if (attempt === answer) {
            document.querySelector("#box00 input").style.backgroundColor = "green";
            document.querySelector("#box01 input").style.backgroundColor = "green";
            document.querySelector("#box02 input").style.backgroundColor = "green";
            document.querySelector("#box03 input").style.backgroundColor = "green";
            document.querySelector("#box04 input").style.backgroundColor = "green";
        }
        else {
            for (let i = 0; i < 5; i++) {
                for (let x of answer) {
                    if (attempt[i] === x) {
                        if (attempt[i] === answer[i]) {
                            document.querySelector("#box0" + i + " input").style.backgroundColor = "green";
                            break;
                        }
                        else {
                            document.querySelector("#box0" + i + " input").style.backgroundColor = "yellow";
                            break;
                        }
                    }
                    else {
                        document.querySelector("#box0" + i + " input").style.backgroundColor = "red";
                    }
                }
            }
        }
    }
})

