let gameStarted = false;
let dealerSum;
let dealerSumEl = document.querySelector("#dealer-sum");
let dealerCards;
let dealerCardValues = document.querySelector("#dealer-card-values");
let playerSum;
let playerSumEl = document.querySelector("#player-sum");
let playerCards;
let playerCardValues = document.querySelector("#player-card-values");
let deck1 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let deck2 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let deck3 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let deck4 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let deck5 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let decksCombined = deck1.concat(deck2, deck3, deck4, deck5);
let gameState = document.querySelector("#game-state");
let chips = 100;
let chipsEl = document.querySelector("#chips");
chipsEl.textContent += chips;
let bet = 0;
let betEl = document.querySelector("#bet");
betEl.textContent += bet;
let setInputMax = document.querySelector("#bet-amt");
setInputMax.setAttribute("max", chips);
let didPlayerBet = false;
let didPlayerStand = false;
let didPlayerBJ = false;
let didPlayerBust = false;
let reshufflePen = 0.20;

function bets() {
    let i = document.querySelector("#bet-amt").value;
    if (didPlayerBet === false && gameStarted === false && i > 0 && chips > 0) {
        document.querySelector("#bet-amt").value = "";

        bet = chips >= i ? i : chips;
        betEl.textContent = "Bet: $" + bet;
        didPlayerBet = true;

        chips = chips >= i ? chips - i : 0;
        chipsEl.textContent = "Chips: $" + chips;

        startGame();
    }
}

function startGame() {
    gameStarted = true;
    //randomly chooses an element from decksCombined by generating a random index value
    let firstCard = decksCombined[Math.floor(Math.random() * decksCombined.length)];
    decksCombined.splice(decksCombined.indexOf(firstCard), 1);

    let secondCard = decksCombined[Math.floor(Math.random() * decksCombined.length)];
    decksCombined.splice(decksCombined.indexOf(secondCard), 1);

    if (firstCard === 1 && secondCard === 1) {
        secondCard = 11;
    }
    else if (firstCard === 1) {
        firstCard = 11;
    }
    else if (secondCard === 1) {
        secondCard = 11;
    }

    playerSum = firstCard + secondCard;
    playerSumEl.textContent += " " + playerSum;
    
    playerCards = [firstCard, secondCard];
    playerCardValues.textContent += " " + playerCards.join(" ");

    dealerStart();

    if (playerSum < 21) {
        if (dealerSum !== 21) {
            gameState.textContent = "Do you want to draw a new card?";

            document.querySelector("#bet-amt").style.display = "none";
            document.querySelector("#startgame-btn").style.display = "none";

            document.querySelector("#drawcard-btn").style.display = "block";
            document.querySelector("#stand-btn").style.display = "block";
        }
        else {
            dealerCardValues.textContent = dealerCards.join(" ");
            dealerSumEl.textContent = dealerSum;
            gameState.textContent = "Oh no! You've Lost!";

            changeChips();
        }
    }
    else if (playerSum === 21) {
        didPlayerBJ = true;
        dealerCardValues.textContent = dealerCards.join(" ");
        dealerSumEl.textContent = dealerSum;

        if (dealerSum !== 21) {
            gameState.textContent = "Wohoo! You've you got Blackjack!";

            changeChips();
        }
        else {
            gameState.textContent = "You've tied the Dealer!";

            changeChips();
        }
    }
}

function dealerStart () {
    let dealerfirstCard = decksCombined[Math.floor(Math.random() * decksCombined.length)];
    decksCombined.splice(decksCombined.indexOf(dealerfirstCard), 1);

    let dealersecondCard = decksCombined[Math.floor(Math.random() * decksCombined.length)];
    decksCombined.splice(decksCombined.indexOf(dealersecondCard), 1);

    if (dealerfirstCard === 1 && dealersecondCard === 1) {
        dealersecondCard = 11;
    }
    else if (dealerfirstCard === 1) {
        dealerfirstCard = 11;
    }
    else if (dealersecondCard === 1) {
        dealersecondCard = 11;
    }

    dealerSum = dealerfirstCard + dealersecondCard;

    dealerCards = [dealerfirstCard, dealersecondCard];
    dealerCardValues.textContent += " " + dealerCards[0];
}

function addCard() {
    // adds new card only if the current sum is less than 21
    if (gameStarted === true && didPlayerBust === false && didPlayerBJ === false && didPlayerStand === false && dealerSum !== 21) {
        let newCard = decksCombined[Math.floor(Math.random() * decksCombined.length)];
        decksCombined.splice(decksCombined.indexOf(newCard), 1);

        if (playerSum < 11 && newCard === 1) {
            newCard = 11;
        }

        playerCards.push(newCard);
        playerSum += newCard;

        for (i = 0; i < playerCards.length; i++) {
            if (playerCards[i] === 11 && playerSum > 21) {
                playerCards[i] = 1;
                playerSum -= 10;
            }
        }

        playerCardValues.textContent = playerCards.join(" ");
        playerSumEl.textContent = playerSum;

        if (playerSum > 21) {
            gameState.textContent = "You're out of the game!";
            didPlayerBust = true;

            changeChips();
        }
    }
}

