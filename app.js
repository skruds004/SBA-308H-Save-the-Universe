import {Ship, YourShip, AlienShip} from "./ships.js";

const USSAssembly = new YourShip();
console.log(USSAssembly.hull);
const evilAlien = new AlienShip();
console.log(evilAlien.accuracy);

USSAssembly.attack(evilAlien);
evilAlien.attack(USSAssembly);