const FR = 60;
let GAME_STATE = 'lobby';

const board = document.getElementById('board');
const currentTurnElement = document.getElementById('current-turn');
const currentTurnImageElement = document.getElementById('current-turn-image');
const configForm = document.getElementById('configForm');
const configFormTitle = document.getElementById('configFormTitle');
const canvas = document.getElementById('canvas');
const stats = document.getElementById('stats');

const players = [
  { x: 0, y: 0, HP: 0, AD: 0, AP: 0, A: 0, MR: 0, IS: 0, state: "ALIVE" },
  { x: 0, y: 0, HP: 0, AD: 0, AP: 0, A: 0, MR: 0, IS: 0, state: "ALIVE" },
  { x: 0, y: 0, HP: 0, AD: 0, AP: 0, A: 0, MR: 0, IS: 0, state: "ALIVE" },
  { x: 0, y: 0, HP: 0, AD: 0, AP: 0, A: 0, MR: 0, IS: 0, state: "ALIVE" }
];

const mobs = [
  {
    name: "Bat",
    HP: 20,
    AD: 10,
    Armor: 1,
    MR: 1,
  },
  {
    name: "Rat",
    HP: 30,
    AD: 12,
    Armor: 2,
    MR: 1,
  },
  {
    name: "Spider",
    HP: 40,
    AD: 15,
    Armor: 1,
    MR: 3,
  },
  {
    name: "Skeleton",
    HP: 50,
    AD: 20,
    Armor: 5,
    MR: 3,
  },
  {
    name: "Mimic",
    HP: 70,
    AD: 20,
    Armor: 5,
    MR: 5,
  },
];

// Define avatar data for different classes
const avatarData = {
  warrior: {
    HP: 330,
    AD: 12,
    AP: 6,
    armor: 6,
    magicResistance: 4,
    itemSlots: 1,
  },
  mage: {
    HP: 300,
    AD: 8,
    AP: 12,
    armor: 4,
    magicResistance: 7,
    itemSlots: 2,
  },
  rogue: {
    HP: 300,
    AD: 8,
    AP: 8,
    armor: 5,
    magicResistance: 5,
    itemSlots: 3,
  },
  paladin: {
    HP: 320,
    AD: 10,
    AP: 6,
    armor: 5,
    magicResistance: 6,
    itemSlots: 1,
  },
};

var maze = [];
var currentPlayer;

