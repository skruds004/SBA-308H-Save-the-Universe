import {Ship, AlienShip} from "./ships.js";

//initialize DOM selectors and arrays
const swarm = document.querySelector('#swarm-container');
let aliens = [];
const textContent = [];
const textBox = document.querySelector('#text-box');
const retreatButton = document.querySelector('#retreat');
retreatButton.addEventListener("click", gameOver);
const waveText = document.querySelector('#wave-text');

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
    //these are the cyan rectangles that represent health on screen
    let hullPoint = document.createElement('div');
    hullPoint.className = 'hull-point';
    hullPoints.appendChild(hullPoint);
}

//first game initialization
let numWaves = 4;
startGame(numWaves);


//Function to hide the UI Hull Point Elements
function damageHull(damage) {
    //Hide the hull-points when the ship is damaged
    for(let i = 0; i < damage; i++) {
        if(currentHull-i-1 >= 0) {
            hullPoints.children[currentHull-i-1].style.opacity = 0;
        }
        
    }
    //decrement currentHull
    currentHull -= damage;
    if(currentHull < 0) {
        currentHull = 0;
    }
}

//Function to show the hull-points when the ship is repaired
function repairHull(damage) {
    //increment currentHull and the ship hull
    currentHull += damage;
    USSAssembly.hull += damage;
    if(currentHull > 20) { 
        currentHull = 20;
    }
    //show the hullpoints
    for(let i = 0; i < currentHull; i++) {
        hullPoints.children[i].style.opacity = 1;
    }
    //when the ship is fully repaired on a restart, don't show this text
    if(damage != 20) {
        updateText("<p class='good'>Your hull has been repaired by " + damage + " points!</p>");
    }
}

//Main logic of the program, handles the game flow logic on click
function clickAlien(event) {
    //This line of code was changed to prevent some errant behavior -> const alienNum = event.target.title;

    //this line of code gets the number which can access the alien ships on the DOM and in the aliens array
    const alienNum = aliens.find(alien => alien.number == event.target.title).number;
    //this line of code gets the index of the alien in the aliens array
    const alienIndex = aliens.findIndex(alien => alien.number == event.target.title);

    let canRetreat = false;

    //Your ship attacks the clicked alien, and updates text properly
    if(USSAssembly.attack(aliens[alienIndex])) {
        updateText("<p class='good'>Your Attack Hit!</p>");
    }
    else {
        updateText("<p class='bad'>Your Attack Missed!</p>")
    }
    //Logic for when you destroy an alien
    if(aliens[alienIndex].hull <= 0) {
        //You can retreat when you destroy an alien
        canRetreat = true;
        updateText("<p class='good'>Alien Destroyed! Retreat Available!</p>");
        //remove the alien from the DOM and the aliens array
        for(let i = 0; i < swarm.children.length; i++) {
            if(swarm.children[i].firstChild.title == alienNum) {
                swarm.removeChild(swarm.children[i]);
                aliens.splice(i, 1);
            }
        }
    }

    //retreat button is only available after an alien is destroyed, otherwise hide it
    if(canRetreat) {
        retreatButton.style.display = "block";
    }
    else {
        retreatButton.style.display = "none";
    }

    //check if there are aliens left
    if(aliens[0]) {
        //Only the last alien attacks
        if(aliens[aliens.length-1].attack(USSAssembly)) {
            //damage ship hull when the alien hits
            damageHull(aliens[aliens.length-1].firepower);
            //check for gameover state
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
    //you beat the wave when all aliens are destroyed
    else {
        win();
    }

}

//reset function for the aliens array and swarm container
function removeAliens() {
    aliens = [];
    swarm.replaceChildren();
}

//function ran when the game is started or restarted
function startGame(waves) {
    waveText.value = waves;
    repairHull(20);
    startWave(waves);
}

//function ran each wave in the game
function startWave(wavesLeft) {
    //hide the retreat button when a wave starts
    retreatButton.style.display = "none";
    //don't repair the hull on the first wave
    if(wavesLeft != waveText.value) {
        repairHull(Math.floor(Math.random() * 5) + 3);
    }
    //decrement the wave number
    numWaves = wavesLeft - 1;
    //update the wave header
    waveText.innerText = "Wave " + (waveText.value - wavesLeft + 1) + " of: " + waveText.value;
    //remove any text and extra aliens
    removeAliens();

    //populate the swarm container and aliens array
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

//function for game over states
function gameOver(isRetreat) {
    //events from the reset button will always be 'truthy'
    if(isRetreat) {
        updateText("<p class='bad'>You ran from the aliens, but at what cost...</p>");
        endText.innerText = "You Ran From the Aliens, but At What Cost...";
    }
    //false gets sent manually when your hull drops to 0
    else {
        updateText("<p class='bad'>You fought valiantly but you were overcome by aliens.</p>");
        endText.innerText = "You Fought Valiantly but You Were Overcome By the Aliens";
    }

    //get rid of all the aliens when the game ends
    removeAliens();
    swarm.appendChild(gameEnd);
}

//function when you beat a wave
function win() {
    //start a new wave while there are still waves left
    if(numWaves > 0) {
        startWave(numWaves);
    }
    //otherwise end game state is reached
    else {
        updateText("<p class='good'>You've saved the universe from the aliens!</p>");
        waveText.innerText = "Earth Lives To See Another Day!";
        endText.innerText = "You've saved the universe from the aliens!";
        swarm.appendChild(gameEnd);
    }
}

//Text box updating function
function updateText(text) {
    //maximum of 5 text updates are allowed in the text box, last one is popped
    if(textContent.length >= 5) {
        textContent.pop();
    }
    //add new text to the start of the array
    textContent.unshift(text);

    //Update the textbox DOM element
    textBox.innerHTML = textContent.join('');
}
