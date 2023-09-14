let matchStarted = false;
let turn = 1;
let players = ["light-pc", "dark-pc"];
let activePiece, lastMovedPiece;
let promoPieceCount = 0;
let remainingPieces = ["dark-king", "dark-knight-a", "dark-bishop-a", "dark-queen", "dark-king", "dark-bishop-b", "dark-knight-b", "dark-rook-b", "dark-pawn-a", "dark-pawn-b", "dark-pawn-c", "dark-pawn-d", "dark-pawn-e", "dark-pawn-f", "dark-pawn-g", "dark-pawn-h", "light-king", "light-knight-a", "light-bishop-a", "light-queen", "light-king", "light-bishop-b", "light-knight-b", "light-rook-b", "light-pawn-a", "light-pawn-b", "light-pawn-c", "light-pawn-d", "light-pawn-e", "light-pawn-f", "light-pawn-g", "light-pawn-h"];
let intervalID;
let lightTimeRem;
let darkTimeRem;

function startTimer(duration) {
    clearInterval(intervalID); //stops other player's timer

    if (matchStarted === true) {
        let initialDuration = duration;
        let hours, minutes, seconds;
        let startTime = Date.now();

        function timer() {
            let timeElapsed = Math.trunc((Date.now() - startTime) / 1000); //truncates the elapsed time, ex. 1.01 -> 1
            let timeRemaining = initialDuration - timeElapsed;

            hours = timeRemaining / 3600 >= 10 ? Math.trunc(timeRemaining / 3600) : "0" + Math.trunc(timeRemaining / 3600);
            minutes = timeRemaining / 60 >= 10 ?
                          Math.trunc(timeRemaining / 60) % 60 === 0 ? "00"
                        : Math.trunc(timeRemaining / 60) % 60 >= 10 ? Math.trunc(timeRemaining / 60) % 60
                        : "0" + Math.trunc(timeRemaining / 60) % 60
                    : "0" + Math.trunc(timeRemaining / 60);
            seconds = timeRemaining % 60 >= 10 ? timeRemaining % 60 : "0" + timeRemaining % 60; //doesn't need to be truncated cause timeRemaining is already truncated and the resulting remainder will always be an integer

            if (players[0] === "light-pc") {
                document.querySelector("#light-timer").innerHTML = hours + ":" + minutes + ":" + seconds;
                lightTimeRem = timeRemaining;
            }
            else {
                document.querySelector("#dark-timer").innerHTML = hours + ":" + minutes + ":" + seconds;
                darkTimeRem = timeRemaining;
            }

            if (timeRemaining <= 0) {
                clearInterval(intervalID);
                matchStarted = false;

                document.querySelector("#win-screen").style.visibility = "visible";
                document.querySelector("#win-screen").style.opacity = "100%";

                if (players[0] === "light-pc") {
                    document.querySelector("#win-screen").innerHTML = "~ DARK WINS ~";
                }
                else {
                    document.querySelector("#win-screen").style.color = "white";
                    document.querySelector("#win-screen").innerHTML = "~ LIGHT WINS ~";
                }
            }
        }
        timer(); //calls the function immediately so we don't have to wait 1000ms for it to start
        intervalID = setInterval(timer, 1000);
    }

    else if (document.querySelector("#win-screen").style.visibility !== "visible") { //prevents timer from continuing once the win screen pops up
        matchStarted = true;
        
        document.querySelector("#timer-selection").style.display = "none";
        document.querySelector("#veil").style.visibility = "hidden";

        darkTimeRem = duration; //stores the initial duration into darkTimeRem, otherwise darkTimeRem === undefined when startTimer() is called on dark's turn
        document.querySelector("#dark-timer").innerHTML = (duration / 3600 >= 10 ? Math.trunc(duration / 3600) : "0" + Math.trunc(duration / 3600)) + ":"
                                                        + (duration / 60 >= 10 ?
                                                            (Math.trunc(duration / 60) % 60 === 0 ? "00"
                                                            : (Math.trunc(duration / 60) % 60 >= 10 ? Math.trunc(duration / 60) % 60
                                                            : "0" + Math.trunc(duration / 60) % 60))
                                                        : "0" + Math.trunc(duration / 60)) + ":"
                                                        + (duration % 60 >= 10 ? duration % 60 : "0" + duration % 60);

        startTimer(duration);
    }
}
function possibleMoves(id) {
    let boardSpace = document.querySelector("#" + id);
    movePiece(id);
    clearsBoard();
    //checks for a piece and player's turn and win-screen visibility
    if (matchStarted === true && boardSpace.children.length && boardSpace.children[0].classList.contains(players[0])) {
        //creates an array of boolean values indicating the visibility of each promo column
        let pawnPromo = [...document.querySelectorAll(".pawn-promo span")];
        pawnPromo = pawnPromo.map(promo => promo.style.visibility !== "visible" ? true : false);
        //ensure no player needs to make a pawn promotion before allowing piece movement
        if (!pawnPromo.includes(false)) {
            activePiece = document.querySelector("#" + boardSpace.children[0].id);
            let boardPiece = boardSpace.children[0];

            switch (true) {
                case boardPiece.classList.contains("pawn"):
                    pawnMoves(id);
                    break;
                case boardPiece.classList.contains("bishop"):
                    bishopMoves(id);
                    break;
                case boardPiece.classList.contains("knight"):
                    knightMoves(id);
                    break;
                case boardPiece.classList.contains("rook"):
                    rookMoves(id);
                    break;
                case boardPiece.classList.contains("queen"):
                    queenMoves(id);
                    break;
                case boardPiece.classList.contains("king"):
                    kingMoves(id);
            }
        }
    }
}
function movePiece(id) {
    let boardSpace = document.querySelector("#" + id);
    //style.outline order needs to be this way, 
    //if solid and 5px are switched then the if statement will return false
    //hexcode color is converted into RGB format
    if (boardSpace.style.outline === "rgb(71, 58, 51) solid 5px") {
        //moves piece
        boardSpace.appendChild(activePiece);
        //checks for castling
        castling(id);
        //captures
        if (boardSpace.children.length === 2) {
            boardSpace.children[0].style.height = "2rem";
            if (boardSpace.children[0].classList.contains("light-pc")) {
                boardSpace.children[0].style.paddingLeft = "10px";
            }
            else {
                boardSpace.children[0].style.paddingRight = "10px";
            }
            //removes the captured piece from the array of remaining pieces
            remainingPieces.splice(remainingPieces.indexOf(boardSpace.children[0].id), 1);

            switch (true) {
                case players[0] === "light-pc":
                    document.querySelector("#cap-dark-pcs").appendChild(boardSpace.children[0]);
                    break;
                case players[0] === "dark-pc":
                    document.querySelector("#cap-light-pcs").appendChild(boardSpace.children[0]);
            }
        }
        //checks for pawn movement for en passant & marks moved pieces
        if (activePiece.classList.contains("pawn")) {
            //marks piece to indicate that it's been moved
            if (!activePiece.classList.contains("moved-once") && !activePiece.classList.contains("moved")) {
                activePiece.classList.add("moved-once");
            }
            else {
                activePiece.classList.remove("moved-once");
                activePiece.classList.add("moved");
            }
            //checks for en passant
            enPassant(id);
            //checks for pawn promotion
            if (id[1] === "8" || id[1] === "1") {
                document.querySelector("#promo-" + id).style.visibility = "visible";
                remainingPieces.splice(remainingPieces.indexOf(boardSpace.children[0].id), 1);
                activePiece.remove();
            }
        }
        else {
            activePiece.classList.add("moved");
        }

        let promoVis = [];

        for (let i = 0; i < document.querySelectorAll(".pawn-promo span").length; i++) {
            promoVis.push(document.querySelectorAll(".pawn-promo span")[i].style.visibility);
        }

        if (!promoVis.includes("visible")) {
            //stores the last moved piece
            lastMovedPiece = activePiece.id;
            check();
            //clears moved piece's possible moves, change player's turn, check for checkmate/stalemate, record total overall turns
            clearsBoard();
            players.reverse();
            mate();
            startTimer(players[0] === "light-pc" ? lightTimeRem : darkTimeRem);

            if (matchStarted === true) {
                turn += .5;
                document.querySelector("#turnCount").innerHTML = Math.floor(turn);
            }
        }
    }
}
function clearsBoard() {
    let allSquares = document.querySelectorAll(".light-sq, .dark-sq");

    for (let i = 0; i < allSquares.length; i++ ) {

        if (allSquares[i].style.outline === "rgb(71, 58, 51) solid 5px" || (allSquares[i].style.outline === "red solid 5px" && !(allSquares[i].children.length && allSquares[i].children[0].classList.contains("king")))) {
            allSquares[i].style.outline = "none";
        }
    }
}
function pawnMoves(id) {
    let moves = [];
    //en passant possibility for light-pcs
    if (players[0] === "light-pc" && id[1] ==="5") {

        if (id.charCodeAt(0) - 1 > 96 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children.length) {
            let samePiece = false;

            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children[0].id === lastMovedPiece) {
                samePiece = true;
            }

            if (samePiece && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once")) {
                document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1)).appendChild(document.querySelector("#" + id).children[0]);    
                check();

                if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                    moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1));
                }

                document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1)).children[0]);
            }
        }

        if (id.charCodeAt(0) + 1 < 105 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children.length) {
            let samePiece = false;

            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children[0].id === lastMovedPiece) {
                samePiece = true;
            }

            if (samePiece && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once")) {
                document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1)).appendChild(document.querySelector("#" + id).children[0]);    
                check();

                if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                    moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1));
                }

                document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1)).children[0]);
            }
        }
    }
    //en passant possibility for dark-pcs
    if (players[0] === "dark-pc" && id[1] === "4") {
        if (id.charCodeAt(0) - 1 > 96 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children.length) {
            let samePiece = false;

            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children[0].id === lastMovedPiece) {
                samePiece = true;
            }

            if (samePiece && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once")) {
                document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1)).appendChild(document.querySelector("#" + id).children[0]);    
                check();

                if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                    moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1));
                }

                document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1)).children[0]);
            }
        }

        if (id.charCodeAt(0) + 1 < 105 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children.length) {
            let samePiece = false;

            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children[0].id === lastMovedPiece) {
                samePiece = true;
            }

            if (samePiece && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once")) {
                document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1)).appendChild(document.querySelector("#" + id).children[0]);    
                check();

                if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                    moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1));
                }

                document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1)).children[0]);
            }
        }
    }
    //vertical pawn movement for first move
    if (!activePiece.classList.contains("moved") && !activePiece.classList.contains("moved-once")) {
        
        switch (true) {
            //movement for light-pc
            case players[0] === "light-pc":
                for (let i = 1; i < 3 && document.querySelector("#" + id[0] + (+id[1] + i)).children.length === 0; i++) {
                    document.querySelector("#" + id[0] + (+id[1] + i)).appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push(id[0] + (+id[1] + i));
                    }
    
                    document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] + i)).children[0]);
                }
                break;
            //movement for dark-pc
            case players[0] === "dark-pc":
                for (let i = 1; i < 3 && document.querySelector("#" + id[0] + (+id[1] - i)).children.length === 0; i++) {
                    document.querySelector("#" + id[0] + (+id[1] - i)).appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push(id[0] + (+id[1] - i));
                    }
    
                    document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] - i)).children[0]);
                }
        }
    }
    else {//vertical pawn movement after moving once
        
        switch (true) {
            //movement for light-pc
            case players[0] === "light-pc":
                if (document.querySelector("#" + id[0] + (+id[1] + 1)).children.length === 0) {
                    document.querySelector("#" + id[0] + (+id[1] + 1)).appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push(id[0] + (+id[1] + 1));
                    }
    
                    document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] + 1)).children[0]);
                }
                break;
            //movement for dark-pc
            case players[0] === "dark-pc":
                if (document.querySelector("#" + id[0] + (+id[1] - 1)).children.length === 0) {
                    document.querySelector("#" + id[0] + (+id[1] - 1)).appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push(id[0] + (+id[1] - 1));
                    }
    
                    document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] - 1)).children[0]);
                }
        }
    }
    //diagonal captures
    if (players[0] === "light-pc") {
        //right diagonal
        if (id.charCodeAt(0) + 1 < 105 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1)).children.length && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1)).children[0]);
        }
        //left diagonal
        if (id.charCodeAt(0) - 1 > 96  && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1)).children.length && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1)).children[0]);
        }
    }
    else if (players[0] === "dark-pc") {
        //left diagonal
        if (id.charCodeAt(0) + 1 < 105 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1)).children.length && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1)).children[0]);
        }
        //right diagonal
        if (id.charCodeAt(0) - 1 > 96  && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1)).children.length && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1)).children[0]);
        }
    }

    check();

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
        document.querySelector("#" + moves[i]).style.zIndex = "0";
    }
}
function enPassant(id) {
    //en passant capture
    if (turn !== 1 && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once") && document.querySelector("#" + lastMovedPiece).parentElement.id[0] === String.fromCharCode(id.charCodeAt(0))) {
        
        if (players[0] === "light-pc" && id[1] === "6") {
            document.querySelector("#" + lastMovedPiece).style.height = "2rem";
            document.querySelector("#" + lastMovedPiece).style.paddingLeft = "10px";
            remainingPieces.splice(remainingPieces.indexOf(lastMovedPiece), 1);
            document.querySelector("#cap-dark-pcs").appendChild(document.querySelector("#" + lastMovedPiece));
        }
        else if (players[0] === "dark-pc" && id[1] === "3") {
            document.querySelector("#" + lastMovedPiece).style.height = "2rem";
            document.querySelector("#" + lastMovedPiece).style.paddingLeft = "10px";
            remainingPieces.splice(remainingPieces.indexOf(lastMovedPiece), 1);
            document.querySelector("#cap-light-pcs").appendChild(document.querySelector("#" + lastMovedPiece));
        }
    }
}
function pawnPromotion(id) {
    let newPiece = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //checks for piece selection & creates a new piece based on the selection
    switch (true) {
        case document.querySelector("#" + id).classList.contains("queen"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            newPiece.setAttribute("viewBox", "0 0 512 512");
            newPiece.innerHTML = "<path d='M256 112c30.88 0 56-25.12 56-56S286.9 0 256 0S199.1 25.12 199.1 56S225.1 112 256 112zM399.1 448H111.1c-26.51 0-48 21.49-48 47.1C63.98 504.8 71.15 512 79.98 512h352c8.837 0 16-7.163 16-16C447.1 469.5 426.5 448 399.1 448zM511.1 197.4c0-5.178-2.509-10.2-7.096-13.26L476.4 168.2c-2.684-1.789-5.602-2.62-8.497-2.62c-17.22 0-17.39 26.37-51.92 26.37c-29.35 0-47.97-25.38-47.97-50.63C367.1 134 361.1 128 354.6 128h-38.75c-6 0-11.63 4-12.88 9.875C298.2 160.1 278.7 176 255.1 176c-22.75 0-42.25-15.88-47-38.12C207.7 132 202.2 128 196.1 128h-38.75C149.1 128 143.1 134 143.1 141.4c0 18.45-13.73 50.62-47.95 50.62c-34.58 0-34.87-26.39-51.87-26.39c-2.909 0-5.805 .8334-8.432 2.645l-28.63 16C2.509 187.2 0 192.3 0 197.4C0 199.9 .5585 202.3 1.72 204.6L104.2 416h303.5l102.5-211.4C511.4 202.3 511.1 199.8 511.1 197.4z'></path>";

            if (players[0] === "light-pc") {
                newPiece.classList = "light-pc queen promo";
                newPiece.id = "light-queen-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "dark-pc queen promo";
                newPiece.id = "dark-queen-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            lastMovedPiece = newPiece.id;
            break;
        case document.querySelector("#" + id).classList.contains("knight"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            newPiece.setAttribute("viewBox", "0 0 384 512");
            newPiece.innerHTML = "<path d='M19 272.5l40.62 18C63.78 292.3 68.25 293.3 72.72 293.3c4 0 8.001-.7543 11.78-2.289l12.75-5.125c9.125-3.625 16-11.12 18.75-20.5L125.2 234.8C127 227.9 131.5 222.2 137.9 219.1L160 208v50.38C160 276.5 149.6 293.1 133.4 301.2L76.25 329.9C49.12 343.5 32 371.1 32 401.5V416h319.9l-.0417-192c0-105.1-85.83-192-191.8-192H12C5.375 32 0 37.38 0 44c0 2.625 .625 5.25 1.75 7.625L16 80L7 89C2.5 93.5 0 99.62 0 106V243.2C0 255.9 7.5 267.4 19 272.5zM52 128C63 128 72 137 72 148S63 168 52 168S32 159 32 148S41 128 52 128zM336 448H47.1C21.49 448 0 469.5 0 495.1C0 504.8 7.163 512 16 512h352c8.837 0 16-7.163 16-16C384 469.5 362.5 448 336 448z'></path>";

            if (players[0] === "light-pc") {
                newPiece.classList = "light-pc knight promo";
                newPiece.id = "light-knight-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "dark-pc knight promo";
                newPiece.id = "dark-knight-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            lastMovedPiece = newPiece.id;
            break;
        case document.querySelector("#" + id).classList.contains("rook"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            newPiece.setAttribute("viewBox", "0 0 384 512");
            newPiece.innerHTML = "<path d='M368 32h-56c-8.875 0-16 7.125-16 16V96h-48V48c0-8.875-7.125-16-16-16h-80c-8.875 0-16 7.125-16 16V96H88.12V48c0-8.875-7.25-16-16-16H16C7.125 32 0 39.12 0 48V224l64 32c0 48.38-1.5 95-13.25 160h282.5C321.5 351 320 303.8 320 256l64-32V48C384 39.12 376.9 32 368 32zM224 320H160V256c0-17.62 14.38-32 32-32s32 14.38 32 32V320zM336 448H47.1C21.49 448 0 469.5 0 495.1C0 504.8 7.163 512 16 512h352c8.837 0 16-7.163 16-16C384 469.5 362.5 448 336 448z'></path>";

            if (players[0] === "light-pc") {
                newPiece.classList = "light-pc rook promo";
                newPiece.id = "light-rook-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "dark-pc rook promo";
                newPiece.id = "dark-rook-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            lastMovedPiece = newPiece.id;
            break;
        case document.querySelector("#" + id).classList.contains("bishop"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            newPiece.setAttribute("viewBox", "0 0 320 512");
            newPiece.innerHTML = "<path d='M272 448h-224C21.49 448 0 469.5 0 496C0 504.8 7.164 512 16 512h288c8.836 0 16-7.164 16-16C320 469.5 298.5 448 272 448zM8 287.9c0 51.63 22.12 73.88 56 84.63V416h192v-43.5c33.88-10.75 56-33 56-84.63c0-30.62-10.75-67.13-26.75-102.5L185 285.6c-1.565 1.565-3.608 2.349-5.651 2.349c-2.036 0-4.071-.7787-5.63-2.339l-11.35-11.27c-1.56-1.56-2.339-3.616-2.339-5.672c0-2.063 .7839-4.128 2.349-5.693l107.9-107.9C249.5 117.3 223.8 83 199.4 62.5C213.4 59.13 224 47 224 32c0-17.62-14.38-32-32-32H128C110.4 0 96 14.38 96 32c0 15 10.62 27.12 24.62 30.5C67.75 106.8 8 214.5 8 287.9z'></path>";

            if (players[0] === "light-pc") {
                newPiece.classList = "light-pc bishop promo";
                newPiece.id = "light-bishop-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "dark-pc bishop promo";
                newPiece.id = "dark-bishop-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            lastMovedPiece = newPiece.id;
    }

    check();
    //clears moved piece's possible moves, change player's turn, check for checkmate/stalemate, record total overall turns
    clearsBoard();
    players.reverse();
    mate();
    startTimer(players[0] === "light-pc" ? lightTimeRem : darkTimeRem);

    if (matchStarted === true) {
        turn += .5;
        document.querySelector("#turnCount").innerHTML = Math.floor(turn);
    }
}
function bishopMoves(id) {
    let moves = [];
    //right diagonal movement
        //up movement
    for (let i = 1; i < Math.min(9 - (id.charCodeAt(0) - 96), 9 - id[1]); i++) {
    
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
        //down movement
    for (let i = 1; i < Math.min(id.charCodeAt(0) - 96, id[1]); i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
    //left diagonal movement
        //up movement
    for (let i = 1; i < Math.min(id.charCodeAt(0) - 96, 9 - id[1]); i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
        //down movement
    for (let i = 1; i < Math.min(9 - (id.charCodeAt(0) - 96), id[1]); i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children[0]);
            break;
        }
        else {
            break;
        }
    }

    check();

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
        document.querySelector("#" + moves[i]).style.zIndex = "0";
    }
}
function knightMoves(id) {
    let moves = [];
    //(-1, -2)
    if ((id.charCodeAt(0) - 1) >= 97 && (id.charCodeAt(0) - 1) <= 104 && (id[1] - 2) >= 1 && (id[1] - 2) <= 8) {
        let move = String.fromCharCode(id.charCodeAt(0) - 1) + (id[1] - 2);
        
        if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
            document.querySelector("#" + move).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(move);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + move).children[0]);
        }
    }
    //(1, -2)    
    if ((id.charCodeAt(0) + 1) >= 97 && (id.charCodeAt(0) + 1) <= 104 && (id[1] - 2) >= 1 && (id[1] - 2) <= 8) {
        let move = String.fromCharCode(id.charCodeAt(0) + 1) + (id[1] - 2);
        
        if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
            document.querySelector("#" + move).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(move);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + move).children[0]);
        }
    }
    //(2, -1)
    if ((id.charCodeAt(0) + 2) >= 97 && (id.charCodeAt(0) + 2) <= 104 && (id[1] - 1) >= 1 && (id[1] - 1) <= 8) {
        let move = String.fromCharCode(id.charCodeAt(0) + 2) + (id[1] - 1);
        
        if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
            document.querySelector("#" + move).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(move);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + move).children[0]);
        }
    }
    //(2, 1)
    if ((id.charCodeAt(0) + 2) >= 97 && (id.charCodeAt(0) + 2) <= 104 && (+id[1] + 1) >= 1 && (+id[1] + 1) <= 8) {
        let move = String.fromCharCode(id.charCodeAt(0) + 2) + (+id[1] + 1);
        
        if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
            document.querySelector("#" + move).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(move);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + move).children[0]);
        }
    }
    //(1, 2)
    if ((id.charCodeAt(0) + 1) >= 97 && (id.charCodeAt(0) + 1) <= 104 && (+id[1] + 2) >= 1 && (+id[1] + 2) <= 8) {
        let move = String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 2);
        
        if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
            document.querySelector("#" + move).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(move);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + move).children[0]);
        }
    }
    //(-1, 2)
    if ((id.charCodeAt(0) - 1) >= 97 && (id.charCodeAt(0) - 1) <= 104 && (+id[1] + 2) >= 1 && (+id[1] + 2) <= 8) {
        let move = String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 2);
        
        if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
            document.querySelector("#" + move).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(move);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + move).children[0]);
        }
    }
    //(-2, 1)
    if ((id.charCodeAt(0) - 2) >= 97 && (id.charCodeAt(0) - 2) <= 104 && (+id[1] + 1) >= 1 && (+id[1] + 1) <= 8) {
        let move = String.fromCharCode(id.charCodeAt(0) - 2) + (+id[1] + 1);
        
        if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
            document.querySelector("#" + move).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(move);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + move).children[0]);
        }
    }
    //(-2, -1)    
    if ((id.charCodeAt(0) - 2) >= 97 && (id.charCodeAt(0) - 2) <= 104 && (id[1] - 1) >= 1 && (id[1] - 1) <= 8) {
        let move = String.fromCharCode(id.charCodeAt(0) - 2) + (id[1] - 1);
        
        if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
            document.querySelector("#" + move).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(move);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + move).children[0]);
        }
    }

    check();

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
        document.querySelector("#" + moves[i]).style.zIndex = "0";
    }
}
function rookMoves(id) {
    let moves = [];
    //vertical movement
        //upward movement
    for (let i = 1; i < 9 - id[1]; i++) {
        
        if (document.querySelector("#" + id[0] + (+id[1] + i)).children.length === 0) {
            document.querySelector("#" + id[0] + (+id[1] + i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(id[0] + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] + i)).children[0]);
        }
        else if (document.querySelector("#" + id[0] + (+id[1] + i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + id[0] + (+id[1] + i)).prepend(document.querySelector("#" + id).children[0]);  
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(id[0] + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] + i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
    //downward movement
    for (let i = 1; i < id[1]; i++) {

        if (document.querySelector("#" + id[0] + (+id[1] - i)).children.length === 0) {
            document.querySelector("#" + id[0] + (+id[1] - i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(id[0] + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] - i)).children[0]);
        }
        else if (document.querySelector("#" + id[0] + (+id[1] - i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + id[0] + (+id[1] - i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(id[0] + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] - i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
    //horizontal movement
        //rightward movement
    for (let i = 1; i < 9 - (id.charCodeAt(0) - 96); i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + id[1]);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + id[1]);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children[0]);
            break;
        }
        else {
            break;
        }
    }
        //leftward movement
    for (let i = 1; i < id.charCodeAt(0) - 96; i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + id[1]);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + id[1]);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children[0]);
            break;
        }
        else {
            break;
        }
    }

    check();

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
        document.querySelector("#" + moves[i]).style.zIndex = "0";
    }
}
function queenMoves(id) {
    let moves = [];
    //right diagonal movement
        //up movement
    for (let i = 1; i < Math.min(9 - (id.charCodeAt(0) - 96), 9 - id[1]); i++) {
    
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
        //down movement
    for (let i = 1; i < Math.min(id.charCodeAt(0) - 96, id[1]); i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
    //left diagonal movement
        //up movement
    for (let i = 1; i < Math.min(id.charCodeAt(0) - 96, 9 - id[1]); i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
        //down movement
    for (let i = 1; i < Math.min(9 - (id.charCodeAt(0) - 96), id[1]); i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
    //vertical movement
        //upward movement
    for (let i = 1; i < 9 - id[1]; i++) {
    
        if (document.querySelector("#" + id[0] + (+id[1] + i)).children.length === 0) {
            document.querySelector("#" + id[0] + (+id[1] + i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(id[0] + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] + i)).children[0]);
        }
        else if (document.querySelector("#" + id[0] + (+id[1] + i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + id[0] + (+id[1] + i)).prepend(document.querySelector("#" + id).children[0]);  
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(id[0] + (+id[1] + i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] + i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
        //downward movement
    for (let i = 1; i < id[1]; i++) {

        if (document.querySelector("#" + id[0] + (+id[1] - i)).children.length === 0) {
            document.querySelector("#" + id[0] + (+id[1] - i)).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(id[0] + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] - i)).children[0]);
        }
        else if (document.querySelector("#" + id[0] + (+id[1] - i)).children[0].classList.contains(players[1])) {
            document.querySelector("#" + id[0] + (+id[1] - i)).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(id[0] + (+id[1] - i));
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + id[0] + (+id[1] - i)).children[0]);
            break;
        }
        else {
            break;
        }
    }
    //horizontal movement
        //rightward movement
    for (let i = 1; i < 9 - (id.charCodeAt(0) - 96); i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + id[1]);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + id[1]);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children[0]);
            break;
        }
        else {
            break;
        }
    }
        //leftward movement
    for (let i = 1; i < id.charCodeAt(0) - 96; i++) {
        
        if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children.length === 0) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).appendChild(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + id[1]);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children[0]);
        }
        else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children[0].classList.contains(players[1])) {
            document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).prepend(document.querySelector("#" + id).children[0]);    
            check();

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + id[1]);
            }

            document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children[0]);
            break;
        }
        else {
            break;
        }
    }

    check();

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
        document.querySelector("#" + moves[i]).style.zIndex = "0";
    }
}
function kingMoves(id) {
    let moves = [];

    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
        //checks for the possibility of castling
        switch (true) {
            //castling for light
            case players[0] === "light-pc" && !document.querySelector("#" + id).children[0].classList.contains("moved"):
                //castling queenside
                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 3) + id[1]).children.length === 0 &&
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 2) + id[1]).children.length === 0 &&
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children.length === 0 &&
                    document.querySelector("#a1").children.length &&
                    document.querySelector("#a1").children[0].classList.contains("light-pc") &&
                    !document.querySelector("#a1").children[0].classList.contains("moved"))
                {
                    document.querySelector("#c1").appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push("c1");
                    }
                    else {
                        document.querySelector("." + players[0] + ".king").parentElement.style.outline = "none";
                    }
                    
                    document.querySelector("#" + id).appendChild(document.querySelector("#c1").children[0]);
                }
                //castling kingside
                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children.length === 0 &&
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 2) + id[1]).children.length === 0 &&
                    document.querySelector("#h1").children.length &&
                    document.querySelector("#h1").children[0].classList.contains("light-pc") &&
                    !document.querySelector("#h1").children[0].classList.contains("moved"))
                {
                    document.querySelector("#g1").appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push("g1");
                    }
                    else {
                        document.querySelector("." + players[0] + ".king").parentElement.style.outline = "none";
                    }
                    
                    document.querySelector("#" + id).appendChild(document.querySelector("#g1").children[0]);
                }
                break;
            //castling for dark
            case players[0] === "dark-pc" && !document.querySelector("#" + id).children[0].classList.contains("moved"):
                //castling queenside
                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 3) + id[1]).children.length === 0 &&
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 2) + id[1]).children.length === 0 &&
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children.length === 0 &&
                    document.querySelector("#a8").children.length &&
                    document.querySelector("#a8").children[0].classList.contains("dark-pc") &&
                    !document.querySelector("#a8").children[0].classList.contains("moved"))
                {
                    document.querySelector("#c8").appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push("c8");
                    }
                    else {
                        document.querySelector("." + players[0] + ".king").parentElement.style.outline = "none";
                    }
                    
                    document.querySelector("#" + id).appendChild(document.querySelector("#c8").children[0]);
                }
                //castling kingside
                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children.length === 0 &&
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 2) + id[1]).children.length === 0 &&
                    document.querySelector("#h8").children.length &&
                    document.querySelector("#h8").children[0].classList.contains("dark-pc") &&
                    !document.querySelector("#h8").children[0].classList.contains("moved"))
                {
                    document.querySelector("#g8").appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push("g8");
                    }
                    else {
                        document.querySelector("." + players[0] + ".king").parentElement.style.outline = "none";
                    }
                    
                    document.querySelector("#" + id).appendChild(document.querySelector("#g8").children[0]);
                }
        }
    }

    //checks for regular moves
    for (j = 1; j > -2; j--) { //evaluating each rank
        
        for (let i = -1; i < 2; i++) { //evaluating each file
            //checks ranks and files to see if they exist && spaces to make sure they don't have a piece on them
            if (id.charCodeAt(0) + i >= 97 && id.charCodeAt(0) + i <= 104 && +id[1] + j > 0 && +id[1] + j < 9) {
                
                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + j)).children.length === 0 || document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + j)).children[0].classList.contains(players[1])) {
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + j)).prepend(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        //makes sure opposing kings cannot move next to each other
                        if (Math.abs(document.querySelector("." + players[0] + ".king").parentElement.id.charCodeAt(0) - document.querySelector("." + players[1] + ".king").parentElement.id.charCodeAt(0)) > 1 || Math.abs(document.querySelector("." + players[0] + ".king").parentElement.id[1] - document.querySelector("." + players[1] + ".king").parentElement.id[1]) > 1) {
                            moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + j));
                        }
                    }
                    else {
                        document.querySelector("." + players[0] + ".king").parentElement.style.outline = "none";
                    }
                    
                    document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + j)).children[0]);
                }
            }
        }
    }

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
    }
}
function castling(id) {

    if (activePiece.id === "light-king") {

        switch (true) {
            case id === "c1" && !activePiece.classList.contains("moved"):
                document.querySelector("#d1").appendChild(document.querySelector("#light-rook-a"));
                break;
            case id === "g1" && !activePiece.classList.contains("moved"):
                document.querySelector("#f1").appendChild(document.querySelector("#light-rook-b"));
        }
    }
    else if (activePiece.id === "dark-king") {

        switch (true) {
            case id === "c8" && !activePiece.classList.contains("moved"):
                document.querySelector("#d8").appendChild(document.querySelector("#dark-rook-a"));
                break;
            case id === "g8" && !activePiece.classList.contains("moved"):
                document.querySelector("#f8").appendChild(document.querySelector("#dark-rook-b"));
        }
    }
}
function check() {

    for (let i = 0; i < players.length; i++) {
        let kingSpace = document.querySelector("." + players[i] + ".king").parentElement.id;
        let checkingPieces = [];
        //right diagonal check
            //up check
        for (let j = 1; j < Math.min(9 - (kingSpace.charCodeAt(0) - 96), 9 - kingSpace[1]); j++) {

            if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (+kingSpace[1] + j)).children.length) {
                
                if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (+kingSpace[1] + j)).children[0].classList.contains(players[i])) {
                    break;
                }
                else if (j === 1 && players[i] === "light-pc" && document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (+kingSpace[1] + j)).children[0].classList.contains("pawn")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (+kingSpace[1] + j)).children[0].id);
                }
                else if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (+kingSpace[1] + j)).children[0].classList.contains("bishop") || document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (+kingSpace[1] + j)).children[0].classList.contains("queen")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (+kingSpace[1] + j)).children[0].id);
                    break;
                }
                else {
                    break;
                }
            }
        }
            //down check
        for (let j = 1; j < Math.min(kingSpace.charCodeAt(0) - 96, kingSpace[1]); j++) {

            if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (kingSpace[1] - j)).children.length) {
                
                if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (kingSpace[1] - j)).children[0].classList.contains(players[i])) {
                    break;
                }
                else if (j === 1 && players[i] === "dark-pc" && document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (kingSpace[1] - j)).children[0].classList.contains("pawn")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (kingSpace[1] - j)).children[0].id);
                }
                else if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (kingSpace[1] - j)).children[0].classList.contains("bishop") || document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (kingSpace[1] - j)).children[0].classList.contains("queen")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (kingSpace[1] - j)).children[0].id);
                    break;
                }
                else {
                    break;
                }
            }
        }
        //left diagonal check
            //up check
        for (let j = 1; j < Math.min(kingSpace.charCodeAt(0) - 96, 9 - kingSpace[1]); j++) {
            
            if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (+kingSpace[1] + j)).children.length) {

                if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (+kingSpace[1] + j)).children[0].classList.contains(players[i])) {
                    break;
                }
                else if (j === 1 && players[i] === "light-pc" && document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (+kingSpace[1] + j)).children[0].classList.contains("pawn")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (+kingSpace[1] + j)).children[0].id);
                }
                else if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (+kingSpace[1] + j)).children[0].classList.contains("bishop") || document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (+kingSpace[1] + j)).children[0].classList.contains("queen")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + (+kingSpace[1] + j)).children[0].id);
                    break;
                }
                else {
                    break;
                }
            }
        }
            //down check
        for (let j = 1; j < Math.min(9 - (kingSpace.charCodeAt(0) - 96), kingSpace[1]); j++) {
            
            if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (kingSpace[1] - j)).children.length) {

                if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (kingSpace[1] - j)).children[0].classList.contains(players[i])) {
                    break;
                }
                else if (j === 1 && players[i] === "dark-pc" && document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (kingSpace[1] - j)).children[0].classList.contains("pawn")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (kingSpace[1] - j)).children[0].id);
                }
                else if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (kingSpace[1] - j)).children[0].classList.contains("bishop") || document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (kingSpace[1] - j)).children[0].classList.contains("queen")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + (kingSpace[1] - j)).children[0].id);
                    break;
                }
                else {
                    break;
                }
            }
        }
        //vertical check
            //up check
        for (let j = 1; j < 9 - kingSpace[1]; j++) {
            
            if (document.querySelector("#" + kingSpace[0] + (+kingSpace[1] + j)).children.length) {

                if (document.querySelector("#" + kingSpace[0] + (+kingSpace[1] + j)).children[0].classList.contains(players[i])) {
                    break;
                }
                else if (document.querySelector("#" + kingSpace[0] + (+kingSpace[1] + j)).children[0].classList.contains("rook") || document.querySelector("#" + kingSpace[0] + (+kingSpace[1] + j)).children[0].classList.contains("queen")) {
                    checkingPieces.push(document.querySelector("#" + kingSpace[0] + (+kingSpace[1] + j)).children[0].id);
                    break;
                }
                else {
                    break;
                }
            }
        }
            //down check
        for (let j = 1; j < kingSpace[1]; j++) {

            if (document.querySelector("#" + kingSpace[0] + (kingSpace[1] - j)).children.length) {

                if (document.querySelector("#" + kingSpace[0] + (kingSpace[1] - j)).children[0].classList.contains(players[i])) {
                    break;
                }
                else if (document.querySelector("#" + kingSpace[0] + (kingSpace[1] - j)).children[0].classList.contains("rook") || document.querySelector("#" + kingSpace[0] + (kingSpace[1] - j)).children[0].classList.contains("queen")) {
                    checkingPieces.push(document.querySelector("#" + kingSpace[0] + (kingSpace[1] - j)).children[0].id);
                    break;
                }
                else {
                    break;
                }
            }
        }
        //horizontal check
            //right check
        for (let j = 1; j < 9 - (kingSpace.charCodeAt(0) - 96); j++) {
        
            if(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + kingSpace[1]).children.length) {

                if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + kingSpace[1]).children[0].classList.contains(players[i])) {
                    break;
                }
                else if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + kingSpace[1]).children[0].classList.contains("rook") || document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + kingSpace[1]).children[0].classList.contains("queen")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) + j) + kingSpace[1]).children[0].id);
                    break;
                }
                else {
                    break;
                }
            }
        }
            //left check
        for (let j = 1; j < kingSpace.charCodeAt(0) - 96; j++) {
                
            if(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + kingSpace[1]).children.length) {

                if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + kingSpace[1]).children[0].classList.contains(players[i])) {
                    break;
                }
                else if (document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + kingSpace[1]).children[0].classList.contains("rook") || document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + kingSpace[1]).children[0].classList.contains("queen")) {
                    checkingPieces.push(document.querySelector("#" + String.fromCharCode(kingSpace.charCodeAt(0) - j) + kingSpace[1]).children[0].id);
                    break;
                }
                else {
                    break;
                }
            }
        }
        //(-1, -2)
        if ((kingSpace.charCodeAt(0) - 1) >= 97 && (kingSpace.charCodeAt(0) - 1) <= 104 && (kingSpace[1] - 2) >= 1 && (kingSpace[1] - 2) <= 8) {
            let knightCheck = String.fromCharCode(kingSpace.charCodeAt(0) - 1) + (kingSpace[1] - 2);
            if (document.querySelector("#" + knightCheck).children.length && document.querySelector("#" + knightCheck).children[0].classList.contains("knight") && !document.querySelector("#" + knightCheck).children[0].classList.contains(players[i])) {
                checkingPieces.push(document.querySelector("#" + knightCheck).children[0].id);
            }
        }
        //(1, -2)    
        if ((kingSpace.charCodeAt(0) + 1) >= 97 && (kingSpace.charCodeAt(0) + 1) <= 104 && (kingSpace[1] - 2) >= 1 && (kingSpace[1] - 2) <= 8) {
            let knightCheck = String.fromCharCode(kingSpace.charCodeAt(0) + 1) + (kingSpace[1] - 2);
            if (document.querySelector("#" + knightCheck).children.length && document.querySelector("#" + knightCheck).children[0].classList.contains("knight") && !document.querySelector("#" + knightCheck).children[0].classList.contains(players[i])) {
                checkingPieces.push(document.querySelector("#" + knightCheck).children[0].id);
            }
        }
        //(2, -1)
        if ((kingSpace.charCodeAt(0) + 2) >= 97 && (kingSpace.charCodeAt(0) + 2) <= 104 && (kingSpace[1] - 1) >= 1 && (kingSpace[1] - 1) <= 8) {
            let knightCheck = String.fromCharCode(kingSpace.charCodeAt(0) + 2) + (kingSpace[1] - 1);
            if (document.querySelector("#" + knightCheck).children.length && document.querySelector("#" + knightCheck).children[0].classList.contains("knight") && !document.querySelector("#" + knightCheck).children[0].classList.contains(players[i])) {
                checkingPieces.push(document.querySelector("#" + knightCheck).children[0].id);
            }
        }
        //(2, 1)
        if ((kingSpace.charCodeAt(0) + 2) >= 97 && (kingSpace.charCodeAt(0) + 2) <= 104 && (+kingSpace[1] + 1) >= 1 && (+kingSpace[1] + 1) <= 8) {
            let knightCheck = String.fromCharCode(kingSpace.charCodeAt(0) + 2) + (+kingSpace[1] + 1);
            if (document.querySelector("#" + knightCheck).children.length && document.querySelector("#" + knightCheck).children[0].classList.contains("knight") && !document.querySelector("#" + knightCheck).children[0].classList.contains(players[i])) {
                checkingPieces.push(document.querySelector("#" + knightCheck).children[0].id);
            }
        }
        //(1, 2)
        if ((kingSpace.charCodeAt(0) + 1) >= 97 && (kingSpace.charCodeAt(0) + 1) <= 104 && (+kingSpace[1] + 2) >= 1 && (+kingSpace[1] + 2) <= 8) {
            let knightCheck = String.fromCharCode(kingSpace.charCodeAt(0) + 1) + (+kingSpace[1] + 2);
            if (document.querySelector("#" + knightCheck).children.length && document.querySelector("#" + knightCheck).children[0].classList.contains("knight") && !document.querySelector("#" + knightCheck).children[0].classList.contains(players[i])) {
                checkingPieces.push(document.querySelector("#" + knightCheck).children[0].id);
            }
        }
        //(-1, 2)
        if ((kingSpace.charCodeAt(0) - 1) >= 97 && (kingSpace.charCodeAt(0) - 1) <= 104 && (+kingSpace[1] + 2) >= 1 && (+kingSpace[1] + 2) <= 8) {
            let knightCheck = String.fromCharCode(kingSpace.charCodeAt(0) - 1) + (+kingSpace[1] + 2);
            if (document.querySelector("#" + knightCheck).children.length && document.querySelector("#" + knightCheck).children[0].classList.contains("knight") && !document.querySelector("#" + knightCheck).children[0].classList.contains(players[i])) {
                checkingPieces.push(document.querySelector("#" + knightCheck).children[0].id);
            }
        }
        //(-2, 1)
        if ((kingSpace.charCodeAt(0) - 2) >= 97 && (kingSpace.charCodeAt(0) - 2) <= 104 && (+kingSpace[1] + 1) >= 1 && (+kingSpace[1] + 1) <= 8) {
            let knightCheck = String.fromCharCode(kingSpace.charCodeAt(0) - 2) + (+kingSpace[1] + 1);
            if (document.querySelector("#" + knightCheck).children.length && document.querySelector("#" + knightCheck).children[0].classList.contains("knight") && !document.querySelector("#" + knightCheck).children[0].classList.contains(players[i])) {
                checkingPieces.push(document.querySelector("#" + knightCheck).children[0].id);
            }
        }
        //(-2, -1)    
        if ((kingSpace.charCodeAt(0) - 2) >= 97 && (kingSpace.charCodeAt(0) - 2) <= 104 && (kingSpace[1] - 1) >= 1 && (kingSpace[1] - 1) <= 8) {
            let knightCheck = String.fromCharCode(kingSpace.charCodeAt(0) - 2) + (kingSpace[1] - 1);
            if (document.querySelector("#" + knightCheck).children.length && document.querySelector("#" + knightCheck).children[0].classList.contains("knight") && !document.querySelector("#" + knightCheck).children[0].classList.contains(players[i])) {
                checkingPieces.push(document.querySelector("#" + knightCheck).children[0].id);
            }
        }
        
        if (checkingPieces.length !== 0) {
            document.querySelector("#" + kingSpace).style.outline = "red 5px solid";
            document.querySelector("#" + kingSpace).style.zIndex = "1";
        }
        else {
            document.querySelector("#" + kingSpace).style.outline = "none";
            document.querySelector("#" + kingSpace).style.zIndex = "0";
            checkingPieces = [];
        }
    }
}
function mate() {
    if (players[0] === "light-pc") {
        let lightPieces = remainingPieces.filter(pc => pc.includes("light"));
        //test all possible moves of remaining pieces
        for (let i = 0; i < lightPieces.length; i++) {
            switch (true) {
                case lightPieces[i].includes("pawn"):
                    pawnMoves(document.querySelector("#" + lightPieces[i]).parentElement.id);
                    break;
                case lightPieces[i].includes("bishop"):
                    bishopMoves(document.querySelector("#" + lightPieces[i]).parentElement.id);
                    break;
                case lightPieces[i].includes("knight"):
                    knightMoves(document.querySelector("#" + lightPieces[i]).parentElement.id);
                    break;
                case lightPieces[i].includes("rook"):
                    rookMoves(document.querySelector("#" + lightPieces[i]).parentElement.id);
                    break;
                case lightPieces[i].includes("queen"):
                    queenMoves(document.querySelector("#" + lightPieces[i]).parentElement.id);
                    break;
                case lightPieces[i].includes("king"):
                    kingMoves(document.querySelector("#" + lightPieces[i]).parentElement.id);
            }
        }

        let allSquares = document.querySelectorAll(".light-sq, .dark-sq");
        let noMoves = true;

        for (let i = 0; i < allSquares.length; i++ ) {
            //if there is a possible move(s), clear the possible move outline(s)
            if (allSquares[i].style.outline === "rgb(71, 58, 51) solid 5px") {
                for (let j = i; j < allSquares.length; j++ ) {

                    if (allSquares[j].style.outline !== "red solid 5px") {
                        allSquares[j].style.outline = "none";
                    }
                }
                noMoves = false;
                break;
            }
        }
        //if no possible moves left, declare winner
        if (noMoves === true) {
            document.querySelector("#win-screen").style.visibility = "visible";
            document.querySelector("#win-screen").style.opacity = "100%";
            matchStarted = false;

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline === "red solid 5px") {
                document.querySelector("#win-screen").innerHTML = "~ DARK WINS ~";
            }
            else {
                document.querySelector("#win-screen").innerHTML = "STALEMATE!";
            }
        }
    }
    else {
        let darkPieces = remainingPieces.filter(pc => pc.includes("dark"));

        for (let i = 0; i < darkPieces.length; i++) {
            switch (true) {
                case darkPieces[i].includes("pawn"):
                    pawnMoves(document.querySelector("#" + darkPieces[i]).parentElement.id);
                    break;
                case darkPieces[i].includes("bishop"):
                    bishopMoves(document.querySelector("#" + darkPieces[i]).parentElement.id);
                    break;
                case darkPieces[i].includes("knight"):
                    knightMoves(document.querySelector("#" + darkPieces[i]).parentElement.id);
                    break;
                case darkPieces[i].includes("rook"):
                    rookMoves(document.querySelector("#" + darkPieces[i]).parentElement.id);
                    break;
                case darkPieces[i].includes("queen"):
                    queenMoves(document.querySelector("#" + darkPieces[i]).parentElement.id);
                    break;
                case darkPieces[i].includes("king"):
                    kingMoves(document.querySelector("#" + darkPieces[i]).parentElement.id);
            }
        }

        let allSquares = document.querySelectorAll(".light-sq, .dark-sq");
        let noMoves = true;

        for (let i = 0; i < allSquares.length; i++ ) {
    
            if (allSquares[i].style.outline === "rgb(71, 58, 51) solid 5px") {
                for (let j = i; j < allSquares.length; j++ ) {

                    if (allSquares[j].style.outline !== "red solid 5px") {
                        allSquares[j].style.outline = "none";
                    }
                }
                noMoves = false;
                break;
            }
        }

        if (noMoves === true) {
            document.querySelector("#win-screen").style.visibility = "visible";
            document.querySelector("#win-screen").style.opacity = "100%";
            document.querySelector("#win-screen").style.color = "white";
            matchStarted = false;

            if (document.querySelector("." + players[0] + ".king").parentElement.style.outline === "red solid 5px") {
                document.querySelector("#win-screen").innerHTML = "~ LIGHT WINS ~";
            }
            else {
                document.querySelector("#win-screen").innerHTML = "STALEMATE!";
            }
        }
    }
}