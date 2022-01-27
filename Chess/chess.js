let matchStarted = false;
let turn = 1;
let players = ["light-pc", "dark-pc"];
let activePiece;
let lastMovedPiece;
let promoPieceCount = 0;
let remainingPieces = ["dark-king", "dark-knight-a", "dark-bishop-a", "dark-queen", "dark-king", "dark-bishop-b", "dark-knight-b", "dark-rook-b", "dark-pawn-a", "dark-pawn-b", "dark-pawn-c", "dark-pawn-d", "dark-pawn-e", "dark-pawn-f", "dark-pawn-g", "dark-pawn-h", "light-king", "light-knight-a", "light-bishop-a", "light-queen", "light-king", "light-bishop-b", "light-knight-b", "light-rook-b", "light-pawn-a", "light-pawn-b", "light-pawn-c", "light-pawn-d", "light-pawn-e", "light-pawn-f", "light-pawn-g", "light-pawn-h"]
//complete
function possibleMoves(id) {
    let boardSpace = document.querySelector("#" + id);
    movePiece(id);
    clearsBoard();
    //checks for a piece and player's turn and assigns piece as active piece
    if (boardSpace.children.length && boardSpace.children[0].classList.contains(players[0])) {
        //creates an array of boolean values indicating the visibility of each promo column
        let pawnPromo = [...document.querySelectorAll(".light-promo,.dark-promo")];
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
//complete
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
            boardSpace.children[0].style.fontSize = "2rem";
            boardSpace.children[0].style.paddingLeft = "10px";
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

        if (turn === 1) {
            matchStarted = true;
        }

        let promoVis = [];

        for (let i = 0; i < document.querySelectorAll(".light-promo,.dark-promo").length; i++) {
            promoVis.push(document.querySelectorAll(".light-promo,.dark-promo")[i].style.visibility);
        }

        if (!promoVis.includes("visible")) {
            //stores the last moved piece
            lastMovedPiece = activePiece.id;
            check();
            //clears moved piece's possible moves, change player's turn, check for checkmate/stalemate, record total overall turns
            clearsBoard();
            players.reverse();
            mate();

            if (matchStarted === true) {
                turn += .5;
                document.querySelector("#turnCount").innerHTML = Math.floor(turn);
                timer();
            }
        }
    }
}
//complete
function clearsBoard() {
    let allSquares = document.querySelectorAll(".light-sq, .dark-sq");

    for (let i = 0; i < allSquares.length; i++ ) {

        if (allSquares[i].style.outline === "rgb(71, 58, 51) solid 5px" || (allSquares[i].style.outline === "red solid 5px" && !(allSquares[i].children.length && allSquares[i].children[0].classList.contains("king")))) {
            allSquares[i].style.outline = "none";
        }
    }
}
//complete
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
                document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).appendChild(document.querySelector("#" + id).children[0]);    
                check();

                if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                    moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1));
                }

                document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children[0]);
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
                document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).appendChild(document.querySelector("#" + id).children[0]);    
                check();

                if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                    moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1));
                }

                document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children[0]);
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
    }
}
//complete
function enPassant(id) {
    //en passant capture
    if (turn !== 1 && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once") && document.querySelector("#" + lastMovedPiece).parentElement.id[0] === String.fromCharCode(id.charCodeAt(0))) {
        
        if (players[0] === "light-pc" && id[1] === "6") {
            document.querySelector("#" + lastMovedPiece).style.fontSize = "2rem";
            document.querySelector("#" + lastMovedPiece).style.paddingLeft = "10px";
            remainingPieces.splice(remainingPieces.indexOf(lastMovedPiece), 1);
            document.querySelector("#cap-dark-pcs").appendChild(document.querySelector("#" + lastMovedPiece));
        }
        else if (players[0] === "dark-pc" && id[1] === "3") {
            document.querySelector("#" + lastMovedPiece).style.fontSize = "2rem";
            document.querySelector("#" + lastMovedPiece).style.paddingLeft = "10px";
            remainingPieces.splice(remainingPieces.indexOf(lastMovedPiece), 1);
            document.querySelector("#cap-light-pcs").appendChild(document.querySelector("#" + lastMovedPiece));
        }
    }
}
//complete
function pawnPromotion(id) {
    let newPiece = document.createElement("i");
    //checks for piece selection & creates a new piece based on the selection
    switch (true) {
        case document.querySelector("#" + id).classList.contains("queen"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            if (players[0] === "light-pc") {
                newPiece.classList = "fas fa-chess-queen light-pc queen promo";
                newPiece.id = "light-queen-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "fas fa-chess-queen dark-pc queen promo";
                newPiece.id = "dark-queen-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            lastMovedPiece = newPiece.id;
            break;
        case document.querySelector("#" + id).classList.contains("knight"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            if (players[0] === "light-pc") {
                newPiece.classList = "fas fa-chess-knight light-pc knight promo";
                newPiece.id = "light-knight-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "fas fa-chess-knight dark-pc knight promo";
                newPiece.id = "dark-knight-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            lastMovedPiece = newPiece.id;
            break;
        case document.querySelector("#" + id).classList.contains("rook"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            if (players[0] === "light-pc") {
                newPiece.classList = "fas fa-chess-rook light-pc rook promo";
                newPiece.id = "light-rook-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "fas fa-chess-rook dark-pc rook promo";
                newPiece.id = "dark-rook-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            lastMovedPiece = newPiece.id;
            break;
        case document.querySelector("#" + id).classList.contains("bishop"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            if (players[0] === "light-pc") {
                newPiece.classList = "fas fa-chess-bishop light-pc bishop promo";
                newPiece.id = "light-bishop-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "fas fa-chess-bishop dark-pc bishop promo";
                newPiece.id = "dark-bishop-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            lastMovedPiece = newPiece.id;
    }
    //stores the last moved piece
    lastMovedPiece = activePiece.id;
    check();
    //clears moved piece's possible moves, change player's turn, check for checkmate/stalemate, record total overall turns
    clearsBoard();
    players.reverse();
    mate();

    if (matchStarted === true) {
        turn += .5;
        document.querySelector("#turnCount").innerHTML = Math.floor(turn);
    }
}
//complete
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
    }
}
//complete
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
    }
}
//complete
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
    }
}
//complete
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
    }
}
//complete
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
//complete
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
//complete
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
        }
        else {
            document.querySelector("#" + kingSpace).style.outline = "none";
            checkingPieces = [];
        }
    }
}
//complete
function mate() {
    if (players[0] === "light-pc") {
        let lightPieces = remainingPieces.filter(pc => pc.includes("light"));

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
//incomplete
function timer() {
    let timeRemaining = 10 * 60
    let start = Date.now();

    setInterval(function() {
        let delta = Date.now() - start; // milliseconds elapsed since start

        document.querySelector("#dark-timer").innerHTML = timeRemaining - (Math.floor(delta / 1000)); // in minutes
        // alternatively just show wall clock time:
        // output(new Date().toUTCString());
    }, 1000); // update about every second
}