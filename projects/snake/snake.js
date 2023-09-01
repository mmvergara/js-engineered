const snakeHeadColor = "greenyellow";
const snakeBodyColor = "green";
const foodColor = "red";

// Board Setup
const blockSize = 25;
const rows = 25;
const cols = 60;
const board = document.getElementById("board");
const scoreText = document.getElementById("score");
board.height = rows * blockSize;
board.width = cols * blockSize;
context = board.getContext("2d");

// Snake Head Location
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let snakeBody = [];

// Snake Direction
let velocityX = 0;
let velocityY = 1;

// Food Location
let foodX;
let foodY;

let score = 0;

let gameOver = false;
const update = () => {
  if (gameOver) return;
  lastLocX = snakeX;
  lastLocY = snakeY;
  // Update Snake Location
  snakeX = snakeX + velocityX * blockSize;
  snakeY = snakeY + velocityY * blockSize;

  // Check if snake died
  if (snakeBody.findIndex(([x, y]) => x == snakeX && y == snakeY) != -1) {
    gameOver = true;
  }
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= cols * blockSize ||
    snakeY >= rows * blockSize
  ) {
    gameOver = true;
  }

  // Check if snake ate the afood
  if (snakeX == foodX && snakeY == foodY) {
    score++;
    scoreText.textContent = score;
    snakeBody.push([lastLocX, lastLocY]);
    placeFood();
  }

  // Render Board Background
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  // Render Snake Body
  context.fillStyle = snakeBodyColor;
  for (let i = 0; i < snakeBody.length; i++) {
    const [x, y] = snakeBody[i];
    context.fillRect(x, y, blockSize, blockSize);
  }

  // Render Snake Head
  context.fillStyle = snakeHeadColor;
  context.fillRect(snakeX, snakeY, blockSize, blockSize);

  // update body
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }
  if (snakeBody.length != 0) {
    snakeBody[0] = [snakeX, snakeY];
  }

  // Render Food
  context.fillStyle = foodColor;
  context.fillRect(foodX, foodY, blockSize, blockSize);
  if (gameOver) {
    alert("Game Over!!!");
    window.location.reload();
    return;
  }
};

const changeDirection = (e) => {
  if (e.code === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  }
  if (e.code === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  }
  if (e.code === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  }
  if (e.code === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

document.addEventListener("keyup", changeDirection);

const placeFood = () => {
  foodX = Math.floor(Math.random() * cols) * blockSize;
  foodY = Math.floor(Math.random() * rows) * blockSize;
};

placeFood();
setInterval(() => {
  update();
}, 38);
