import {YourShip, AlienShip} from "./ships.js";

const swarm = document.querySelector('#swarm-container');
const aliens = [];
const textContent = [];
const textBox = document.querySelector('#text-box');
const retreatButton = document.querySelector('#retreat');
let numWaves = 0;
startGame();
//const swarm = document.querySelector('#swarm-container');
let numAliens = 10;
// const aliens = [];
// const textContent = [];
// const textBox = document.querySelector('#text-box');
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

console.log(aliens);
const USSAssembly = new YourShip();
let currentHull = USSAssembly.hull;

const hullPoints = document.querySelector('#hull-points')

for(let i = 0; i < USSAssembly.hull; i++) {
    let hullPoint = document.createElement('div');
    hullPoint.className = 'hull-point';
    hullPoints.appendChild(hullPoint);
}
console.log(USSAssembly.hull);
let evilAlien = new AlienShip();
console.log(evilAlien.accuracy);

USSAssembly.attack(evilAlien);
evilAlien.attack(USSAssembly);

evilAlien = new AlienShip();

// damageHull(2);
// repairHull(5);
// damageHull(3);



function damageHull(damage) {
    for(let i = 0; i < damage; i++) {
        if(currentHull-i-1 >= 0) {
            hullPoints.children[currentHull-i-1].style.opacity = 0;
        }
        
    }
    currentHull -= damage;
    console.log(currentHull);
}

function repairHull(damage) {
    for(let i = currentHull-1; i < 20; i++) {
        hullPoints.children[i].style.opacity = 1;
    }
    currentHull += damage;
    if(currentHull > 20) { 
        currentHull = 20;
    }
    console.log(currentHull);
}

function clickAlien(event) {
    const alienNum = aliens.find(alien => alien.number == event.target.title).number;
    const alienIndex = aliens.findIndex(alien => alien.number == event.target.title);
    console.log(alienNum);

    if(USSAssembly.attack(aliens[alienIndex])) {
        updateText("<p class='good'>Your Attack Hit!</p>");
    }
    else {
        updateText("<p class='bad'>Your Attack Missed!</p>")
    }
    if(aliens[alienIndex].hull <= 0) {
        updateText("<p class='good'>Alien Destroyed!</p>");
        for(let i = 0; i < swarm.children.length; i++) {
            if(swarm.children[i].firstChild.title == alienNum) {
                swarm.removeChild(swarm.children[i]);
                aliens.splice(i, 1);
            }
        }
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

function startGame() {
    

    startWave();
    
    retreatButton.addEventListener("click", gameOver);
}

function startWave() {

}

function gameOver(isRetreat) {
    console.log(isRetreat);
    if(isRetreat) {
        updateText("<p class='bad'>You ran from the aliens, but at what cost...</p>");
    }
    else {
        updateText("<p class='bad'>You fought valiantly but you were overcome by aliens.</p>");
    }
}

function win() {
    updateText("<p class='good'>You've saved the universe from the aliens!</p>");
}

function updateText(text) {
    if(textContent.length >= 5) {
        textContent.shift();
    }
    textContent.push(text);

    textBox.innerHTML = textContent.join('');
}

// while(numAliens > 0 && USSAssembly.hull > 0) {
//     USSAssembly.attack(evilAlien);
//     if(evilAlien.hull <= 0) {
//         numAliens -= 1;
//         console.log("Alien destroyed!");
//         evilAlien = new AlienShip();
//     }
//     else {
//         evilAlien.attack(USSAssembly);
//     }
// }
// if(numAliens == 0) {
//     console.log("You win!");
// }