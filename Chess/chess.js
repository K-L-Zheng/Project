let turn = 1;
let players = ["light-pc", "dark-pc"];
let activePiece;
let lastMovedPiece;
let promoPieceCount = 0;
let allPiecesNoKings = ["dark-knight-a", "dark-bishop-a", "dark-queen", "dark-king", "dark-bishop-b", "dark-knight-b", "dark-rook-b", "dark-pawn-a", "dark-pawn-b", "dark-pawn-c", "dark-pawn-d", "dark-pawn-e", "dark-pawn-f", "dark-pawn-g", "dark-pawn-h", "light-knight-a", "light-bishop-a", "light-queen", "light-king", "light-bishop-b", "light-knight-b", "light-rook-b", "light-pawn-a", "light-pawn-b", "light-pawn-c", "light-pawn-d", "light-pawn-e", "light-pawn-f", "light-pawn-g", "light-pawn-h"]
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
    let style = boardSpace.style.outline;
    //style.outline order needs to be this way, 
    //if solid and 5px are switched then the if statement will return false
    //hexcode color is converted into RGB format
    if (style === "rgb(71, 58, 51) solid 5px") {
        //moves piece
        boardSpace.appendChild(activePiece);
        //checks for castling
        castling(id);
        //captures
        if (boardSpace.children.length === 2) {
            boardSpace.children[0].style.fontSize = "2rem";
            boardSpace.children[0].style.paddingLeft = "10px";

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
                activePiece.remove();
            }
        }
        else {
            activePiece.classList.add("moved");
        }
        //stores the last moved piece
        lastMovedPiece = activePiece.id;
        check();
        //change player's turn & record total overall turns
        players.reverse();
        turn += .5;
        document.querySelector("#turnCount").innerHTML = Math.floor(turn);
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
//opposing pawns switch when right next to each other - difficulty replicating
function pawnMoves(id) {
    let moves = [];

    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline === "red solid 5px") {
        //en passant possibility for light-pcs
        if (players[0] === "light-pc" && id[1] ==="5") {

            if (id.charCodeAt(0) - 1 > 96 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children.length) {
                let samePiece = false;

                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children[0].id === lastMovedPiece) {
                    samePiece = true;
                }

                if (samePiece && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once")) {
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1));
                    }
    
                    document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children[0]);
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
                    document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).appendChild(document.querySelector("#" + id).children[0]);    
                    check();
    
                    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline !== "red solid 5px") {
                        moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1));
                    }
    
                    document.querySelector("#" + id).appendChild(document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children[0]);
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
                        break;
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
                        break;
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
    }
    else {
        //en passant possibility for light-pcs
        if (players[0] === "light-pc" && id[1] ==="5") {

            if (id.charCodeAt(0) - 1 > 96 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children.length) {
                let samePiece = false;

                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + id[1]).children[0].id === lastMovedPiece) {
                    samePiece = true;
                }

                if (samePiece && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once")) {
                    moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1));
                }
            }

            if (id.charCodeAt(0) + 1 < 105 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children.length) {
                let samePiece = false;

                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children[0].id === lastMovedPiece) {
                    samePiece = true;
                }

                if (samePiece && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once")) {
                    moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1));
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
                    moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1));
                }
            }

            if (id.charCodeAt(0) + 1 < 105 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children.length) {
                let samePiece = false;

                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children[0].id === lastMovedPiece) {
                    samePiece = true;
                }

                if (samePiece && document.querySelector("#" + lastMovedPiece).classList.contains("moved-once")) {
                    moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1));
                }
            }
        }
        //vertical pawn movement for first move
        if (!activePiece.classList.contains("moved") && !activePiece.classList.contains("moved-once")) {
            
            switch (true) {
                //movement for light-pc
                case players[0] === "light-pc":
                    for (let i = 1; i < 3 && document.querySelector("#" + id[0] + (+id[1] + i)).children.length === 0; i++) {
                        moves.push(id[0] + (+id[1] + i));
                    }
                    break;
                //movement for dark-pc
                case players[0] === "dark-pc":
                    for (let i = 1; i < 3 && document.querySelector("#" + id[0] + (+id[1] - i)).children.length === 0; i++) {
                        moves.push(id[0] + (+id[1] - i));
                    }
            }
        }
        else {//vertical pawn movement after moving once
            
            switch (true) {
                //movement for light-pc
                case players[0] === "light-pc":
                    if (document.querySelector("#" + id[0] + (+id[1] + 1)).children.length === 0) {
                        moves.push(id[0] + (+id[1] + 1));
                    }
                    break;
                //movement for dark-pc
                case players[0] === "dark-pc":
                    if (document.querySelector("#" + id[0] + (+id[1] - 1)).children.length === 0) {
                        moves.push(id[0] + (+id[1] - 1));
                    }
            }
        }
        //diagonal captures
        if (players[0] === "light-pc") {
            //right diagonal
            if (id.charCodeAt(0) + 1 < 105 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1)).children.length && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 1));
            }
            //left diagonal
            if (id.charCodeAt(0) - 1 > 96  && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1)).children.length && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 1));
            }
        }
        else if (players[0] === "dark-pc") {
            //left diagonal
            if (id.charCodeAt(0) + 1 < 105 && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1)).children.length && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] - 1));
            }
            //right diagonal
            if (id.charCodeAt(0) - 1 > 96  && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1)).children.length && document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] - 1));
            }
        }
    }

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
            document.querySelector("#cap-dark-pcs").appendChild(document.querySelector("#" + lastMovedPiece));
        }
        else if (players[0] === "dark-pc" && id[1] === "3") {
            document.querySelector("#" + lastMovedPiece).style.fontSize = "2rem";
            document.querySelector("#" + lastMovedPiece).style.paddingLeft = "10px";
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
            //turn ends before new piece is created so the active player is the opposing player
            if (players[0] === "dark-pc") {
                newPiece.classList = "fas fa-chess-queen light-pc queen promo";
                newPiece.id = "light-queen-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "fas fa-chess-queen dark-pc queen promo";
                newPiece.id = "dark-queen-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            break;
        case document.querySelector("#" + id).classList.contains("knight"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            if (players[0] === "dark-pc") {
                newPiece.classList = "fas fa-chess-knight light-pc knight promo";
                newPiece.id = "light-knight-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "fas fa-chess-knight dark-pc knight promo";
                newPiece.id = "dark-knight-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            break;
        case document.querySelector("#" + id).classList.contains("rook"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            if (players[0] === "dark-pc") {
                newPiece.classList = "fas fa-chess-rook light-pc rook promo";
                newPiece.id = "light-rook-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "fas fa-chess-rook dark-pc rook promo";
                newPiece.id = "dark-rook-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
            break;
        case document.querySelector("#" + id).classList.contains("bishop"):
            document.querySelector("#" + id).parentElement.style.visibility = "hidden";
            promoPieceCount += 1;

            if (players[0] === "dark-pc") {
                newPiece.classList = "fas fa-chess-bishop light-pc bishop promo";
                newPiece.id = "light-bishop-promo-" + promoPieceCount;
            }
            else {
                newPiece.classList = "fas fa-chess-bishop dark-pc bishop promo";
                newPiece.id = "dark-bishop-promo-" + promoPieceCount;
            }
            
            document.querySelector("#" + document.querySelector("#" + id).parentElement.id[6] + document.querySelector("#" + id).parentElement.id[7]).appendChild(newPiece);
    }
}
//complete
function bishopMoves(id) {
    let moves = [];

    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline === "red solid 5px") {
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
    }
    else {
        //right diagonal movement
            //up movement
        for (let i = 1; i < Math.min(9 - (id.charCodeAt(0) - 96), 9 - id[1]); i++) {
            
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children.length === 0) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i));
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i));
                break;
            }
            else {
                break;
            }
        }
            //down movement
        for (let i = 1; i < Math.min(id.charCodeAt(0) - 96, id[1]); i++) {
            
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children.length === 0) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i));
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i));
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
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i));
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i));
                break;
            }
            else {
                break;
            }
        }
            //down movement
        for (let i = 1; i < Math.min(9 - (id.charCodeAt(0) - 96), id[1]); i++) {
            
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children.length === 0) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i));
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i));
                break;
            }
            else {
                break;
            }
        }
    }

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
    }
}
//complete
function knightMoves(id) {
    let moves = [];

    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline === "red solid 5px") {
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
    }
    else {
        //(-1, -2)
        if ((id.charCodeAt(0) - 1) >= 97 && (id.charCodeAt(0) - 1) <= 104 && (id[1] - 2) >= 1 && (id[1] - 2) <= 8) {
            let move = String.fromCharCode(id.charCodeAt(0) - 1) + (id[1] - 2);
            
            if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
                moves.push(move);
            }
        }
        //(1, -2)    
        if ((id.charCodeAt(0) + 1) >= 97 && (id.charCodeAt(0) + 1) <= 104 && (id[1] - 2) >= 1 && (id[1] - 2) <= 8) {
            let move = String.fromCharCode(id.charCodeAt(0) + 1) + (id[1] - 2);
            
            if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
                moves.push(move);
            }
        }
        //(2, -1)
        if ((id.charCodeAt(0) + 2) >= 97 && (id.charCodeAt(0) + 2) <= 104 && (id[1] - 1) >= 1 && (id[1] - 1) <= 8) {
            let move = String.fromCharCode(id.charCodeAt(0) + 2) + (id[1] - 1);
            
            if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
                moves.push(move);
            }
        }
        //(2, 1)
        if ((id.charCodeAt(0) + 2) >= 97 && (id.charCodeAt(0) + 2) <= 104 && (+id[1] + 1) >= 1 && (+id[1] + 1) <= 8) {
            let move = String.fromCharCode(id.charCodeAt(0) + 2) + (+id[1] + 1);
            
            if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
                moves.push(move);
            }
        }
        //(1, 2)
        if ((id.charCodeAt(0) + 1) >= 97 && (id.charCodeAt(0) + 1) <= 104 && (+id[1] + 2) >= 1 && (+id[1] + 2) <= 8) {
            let move = String.fromCharCode(id.charCodeAt(0) + 1) + (+id[1] + 2);
            
            if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
                moves.push(move);
            }
        }
        //(-1, 2)
        if ((id.charCodeAt(0) - 1) >= 97 && (id.charCodeAt(0) - 1) <= 104 && (+id[1] + 2) >= 1 && (+id[1] + 2) <= 8) {
            let move = String.fromCharCode(id.charCodeAt(0) - 1) + (+id[1] + 2);
            
            if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
                moves.push(move);
            }
        }
        //(-2, 1)
        if ((id.charCodeAt(0) - 2) >= 97 && (id.charCodeAt(0) - 2) <= 104 && (+id[1] + 1) >= 1 && (+id[1] + 1) <= 8) {
            let move = String.fromCharCode(id.charCodeAt(0) - 2) + (+id[1] + 1);
            
            if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
                moves.push(move);
            }
        }
        //(-2, -1)    
        if ((id.charCodeAt(0) - 2) >= 97 && (id.charCodeAt(0) - 2) <= 104 && (id[1] - 1) >= 1 && (id[1] - 1) <= 8) {
            let move = String.fromCharCode(id.charCodeAt(0) - 2) + (id[1] - 1);
            
            if (document.querySelector("#" + move).children.length === 0 || document.querySelector("#" + move).children[0].classList.contains(players[1])) {
                moves.push(move);
            }
        }
    }

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
    }
}
//complete
function rookMoves(id) {
    let moves = [];

    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline === "red solid 5px") {
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
    }
    else {
        //vertical movement
            //upward movement
        for (let i = 1; i < 9 - id[1]; i++) {
            
            if (document.querySelector("#" + id[0] + (+id[1] + i)).children.length === 0) {
                moves.push(id[0] + (+id[1] + i));
            }
            else if (document.querySelector("#" + id[0] + (+id[1] + i)).children[0].classList.contains(players[1])) {
                moves.push(id[0] + (+id[1] + i));
                break;
            }
            else {
                break;
            }
        }
            //downward movement
        for (let i = 1; i < id[1]; i++) {
            
            if (document.querySelector("#" + id[0] + (+id[1] - i)).children.length === 0) {
                moves.push(id[0] + (+id[1] - i));
            }
            else if (document.querySelector("#" + id[0] + (+id[1] - i)).children[0].classList.contains(players[1])) {
                moves.push(id[0] + (+id[1] - i));
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
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + id[1]);
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + id[1]);
                break;
            }
            else {
                break;
            }
        }
            //leftward movement
        for (let i = 1; i < id.charCodeAt(0) - 96; i++) {
            
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children.length === 0) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + id[1]);
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + id[1]);
                break;
            }
            else {
                break;
            }
        }
    }

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
    }
}
//complete
function queenMoves(id) {
    let moves = [];

    if (document.querySelector("." + players[0] + ".king").parentElement.style.outline === "red solid 5px") {
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
    }
    else {
        //right diagonal movement
            //up movement
        for (let i = 1; i < Math.min(9 - (id.charCodeAt(0) - 96), 9 - id[1]); i++) {
            
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children.length === 0) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i));
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + i));
                break;
            }
            else {
                break;
            }
        }
            //down movement
        for (let i = 1; i < Math.min(id.charCodeAt(0) - 96, id[1]); i++) {
            
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children.length === 0) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i));
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] - i));
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
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i));
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + (+id[1] + i));
                break;
            }
            else {
                break;
            }
        }
            //down movement
        for (let i = 1; i < Math.min(9 - (id.charCodeAt(0) - 96), id[1]); i++) {
            
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children.length === 0) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i));
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i)).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] - i));
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
                moves.push(id[0] + (+id[1] + i));
            }
            else if (document.querySelector("#" + id[0] + (+id[1] + i)).children[0].classList.contains(players[1])) {
                moves.push(id[0] + (+id[1] + i));
                break;
            }
            else {
                break;
            }
        }
            //downward movement
        for (let i = 1; i < id[1]; i++) {
        
            if (document.querySelector("#" + id[0] + (+id[1] - i)).children.length === 0) {
                moves.push(id[0] + (+id[1] - i));
            }
            else if (document.querySelector("#" + id[0] + (+id[1] - i)).children[0].classList.contains(players[1])) {
                moves.push(id[0] + (+id[1] - i));
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
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + id[1]);
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + id[1]).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) + i) + id[1]);
                break;
            }
            else {
                break;
            }
        }
            //leftward movement
        for (let i = 1; i < id.charCodeAt(0) - 96; i++) {
        
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children.length === 0) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + id[1]);
            }
            else if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) - i) + id[1]).children[0].classList.contains(players[1])) {
                moves.push(String.fromCharCode(id.charCodeAt(0) - i) + id[1]);
                break;
            }
            else {
                break;
            }
        }
    }

    for (let i = 0; i < moves.length; i++) {
        document.querySelector("#" + moves[i]).style.outline = "#473A33 5px solid";
    }
}
//need to add inability to move to dangerous boardspaces + add check moves
function kingMoves(id) {
    let moves = [];
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
                document.querySelector("#c1").style.outline = "#473A33 5px solid";
            }
            //castling kingside
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children.length === 0 &&
                document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 2) + id[1]).children.length === 0 &&
                document.querySelector("#h1").children.length &&
                document.querySelector("#h1").children[0].classList.contains("light-pc") &&
                !document.querySelector("#h1").children[0].classList.contains("moved"))
            {
                document.querySelector("#g1").style.outline = "#473A33 5px solid";
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
                document.querySelector("#c8").style.outline = "#473A33 5px solid";
            }
            //castling kingside
            if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 1) + id[1]).children.length === 0 &&
                document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + 2) + id[1]).children.length === 0 &&
                document.querySelector("#h8").children.length &&
                document.querySelector("#h8").children[0].classList.contains("dark-pc") &&
                !document.querySelector("#h8").children[0].classList.contains("moved"))
            {
                document.querySelector("#g8").style.outline = "#473A33 5px solid";
            }
    }
    //checks for regular moves
    for (j = 1; j > -2; j--) { //evaluating each rank
        
        for (let i = -1; i < 2; i++) { //evaluating each file
            //checks ranks and files to see if they exist && spaces to make sure they don't have a piece on them
            if (id.charCodeAt(0) + i >= 97 && id.charCodeAt(0) + i <= 104 && +id[1] + j > 0 && +id[1] + j < 9) {
                
                if (document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + j)).children.length === 0 || document.querySelector("#" + String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + j)).children[0].classList.contains(players[1])) {
                    moves.push(String.fromCharCode(id.charCodeAt(0) + i) + (+id[1] + j));
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
    if (!activePiece.classList.contains("moved")) {
        
        if (activePiece.id === "light-king") {

            switch (true) {
                case id === "c1":
                    document.querySelector("#d1").appendChild(document.querySelector("#light-rook-a"));
                    break;
                case id === "g1":
                    document.querySelector("#f1").appendChild(document.querySelector("#light-rook-b"));
            }
        }
        else if (activePiece.id === "dark-king") {

            switch (true) {
                case id === "c8":
                    document.querySelector("#d8").appendChild(document.querySelector("#dark-rook-a"));
                    break;
                case id === "g8":
                    document.querySelector("#f8").appendChild(document.querySelector("#dark-rook-b"));
            }
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