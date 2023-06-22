export class Ship {
    #hull;
    #firepower;
    #accuracy;
    constructor(hull = 20, firepower = 5, accuracy = .7) {
        this.#hull = hull;
        this.#firepower = firepower;
        this.#accuracy = accuracy;
    }
    attack(enemy) {
        if(Math.random() < this.#accuracy) {
            enemy.getHit(this.#firepower);
            return true;
        }
        return false;
    }
    getHit(firepower) {
        this.hull -= firepower;
    }
    get hull() { return this.#hull; }
    get firepower() { return this.#firepower; }
    get accuracy() { return this.#accuracy; }
    set hull(hull) { this.#hull = hull; }
    set firepower(firepower) { this.#firepower = firepower; }
    set accuracy(accuracy) { this.#accuracy = accuracy; }
}

export class AlienShip extends Ship {
    constructor(number) {
        super(
            //hull between 3 and 6
            Math.floor(Math.random() * 4) + 3,
            //firepower between 2 and 4
            Math.floor(Math.random() * 3) + 2,
            //accuracy between .6 and .8
            ((Math.floor(Math.random() * 3) + 6) * 0.1).toFixed(1)
        );
        this.number = number;
    }
}