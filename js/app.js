// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.reSpawn(); // intial location coordinates and speed for the bug will be created as a result of this call

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);

    if ((this.x >= 505)) { // If bug moves off the screen to the right
        this.reSpawn(); // reset speed and with road row this bug is on
        this.x = -101; // bug will need to come into the screen again gradually
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reSpawn = function() { // this function resets the bug into a random road tile and gives the bug a speed
    this.x = Math.floor(Math.random() * 5) * 101;
    this.y = (Math.floor(Math.random() * 3) + 1) * 72;
    this.speed = Math.floor(Math.random() * 80) + 101; // enemy speed ranges from 101 to 180
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.reSpawn(); // initial location coordinates will be set as a result of this call
};

// toMove is an object whose purpose is to provide a connection with the game loop
// and the keyboard events triggered by the user.  When a keyboard event is triggered,
//the appropriate distance to move, based on the direction chosen by user, is stored
// in this object.  When update function for the player is called the actual coordinates
// for the player are updated, along with the usual check for valid coordinates (in bounds)
Player.prototype.toMove = {
    "x": 0,
    "y": 0
};

Player.prototype.update = function() {
    // store the updated coordinates in the temporary variable and validate them before making
    // changing the player's coordinates
    var projectedX = this.x + (this.toMove.x);
    var projectedY = this.y + (this.toMove.y);

    if (projectedY <= 0) { // if player is in water reset to the initial location and character sprite is changed
        this.reSpawn();
        spriteSwitcher.push(this.sprite);
        this.sprite = spriteSwitcher.shift();
    } else if ((projectedX < 0 || projectedX >= 505) || projectedY > 415) { // anywhere else out of bound player stays put
    } else { // valid coordinates so officialy update the players position
        this.x = projectedX;
        this.y = projectedY;
    }

    // reset toMove for the next keyboard event
    this.toMove.x = 0;
    this.toMove.y = 0;

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {

    // store direction to be moved in the toMove object to be validated later

    if (direction == "left") {
        this.toMove.x -= 101;
    } else if (direction == "up") {
        this.toMove.y -= 95;
    } else if (direction == "right") {
        this.toMove.x += 101;
    } else if (direction == "down") {
        this.toMove.y += 95;
    }

};

Player.prototype.reSpawn = function() {
    // initial position for the player
    this.x = 202;
    this.y = 415;
};

// checkCollisions checks each enemy and see if there's a collison with the player
// it uses simple rectangle collsion detection
function checkCollisions() {
    var currentEnemy;
    for (var i = 0; i < allEnemies.length; i++) {
        currentEnemy = allEnemies[i];
        if ((currentEnemy.x <= player.x + 50) && (currentEnemy.x + 50 >= player.x) && (currentEnemy.y <= player.y + 40) && (currentEnemy.y + 40 >= player.y)) {
            // if collsion, reset player to original start position and no need to check more enemies for collision...enemies keep going
            player.reSpawn();
            break;
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

var allEnemies = []; // used to hold all enemy instances

// spriteSwitcher is used to store the different character sprites.
// When the user successfully reaches the water, player's sprite changes
var spriteSwitcher = ['images/char-princess-girl.png', 'images/char-horn-girl.png'];

for (var i = 0; i < 5; i++) {
    allEnemies.push(new Enemy());
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
