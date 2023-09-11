alert("Good luck!"); // Of course you can remove this (annoying) line ;)

// random integer
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getRandom = (max) => {
  return Math.floor(Math.random() * max);
};
// hidden mine location to check against

const newGame = (h = 16, w = 30, m = 99) => {
  const x = w;
  const y = h;
  const numberOfMines = m;
  const squares = x * y;
  const minelocation = {};
  let running = true;

  // create the table
  const generateTable = () => {
    let tableKey = 1;
    let tableString = "";
    // creating the table based on x and y
    for (let yi = 0; yi < y; yi += 1) {
      tableString += "<tr>";
      for (let xi = 0; xi < x; xi += 1) {
        tableString += `<td class="unopened" id="${tableKey}"></td>`;
        tableKey += 1;
      }
      tableString += "</tr>";
    }
    // set HTML to show game
    document.querySelector('#minesweeper').innerHTML = tableString;
  };

  // create the flag counter
  const updateFlagCounter = () => {
    const flaggedCounter = Array.from(tiles).filter(tiles => tiles.classList.contains('flagged')).length;
    document.querySelector('#bomb-counter').innerText = `Bomb Counter: ${numberOfMines - flaggedCounter}`;
  };

  // mine location
  const createMineLocation = () => {
    // create mine location
    const times = squares;
    for (let i = 0; i < times; i += 1) {
      minelocation[(i + 1)] = false;
    }

    const activeMines = () => {
      return Object.values(minelocation).reduce((sum, cell) => sum + (cell === true ? 1 : 0), 0);
    };

    let n = activeMines();
    while (n !== numberOfMines) {
      minelocation[getRandom(squares)] = true;
      n = activeMines();
    }
  };


  const checkIsMine = (tile) => {
    return minelocation[tile.id] === true;
  };

  const getSurroundingTiles = (clickedTile) => {
    const clickedTileCoordinate = {
      x: clickedTile.cellIndex,
      y: clickedTile.parentElement.rowIndex
    };
    let surroundingTiles = [];
    tiles.forEach((tile) => {
      const tileCoordinate = {
        x: tile.cellIndex,
        y: tile.parentElement.rowIndex
      };
      if (Math.abs(clickedTileCoordinate.x - tileCoordinate.x) < 2
      && Math.abs(clickedTileCoordinate.y - tileCoordinate.y) < 2) {
        surroundingTiles.push(tile);
      }
    });

    return surroundingTiles.filter(tile => tile !== clickedTile);
  };


  const checkSurrounding = (clickedTile) => {
    let surroundingBombs = 0;
    const surroundingTiles = getSurroundingTiles(clickedTile);
    surroundingTiles.forEach((tile) => {
      if (checkIsMine(tile)) {
        surroundingBombs += 1;
      }
    });
    return surroundingBombs;
  };

  const checkResult = () => {
    tiles.forEach((tile) => {
      if (tile.classList.contains('mine')) {
        running = false;
        tiles.forEach((tile) => {
          if (checkIsMine(tile)) {
            tile.classList.add('mine');
          }
        });
      }
    });
    if (running === false) { alert('BOOM! You Lose!'); }
  };

  const reveal = (clickedTile) => {
  // check if bomb, if yes. game end
    if (checkIsMine(clickedTile)) {
      clickedTile.classList.remove('unopened');
      clickedTile.classList.add('mine');
    } else {
      // check if surrounding # of bombs
      const surroundingBombs = checkSurrounding(clickedTile);
      // show clue
      clickedTile.classList.remove('unopened');
      clickedTile.classList.add(`mine-neighbour-${surroundingBombs}`);

      if (surroundingBombs === 0) {
        const surroundingTiles = getSurroundingTiles(clickedTile);
        surroundingTiles.forEach(tile => {
          if (tile.classList.contains('unopened')) {
            reveal(tile);
          }
        });
      }
    }
    checkResult();
  };

  const initiateGame = () => {
    tiles.forEach((tile) => {
      tile.addEventListener('click', (event) => {
        console.log("click");
        const clickedTile = event.currentTarget;
        if (clickedTile.classList.contains('unopened')) {
          if (event.shiftKey === true) {
            clickedTile.classList.toggle('flagged');
            updateFlagCounter();
          } else if (!clickedTile.classList.contains('flagged')) {
            reveal(clickedTile);
          }
        }
      });
    });
  };

  generateTable();
  const tiles = document.querySelectorAll('td');
  createMineLocation();
  updateFlagCounter();
  initiateGame();
};


document.querySelector('#btn-new-game').addEventListener('click', (event) => {
  event.preventDefault();
  const difficulties = document.querySelector("#difficulties").value;
  if (difficulties === '1') {
    newGame(8, 8, 10);
  } if (difficulties === '2') {
    newGame(9, 9, 10);
  } if (difficulties === '3') {
    newGame(16, 16, 40);
  } if (difficulties === '4') {
    newGame(16, 30, 99);
  }
});

newGame();