function stand() {
    if(gameStarted === true && didPlayerBust === false && didPlayerBJ === false && didPlayerStand === false && dealerSum !== 21) {
        didPlayerStand = true;

        dealerDraw();
    }
}

function dealerDraw() {
    do {
        if (dealerSum < 17) {
            let dealerNewCard = decksCombined[Math.floor(Math.random() * decksCombined.length)];
            decksCombined.splice(decksCombined.indexOf(dealerNewCard), 1);

            if (dealerSum < 11 && dealerNewCard === 1) {
                dealerNewCard = 11;
            }

            dealerCards.push(dealerNewCard);
            dealerSum += dealerNewCard;

            for (i = 0; i < dealerCards.length; i++) {
                if (dealerCards[i] === 11 && dealerSum > 21) {
                    dealerCards[i] = 1;
                    dealerSum -= 10;
                }
            }

            dealerCardValues.textContent = dealerCards.join(" ");
            dealerSumEl.textContent = dealerSum;
        }
        else {
            dealerCardValues.textContent = dealerCards.join(" ");
            dealerSumEl.textContent = dealerSum;
        }
    }
    while (dealerSum < 17);

    if (dealerSum > playerSum && dealerSum < 22) {
        gameState.textContent = "Oh no! You've Lost!";

        changeChips();
    }
    else if (dealerSum < playerSum || dealerSum > 21) {
        gameState.textContent = "Congratulations! You've Won!";

        changeChips();
    }
    else {
        gameState.textContent = "You've tied the Dealer!";

        changeChips();
    }
}

function changeChips() {
    chips += playerSum === 21 && didPlayerBJ === true && dealerSum !== 21 ? bet * 2.5
            :playerSum === dealerSum ? bet * 1
            :playerSum > 21 ? 0
            :playerSum > dealerSum ? bet * 2
            :playerSum < dealerSum && dealerSum > 21 ? bet * 2
            :0;

    chipsEl.textContent = "Chips: $" + chips;
    setInputMax.setAttribute("max", chips);

    bet = 0;
    betEl.textContent = "Bet: $" + bet;
    didPlayerBet = false;

    document.querySelector("#bet-amt").style.display = "none";
    document.querySelector("#startgame-btn").style.display = "none";
    document.querySelector("#drawcard-btn").style.display = "none";
    document.querySelector("#stand-btn").style.display = "none";

    document.querySelector("#playagain-btn").style.display = chips > 0 ? "block" : "none";
    document.querySelector("#restart-btn").style.display = "block";
}

function playAgain() {
    if (gameStarted === true && didPlayerBet === false) {
        gameStarted = false;

        dealerSum = undefined;
        dealerSumEl.textContent = ""

        dealerCards = undefined;
        dealerCardValues.textContent = "";

        playerSumEl.textContent = "";
        playerSum = undefined;

        playerCards = undefined;
        playerCardValues.textContent = "";

        gameState.textContent = "";

        didPlayerStand = false;
        didPlayerBJ = false;
        didPlayerBust = false;

        if (decksCombined.length / 260 < 1 - reshufflePen) {
            decksCombined = deck1.concat(deck2, deck3, deck4, deck5);
        }

        document.querySelector("#bet-amt").style.display = "block";
        document.querySelector("#startgame-btn").style.display = "block";

        document.querySelector("#playagain-btn").style.display = "none";
        document.querySelector("#restart-btn").style.display = "none";
    }
}

function restartGame() {
    //resets all variables to original values
    gameStarted = false;

    decksCombined = deck1.concat(deck2, deck3, deck4, deck5);

    dealerSum = undefined;
    dealerSumEl.textContent = ""

    dealerCards = undefined;
    dealerCardValues.textContent = "";

    playerSum = undefined;
    playerSumEl.textContent = "";

    playerCards = undefined;
    playerCardValues.textContent = "";

    gameState.textContent = "";

    chips = 100;
    chipsEl.textContent = "Chips: $" + chips;
    setInputMax.setAttribute("max", chips);

    bet = 0;
    betEl.textContent = "Bet: $" + bet;

    didPlayerBet = false;
    didPlayerStand = false;
    didPlayerBJ = false;
    didPlayerBust = false;

    document.querySelector("#bet-amt").style.display = "block";
    document.querySelector("#startgame-btn").style.display = "block";
    
    document.querySelector("#playagain-btn").style.display = "none";
    document.querySelector("#restart-btn").style.display = "none";
}

