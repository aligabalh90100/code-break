let scoreText = document.querySelector(".score");
let result = document.querySelector(".game-over");
let button = document.querySelector("button");

//board
let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

// player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 10;
let player = {
  x: boardWidth / 2 - playerWidth / 2,
  y: boardHeight - playerHeight - 5,
  width: playerWidth,
  height: playerHeight,
  velocityX: playerVelocityX,
};
// ball
let ballDiameter = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;
let ball = {
  x: boardWidth / 2,
  y: boardHeight / 2,
  diameter: ballDiameter,
  velocityX: ballVelocityX,
  velocityY: ballVelocityY,
};

// blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 3;
let blockMaxRows = 10;
let blockCount = 0;
// starting corners
let blockX = 15;
let blockY = 45;
let score = 0;
let gameOver = false;

window.onload = function () {
  board = document.querySelector("#board");
  board.width = boardWidth;
  board.height = boardHeight;
  context = board.getContext("2d");
  // player
  context.fillStyle = "green";
  context.fillRect(player.x, player.y, player.width, playerHeight);

  requestAnimationFrame(update);
  // target player move
  document.addEventListener("keydown", movePlayer);
  // draw blocks
  createBlocks();
};

// make loop to get the change of positions
function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    result.classList.add("show");
    scoreText.innerHTML = score;
    return;
  }
  context.clearRect(0, 0, board.width, board.height);
  // draw player
  context.fillStyle = "green";
  context.fillRect(player.x, player.y, player.width, playerHeight, 10);

  // ball
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillStyle = "white";
  context.fillRect(ball.x, ball.y, ball.diameter, ball.diameter);
  // bounce ball of walls
  if (ball.y < 0) {
    ball.velocityY *= -1;
  } else if (ball.x + ball.diameter >= 500 || ball.x <= 0) {
    ball.velocityX *= -1;
  } else if (ball.y + ball.diameter >= boardHeight) {
    // game over
    gameOver = true;
  }
  // ball bounce if touch baddle
  if (detectCollision(player, ball)) {
    ball.velocityY *= -1;
  }

  // blocks
  context.fillStyle = "skyblue";
  for (let i = 0; i < blockArray.length; i++) {
    let block = blockArray[i];
    if (!block.break) {
      if (breakCollision(ball, block)) {
        block.break = true;
        ball.velocityY *= -1;
        blockCount -= 1;
        score += 50;
      }
      context.fillRect(block.x, block.y, block.width, block.height);
    }
  }

  context.font = "20px sans-serif";
  context.fillText(score, 10, 25);
}

function movePlayer(e) {
  if (e.key == "ArrowLeft") {
    let playerNextX = player.x - player.velocityX;
    if (!outOfBoundries(playerNextX)) {
      player.x = playerNextX;
    }
  } else if (e.key == "ArrowRight") {
    let playerNextX = player.x + player.velocityX;
    if (!outOfBoundries(playerNextX)) {
      player.x = playerNextX;
    }
  }
}

function outOfBoundries(playerNextX) {
  return playerNextX < 0 || playerNextX + player.width > boardWidth;
}

function detectCollision(player, ball) {
  return (
    ball.x >= player.x &&
    ball.x <= player.x + playerWidth &&
    ball.y + ballDiameter >= player.y
  );
}

function createBlocks() {
  blockArray = [];
  for (let c = 0; c < blockColumns; c++) {
    for (let r = 0; r < blockRows; r++) {
      let block = {
        x: blockX + c * blockWidth + c * 10,
        y: blockY + r * blockHeight + r * 10,
        width: blockWidth,
        height: blockHeight,
        break: false,
      };
      blockArray.push(block);
    }
  }
  blockCount = blockArray.length;
}

function breakCollision(ball, block) {
  return (
    ball.x + ball.diameter >= block.x &&
    ball.x <= block.x + block.width &&
    ball.y + ball.diameter >= block.y &&
    ball.y <= block.y + block.height
  );
}
button.addEventListener("click", () => {
  location.reload();
});