function createMaze() {
  // Dungeon Generator -- by David Lopez
  // Modified version of Randomized Prim Algorithm

  function surroundingCells(randWall) {
    let sCells = 0;
    if (maze[randWall[0] - 1][randWall[1]] === 'c') {
      sCells += 1;
    }
    if (maze[randWall[0] + 1][randWall[1]] === 'c') {
      sCells += 1;
    }
    if (maze[randWall[0]][randWall[1] - 1] === 'c') {
      sCells += 1;
    }
    if (maze[randWall[0]][randWall[1] + 1] === 'c') {
      sCells += 1;
    }
    return sCells;
  }

  // Main code
  const cell = 'c';
  const unvisited = 'u';
  const height = 15;
  const width = 15;
  const maze = [];

  // Denote all cells as unvisited
  for (let i = 0; i < height; i++) {
    const line = [];
    for (let j = 0; j < width; j++) {
      line.push(unvisited);
    }
    maze.push(line);
  }

  // Randomize starting point and set it as a cell
  var startingHeight = Math.floor(Math.random() * height);
  var startingWidth = Math.floor(Math.random() * width);
  if (startingHeight === 0) {
    startingHeight += 1;
  }
  if (startingHeight === height - 1) {
    startingHeight -= 1;
  }
  if (startingWidth === 0) {
    startingWidth += 1;
  }
  if (startingWidth === width - 1) {
    startingWidth -= 1;
  }

  // Mark it as a cell and add surrounding walls to the list
  maze[startingHeight][startingWidth] = cell;
  const walls = [];
  walls.push([startingHeight - 1, startingWidth]);
  walls.push([startingHeight, startingWidth - 1]);
  walls.push([startingHeight, startingWidth + 1]);
  walls.push([startingHeight + 1, startingWidth]);

  // Denote walls in the maze
  maze[startingHeight - 1][startingWidth] = 'w';
  maze[startingHeight][startingWidth - 1] = 'w';
  maze[startingHeight][startingWidth + 1] = 'w';
  maze[startingHeight + 1][startingWidth] = 'w';

  while (walls.length > 0) {
    // Pick a random wall
    const randIndex = Math.floor(Math.random() * walls.length);
    const randWall = walls[randIndex];

    if (randWall[1] !== 0) {
      if (maze[randWall[0]][randWall[1] - 1] === 'u' && maze[randWall[0]][randWall[1] + 1] === 'c') {
        // Find the number of surrounding cells
        const sCells = surroundingCells(randWall);

        if (sCells < 2) {
          // Denote the new path
          maze[randWall[0]][randWall[1]] = 'c';

          // Mark the new walls
          // Upper cell
          if (randWall[0] !== 0) {
            if (maze[randWall[0] - 1][randWall[1]] !== 'c') {
              maze[randWall[0] - 1][randWall[1]] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] - 1 && w[1] === randWall[1])) {
              walls.push([randWall[0] - 1, randWall[1]]);
            }
          }

          // Bottom cell
          if (randWall[0] !== height - 1) {
            if (maze[randWall[0] + 1][randWall[1]] !== 'c') {
              maze[randWall[0] + 1][randWall[1]] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] + 1 && w[1] === randWall[1])) {
              walls.push([randWall[0] + 1, randWall[1]]);
            }
          }

          // Leftmost cell
          if (randWall[1] !== 0) {
            if (maze[randWall[0]][randWall[1] - 1] !== 'c') {
              maze[randWall[0]][randWall[1] - 1] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] && w[1] === randWall[1] - 1)) {
              walls.push([randWall[0], randWall[1] - 1]);
            }
          }
        }

        walls.splice(randIndex, 1);
        continue;
      }
    }

    if (randWall[0] !== 0) {
      if (maze[randWall[0] - 1][randWall[1]] === 'u' && maze[randWall[0] + 1][randWall[1]] === 'c') {
        // Find the number of surrounding cells
        const sCells = surroundingCells(randWall);

        if (sCells < 2) {
          // Denote the new path
          maze[randWall[0]][randWall[1]] = 'c';

          // Mark the new walls
          // Upper cell
          if (randWall[0] !== 0) {
            if (maze[randWall[0] - 1][randWall[1]] !== 'c') {
              maze[randWall[0] - 1][randWall[1]] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] - 1 && w[1] === randWall[1])) {
              walls.push([randWall[0] - 1, randWall[1]]);
            }
          }

          // Leftmost cell
          if (randWall[1] !== 0) {
            if (maze[randWall[0]][randWall[1] - 1] !== 'c') {
              maze[randWall[0]][randWall[1] - 1] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] && w[1] === randWall[1] - 1)) {
              walls.push([randWall[0], randWall[1] - 1]);
            }
          }

          // Rightmost cell
          if (randWall[1] !== width - 1) {
            if (maze[randWall[0]][randWall[1] + 1] !== 'c') {
              maze[randWall[0]][randWall[1] + 1] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] && w[1] === randWall[1] + 1)) {
              walls.push([randWall[0], randWall[1] + 1]);
            }
          }
        }

        walls.splice(randIndex, 1);
        continue;
      }
    }

    if (randWall[0] !== height - 1) {
      if (maze[randWall[0] + 1][randWall[1]] === 'u' && maze[randWall[0] - 1][randWall[1]] === 'c') {
        // Find the number of surrounding cells
        const sCells = surroundingCells(randWall);

        if (sCells < 2) {
          // Denote the new path
          maze[randWall[0]][randWall[1]] = 'c';

          // Mark the new walls
          if (randWall[0] !== height - 1) {
            if (maze[randWall[0] + 1][randWall[1]] !== 'c') {
              maze[randWall[0] + 1][randWall[1]] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] + 1 && w[1] === randWall[1])) {
              walls.push([randWall[0] + 1, randWall[1]]);
            }
          }
          if (randWall[1] !== 0) {
            if (maze[randWall[0]][randWall[1] - 1] !== 'c') {
              maze[randWall[0]][randWall[1] - 1] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] && w[1] === randWall[1] - 1)) {
              walls.push([randWall[0], randWall[1] - 1]);
            }
          }
          if (randWall[1] !== width - 1) {
            if (maze[randWall[0]][randWall[1] + 1] !== 'c') {
              maze[randWall[0]][randWall[1] + 1] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] && w[1] === randWall[1] + 1)) {
              walls.push([randWall[0], randWall[1] + 1]);
            }
          }
        }

        walls.splice(randIndex, 1);
        continue;
      }
    }

    if (randWall[1] !== width - 1) {
      if (maze[randWall[0]][randWall[1] + 1] === 'u' && maze[randWall[0]][randWall[1] - 1] === 'c') {
        // Find the number of surrounding cells
        const sCells = surroundingCells(randWall);

        if (sCells < 2) {
          // Denote the new path
          maze[randWall[0]][randWall[1]] = 'c';

          // Mark the new walls
          if (randWall[1] !== width - 1) {
            if (maze[randWall[0]][randWall[1] + 1] !== 'c') {
              maze[randWall[0]][randWall[1] + 1] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] && w[1] === randWall[1] + 1)) {
              walls.push([randWall[0], randWall[1] + 1]);
            }
          }
          if (randWall[0] !== height - 1) {
            if (maze[randWall[0] + 1][randWall[1]] !== 'c') {
              maze[randWall[0] + 1][randWall[1]] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] + 1 && w[1] === randWall[1])) {
              walls.push([randWall[0] + 1, randWall[1]]);
            }
          }
          if (randWall[0] !== 0) {
            if (maze[randWall[0] - 1][randWall[1]] !== 'c') {
              maze[randWall[0] - 1][randWall[1]] = 'w';
            }
            if (!walls.some((w) => w[0] === randWall[0] - 1 && w[1] === randWall[1])) {
              walls.push([randWall[0] - 1, randWall[1]]);
            }
          }
        }

        walls.splice(randIndex, 1);
        continue;
      }
    }

    // Delete the wall from the list anyway
    walls.splice(randIndex, 1);
  }

  // Mark the remaining unvisited cells as walls
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (maze[i][j] === 'u') {
        maze[i][j] = 'w';
      }
    }
  }

  // Set entrance and exit
  for (let i = 0; i < width; i++) {
    if (maze[1][i] === 'c') {
      maze[0][i] = 'c';
      break;
    }
  }

  // Create chambers
  // Up chamber
  for (let i = 0; i < height / 5; i++) {
    for (let j = 0; j < width / 5; j++) {
      maze[i][j] = 'c';
    }
    for (let j = (width - width / 5); j < width; j++) {
      maze[i][j] = 'c';
    }
  }
  // Down chambers
  for (let i = (height - height / 5); i < height; i++) {
    for (let j = 0; j < width / 5; j++) {
      maze[i][j] = 'c';
    }
    for (let j = (width - width / 5); j < width; j++) {
      maze[i][j] = 'c';
    }
  }
  // Main chamber
  for (let i = (2 / 5) * height; i < (3 / 5) * height; i++) {
    for (let j = (2 / 5) * width; j < (3 / 5) * width; j++) {
      maze[i][j] = 'c';
    }
  }

  for (let i = width - 1; i > 0; i--) {
    if (maze[height - 2][i] === 'c') {
      maze[height - 1][i] = 'c';
      break;
    }
  }

  // Find available cells
  const availableCells = [];
  for (let i = 1; i < height - 1; i++) {
    for (let j = 1; j < width - 1; j++) {
      if (maze[i][j] === 'c' &&
        maze[i - 1][j] === 'c' && maze[i + 1][j] === 'c' &&
        maze[i][j - 1] === 'c' && maze[i][j + 1] === 'c') {
        availableCells.push([i, j]);
      }
    }
  }

  // Ensure there are enough available cells for 4 players with a minimum distance of 3 cells
  if (availableCells.length < 4) {
    return maze;
  }

  // Shuffle available cells
  for (let i = availableCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableCells[i], availableCells[j]] = [availableCells[j], availableCells[i]];
  }

  // Place four players with a minimum distance
  for (let i = 0; i <= 3; i++) {
    const [playerY, playerX] = availableCells[i];
    maze[playerY][playerX] = (i + 1).toString();
    players[i].x = playerX;
    players[i].y = playerY;
  }

  return maze;
}

