const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

let gameInterval; // To store the game interval

// Snake initial position and size
let snake = [{ x: 10, y: 10 }];
let direction = "right";
let snakeSize = 1; // Initial size of the snake

// Food position
let food = { x: 5, y: 5 };

// Sound effects
const popoutSound = document.getElementById("bgmusic");
const coinSound = document.getElementById("coinSound");
const popout=document.getElementById("popout");
// Score variables
let score = 0;
let maxScore = 0;

// Game loop
function gameLoop() {
    moveSnake();
    checkCollision();
    checkFood();
    draw();
}

// Handle keyboard input
window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction !== "down") direction = "up";
            break;
        case "ArrowDown":
            if (direction !== "up") direction = "down";
            break;
        case "ArrowLeft":
            if (direction !== "right") direction = "left";
            break;
        case "ArrowRight":
            if (direction !== "left") direction = "right";
            break;
    }
});

// Move the snake
function moveSnake() {
    let newHead = { ...snake[0] };

    switch (direction) {
        case "up":
            newHead.y--;
            break;
        case "down":
            newHead.y++;
            break;
        case "left":
            newHead.x--;
            break;
        case "right":
            newHead.x++;
            break;
    }

    snake.unshift(newHead);

    // Trim the snake if its size exceeds the specified length
    if (snake.length > snakeSize) {
        snake.pop();
    }

    // Play popout sound when snake moves
    popoutSound.play();
}

// Check for collisions with walls or itself
function checkCollision() {
    if (
        snake[0].x < 0 ||
        snake[0].x >= 20 ||
        snake[0].y < 0 ||
        snake[0].y >= 20 ||
        collisionWithItself()
    ) {
        popoutSound.pause();
        popout.play();
        handleGameOver();
    }
}

// Check if snake collides with itself
function collisionWithItself() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Check if snake eats food
function checkFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        snakeSize++; // Increase snake size
        generateFood();
        // Play coin sound when snake eats the apple
        coinSound.currentTime = 0;
        coinSound.play();
        // Increase the score
        score++;
        // Update the maximum score if needed
        if (score > maxScore) {
            maxScore = score;
        }
    }
}

// Generate random food position
function generateFood() {
    food = { x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) };
}

// Draw the game on the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "#4CAF50";
    snake.forEach((segment) => {
        ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
        ctx.strokeStyle = "#2E7D32";
        ctx.strokeRect(segment.x * 20, segment.y * 20, 20, 20);
    });

    // Draw apple
    ctx.fillStyle = "#FF5733";
    ctx.beginPath();
    ctx.arc((food.x * 20) + 10, (food.y * 20) + 10, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Draw realistic eyes on the snake's head
    const head = snake[0];
    const eyeSize = 3;
    const eyeOffsetX = 5;
    const eyeOffsetY = 5;

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(head.x * 20 + eyeOffsetX, head.y * 20 + eyeOffsetY, eyeSize, 0, 2 * Math.PI);
    ctx.arc(head.x * 20 + 20 - eyeOffsetX, head.y * 20 + eyeOffsetY, eyeSize, 0, 2 * Math.PI);
    ctx.fill();

    // Draw score
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + score, 10, 20);
    ctx.fillText("Max Score: " + maxScore, 10, 40);
}

// Reset the game
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = "right";
    snakeSize = 1;
    generateFood();
    score = 0;
}

// Handle game over
function handleGameOver() {
    alert("Game Over! Your Score: " + score+"\n                    Maxscore is "+maxScore);
    resetGame();
}

// Start the game
function startGame() {
    stopGame(); // Stop the game if already running
    gameInterval = setInterval(gameLoop, 200); // Adjust interval as needed
}

// Stop the game
function stopGame() {
    clearInterval(gameInterval);
}

// Restart the game
function restartGame() {
    stopGame();
    resetGame();
    startGame();
}

// Initially, you can start the game automatically or let the user click the "Play" button
startGame();
