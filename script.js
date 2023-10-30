const size = 4;
const total = size * size;
const container = document.getElementById('game-container');
let cells = [];
let emptyCell = null;
let startTime, endTime;
let timerInterval;

function initializeGame() {
    for (let i = 1; i <= total; i++) {
        const cell = document.createElement('div');
        cell.classList.add('game-cell');
        cell.textContent = i === total ? '' : i;
        cell.addEventListener('click', () => moveCell(cell));
        container.appendChild(cell);
        cells.push(cell);
    }

    shuffleCells();
}


function shuffleCells() {
    
    for (let i = cells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = cells[i].textContent;
        cells[i].textContent = cells[j].textContent;
        cells[j].textContent = temp;
    }
    emptyCell = cells.find(c => c.textContent === '');
    emptyCell.classList.add('game-cell--empty');
}

function moveCell(clickedCell) {
    const emptyCell = cells.find(cell => cell.textContent === '');
    const clickedIndex = cells.indexOf(clickedCell);
    const emptyIndex = cells.indexOf(emptyCell);

    if (canMove(clickedIndex, emptyIndex)) {
        cells[emptyIndex].textContent = clickedCell.textContent;
        cells[emptyIndex].classList.remove('game-cell--empty');
        clickedCell.textContent = '';
        clickedCell.classList.add('game-cell--empty');
        
    }
    checkWinCondition();
}

function canMove(clickedIndex, emptyIndex) {
    const colDiff = Math.abs((clickedIndex % size) - (emptyIndex % size));
    const rowDiff = Math.abs(Math.floor(clickedIndex / size) - Math.floor(emptyIndex / size));
    return (colDiff === 1 && rowDiff === 0) || (rowDiff === 1 && colDiff === 0);
}

function checkWinCondition() {
    const isSorted = cells.every((cell, index) => {
        if (index === cells.length - 1) return cell.textContent === ''; 
        return cell.textContent === '' || parseInt(cell.textContent, 10) === index + 1;
    });

    if (isSorted) {
        stopTimer();
    }
}


function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = Date.now();
    const elapsedTime = new Date(currentTime - startTime);
    const minutes = elapsedTime.getUTCMinutes();
    const seconds = elapsedTime.getUTCSeconds();
    document.getElementById('timer').innerText = `${minutes} min ${seconds} seg`;
}

function stopTimer() {
    endTime = Date.now();
    clearInterval(timerInterval);
    const totalElapsedTime = new Date(endTime - startTime);
    const minutes = totalElapsedTime.getUTCMinutes();
    const seconds = totalElapsedTime.getUTCSeconds();
    const completionMessage = `${minutes} minutos ${seconds} segundos.`;
    document.getElementById('timer').innerText =  completionMessage;
    showModal(completionMessage);
}

function showModal(message) {
    const modal = document.getElementById('modal');
    const completionMessageElement = document.getElementById('completionMessage');
    completionMessageElement.textContent = message;
    modal.style.display = 'block';
}

document.getElementById('close').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

function resetGame() {
    cells.forEach(cell => cell.remove());
    cells = []; 
    emptyCell = null; 
    initializeGame();
}

document.getElementById('startButton').addEventListener('click', function(){
    startTimer();
    initializeGame();
    document.getElementById('timer').style.display = 'block'; 
    document.getElementById('startButton').style.display = 'none'; 
    document.getElementById('restartButton').style.display = 'block'; 

});

document.getElementById('restartButton').addEventListener('click', function() {
    startTimer();
   resetGame();
});