function placeTreasures(maze, numTreasures) {
  const treasures = [];
  for (let i = 0; i < 40; i++) {
    treasures.push(`t${i}`);
  }

  // Define a function to check if a cell is valid for placing treasures
  function isValidCell(x, y) {
    if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length) {
      return false;
    }
    return maze[y][x] === 'c' && !treasures.includes(maze[y][x]);
  }

  const availableCells = [];
  const width = maze[0].length;
  const height = maze.length;

  // Collect all available cell coordinates
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (isValidCell(x, y)) {
        availableCells.push({ x, y });
      }
    }
  }

  const placedTreasures = [];

  // Place the treasures
  for (let i = 0; i < numTreasures; i++) {
    const availableTreasures = availableCells.filter((cell) => {
      // Check if the cell is not adjacent to any existing treasure
      return !placedTreasures.some((placedTreasure) => {
        const dx = Math.abs(placedTreasure.x - cell.x);
        const dy = Math.abs(placedTreasure.y - cell.y);
        return dx <= 1 && dy <= 1;
      });
    });

    if (availableTreasures.length > 0) {
      // Randomly select an available cell for the treasure
      const randomIndex = Math.floor(Math.random() * availableTreasures.length);
      const treasureCell = availableTreasures.splice(randomIndex, 1)[0];
      const { x, y } = treasureCell;
      maze[y][x] = treasures[i + Math.round(Math.random() * 3) * 10];
      placedTreasures.push({ x, y });
    }
  }

  console.log(maze);

  return maze;
}

function rollD6() {
  return (Math.floor(Math.random() * 6) + 1) % 7;
}

function rollD10() {
  return (Math.floor(Math.random() * 10) + 1) % 11;
}

function fightWithMOB(rollResult) {
  alert(`You rolled a 6D 🎲🎲... you've got ${rollResult}`)
  let effectiveDamage = 0;
  let mobIndex = 0;

  switch (rollResult) {
    case 1:
    case 2: {
      alert("You're going to fight a bat! 🦇🦇");
      mobIndex = 0;
    } break;
    case 3:
    case 4: {
      alert("You're going to fight a rat! 🐀🐀");
      mobIndex = 1;
    } break;

    case 5: {
      alert("You're going to fight a spider! 🕷️🕷️");
      mobIndex = 2;
    } break;

    case 6: {
      alert("You're going to fight a skeleton! 💀💀");
      mobIndex = 3;
    } break;

    default: {
      alert("Oh no, a mimic treasure! Fight! 🚫💰");
      mobIndex = 4;
      break;
    }
  }

  if (players[currentPlayer].AD - mobs[mobIndex].Armor > players[currentPlayer].AP - mobs[mobIndex].MR) {
    effectiveDamage = players[currentPlayer].AD - mobs[mobIndex].Armor;
  } else {
    effectiveDamage = players[currentPlayer].AP - mobs[mobIndex].MR
  }

  let totalHits = Math.floor(mobs[mobIndex].HP / effectiveDamage) + 1;
  let receivedDamage = (mobs[mobIndex].AD - players[currentPlayer].A) * totalHits;
  if (receivedDamage < 0) {
    receivedDamage = 0;
  }
  players[currentPlayer].HP -= receivedDamage;

  console.log({ mobdata: mobs[mobIndex], playerdata: players[currentPlayer], battledata: { effectiveDamage: effectiveDamage, totalHits: totalHits, receivedDamage: receivedDamage } });

  if (players[currentPlayer].HP <= 0) {
    alert("You died :c 💀💀");
    players[currentPlayer].state = "DEAD";
    // CHeck if there's a winner
    let survivors = 0;
    let survivorIndex = 0;
    for (let i = 0; i < players.length; i++) {
      if (players[i].state === "ALIVE") {
        survivors++;
        survivorIndex = i;
      }
    }
    if (survivors === 1) {
      alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
      alert("Refresh the window for a new game 🔄🔄");
      updateBoard();
      GAME_STATE = "over";
    }
  } else {
    alert(`You survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[currentPlayer].HP}`);
  }
}

