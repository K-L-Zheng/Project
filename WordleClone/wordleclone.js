let row = 0;
let column = 0;
let validWords = ["sword", "store", "pause", "graph", "sweet", "seeds", "speed", "sbmad", "brand"];
let validAns = ["sword", "pause", "sweet", "speed", "sbmad"];
let answer = ["s","b", "m", "a", "d"];
let matchedLetters = ["-", "-", "-", "-", "-"];
// let keyboard = ["a", "b", "c", "d", "e", "f", "g" , "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

//FIX - mouse clicks directly on letters cause the letters to be undeletable

document.addEventListener("keydown", function(keypress) {
    if (/[A-z]/.test(keypress.key) && /[^\\\][^_]/.test(keypress.key)) { //filters out numbers + special characters, second part filters out [, ], \, ^, _
        if (keypress.key.length === 1) { //prevent non-letter keys from changing input focus
            if (column < 5) {
                document.querySelector("#box" + row + column++ + " input").focus();
                document.activeElement.value = "";
            }
            else if (column === 5) {
                document.activeElement.value = "";
            }
        }
    }
    else {
        keypress.preventDefault(); //prevents key event from activating
    }

    if (keypress.code === "Backspace" && column > 0) {
        document.querySelector("#box" + row + --column + " input").focus();
    }

    if (keypress.code === "Enter") {
        let attempt = document.querySelector("#box00 input").value + document.querySelector("#box01 input").value + document.querySelector("#box02 input").value + document.querySelector("#box03 input").value + document.querySelector("#box04 input").value;
        if (attempt === answer.join("")) {
            document.querySelector("#box00 input").style.backgroundColor = "rgb(120, 223, 163)";
            document.querySelector("#box01 input").style.backgroundColor = "rgb(120, 223, 163)";
            document.querySelector("#box02 input").style.backgroundColor = "rgb(120, 223, 163)";
            document.querySelector("#box03 input").style.backgroundColor = "rgb(120, 223, 163)";
            document.querySelector("#box04 input").style.backgroundColor = "rgb(120, 223, 163)";
        }
        else if (validWords.includes(attempt)) { //checks to see if the word is in the word bank
            for (let i = 0; i < 5; i++) {
                if (answer.includes(attempt[i])) {
                    if (attempt[i] === answer[i]) {
                        document.querySelector("#box0" + i + " input").style.backgroundColor = "rgb(120, 223, 163)";
                        answer.splice(i, 1, "-"); // placeholder hyphen for spliced letter so the # of elements in the array remains the same
                    }
                    else {
                        matchedLetters.splice(i, 1, attempt[i]);
                    }
                }
                else {
                    document.querySelector("#box0" + i + " input").style.backgroundColor = "rgb(245, 131, 131)";
                }
            }
            for (let i = 0; i < 5; i++) {
                if (matchedLetters[i].match(/[A-z]/)) { //checks to see if the element is a letter
                    if (answer.includes(matchedLetters[i])) {
                        document.querySelector("#box0" + i + " input").style.backgroundColor = "rgb(255, 255, 204)";
                        answer.splice(answer.indexOf(matchedLetters[i]), 1, "-");
                    }
                    else {
                        document.querySelector("#box0" + i + " input").style.backgroundColor = "rgb(245, 131, 131)";
                    }
                }
            }
        }
        else { //clears the row
            document.querySelector("#box00 input").value = "";
            document.querySelector("#box01 input").value = "";
            document.querySelector("#box02 input").value = "";
            document.querySelector("#box03 input").value = "";
            document.querySelector("#box04 input").value = "";
            //resets back to 1st box in row
            document.querySelector("#box00 input").focus();
            column = 0;
        }
    }
})

document.addEventListener("click", function() {
    if (document.activeElement.parentElement.classList.contains("attempt1")) {
        column = document.activeElement.parentElement.id[4];
    }
})