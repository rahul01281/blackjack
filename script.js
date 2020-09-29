let blackjackGame = {
    'you':{'scoreSpan':'#your-blackjack-result', 'div': '#your-box', 'score':0},
    'dealer':{'scoreSpan':'#dealer-blackjack-result', 'div': '#dealer-box', 'score':0},
    'cards':['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap':{'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10,'K':10,'J':10, 'Q':10, 'A':[1, 11]},
    'wins':0, 'losses':0, 'draws':0, 'isStand':false, 'turnsOver':false
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

const hitSound = new Audio('assets/sounds/swish.m4a');
const winSound = new Audio('assets/sounds/cash.mp3');
const lostSound = new Audio('assets/sounds/aww.mp3');

function blackjackHit(){
    if (blackjackGame['isStand'] === false){
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function showCard(activePlayer, card){
    if (activePlayer['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = 'assets/images/'+ card + '.png';
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}
    

function blackjackDeal(){
    if (blackjackGame['turnsOver'] === true){
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');

        for (let i = 0; i < yourImages.length; i++){
            yourImages[i].remove();
        }

        for (let i = 0; i < dealerImages.length; i++){
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your-blackjack-result').textContent=0;
        document.querySelector('#your-blackjack-result').style.color='white';

        document.querySelector('#dealer-blackjack-result').textContent=0;
        document.querySelector('#dealer-blackjack-result').style.color='white';

        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = "black";

        blackjackGame['turnsOver'] = true;
    }
}

function randomCard(){
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function updateScore(card, activePlayer){
    if (card == 'A'){
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21){
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }
        else{
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    }
    else{
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer){
    if (activePlayer['score'] > 21){
        document.querySelector(activePlayer['scoreSpan']).textContent="BUST!";
        document.querySelector(activePlayer['scoreSpan']).style.color="red";
    }
    else{
        document.querySelector(activePlayer['scoreSpan']).textContent=activePlayer['score'];
    }

}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
    blackjackGame['isStand'] = true;
    while (DEALER['score']<18 && blackjackGame['isStand'] === true){
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(700);
    }
    
    blackjackGame['turnsOver'] = true;
    winnerList = computeWinner();
    showResult(winnerList);    
}

//computes winner and returns who won
//update the wins, draws and losses
function computeWinner(){
    let winnerList;

    if (YOU['score'] <= 21){
        //condition: higher score than dealer or when dealer busts but you're 21 or under
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
            blackjackGame['wins'] += 1;
            winnerList = {'winner':YOU, 'message':'You Won!', 'messageColor': 'green'}
        }
        else if (YOU['score'] < DEALER['score']){
            blackjackGame['losses'] += 1;
            winnerList = {'winner':DEALER, 'message':'You Lost!', 'messageColor': 'red'}
        }
        else if (YOU['score'] === DEALER['score']){
            blackjackGame['draws'] += 1;
            winnerList = {'winner':'no winner', 'message':'Draw Game!', 'messageColor': 'blue'}
        }
    }
    // condition: user busts but dealer doesn't
    else if (YOU['score'] > 21 && DEALER['score'] <= 21){
        blackjackGame['losses'] += 1;
        winnerList = {'winner':DEALER, 'message':'You Lost!', 'messageColor': 'red'}
    }

    //condition: when you and dealer busts
    else if (YOU['score']>21 && DEALER['score']>21){
        blackjackGame['draws'] += 1;
        winnerList = {'winner':'no winner', 'message':'Draw Game!', 'messageColor': 'black'}
    }

    return winnerList;
}

function showResult(winnerList){
    if (blackjackGame['turnsOver'] ==  true){
        if (winnerList['winner'] === YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            winSound.play();
        }
        else if (winnerList['winner'] === DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            lostSound.play();
        }
        else{
            document.querySelector('#draws').textContent = blackjackGame['draws'];
        }

        document.querySelector('#blackjack-result').textContent = winnerList['message'];
        document.querySelector('#blackjack-result').style.color = winnerList['messageColor'];
    }
}