function initGame() {
  maze = createMaze();
  maze = placeTreasures(maze, 10);
  currentPlayer = 0;
}

document.addEventListener("DOMContentLoaded", function () {
  // Add change event listeners to the class selection dropdowns
  for (let i = 1; i <= 4; i++) {
    const classSelect = document.getElementById(`player${i}Class`);
    const classInfo = document.getElementById(`player${i}Info`);

    classSelect.addEventListener("change", function () {
      const selectedClass = classSelect.value;
      const data = avatarData[selectedClass];
      updateClassInfo(classInfo, data, i - 1);
    });

    // Set the initial data for each player
    updateClassInfo(classInfo, avatarData.warrior, i - 1);
  }
});

// Function to update the class info display
function updateClassInfo(classInfo, data, player) {
  classInfo.innerHTML = `
      <p>Health Points (HP): ${data.HP}</p>
      <p>Attack Damage (AD): ${data.AD}</p>
      <p>Ability Power (AP): ${data.AP}</p>
      <p>Armor: ${data.armor}</p>
      <p>Magic Resistance: ${data.magicResistance}</p>
      <p>Item Slots: ${data.itemSlots}</p>
  `;

  players[player].HP = data.HP;
  players[player].AD = data.AD;
  players[player].AP = data.AP;
  players[player].A = data.armor;
  players[player].MR = data.magicResistance;
  players[player].IS = data.itemSlots;
}

configForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission behavior
  createGame();
});

// Set up game
initGame();

