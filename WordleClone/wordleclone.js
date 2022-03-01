let row = 0;
let column = 0;
let activeBox = document.querySelector("#box" + row + column + " input");
let validWords = ["sword", "store", "pause", "graph"];
let validAns = ["sword", "pause"];
let answer = ["s","w", "e", "e", "t"];
let matchedLetters = ["-", "-", "-", "-", "-"];
let keyboard = ["a", "b", "c", "d", "e", "f", "g" , "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

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
        if (attempt === answer.join("")) {
            document.querySelector("#box00 input").style.backgroundColor = "green";
            document.querySelector("#box01 input").style.backgroundColor = "green";
            document.querySelector("#box02 input").style.backgroundColor = "green";
            document.querySelector("#box03 input").style.backgroundColor = "green";
            document.querySelector("#box04 input").style.backgroundColor = "green";
        }
        else {
            for (let i = 0; i < 5; i++) {
                if (answer.includes(attempt[i])) {
                    if (attempt[i] === answer[i]) {
                        document.querySelector("#box0" + i + " input").style.backgroundColor = "green";
                        answer.splice(i, 1, "-"); // placeholder hyphen for spliced letter so the # of elements in the array remains the same
                    }
                    else {
                        matchedLetters.splice(i, 1, attempt[i]);
                    }
                }
                else {
                    document.querySelector("#box0" + i + " input").style.backgroundColor = "red";
                }
            }
            for (let i = 0; i < 5; i++) {
                if (matchedLetters[i].match(/[A-z]/)) { //checks to see if the element is a letter
                    if (answer.includes(matchedLetters[i])) {
                        document.querySelector("#box0" + i + " input").style.backgroundColor = "yellow";
                        answer.splice(answer.indexOf(matchedLetters[i]), 1, "-");
                    }
                    else {
                        document.querySelector("#box0" + i + " input").style.backgroundColor = "red";
                    }
                }
            }
        }
    }
})

