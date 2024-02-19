const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards")
    },
    action:{
        button: document.getElementById("next-duel")
    },
};

const pathImages = "./src/assets/icons/";
//pode vir de um BD
const cardData = [
    {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    WinOf: [1],
    LoseOf: [2],
    },
    {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    WinOf: [2],
    LoseOf: [0],
    },

    {
        id: 2,
        name: "Exodia",
        type: "scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    }

];

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
};

async function creatCardImage(IdCard, fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1){
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", ()=>{
            drawSelectCard(IdCard);
        });
    };

    return cardImage;
};

async function uptadeScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.
        playerScore} / Lose: ${state.score.computerScore}`;
};

async function checkDuelResults(playerCard, computerCardId){
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Ganhou";
        state.score.playerScore++;
    };
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Perdeu";
        state.score.computerScore++;
    };

    return duelResults;
};

async function setCardsField(cardId){

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);
    await hiddenCardDetails();

    await drawCardInField(cardId, computerCardId);
    
    let duelResults = await checkDuelResults(cardId, computerCardId);

    await uptadeScore();
    await drawButton(duelResults);
};

async function drawCardInField(cardId, computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

}

async function showHiddenCardFieldsImages(value){
    if(value === true){  
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    }
    if(value === false){
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails(){
    
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";

}

async function drawButton(text){
    state.action.button.innerText = text;
    state.action.button.style.display = "block";
};

async function removeAllCardsImages(){
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
};

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;

};

async function drawCards(cardNumbers, fielSide){
    for(let i=0; i< cardNumbers; i++){
        const randomIdCard = await getRandomCardId()
        const cardImage = await creatCardImage(randomIdCard, fielSide);

        document.getElementById(fielSide).appendChild(cardImage)
    }
};

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.action.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

function init(){
    showHiddenCardFieldsImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
};
init();