document.addEventListener('keydown', keydown);
function keydown(e) {
  if (GAME_STATE === 'play') {
    // Check if current player is dead
    if (players[currentPlayer].state === "DEAD") {
      currentPlayer = (currentPlayer + 1) % 4;
      return;
    }

    // Get the current position of current player
    const x = players[currentPlayer].x;
    const y = players[currentPlayer].y;
    let rolled10 = 0;

    switch (e.keyCode) {
      case 37: { // Left
        if (x > 0 && maze[y][x - 1] !== 'w') {
          // Roll D10
          rolled10 = rollD10();
          alert(`You rolled a D10 🎲🎲... you've got ${rolled10}`);
          if (rolled10 === 10 || rolled10 === 1) {
            fightWithMOB(rollD6());
          }

          players[currentPlayer].x = x - 1;
          maze[y][x] = 'c';

          // Treasure cell
          if (maze[y][x - 1].startsWith('t')) {
            checkTreasure(maze[y][x - 1], currentPlayer);
            maze[y][x - 1] = String(currentPlayer + 1);
            
            // Player cell
          } else if ('1234'.replace(maze[y][x], '').includes(maze[y][x - 1])) {
            let effectiveDamage01;
            let effectiveDamage02;

            alert(`You're going to fight against player ${maze[y][x - 1]} 🔥🔥`);
            if (players[currentPlayer].AD - players[parseInt(maze[y][x - 1]) - 1].A > players[currentPlayer].AP - players[parseInt(maze[y][x - 1]) - 1].MR) {
              effectiveDamage01 = players[currentPlayer].AD - players[parseInt(maze[y][x - 1]) - 1].A;
            } else {
              effectiveDamage01 = players[currentPlayer].AP - players[parseInt(maze[y][x - 1]) - 1].MR;
            }
            if (players[currentPlayer].A - players[parseInt(maze[y][x - 1]) - 1].AD < players[currentPlayer].MR - players[parseInt(maze[y][x - 1]) - 1].AP) {
              effectiveDamage02 = players[parseInt(maze[y][x - 1]) - 1].AD - players[currentPlayer].A;
            } else {
              effectiveDamage02 = players[parseInt(maze[y][x - 1]) - 1].AP - players[currentPlayer].MR;
            }

            relativeHP01 = players[currentPlayer].HP
            relativeHP02 = players[parseInt(maze[y][x - 1]) - 1].HP
            if (relativeHP02 / effectiveDamage01 <= relativeHP01 / effectiveDamage02) {
              // Current player wins. Affect health
              players[parseInt(maze[y][x - 1]) - 1].HP -= 50;
              players[parseInt(maze[y][x - 1]) - 1].x = x;
              players[parseInt(maze[y][x - 1]) - 1].y = y;

              // Swap positions
              maze[y][x] = maze[y][x - 1];
              maze[y][x - 1] = String(currentPlayer + 1);
              
              // Update the current player's turn
              currentPlayer = (currentPlayer + 1) % 4;

              alert("You won the fight! ✌️✌️ Swapping positions and giving damage of 50HP");
              if (players[parseInt(maze[y][x - 1]) - 1].HP <= 0) {
                alert(`Player ${parseInt(maze[y][x - 1]) - 1} died :c 💀💀`);
                players[parseInt(maze[y][x - 1]) - 1].state = "DEAD";
                // Check if there's a winner
                let survivors = 0;
                let survivorIndex = 0;
                for (let i = 0; i < players.length; i++) {
                  if (players[i].state === "ALIVE") {
                    survivors++;
                    survivorIndex = i;
                  }
                }
                if (survivors === 1) {
                  alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
                  alert("Refresh the window for a new game 🔄🔄");
                  updateBoard();
                  GAME_STATE = "over";
                }
              } else {
                alert(`Player ${parseInt(maze[y][x - 1]) - 1} survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[parseInt(maze[y][x - 1]) - 1].HP}`);
              }

            } else {
              // Other player wins
              players[currentPlayer].HP -= 50;
              maze[y][x] = String(currentPlayer + 1);
              players[currentPlayer].x = x;
              players[currentPlayer].y = y;
              alert("You lost the fight! 👎👎 Positions remaind the same and recieving damage of 50HP");
              if (players[currentPlayer].HP <= 0) {
                alert("You died :c 💀💀");
                players[currentPlayer].state = "DEAD";
                // CHeck if there's a winner
                let survivors = 0;
                let survivorIndex = 0;
                for (let i = 0; i < players.length; i++) {
                  if (players[i].state === "ALIVE") {
                    survivors++;
                    survivorIndex = i;
                  }
                }
                if (survivors === 1) {
                  alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
                  alert("Refresh the window for a new game 🔄🔄");
                  updateBoard();
                  GAME_STATE = "over";
                }
              } else {
                alert(`You survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[currentPlayer].HP}`);
              }
              // Update the current player's turn
              currentPlayer = (currentPlayer + 1) % 4;
            }
          } else {
            maze[y][x - 1] = String(currentPlayer + 1);
          }

          // Update the current player's turn
          currentPlayer = (currentPlayer + 1) % 4;
        }
        break;
      }
      case 38: { // Up
        if (y > 0 && maze[y - 1][x] !== 'w') {
          // Roll D10
          rolled10 = rollD10();
          alert(`You rolled a D10 🎲🎲... you've got ${rolled10}`);
          if (rolled10 === 10 || rolled10 === 1) {
            fightWithMOB(rollD6());
          }

          players[currentPlayer].y = y - 1;
          maze[y][x] = 'c';

          if (maze[y - 1][x].startsWith('t')) {
            checkTreasure(maze[y - 1][x], currentPlayer);
            maze[y - 1][x] = String(currentPlayer + 1);
            // Player cell
          } else if ('1234'.replace(maze[y][x], '').includes(maze[y - 1][x])) {
            let effectiveDamage01;
            let effectiveDamage02;

            alert(`You're going to fight against player ${maze[y - 1][x]} 🔥🔥`);
            if (players[currentPlayer].AD - players[parseInt(maze[y - 1][x]) - 1].A > players[currentPlayer].AP - players[parseInt(maze[y - 1][x]) - 1].MR) {
              effectiveDamage01 = players[currentPlayer].AD - players[parseInt(maze[y - 1][x]) - 1].A;
            } else {
              effectiveDamage01 = players[currentPlayer].AP - players[parseInt(maze[y - 1][x]) - 1].MR;
            }
            if (players[currentPlayer].A - players[parseInt(maze[y - 1][x]) - 1].AD < players[currentPlayer].MR - players[parseInt(maze[y - 1][x]) - 1].AP) {
              effectiveDamage02 = players[parseInt(maze[y - 1][x]) - 1].AD - players[currentPlayer].A;
            } else {
              effectiveDamage02 = players[parseInt(maze[y - 1][x]) - 1].AP - players[currentPlayer].MR;
            }

            relativeHP01 = players[currentPlayer].HP
            relativeHP02 = players[parseInt(maze[y - 1][x]) - 1].HP
            if (relativeHP02 / effectiveDamage01 <= relativeHP01 / effectiveDamage02) {
              // Current player wins. Affect health
              players[parseInt(maze[y - 1][x]) - 1].HP -= 50;
              players[parseInt(maze[y - 1][x]) - 1].x = x;
              players[parseInt(maze[y - 1][x]) - 1].y = y;

              // Swap positions
              maze[y][x] = maze[y - 1][x];
              maze[y - 1][x] = String(currentPlayer + 1);

              // Update the current player's turn
              currentPlayer = (currentPlayer + 1) % 4;

              alert("You won the fight! ✌️✌️ Swapping positions and giving damage of 50HP");
              if (players[parseInt(maze[y - 1][x]) - 1].HP <= 0) {
                alert(`Player ${parseInt(maze[y - 1][x]) - 1} died :c 💀💀`);
                players[parseInt(maze[y - 1][x]) - 1].state = "DEAD";
                // Check if there's a winner
                let survivors = 0;
                let survivorIndex = 0;
                for (let i = 0; i < players.length; i++) {
                  if (players[i].state === "ALIVE") {
                    survivors++;
                    survivorIndex = i;
                  }
                }
                if (survivors === 1) {
                  alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
                  alert("Refresh the window for a new game 🔄🔄");
                  updateBoard();
                  GAME_STATE = "over";
                }
              } else {
                alert(`Player ${parseInt(maze[y - 1][x]) - 1} survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[parseInt(maze[y - 1][x]) - 1].HP}`);
              }

            } else {
              // Other player wins
              players[currentPlayer].HP -= 50;
              maze[y][x] = String(currentPlayer + 1);
              players[currentPlayer].x = x;
              players[currentPlayer].y = y;
              alert("You lost the fight! 👎👎 Positions remaind the same and recieving damage of 50HP");
              if (players[currentPlayer].HP <= 0) {
                alert("You died :c 💀💀");
                players[currentPlayer].state = "DEAD";
                // CHeck if there's a winner
                let survivors = 0;
                let survivorIndex = 0;
                for (let i = 0; i < players.length; i++) {
                  if (players[i].state === "ALIVE") {
                    survivors++;
                    survivorIndex = i;
                  }
                }
                if (survivors === 1) {
                  alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
                  alert("Refresh the window for a new game 🔄🔄");
                  updateBoard();
                  GAME_STATE = "over";
                }
              } else {
                alert(`You survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[currentPlayer].HP}`);
              }
              // Update the current player's turn
              currentPlayer = (currentPlayer + 1) % 4;
            }
          } else {
            maze[y - 1][x] = String(currentPlayer + 1);
          }

          // Update the current player's turn
          currentPlayer = (currentPlayer + 1) % 4;
        }
        break;
      }
      case 39: { // Right
        if (x < maze[0].length - 1 && maze[y][x + 1] !== 'w') {
          // Roll D10
          rolled10 = rollD10();
          alert(`You rolled a D10 🎲🎲... you've got ${rolled10}`);
          if (rolled10 === 10 || rolled10 === 1) {
            fightWithMOB(rollD6());
          }

          players[currentPlayer].x = x + 1;
          maze[y][x] = 'c';

          if (maze[y][x + 1].startsWith('t')) {
            checkTreasure(maze[y][x + 1], currentPlayer);
            maze[y][x + 1] = String(currentPlayer + 1);
            // Player cell
          } else if ('1234'.replace(maze[y][x], '').includes(maze[y][x + 1])) {
            let effectiveDamage01;
            let effectiveDamage02;

            alert(`You're going to fight against player ${maze[y][x + 1]} 🔥🔥`);
            if (players[currentPlayer].AD - players[parseInt(maze[y][x + 1]) - 1].A > players[currentPlayer].AP - players[parseInt(maze[y][x + 1]) - 1].MR) {
              effectiveDamage01 = players[currentPlayer].AD - players[parseInt(maze[y][x + 1]) - 1].A;
            } else {
              effectiveDamage01 = players[currentPlayer].AP - players[parseInt(maze[y][x + 1]) - 1].MR;
            }
            if (players[currentPlayer].A - players[parseInt(maze[y][x + 1]) - 1].AD < players[currentPlayer].MR - players[parseInt(maze[y][x + 1]) - 1].AP) {
              effectiveDamage02 = players[parseInt(maze[y][x + 1]) - 1].AD - players[currentPlayer].A;
            } else {
              effectiveDamage02 = players[parseInt(maze[y][x + 1]) - 1].AP - players[currentPlayer].MR;
            }

            relativeHP01 = players[currentPlayer].HP
            relativeHP02 = players[parseInt(maze[y][x + 1]) - 1].HP
            if (relativeHP02 / effectiveDamage01 <= relativeHP01 / effectiveDamage02) {
              // Current player wins. Affect health
              players[parseInt(maze[y][x + 1]) - 1].HP -= 50;
              players[parseInt(maze[y][x + 1]) - 1].x = x;
              players[parseInt(maze[y][x + 1]) - 1].y = y;

              // Swap positions
              maze[y][x] = maze[y][x + 1];
              maze[y][x + 1] = String(currentPlayer + 1);
              // Update the current player's turn
              currentPlayer = (currentPlayer + 1) % 4;

              alert("You won the fight! ✌️✌️ Swapping positions and giving damage of 50HP");
              if (players[parseInt(maze[y][x + 1]) - 1].HP <= 0) {
                alert(`Player ${parseInt(maze[y][x + 1]) - 1} died :c 💀💀`);
                players[parseInt(maze[y][x + 1]) - 1].state = "DEAD";
                // Check if there's a winner
                let survivors = 0;
                let survivorIndex = 0;
                for (let i = 0; i < players.length; i++) {
                  if (players[i].state === "ALIVE") {
                    survivors++;
                    survivorIndex = i;
                  }
                }
                if (survivors === 1) {
                  alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
                  alert("Refresh the window for a new game 🔄🔄");
                  updateBoard();
                  GAME_STATE = "over";
                }
              } else {
                alert(`Player ${parseInt(maze[y][x + 1]) - 1} survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[parseInt(maze[y][x + 1]) - 1].HP}`);
              }

            } else {
              // Other player wins
              players[currentPlayer].HP -= 50;
              maze[y][x] = String(currentPlayer + 1);
              players[currentPlayer].x = x;
              players[currentPlayer].y = y;
              alert("You lost the fight! 👎👎 Positions remaind the same and recieving damage of 50HP");
              if (players[currentPlayer].HP <= 0) {
                alert("You died :c 💀💀");
                players[currentPlayer].state = "DEAD";
                // CHeck if there's a winner
                let survivors = 0;
                let survivorIndex = 0;
                for (let i = 0; i < players.length; i++) {
                  if (players[i].state === "ALIVE") {
                    survivors++;
                    survivorIndex = i;
                  }
                }
                if (survivors === 1) {
                  alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
                  alert("Refresh the window for a new game 🔄🔄");
                  updateBoard();
                  GAME_STATE = "over";
                }
              } else {
                alert(`You survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[currentPlayer].HP}`);
              }
              // Update the current player's turn
              currentPlayer = (currentPlayer + 1) % 4;
            }
          } else {
            maze[y][x + 1] = String(currentPlayer + 1);
          }

          // Update the current player's turn
          currentPlayer = (currentPlayer + 1) % 4;
        }
        break;
      }
      case 40: { // Down
        if (y < maze.length - 1 && maze[y + 1][x] !== 'w') {
          // Roll D10
          rolled10 = rollD10();
          alert(`You rolled a D10 🎲🎲... you've got ${rolled10}`);
          if (rolled10 === 10 || rolled10 === 1) {
            fightWithMOB(rollD6());
          }

          players[currentPlayer].y = y + 1;
          maze[y][x] = 'c';

          if (maze[y + 1][x].startsWith('t')) {
            checkTreasure(maze[y + 1][x], currentPlayer);
            maze[y + 1][x] = String(currentPlayer + 1);
            // Player cell
          } else if ('1234'.replace(maze[y][x], '').includes(maze[y + 1][x])) {
            let effectiveDamage01;
            let effectiveDamage02;

            alert(`You're going to fight against player ${maze[y + 1][x]} 🔥🔥`);
            if (players[currentPlayer].AD - players[parseInt(maze[y + 1][x]) - 1].A > players[currentPlayer].AP - players[parseInt(maze[y + 1][x]) - 1].MR) {
              effectiveDamage01 = players[currentPlayer].AD - players[parseInt(maze[y + 1][x]) - 1].A;
            } else {
              effectiveDamage01 = players[currentPlayer].AP - players[parseInt(maze[y + 1][x]) - 1].MR;
            }
            if (players[currentPlayer].A - players[parseInt(maze[y + 1][x]) - 1].AD < players[currentPlayer].MR - players[parseInt(maze[y + 1][x]) - 1].AP) {
              effectiveDamage02 = players[parseInt(maze[y + 1][x]) - 1].AD - players[currentPlayer].A;
            } else {
              effectiveDamage02 = players[parseInt(maze[y + 1][x]) - 1].AP - players[currentPlayer].MR;
            }

            relativeHP01 = players[currentPlayer].HP
            relativeHP02 = players[parseInt(maze[y + 1][x]) - 1].HP
            if (relativeHP02 / effectiveDamage01 <= relativeHP01 / effectiveDamage02) {
              // Current player wins. Affect health
              players[parseInt(maze[y + 1][x]) - 1].HP -= 50;
              players[parseInt(maze[y + 1][x]) - 1].x = x;
              players[parseInt(maze[y + 1][x]) - 1].y = y;

              // Swap positions
              maze[y][x] = maze[y + 1][x];
              maze[y + 1][x] = String(currentPlayer + 1);
              
              // Update the current player's turn
              currentPlayer = (currentPlayer + 1) % 4;

              alert("You won the fight! ✌️✌️ Swapping positions and giving damage of 50HP");
              if (players[parseInt(maze[y + 1][x]) - 1].HP <= 0) {
                alert(`Player ${parseInt(maze[y + 1][x]) - 1} died :c 💀💀`);
                players[parseInt(maze[y + 1][x]) - 1].state = "DEAD";
                // Check if there's a winner
                let survivors = 0;
                let survivorIndex = 0;
                for (let i = 0; i < players.length; i++) {
                  if (players[i].state === "ALIVE") {
                    survivors++;
                    survivorIndex = i;
                  }
                }
                if (survivors === 1) {
                  alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
                  alert("Refresh the window for a new game 🔄🔄");
                  updateBoard();
                  GAME_STATE = "over";
                }
              } else {
                alert(`Player ${parseInt(maze[y + 1][x]) - 1} survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[parseInt(maze[y + 1][x]) - 1].HP}`);
              }

            } else {
              // Other player wins
              players[currentPlayer].HP -= 50;
              maze[y][x] = String(currentPlayer + 1);
              players[currentPlayer].x = x;
              players[currentPlayer].y = y;
              alert("You lost the fight! 👎👎 Positions remaind the same and recieving damage of 50HP");
              if (players[currentPlayer].HP <= 0) {
                alert("You died :c 💀💀");
                players[currentPlayer].state = "DEAD";
                // CHeck if there's a winner
                let survivors = 0;
                let survivorIndex = 0;
                for (let i = 0; i < players.length; i++) {
                  if (players[i].state === "ALIVE") {
                    survivors++;
                    survivorIndex = i;
                  }
                }
                if (survivors === 1) {
                  alert(`PLAYER ${survivorIndex + 1} is the Dungeon Master! 🎩🎩`);
                  alert("Refresh the window for a new game 🔄🔄");
                  updateBoard();
                  GAME_STATE = "over";
                }
              } else {
                alert(`You survived with a total damage of ${receivedDamage} 👏👏. Remaining HP: ${players[currentPlayer].HP}`);
              }
              // Update the current player's turn
              currentPlayer = (currentPlayer + 1) % 4;
            }
          } else {
            maze[y + 1][x] = String(currentPlayer + 1);
          }

          // Update the current player's turn
          currentPlayer = (currentPlayer + 1) % 4;
        }
        break;
      }
    }
  }
}

