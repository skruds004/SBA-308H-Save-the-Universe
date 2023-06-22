import {Ship, AlienShip} from "./ships.js";

//initialize DOM stuff
const swarm = document.querySelector('#swarm-container');
let aliens = [];
const textContent = [];
const textBox = document.querySelector('#text-box');
const retreatButton = document.querySelector('#retreat');
retreatButton.addEventListener("click", gameOver);
const waveNum = document.querySelector('#wave-text');

//create a game end DOM element to display on game end
const gameEnd = document.createElement('div');
const endText = document.createElement('h1');
const restartButton = document.createElement('button');
gameEnd.className = 'game-end';
endText.className = 'end-text';
restartButton.id = 'restart-button';
restartButton.innerText = 'Restart';
gameEnd.appendChild(endText);
gameEnd.appendChild(restartButton);


restartButton.addEventListener('click', function() {
    startGame(4);
});


//initialize ship and hullpoints UI
const USSAssembly = new Ship();
let currentHull = USSAssembly.hull;
const hullPoints = document.querySelector('#hull-points');
for(let i = 0; i < USSAssembly.hull; i++) {
    let hullPoint = document.createElement('div');
    hullPoint.className = 'hull-point';
    hullPoints.appendChild(hullPoint);
}

let numWaves = 4;
startGame(numWaves);



function damageHull(damage) {
    for(let i = 0; i < damage; i++) {
        if(currentHull-i-1 >= 0) {
            hullPoints.children[currentHull-i-1].style.opacity = 0;
        }
        
    }
    currentHull -= damage;
    if(currentHull < 0) {
        currentHull = 0;
    }
}

function repairHull(damage) {
    currentHull += damage;
    if(currentHull > 20) { 
        currentHull = 20;
    }
    for(let i = 0; i < currentHull; i++) {
        hullPoints.children[i].style.opacity = 1;
    }
    if(damage != 20) {
        updateText("<p class='good'>Your hull has been repaired by " + damage + " points!</p>");
    }
}

function clickAlien(event) {
    const alienNum = aliens.find(alien => alien.number == event.target.title).number;
    //const alienNum = event.target.title;
    const alienIndex = aliens.findIndex(alien => alien.number == event.target.title);

    let canRetreat = false;

    if(USSAssembly.attack(aliens[alienIndex])) {
        updateText("<p class='good'>Your Attack Hit!</p>");
    }
    else {
        updateText("<p class='bad'>Your Attack Missed!</p>")
    }
    if(aliens[alienIndex].hull <= 0) {
        
        canRetreat = true;
        updateText("<p class='good'>Alien Destroyed! Retreat Available!</p>");
        for(let i = 0; i < swarm.children.length; i++) {
            if(swarm.children[i].firstChild.title == alienNum) {
                swarm.removeChild(swarm.children[i]);
                aliens.splice(i, 1);
            }
        }
    }

    //retreat button is only available after an alien is destroyed
    if(canRetreat) {
        retreatButton.style.display = "block";
    }
    else {
        retreatButton.style.display = "none";
    }

    //check if there are aliens left
    if(aliens[0]) {
        //change this so the last alien attacks
        if(aliens[aliens.length-1].attack(USSAssembly)) {
            damageHull(aliens[aliens.length-1].firepower);
            if(currentHull <= 0) {
                gameOver(false);
            }
            else {
                updateText("<p class='bad'>Alien Hit You!</p>");
            }
        }
        else {
            updateText("<p class='good'>Alien Missed You!</p>");
        }
    }
    //when you win
    else {
        win();
    }

}

function removeAliens() {
    aliens = [];
    swarm.replaceChildren();
}

function startGame(waves) {
    waveNum.value = waves;
    repairHull(20);
    startWave(waves);
}

function startWave(wavesLeft) {
    retreatButton.style.display = "none";
    if(wavesLeft != waveNum.value) {
        repairHull(Math.floor(Math.random() * 5) + 3);
    }
    numWaves = wavesLeft - 1;
    waveNum.innerText = "Wave " + (waveNum.value - wavesLeft + 1) + " of: " + waveNum.value;
    removeAliens();
    let numAliens = 4 - numWaves;
    for (let i = 0; i < numAliens; i++) {
        //fill an array with aliens
        aliens.push(new AlienShip(i));

        //make aliens in the DOM
        let alien = document.createElement('div');
        let target = document.createElement('div');
        let image = document.createElement('div');
        alien.className = 'alien';
        image.className = 'alien-image fa-solid fa-spaghetti-monster-flying fa-5x';
        target.className = 'target fa-solid fa-crosshairs fa-1x';

        //title used to access the alien in the aliens array, and works when either the alien or target is clicked
        image.title = i;
        target.title = i;
        //only one eventlistener is needed, an event listener on both
        //the alien and target causes two events to be fired
        image.addEventListener('click', clickAlien);
        alien.appendChild(image);
        image.appendChild(target);
        swarm.appendChild(alien);
    }
}

function gameOver(isRetreat) {
    if(isRetreat) {
        updateText("<p class='bad'>You ran from the aliens, but at what cost...</p>");
        endText.innerText = "You Ran From the Aliens, but At What Cost...";
    }
    else {
        updateText("<p class='bad'>You fought valiantly but you were overcome by aliens.</p>");
        endText.innerText = "You Fought Valiantly but You Were Overcome By the Aliens";
    }

    removeAliens();
    swarm.appendChild(gameEnd);
}

function win() {
    if(numWaves > 0) {
        startWave(numWaves);
    }
    else {
        updateText("<p class='good'>You've saved the universe from the aliens!</p>");
        waveNum.innerText = "";
        endText.innerText = "You've saved the universe from the aliens!";
        swarm.appendChild(gameEnd);
    }
}

function updateText(text) {
    if(textContent.length >= 5) {
        textContent.pop();
    }
    textContent.unshift(text);

    textBox.innerHTML = textContent.join('');
}
