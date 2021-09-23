let gameStarted = false;
let dealerSum;
let dealerSumEl = document.querySelector("#dealer-sum-el");
let dealerCards;
let dealerCardsEl = document.querySelector("#dealer-cards-el");
let playerSum;
let playerSumEl = document.querySelector("#player-sum-el");
let playerCards;
let playerCardsEl = document.querySelector("#player-cards-el");
let deck1 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let deck2 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let deck3 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let deck4 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let deck5 = [1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
let decksCombined = deck1.concat(deck2, deck3, deck4, deck5);
let gameState = document.querySelector("#game-state");
let chips = 100;
let chipsEl = document.querySelector("#chips-el");
chipsEl.textContent += " " + chips;
let bets = 0;
let betEl = document.querySelector("#bet-el");
let setInputMax = document.querySelector("#bet-amt");
setInputMax.setAttribute("max", chips);
let didPlayerBet = false;
let didPlayerStand = false;
let didPlayerBJ = false;
let didPlayerBust = false;
let reshufflePen = 0.20;

function bet() {
    let i = document.querySelector("#bet-amt").value;
    if (didPlayerBet === false && gameStarted === false && i <= chips && i > 0) {
        console.log("works");
        chips -= i;
        chipsEl.textContent = "Chips: " + chips;
        bets = i;
        betEl.textContent = "Bet: " + bets;
        setInputMax.setAttribute("max", chips);
        didPlayerBet = true;
    }
}

function startGame() {
    if (gameStarted === false && didPlayerBet === true) {
        console.log("works");
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
        playerCardsEl.textContent += " " + playerCards.join(" ");

        dealerStart();

        if (playerSum < 21) {
            if (dealerSum !== 21) {
                gameState.textContent = "Do you want to draw a new card?";
            }
            else {
                dealerCardsEl.textContent = "Dealer's Cards: " + dealerCards.join(" ");
                dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;
                gameState.textContent = "Oh no! You've Lost!";
                changeChips();
            }
        }
        else if (playerSum === 21) {
            didPlayerBJ = true;
            dealerCardsEl.textContent = "Dealer's Cards: " + dealerCards.join(" ");
            dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;

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
    console.log(decksCombined);
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
    dealerCardsEl.textContent += " " + dealerCards[0];
}

function addCard() {
    // adds new card only if the current sum is less than 21
    if (gameStarted === true && didPlayerBust === false && didPlayerBJ === false && didPlayerStand === false && dealerSum !== 21) {
        console.log("works");
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

        playerCardsEl.textContent = "Your Cards: " + playerCards.join(" ");
        playerSumEl.textContent = "Sum: " + playerSum;

        if (playerSum > 21) {
            gameState.textContent = "You're out of the game!";
            didPlayerBust = true;
            changeChips();
        }
    }
    console.log(decksCombined);
}

function stand () {
    if(gameStarted === true && didPlayerBust === false && didPlayerBJ === false && didPlayerStand === false && dealerSum !== 21) {
        console.log("works");
        didPlayerStand = true;
        dealerDraw();
    }
}

function dealerDraw () {
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

            dealerCardsEl.textContent = "Dealer's Cards: " + dealerCards.join(" ");
            dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;
        }
        else {
            dealerCardsEl.textContent = "Dealer's Cards: " + dealerCards.join(" ");
            dealerSumEl.textContent = "Dealer's Sum: " + dealerSum;
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
    chips += playerSum === 21 && didPlayerBJ === true && dealerSum !== 21 ? bets * 2.5
            :playerSum === dealerSum ? bets * 1
            :playerSum > 21 ? 0
            :playerSum > dealerSum ? bets * 2
            :playerSum < dealerSum && dealerSum > 21 ? bets * 2
            :0;

    chipsEl.textContent = "Chips: " + chips;
    bets = 0;
    betEl.textContent = "Bet:";
    didPlayerBet = false;
}

function playAgain() {
    if (gameStarted === true && didPlayerBet === false) {
        console.log("works");
        gameStarted = false;

        dealerSum = undefined;
        dealerSumEl.textContent = "Dealer's Sum:"

        dealerCards = undefined;
        dealerCardsEl.textContent = "Dealer's Cards:";

        playerSumEl.textContent = "Sum:";
        playerSum = undefined;

        playerCards = undefined;
        playerCardsEl.textContent = "Your Cards:";

        gameState.textContent = "";

        didPlayerStand = false;
        didPlayerBJ = false;
        didPlayerBust = false;
        //extra parentheses are for visability purposes
        if ((decksCombined.length / 260) < (1 - reshufflePen)) {
            decksCombined = deck1.concat(deck2, deck3, deck4, deck5);
        }
    }
}

function restartGame() {
    //resets all variables to original values
    gameStarted = false;

    decksCombined = deck1.concat(deck2, deck3, deck4, deck5);

    dealerSum = undefined;
    dealerSumEl.textContent = "Dealer's Sum:"

    dealerCards = undefined;
    dealerCardsEl.textContent = "Dealer's Cards:";

    playerSum = undefined;
    playerSumEl.textContent = "Sum:";

    playerCards = undefined;
    playerCardsEl.textContent = "Your Cards:";

    gameState.textContent = "";

    chips = 100;
    chipsEl.textContent = "Chips: " + chips;

    bets = 0;
    betEl.textContent = "Bet:";

    didPlayerBet = false;
    didPlayerStand = false;
    didPlayerBJ = false;
    didPlayerBust = false;
}