// Changes the game state and views
function createGame() {
  // Hide form and show board
  configFormTitle.style.display = "none";
  configForm.style.display = "none";
  canvas.hidden = false;

  GAME_STATE = 'play';
}

setInterval(() => {
  requestAnimationFrame(gameLoop);
}, 1000 / FR);

function gameLoop() {
  if (GAME_STATE === 'play') {
    updateBoard();
  } else if (GAME_STATE === 'over') {
    var winner;
    for (let i = 0; i < players.length; i++) {
      if (players[i].state === "ALIVE") {
        winner = i;
        break;
      }
    }
    currentTurnElement.textContent = `Winner: Player ${winner + 1}`;
    currentTurnImageElement.innerHTML = '<img class="player" x="0" y="0" width="200" height="200" src="./dndgame/assets/player' + (winner + 1) + '.svg"></td>'

    statsString = '<br>'
    for (let i = 0; i < players.length; i++) {
      statsString += `<p>Player ${i + 1}   State:${players[i].state}<br>HP:${players[i].HP}   AD:${players[i].AD}<br>AP:${players[i].AP}   A:${players[i].A}<br>MR:${players[i].MR}   IS:${players[i].IS}</p>`;
    }

    stats.innerHTML = statsString;
  }
}

function checkTreasure(tvalue, playerIndex) {
  if (parseInt(tvalue.replace('t', '')) >= 20) {
    fightWithMOB(0);
    if (players[playerIndex].state === "ALIVE") {
      if (players[playerIndex].IS === 0) {
        alert("You couldn't collect the treasure because you're full of items 🚫🚫");
        return
      }
      players[playerIndex].IS--;
      applyTreasure(tvalue, playerIndex);
    } else {
      return;
    }
  } else if (tvalue === 't0') {
    alert(`You found the winner treasure! Player ${playerIndex} is the Dungeon Master! 🎩🎩`);
    for (let i = 0; i < players.length; i++) {
      if (i !== playerIndex) {
        players[i].HP = 0;
        players[i].state = "DEAD";
      }
    }
    updateBoard();
    GAME_STATE = "over";
  } else {
    if (players[playerIndex].IS === 0) {
      alert("You couldn't collect the treasure because you're full of items 🚫🚫");
      return
    }
    players[playerIndex].IS--;
    applyTreasure(tvalue, playerIndex);
  }
}

