// elementos de HTML
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSing = document.getElementById('gameOver');

//configuraciones del juego
const boardSize = 10;
const gameSpeed = 100;
const squareTypes = {
  emptySquare: 0,
  snakeSquare: 1,
  foodSquare: 2
};

const directions = {
  ArrowUp: -10,
  ArrowDown: 10,
  ArrowRight: 1,
  ArrowLeft: -1,
};

//variables del juego
let snake;
let score;
let direction;
let boardSquares;
let emptySquare;
let moveInterval;

const drawSnake = () => {
  snake.forEach ( square => drawSquare(square, 'snakeSquare'));
}

/*
parametros para rellenar un solo cuadrado del tablero
@params
square: posicion del cuadrado,
type: tipo de cuadrado "vacio", "serpiente", "comida"
*/
const drawSquare = (square, type) => {
  const [ row, column ] = square.split('');
  boardSquares[row][column] = squareTypes[type];
  const squareElement = document.getElementById(square);
  squareElement.setAttribute('class', `square ${type}`);

  if(type === 'emptySquare') {
      emptySquares.push(square);
  } else {
      if(emptySquares.indexOf(square) !== -1) {
          emptySquares.splice(emptySquares.indexOf(square), 1);
      }
  }
}

//mover serpiente
const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction])
    .padStart(2, '0');
  const [row, column] = newSquare.split('');

  if (newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction === 'ArrowRight' && column == 0) ||
    (direction === 'ArrowLeft' && column == 9 ||
    boardSquares[row][column] === squareTypes.snakeSquare)) {
    gameOver();
  } else {
    snake.push(newSquare);
    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();
      drawSquare(emptySquare, 'emptySquare');
    }
    drawSnake();
  }
}

//crear comida nueva
const addFood = () =>{
  score++;
  updateScore();
  createRandomFood();
}

//finaliza el juego funcion
const gameOver = () => {
  gameOverSing.style.display= 'block';
  clearInterval(moveInterval)
  startButton.disabled = false;
}


//funcion para verificar la nueva direccion de la serpiente
const setDirection = newDirection => {
  direction = newDirection;
}

//movimiento de la serpiente
const directionEvent = key => {
  switch (key.code) {
    case 'ArrowUp':
      direction != 'ArrowDown' && setDirection(key.code)
      break;
    case 'ArrowDown':
      direction != 'ArrowUp' && setDirection(key.code)
      break;
    case 'ArrowLeft':
      direction != 'ArrowRight' && setDirection(key.code)
      break;
    case 'ArrowRight':
      direction != 'ArrowLeft' && setDirection(key.code)
      break;
  }
}

//crear lugar en que aparece la comida en el tablero
const createRandomFood = () => {
  const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
  drawSquare(randomEmptySquare, 'foodSquare');
}

//actualizar puntaje
const updateScore = () => {
  scoreBoard.innerText = score-4;
}

//funcion para crear el tablero
const createBoard = () => {
  boardSquares.forEach( (row, rowIndex) => {
    row.forEach( (column, columnIndex) => {
      const squareValue = `${rowIndex}${columnIndex}`;
      const squareElement = document.createElement('div');
      squareElement.setAttribute('class', 'square emptySquare');
      squareElement.setAttribute('id', squareValue);
      board.appendChild(squareElement);
      emptySquares.push(squareValue);
    })
  })
}

//funcion para setear el juego
const setGame = () =>{
  snake = ['00','01','02','03'];
  score = snake.length;
  direction = 'ArrowRight';
  boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
  console.log(boardSquares);
  board.innerHTML = '';
  emptySquares = [];
  createBoard();
}

//funcion que inicia el juego
const startGame = () =>{
  setGame();
  gameOverSing.style.display = 'none';
  startButton.disabled = true;
  drawSnake();
  updateScore();
  createRandomFood();
  document.addEventListener('keydown', directionEvent);
  moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

startButton.addEventListener('click',startGame);