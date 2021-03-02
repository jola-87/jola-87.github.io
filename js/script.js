// get a handle to the canvas context
var canvas = document.getElementById("game");
var context = canvas.getContext("2d");

var earthImage = new Image();
earthImage.src = "./img/earth.png";

var sprite = new Image();
sprite.src = "./img/alien.png"; // Frames 1 to 6

// Default GamerInput is set to None
var gamerInput = new GamerInput("None"); //No Input

var background = new Image();
background.src = "./img/space.jpg";


var score = 0;

function onPageLoad() {
    // Using JSON and Local Storage for GameState Management
    var gameObjects = {
        'pawn': 1,
        'worker': 2,
        'boss': 3
    };

    // Game objects as JSON
    localStorage.setItem('gameObjects', JSON.stringify(gameObjects));

    // Retrieve Games object as from storage
    var npcObjects = localStorage.getItem('gameObjects');

    console.log('npcObjects: ', JSON.parse(npcObjects));

    // Reading Level Information from a file
    var readJSONFromURL = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';

        xhr.onload = function() {
            var status = xhr.status;
            if (status == 200) {
                callback(null, xhr.response);
            } else {
                callback(status);
            }
        };

        xhr.send();
    };

    readJSONFromURL('./data/level.json', function(err, data) {
        if (err != null) {
            console.error(err);
        } else {
            var text = data["Pawns"];
            console.log(text);
            var text = data["Grunts"];
            console.log(text);
            var text = data["Boss"];
            console.log(text);
        }
    });

    // Reading File from a Server

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            //document.getElementById("NPC").innerHTML = data[0];
        }
    };
    xmlhttp.open("GET", "./data/level.json", true);
    xmlhttp.send();

    updateScore();

}

function buttonOnClick() {

    console.log("Button Pressed");
    updateScore();
}

function updateScore() {
    var current_score = localStorage.getItem('score');

    if (isNaN(current_score)) {
        localStorage.setItem('score', 0);
        document.getElementById("SCORE").innerHTML = " Score: " + current_score;
    } else {
        localStorage.setItem('score', parseInt(current_score) + 1);
        document.getElementById("SCORE").innerHTML = " Score: " + current_score;
    }

}

function GameObject(name, image, health) {
    this.name = name;
    this.image = image;
    this.health = health;
    this.x = 0;
    this.y = 120;
}

// The GamerInput is an Object that holds the Current
// GamerInput (Left, Right, Up, Down)
function GamerInput(input) {
    this.action = input;
}

//this function acts when we push down the Y button
function buttonOnClickUp() {
    gamerInput = new GamerInput("Up");
}
// this acts when pushing X 

function buttonOnClickLeft() {
    gamerInput = new GamerInput("Left");
}

function buttonOnClickRight() {
    gamerInput = new GamerInput("Right");
}

function buttonOnClickDown() {
    gamerInput = new GamerInput("Down");
}

function buttonNotPushed() {
    gamerInput = new GamerInput("None");
    console.log("Action stoped");
}

var moveUp = document.getElementById("buttonUp");

moveUp.addEventListener("mousedown", buttonOnClickUp);
moveUp.addEventListener("mouseup", buttonNotPushed);

var moveDown = document.getElementById("buttonDown");

moveDown.addEventListener("mousedown", buttonOnClickDown);
moveDown.addEventListener("mouseup", buttonNotPushed);

var moveLeft = document.getElementById("buttonLeft");

moveLeft.addEventListener("mousedown", buttonOnClickLeft);
moveLeft.addEventListener("mouseup", buttonNotPushed);

var moveRight = document.getElementById("buttonRight");

moveRight.addEventListener("mousedown", buttonOnClickRight);
moveRight.addEventListener("mouseup", buttonNotPushed);

// Default Player
var player = new GameObject("Player", "alien.png", 100);

// Gameobjects is a collection of the Actors within the game
var gameobjects = [player, new GameObject("planetImage", "saturn.png", 100)];