function updateBoard() {
  html = '';
  for (let i = 0; i < maze.length; i++) {
    html += '<tr>';
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === 'c') {
        if ((i + j) % 2 === 0) {
          html += '<td><img x="0" y="0" width="40" height="40" src="./dndgame/assets/cell.svg" alt="cell"></td>';
        } else {
          html += '<td><img x="0" y="0" width="40" height="40" src="./dndgame/assets/cell2.svg" alt="cell"></td>';
        }
      } else if (maze[i][j] === 'w') {
        html += '<td><img x="0" y="0" width="40" height="40" src="./dndgame/assets/wall.svg" alt="wall"></td>';
      } else if (maze[i][j] === '1') {
        html += '<td><img class="player" x="0" y="0" width="40" height="40" src="./dndgame/assets/player1.svg" alt="player1"></td>';
      } else if (maze[i][j] === '2') {
        html += '<td><img class="player" x="0" y="0" width="40" height="40" src="./dndgame/assets/player2.svg" alt="player2"></td>';
      } else if (maze[i][j] === '3') {
        html += '<td><img class="player" x="0" y="0" width="40" height="40" src="./dndgame/assets/player3.svg" alt="player3"></td>';
      } else if (maze[i][j] === '4') {
        html += '<td><img class="player" x="0" y="0" width="40" height="40" src="./dndgame/assets/player4.svg" alt="player4"></td>';
      } else if (maze[i][j].includes('t')) {
        html += '<td><img class="treasure" x="0" y="0" width="40" height="40" src="./dndgame/assets/treasure2.svg" alt="treasure"></td>';
      } else {
        html += '<td>&nbsp;</td>';
      }
    }
    html += '</tr>';
  }
  board.innerHTML = html;
  currentTurnElement.textContent = `Current Turn: Player ${currentPlayer + 1} (${players[currentPlayer].state})`;
  currentTurnImageElement.innerHTML = '<img class="player" x="0" y="0" width="200" height="200" src="./dndgame/assets/player' + (currentPlayer + 1) + '.svg"></td>'

  statsString = '<br>'
  for (let i = 0; i < players.length; i++) {
    statsString += `<p>Player ${i + 1}   State:${players[i].state}<br>HP:${players[i].HP}   AD:${players[i].AD}<br>AP:${players[i].AP}   A:${players[i].A}<br>MR:${players[i].MR}   IS:${players[i].IS}</p>`;
  }

  stats.innerHTML = statsString;
}

