// Initialize
// Initialize
const n = 100;
const rows = n;
const cols = n;
const blockSize = Math.min(window.innerWidth, window.innerHeight) / n;
const board = document.getElementById("board");
const scoreText = document.getElementById("score");
const btnToggle = document.getElementById("toggle");
board.height = rows * blockSize;
board.width = cols * blockSize;
context = board.getContext("2d");
const neighbors = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
];

let hoverCell = null;
let living = [
  [1, 5],
  [1, 6],
  [2, 5],
  [2, 6],
  [11, 5],
  [11, 6],
  [11, 7],
  [12, 4],
  [12, 8],
  [13, 3],
  [13, 9],
  [14, 3],
  [14, 9],
  [15, 6],
  [16, 4],
  [16, 8],
  [17, 5],
  [17, 6],
  [17, 7],
  [18, 6],
  [21, 3],
  [21, 4],
  [21, 5],
  [22, 3],
  [22, 4],
  [22, 5],
  [23, 2],
  [23, 6],
  [25, 1],
  [25, 2],
  [25, 6],
  [25, 7],
  [35, 3],
  [35, 4],
  [36, 3],
  [36, 4],
];
let isLooping = false;
// Initialize
// Initialize

// Game Loop
render();
setInterval(() => {
  if (!isLooping) return;
  update();
}, 16);
function update() {
  render();
  evaluateGame();
}
// Game Loop
function evaluateGame() {
  // Find all of the spots to evaluate
  let boxesToEvaluate = [];
  living.forEach((lv) => {
    // push the current living cell
    const [x, y] = lv;
    boxesToEvaluate.push([x, y]);

    // push all of the neighbors
    for (let j = 0; j < neighbors.length; j++) {
      const [dx, dy] = neighbors[j];
      newX = dx + x;
      newY = dy + y;
      boxesToEvaluate.push([newX, newY]);
    }
  });

  boxesToEvaluate = removeDuplicates(boxesToEvaluate);
  const newAlives = [];
  // Evaluate the boxes and Find the newAlives
  boxesToEvaluate.forEach((boxToEvaluate) => {
    const [x, y] = boxToEvaluate;
    let neighborsCount = 0;
    // Count all living neighbors
    for (let j = 0; j < neighbors.length; j++) {
      const [dx, dy] = neighbors[j];
      newX = dx + x;
      newY = dy + y;
      if (living.findIndex(([x, y]) => x == newX && y == newY) != -1) {
        neighborsCount++;
      }
    }
    if (living.findIndex(([lx, ly]) => x == lx && y == ly) != -1) {
      // If living
      if (neighborsCount == 2 || neighborsCount == 3) {
        newAlives.push([x, y]);
      }
    } else {
      // If blank
      // populate if has 3 neighbors
      if (neighborsCount === 3) {
        newAlives.push([x, y]);
      }
    }
  });
  console.log(newAlives);
  living = [...newAlives];
}

function fillR(x, y) {
  context.rect(
    x * blockSize + 1,
    y * blockSize + 1,
    blockSize - 2,
    blockSize - 2
  );
}

function render() {
  // Render Board Background
  context.fillStyle = "black";
  context.fillRect(0, 0, board.width, board.height);

  // Render Living
  context.beginPath();
  context.fillStyle = "white";
  living.forEach((lv) => {
    const x = lv[0];
    const y = lv[1];
    fillR(x, y);
  });
  context.fill();
}

function removeDuplicates(arr) {
  const uniqueArray = [];
  const seen = new Set();

  for (const subArray of arr) {
    const subArrayStr = JSON.stringify(subArray); // Convert subarray to a string for easy comparison

    if (!seen.has(subArrayStr)) {
      uniqueArray.push(subArray);
      seen.add(subArrayStr);
    }
  }

  return uniqueArray;
}

// Listeners

board.addEventListener("click", (e) => {
  console.log(e);
});

btnToggle.addEventListener("click", () => {
  isLooping = !isLooping;
  if (isLooping) {
    btnToggle.textContent = "stop";
  } else {
    btnToggle.textContent = "start";
  }
});

document.addEventListener("click", (e) => {
  console.log(e);
});

// How does this thing work lol
function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = evt.clientX - rect.left;
  const mouseY = evt.clientY - rect.top;
  const cellX = Math.floor(mouseX / blockSize);
  const cellY = Math.floor(mouseY / blockSize);
  return [cellX, cellY];
}

//
board.addEventListener("click", function (evt) {
  const [cellX, cellY] = getMousePos(board, evt);
  const idx = living.findIndex(([lx, ly]) => cellX == lx && cellY == ly);
  if (idx == -1) {
    living.push([cellX, cellY]);
  } else {
    const newLiving = [];
    for (let i = 0; i < living.length; i++) {
      const [x, y] = living[i];
      if (x == cellX && y == cellY) continue;
      newLiving.push([x, y]);
    }
    living = [...newLiving];
  }
  console.log(living);
  render();
});

board.addEventListener("mousemove", function (evt) {
  if (isLooping) return;
  const [cellX, cellY] = getMousePos(board, evt);
  // Check if the hover cell has changed
  if (hoverCell === null || hoverCell[0] !== cellX || hoverCell[1] !== cellY) {
    render();
    // Clear the previously hovered cell (if any) and fill the new one with cyan
    if (hoverCell !== null) {
      fillCell(hoverCell[0], hoverCell[1], "black");
      render();
    }
    fillCell(cellX, cellY, "cyan");
    hoverCell = [cellX, cellY];
  }
});

function fillCell(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
}

// Function to add a pattern to the living array at a specific position
function addPattern(pattern, xOffset, yOffset) {
  for (const cell of pattern) {
    const x = cell[0] + xOffset;
    const y = cell[1] + yOffset;
    living.push([x, y]);
  }
}