gameobjects[1].x = 500;
gameobjects[1].y = 350;
// Process keyboard input event
function input(event) {
    // Take Input from the Player
    // console.log("Input");
    // console.log("Event type: " + event.type);


    if (event.type === "keydown") {
        switch (event.keyCode) {
            case 37:
                gamerInput = new GamerInput("Left");
                break; //Left key
            case 38:
                gamerInput = new GamerInput("Up");
                break; //Up key
            case 39:
                gamerInput = new GamerInput("Right");
                break; //Right key
            case 40:
                gamerInput = new GamerInput("Down");
                break; //Down key
            default:
                gamerInput = new GamerInput("None"); //No Input
        }
    } else {
        gamerInput = new GamerInput("None"); //No Input
    }
    // console.log("Gamer Input :" + gamerInput.action);
}

function update() {
    // Iterate through all GameObjects
    // Updating position and gamestate
    // console.log("Update");


    if (gamerInput.action === "Up") {
        gameobjects[0].y -= 3;

    }

    if (gamerInput.action === "Right") {
        gameobjects[0].x += 3;

    }
    if (gamerInput.action === "Left") {
        gameobjects[0].x -= 3;

    }
    if (gamerInput.action === "Down") {
        gameobjects[0].y += 3;

    }

    if (gameobjects[1].x < gameobjects[0].x + 100 && gameobjects[0].x < 600 && gameobjects[0].y + 100 > gameobjects[1].y && gameobjects[0].y < 450) {
        // console.log("OOPS!");
    }

    for (i = 0; i < gameobjects.length; i++) {
        //console.log(gameobjects[i].x);
        //console.log(gameobjects[i].y);
    }

}


// Draw GameObjects to Console
// Modify to Draw to Screen
function draw() {
    // Clear Canvas
    // Iterate through all GameObjects
    // Draw each GameObject

    context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    for (i = 0; i < gameobjects.length; i++) {
        if (gameobjects[i].health > 0) {
            // console.log("Image :" + gameobjects[i].img);
        }
    }

    context.drawImage(earthImage, gameobjects[1].x, gameobjects[1].y);

    animate();
    drawHealthbar();

}

// Total Frames
var frames = 6;
// Current Frame
var currentFrame = 0;
// X axis to Draw from
//var sprite_x = 0;

// Initial time set
var initial = new Date().getTime();
//var current; // current time


function animate() {
    // current = new Date().getTime(); // update current
    // if (current - initial >= 500) { // check is greater that 500 ms
    //     currentFrame = (currentFrame + 1) % frames; // update frame
    //     initial = current; // reset initial
    // }
    // Draw sprite frame
    context.drawImage(sprite, (sprite.width / 6) * currentFrame, 0, 100, 100, gameobjects[0].x, gameobjects[0].y, 100, 100);
}

function gameloop() {
    update();
    draw();

    window.requestAnimationFrame(gameloop);
}

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);

// Handle Keypressed
window.addEventListener('keyup', input);
window.addEventListener('keydown', input);

// Update Heads Up Display with Weapon Information
function weaponSelection() {
    var selection = document.getElementById("equipment").value;
    var active = document.getElementById("active");
    if (active.checked == true) {
        document.getElementById("topTxt").innerHTML = selection + " active ";
        console.log("Weapon Active");
    } else {
        document.getElementById("topTxt").innerHTML = selection + " selected ";
        console.log("Weapon Selected");
    }
}


// Array of Weapon Options
var options = [{
        "text": "Select a Weapon",
        "value": "No Weapon",
        "selected": true
    },
    {
        "text": "Spear",
        "value": "Javelin"
    },
    {
        "text": "Sword",
        "value": "Longsword"
    },
    {
        "text": "Crossbow",
        "value": "Pistol crossbow"
    }
];

var selectBox = document.getElementById('equipment');

for (var i = 0; i < options.length; i++) {
    var option = options[i];
    selectBox.options.add(new Option(option.text, option.value, option.selected));
}

// Draw a HealthBar on Canvas, can be used to indicate players health
function drawHealthbar() {
    var width = 100;
    var height = 20;
    var max = 100;
    var val = 65;

    // Draw the background
    context.fillStyle = "darkgrey";
    context.fillRect(20, 20, width, height);

    // Draw the fill
    context.fillStyle = "#17dd10";
    var fillVal = Math.min(Math.max(val / max, 0), 1);
    context.fillRect(20, 20, fillVal * width, height);
}