document.addEventListener('DOMContentLoaded', () => {
   
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let gameOver = false;
    let gameWon = false;
    let moved = false;
    let history = [];
    let touchStartX, touchStartY, touchEndX, touchEndY;
    
   
    const body = document.body;
    
   
    const container = document.createElement('div');
    container.className = 'container';
    body.appendChild(container);
   
    const header = document.createElement('div');
    header.className = 'header';
    
    const title = document.createElement('h1');
    title.textContent = '2048';
    
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'score-container';
    
    const scoreTitle = document.createElement('div');
    scoreTitle.className = 'score-title';
    scoreTitle.textContent = 'Счёт';
    
    const scoreElement = document.createElement('div');
    scoreElement.id = 'score';
    scoreElement.textContent = '0';
    
    scoreContainer.appendChild(scoreTitle);
    scoreContainer.appendChild(scoreElement);
    
    header.appendChild(title);
    header.appendChild(scoreContainer);
    container.appendChild(header);
    
   
    const controls = document.createElement('div');
    controls.className = 'controls';
    
    const newGameBtn = document.createElement('button');
    newGameBtn.className = 'btn';
    newGameBtn.textContent = 'Новая игра';
    newGameBtn.addEventListener('click', newGame);
    
    const undoBtn = document.createElement('button');
    undoBtn.className = 'btn';
    undoBtn.textContent = 'Отмена хода';
    undoBtn.addEventListener('click', undoMove);
    
    const leaderboardBtn = document.createElement('button');
    leaderboardBtn.className = 'btn';
    leaderboardBtn.textContent = 'Таблица лидеров';
    leaderboardBtn.addEventListener('click', showLeaderboard);
    
    controls.appendChild(newGameBtn);
    controls.appendChild(undoBtn);
    controls.appendChild(leaderboardBtn);
    container.appendChild(controls);
    
   
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    
    const gridElement = document.createElement('div');
    gridElement.className = 'grid';
    
    
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridElement.appendChild(cell);
    }
    
    gameContainer.appendChild(gridElement);
    
   
    const gameMessage = document.createElement('div');
    gameMessage.className = 'game-message';
    
    const messageTitle = document.createElement('h2');
    messageTitle.textContent = 'Игра окончена!';
    
    const messageText = document.createElement('p');
    messageText.textContent = 'Ваш счёт: ';
    
    const scoreSpan = document.createElement('span');
    scoreSpan.id = 'final-score';
    messageText.appendChild(scoreSpan);
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'name-input';
    nameInput.placeholder = 'Введите ваше имя';
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn';
    saveBtn.textContent = 'Сохранить результат';
    saveBtn.addEventListener('click', saveScore);
    
    const restartBtn = document.createElement('button');
    restartBtn.className = 'btn';
    restartBtn.textContent = 'Начать заново';
    restartBtn.addEventListener('click', newGame);
    
    gameMessage.appendChild(messageTitle);
    gameMessage.appendChild(messageText);
    gameMessage.appendChild(nameInput);
    gameMessage.appendChild(saveBtn);
    gameMessage.appendChild(restartBtn);
    
    gameContainer.appendChild(gameMessage);
    container.appendChild(gameContainer);
    
    
    const leaderboard = document.createElement('div');
    leaderboard.className = 'leaderboard';
    
    const leaderboardContent = document.createElement('div');
    leaderboardContent.className = 'leaderboard-content';
    
    const leaderboardTitle = document.createElement('h2');
    leaderboardTitle.textContent = 'Таблица лидеров';
    
    const leaderboardTable = document.createElement('table');
    
    
    const tableHead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const placeHeader = document.createElement('th');
    placeHeader.textContent = 'Место';
    
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Имя';
    
    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Счёт';
    
    const dateHeader = document.createElement('th');
    dateHeader.textContent = 'Дата';
    
    headerRow.appendChild(placeHeader);
    headerRow.appendChild(nameHeader);
    headerRow.appendChild(scoreHeader);
    headerRow.appendChild(dateHeader);
    tableHead.appendChild(headerRow);
    
    const tableBody = document.createElement('tbody');
    tableBody.id = 'leaderboard-body';
    
    leaderboardTable.appendChild(tableHead);
    leaderboardTable.appendChild(tableBody);
    
    const closeLeaderboardBtn = document.createElement('button');
    closeLeaderboardBtn.className = 'btn';
    closeLeaderboardBtn.textContent = 'Закрыть';
    closeLeaderboardBtn.addEventListener('click', () => {
        leaderboard.classList.remove('active');
    });
    
    const instructions = document.createElement('div');
   
    leaderboardContent.appendChild(leaderboardTitle);
    leaderboardContent.appendChild(leaderboardTable);
    leaderboardContent.appendChild(closeLeaderboardBtn);
    leaderboardContent.appendChild(instructions);
    
    leaderboard.appendChild(leaderboardContent);
    body.appendChild(leaderboard);
    
    
    function initGame() {
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        score = 0;
        gameOver = false;
        gameWon = false;
        moved = false;
        history = [];
        
        updateScore();
        clearGrid();
        addRandomTile();
        addRandomTile();
        updateGrid();
        
        
        saveGameState();
    }
    
    
    function clearGrid() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.remove());
    }
    
   
    function updateGrid() {
        clearGrid();
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${grid[row][col]}`;
                    tile.textContent = grid[row][col];
                    
                   
                    const cellSize = gridElement.offsetWidth / gridSize;
                    tile.style.width = `${cellSize - 10}px`;
                    tile.style.height = `${cellSize - 10}px`;
                    tile.style.top = `${row * cellSize + 10}px`;
                    tile.style.left = `${col * cellSize + 10}px`;
                    
                    gameContainer.appendChild(tile);
                }
            }
        }
    }
    
    function addRandomTile() {
        const emptyCells = [];
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 0) {
                    emptyCells.push({ row, col });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    function saveGameState() {
        const gameState = {
            grid: JSON.parse(JSON.stringify(grid)),
            score: score,
            history: JSON.parse(JSON.stringify(history))
        };
        
        localStorage.setItem('game2048', JSON.stringify(gameState));
    }
    
    function loadGameState() {
        const savedState = localStorage.getItem('game2048');
        
        if (savedState) {
            const gameState = JSON.parse(savedState);
            grid = gameState.grid;
            score = gameState.score;
            history = gameState.history;
            
            updateScore();
            updateGrid();
        } else {
            initGame();
        }
    }
    
    function updateScore() {
        scoreElement.textContent = score;
    }
    
    
    function moveLeft() {
        moved = false;
        
        for (let row = 0; row < gridSize; row++) {
            
            const newRow = grid[row].filter(cell => cell !== 0);
            
            
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    score += newRow[i];
                    newRow.splice(i + 1, 1);
                    moved = true;
                }
            }
            
          
            while (newRow.length < gridSize) {
                newRow.push(0);
            }
            
            if (JSON.stringify(grid[row]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            
            grid[row] = newRow;
        }
        
        return moved;
    }
    
    
    function moveRight() {
        moved = false;
        
        for (let row = 0; row < gridSize; row++) {
            
            const newRow = grid[row].filter(cell => cell !== 0);
            
            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    score += newRow[i];
                    newRow.splice(i - 1, 1);
                    moved = true;
                    i--; 
                }
            }
            
           
            while (newRow.length < gridSize) {
                newRow.unshift(0);
            }
            
            if (JSON.stringify(grid[row]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            
            grid[row] = newRow;
        }
        
        return moved;
    }
    
    
    function moveUp() {
        moved = false;
        
        for (let col = 0; col < gridSize; col++) {
            
            const column = [];
            for (let row = 0; row < gridSize; row++) {
                if (grid[row][col] !== 0) {
                    column.push(grid[row][col]);
                }
            }
            
            
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            while (column.length < gridSize) {
                column.push(0);
            }
            
           
            for (let row = 0; row < gridSize; row++) {
                if (grid[row][col] !== column[row]) {
                    moved = true;
                }
                grid[row][col] = column[row];
            }
        }
        
        return moved;
    }
    
   
    function moveDown() {
        moved = false;
        
        for (let col = 0; col < gridSize; col++) {
            
            const column = [];
            for (let row = 0; row < gridSize; row++) {
                if (grid[row][col] !== 0) {
                    column.push(grid[row][col]);
                }
            }
            
            
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    score += column[i];
                    column.splice(i - 1, 1);
                    moved = true;
                    i--; 
                }
            }
            
            while (column.length < gridSize) {
                column.unshift(0);
            }
            
           
            for (let row = 0; row < gridSize; row++) {
                if (grid[row][col] !== column[row]) {
                    moved = true;
                }
                grid[row][col] = column[row];
            }
        }
        
        return moved;
    }
    
   
    function canMove() {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 0) {
                    return true;
                }
            }
        }
        
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize - 1; col++) {
                if (grid[row][col] === grid[row][col + 1]) {
                    return true;
                }
            }
        }
        
       
        for (let col = 0; col < gridSize; col++) {
            for (let row = 0; row < gridSize - 1; row++) {
                if (grid[row][col] === grid[row + 1][col]) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
   
    function handleMove(direction) {
        if (gameOver) return;
        
        
        const prevState = {
            grid: JSON.parse(JSON.stringify(grid)),
            score: score
        };
        
        let moved = false;
        
        switch (direction) {
            case 'left':
                moved = moveLeft();
                break;
            case 'right':
                moved = moveRight();
                break;
            case 'up':
                moved = moveUp();
                break;
            case 'down':
                moved = moveDown();
                break;
        }
        
        if (moved) {
            history.push(prevState);
           
            if (history.length > 10) {
                history.shift();
            }
            
            addRandomTile();
            updateScore();
            updateGrid();
            saveGameState();
            
            
            if (!gameWon) {
                for (let row = 0; row < gridSize; row++) {
                    for (let col = 0; col < gridSize; col++) {
                        if (grid[row][col] === 2048) {
                            gameWon = true;
                            showGameMessage('Поздравляем! Вы достигли 2048!', false);
                        }
                    }
                }
            }
            
            
            if (!canMove()) {
                gameOver = true;
                showGameMessage('Игра окончена!', true);
            }
        }
    }
    
    
    function undoMove() {
        if (history.length > 0 && !gameOver) {
            const prevState = history.pop();
            grid = prevState.grid;
            score = prevState.score;
            
            updateScore();
            updateGrid();
            saveGameState();
        }
    }
    
   
    function newGame() {
        gameMessage.classList.remove('active');
        initGame();
    }
    
   
    function showGameMessage(message, isGameOver) {
        messageTitle.textContent = message;
        document.getElementById('final-score').textContent = score;
        
        if (isGameOver) {
            nameInput.style.display = 'block';
            saveBtn.style.display = 'block';
        } else {
            nameInput.style.display = 'none';
            saveBtn.style.display = 'none';
        }
        
        gameMessage.classList.add('active');
    }
    
    
    function saveScore() {
        const name = nameInput.value.trim();
        
        if (name === '') {
            alert('Пожалуйста, введите ваше имя');
            return;
        }
        
       
        const leaderboardData = JSON.parse(localStorage.getItem('leaderboard2048')) || [];
        
        leaderboardData.push({
            name: name,
            score: score,
            date: new Date().toLocaleDateString('ru-RU')
        });
        
       
        leaderboardData.sort((a, b) => b.score - a.score);
        
       
        if (leaderboardData.length > 10) {
            leaderboardData.splice(10);
        }
        
      
        localStorage.setItem('leaderboard2048', JSON.stringify(leaderboardData));
        
       
        nameInput.style.display = 'none';
        saveBtn.style.display = 'none';
        messageTitle.textContent = 'Ваш рекорд сохранен!';
    }
    
    
    function showLeaderboard() {
        const leaderboardBody = document.getElementById('leaderboard-body');
        leaderboardBody.innerHTML = '';
        
        const leaderboardData = JSON.parse(localStorage.getItem('leaderboard2048')) || [];
        
        if (leaderboardData.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'Пока нет рекордов';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            leaderboardBody.appendChild(row);
        } else {
            leaderboardData.forEach((entry, index) => {
                const row = document.createElement('tr');
                
                const placeCell = document.createElement('td');
                placeCell.textContent = index + 1;
                
                const nameCell = document.createElement('td');
                nameCell.textContent = entry.name;
                
                const scoreCell = document.createElement('td');
                scoreCell.textContent = entry.score;
                
                const dateCell = document.createElement('td');
                dateCell.textContent = entry.date;
                
                row.appendChild(placeCell);
                row.appendChild(nameCell);
                row.appendChild(scoreCell);
                row.appendChild(dateCell);
                
                leaderboardBody.appendChild(row);
            });
        }
        
        leaderboard.classList.add('active');
    }
    
   
    document.addEventListener('keydown', (e) => {
        if (gameOver && !gameMessage.classList.contains('active')) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                handleMove('left');
                break;
            case 'ArrowRight':
                handleMove('right');
                break;
            case 'ArrowUp':
                handleMove('up');
                break;
            case 'ArrowDown':
                handleMove('down');
                break;
        }
    });
    
    gameContainer.addEventListener('touchstart', (e) => {
        if (gameOver && !gameMessage.classList.contains('active')) return;
        
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    gameContainer.addEventListener('touchend', (e) => {
        if (gameOver && !gameMessage.classList.contains('active')) return;
        
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const minSwipeDistance = 30; 
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
          
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    handleMove('right');
                } else {
                    handleMove('left');
                }
            }
        } else {
            
            if (Math.abs(diffY) > minSwipeDistance) {
                if (diffY > 0) {
                    handleMove('down');
                } else {
                    handleMove('up');
                }
            }
        }
    }
   
    loadGameState();
});