function applyTreasure(treasure, playerIndex) {
  switch (treasure) {
    case 't1':
    case 't11':
    case 't21':
    case 't31':
      alert("You won +10 HP 💊");
      players[playerIndex].HP += 10;
      break;
    case 't2':
    case 't12':
    case 't22':
    case 't32':
      alert("You won +20 HP 💊💊");
      players[playerIndex].HP += 20;
      break;
    case 't3':
    case 't13':
    case 't23':
    case 't33':
      alert("You won +1 A 🛡️");
      players[playerIndex].A += 1;
      break;
    case 't4':
    case 't14':
    case 't24':
    case 't34':
      alert("You won +2 A 🛡️🛡️");
      players[playerIndex].A += 2;
      break;
    case 't5':
    case 't15':
    case 't25':
    case 't35':
      alert("You won +4 A 🛡️🛡️🛡️🛡️");
      players[playerIndex].A += 4;
      break;
    case 't6':
    case 't16':
    case 't26':
    case 't36':
      alert("You won +1 AD 🥊");
      players[playerIndex].AD += 1;
      break;
    case 't7':
    case 't17':
    case 't27':
    case 't37':
      alert("You won +2 AD 🥊🥊");
      players[playerIndex].AD += 2;
      break;
    case 't8':
    case 't18':
    case 't28':
    case 't38':
      alert("You won +4 AD 🥊🥊🥊🥊");
      players[playerIndex].AD += 4;
      break;
    case 't9':
    case 't19':
    case 't29':
    case 't39':
      alert("Everone gets -10HP 🤒🤒");
      for (let i = 0; i < players.length; i++) {
        if (i !== playerIndex) {
          players[i].HP -= 10;
        }
      }
      break;
  }
}

