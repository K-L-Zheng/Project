let row = 0;
let column = 0;
let validWords = ["sword", "store", "pause", "graph", "sweet", "seeds", "speed", "sbmad", "brand", "swift", "shift", "dance"];
let validAns = ["sword", "pause", "sweet", "speed", "sbmad", "swift", "shift", "dance"];
let answer = "swift";
// let keyboard = ["a", "b", "c", "d", "e", "f", "g" , "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

document.addEventListener("keydown", function(keypress) {
    if (/[A-z]/.test(keypress.key) && /[^\\\][^_]/.test(keypress.key)) { //filters out numbers + special characters, second part filters out [, ], \, ^, _
        if (keypress.key.length === 1 && column < 5) { //prevent non-letter keys from changing input focus & prevents input for last box to be changed once a letter is entered
            document.querySelector("#box" + row + column + " input").focus();
            document.activeElement.value = "";
            column += 1; //column needs to reach 5 in order for backspace to function properly, otherwise backspace will clear the 4th box instead of the 5th
        }
        else if (keypress.key === "Backspace") { //prevents backspace from deleting the value in the previous box
            keypress.preventDefault();
        }
    }
    else {
        keypress.preventDefault(); //prevents key event from activating
    }

    if (keypress.code === "Backspace") {
        if (column !== +document.activeElement.parentElement.id[4]) {
            column -= 1;
            document.querySelector("#box" + row + column + " input").value = "";
            if (column > 0) {
                document.querySelector("#box" + row + (column - 1) + " input").focus();
            }
            else {
                document.querySelector("#box" + row + column + " input").focus();
            }
        }
        else { //for when clicks reassign the column
            document.querySelector("#box" + row + column + " input").value = "";
            column = column > 0 ? column - 1 : column;
            document.querySelector("#box" + row + column + " input").focus();
        }
    }

    if (keypress.code === "Enter") {
        let answerLetters = answer.split("");
        let attempt = document.querySelector("#box" + row + "0 input").value + document.querySelector("#box" + row + "1 input").value + document.querySelector("#box" + row + "2 input").value + document.querySelector("#box" + row + "3 input").value + document.querySelector("#box" + row + "4 input").value;
        let matchedLetters = ["-", "-", "-", "-", "-"];

        if (attempt === answer) {
            document.querySelector("#box" + row + "0 input").style.backgroundColor = "rgb(120, 223, 163)";
            document.querySelector("#box" + row + "1 input").style.backgroundColor = "rgb(120, 223, 163)";
            document.querySelector("#box" + row + "2 input").style.backgroundColor = "rgb(120, 223, 163)";
            document.querySelector("#box" + row + "3 input").style.backgroundColor = "rgb(120, 223, 163)";
            document.querySelector("#box" + row + "4 input").style.backgroundColor = "rgb(120, 223, 163)";

            document.querySelector("#av" + row).style.visibility = "visible";
        }
        else if (validWords.includes(attempt)) { //checks to see if the word is in the word bank
            for (let i = 0; i < 5; i++) {
                if (answerLetters.includes(attempt[i])) {
                    if (attempt[i] === answerLetters[i]) {
                        document.querySelector("#box" + row + i + " input").style.backgroundColor = "rgb(120, 223, 163)";
                        answerLetters.splice(i, 1, "-"); // placeholder hyphen for spliced letter so the # of elements in the array remains the same
                    }
                    else {
                        matchedLetters.splice(i, 1, attempt[i]);
                    }
                }
                else {
                    document.querySelector("#box" + row + i + " input").style.backgroundColor = "rgb(245, 131, 131)";
                }
            }
            for (let i = 0; i < 5; i++) {
                if (matchedLetters[i].match(/[A-z]/)) { //checks to see if the element is a letter
                    if (answerLetters.includes(matchedLetters[i])) {
                        document.querySelector("#box" + row + i + " input").style.backgroundColor = "rgb(255, 255, 204)";
                        answerLetters.splice(answerLetters.indexOf(matchedLetters[i]), 1, "-");
                    }
                    else {
                        document.querySelector("#box" + row + i + " input").style.backgroundColor = "rgb(245, 131, 131)";
                    }
                }
            }
            if (row < 5) {
                row += 1;
                document.querySelector("#av" + (row - 1)).style.visibility = "visible";
                document.querySelector("#av" + row).style.visibility = "hidden";
            }
        }
        else { //clears the row
            document.querySelector("#box" + row + "0 input").value = "";
            document.querySelector("#box" + row + "1 input").value = "";
            document.querySelector("#box" + row + "2 input").value = "";
            document.querySelector("#box" + row + "3 input").value = "";
            document.querySelector("#box" + row + "4 input").value = "";
            //resets back to 1st box in row
            document.querySelector("#box" + row + "0 input").focus();
            column = 0;
        }
    }
})

document.addEventListener("click", function() {
    if (document.activeElement.parentElement.classList.contains("attempt" + (row + 1))) {
        column = +document.activeElement.parentElement.id[4];
    }
})