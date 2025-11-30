document.addEventListener('DOMContentLoaded', () => {
    // Основные переменные
    const gridSize = 4;
    let grid = [];
    let score = 0;
    let gameOver = false;
    let gameWon = false;
    let moved = false;
    let history = [];
    let touchStartX, touchStartY, touchEndX, touchEndY;
    
    // Создание DOM элементов
    const body = document.body;
    
    // Создание контейнера
    const container = document.createElement('div');
    container.className = 'container';
    body.appendChild(container);
    
    // Создание заголовка и счета
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
    
    // Создание кнопок управления
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
    
    // Создание игрового поля
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game-container';
    
    const gridElement = document.createElement('div');
    gridElement.className = 'grid';
    
    // Создание ячеек сетки
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridElement.appendChild(cell);
    }
    
    gameContainer.appendChild(gridElement);
    
    // Создание сообщения о конце игры
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
    
    // Создание таблицы лидеров
    const leaderboard = document.createElement('div');
    leaderboard.className = 'leaderboard';
    
    const leaderboardContent = document.createElement('div');
    leaderboardContent.className = 'leaderboard-content';
    
    const leaderboardTitle = document.createElement('h2');
    leaderboardTitle.textContent = 'Таблица лидеров';
    
    const leaderboardTable = document.createElement('table');
    
    // Создание заголовка таблицы без innerHTML
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
    
    // Инициализация игры
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
        
        // Сохранение состояния
        saveGameState();
    }
    
    // Очистка игрового поля
    function clearGrid() {
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => tile.remove());
    }
    
    // Обновление отображения игрового поля
    function updateGrid() {
        clearGrid();
        
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${grid[row][col]}`;
                    tile.textContent = grid[row][col];
                    
                    // Позиционирование плитки
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
    
    // Добавление случайной плитки
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
    
    // Сохранение состояния игры
    function saveGameState() {
        const gameState = {
            grid: JSON.parse(JSON.stringify(grid)),
            score: score,
            history: JSON.parse(JSON.stringify(history))
        };
        
        localStorage.setItem('game2048', JSON.stringify(gameState));
    }
    
    // Загрузка состояния игры
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
    
    // Обновление счета
    function updateScore() {
        scoreElement.textContent = score;
    }
    
    // Движение влево
    function moveLeft() {
        moved = false;
        
        for (let row = 0; row < gridSize; row++) {
            // Сжатие ряда
            const newRow = grid[row].filter(cell => cell !== 0);
            
            // Слияние одинаковых плиток
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    score += newRow[i];
                    newRow.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            // Заполнение нулями
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
    
    // Движение вправо
    function moveRight() {
        moved = false;
        
        for (let row = 0; row < gridSize; row++) {
            // Сжатие ряда
            const newRow = grid[row].filter(cell => cell !== 0);
            
            // Слияние одинаковых плиток
            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    score += newRow[i];
                    newRow.splice(i - 1, 1);
                    moved = true;
                    i--; // Пропустить следующую плитку, так как она была объединена
                }
            }
            
            // Заполнение нулями слева
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
    
    // Движение вверх
    function moveUp() {
        moved = false;
        
        for (let col = 0; col < gridSize; col++) {
            // Сжатие колонки
            const column = [];
            for (let row = 0; row < gridSize; row++) {
                if (grid[row][col] !== 0) {
                    column.push(grid[row][col]);
                }
            }
            
            // Слияние одинаковых плиток
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            // Заполнение нулями снизу
            while (column.length < gridSize) {
                column.push(0);
            }
            
            // Проверка на изменение
            for (let row = 0; row < gridSize; row++) {
                if (grid[row][col] !== column[row]) {
                    moved = true;
                }
                grid[row][col] = column[row];
            }
        }
        
        return moved;
    }
    
    // Движение вниз
    function moveDown() {
        moved = false;
        
        for (let col = 0; col < gridSize; col++) {
            // Сжатие колонки
            const column = [];
            for (let row = 0; row < gridSize; row++) {
                if (grid[row][col] !== 0) {
                    column.push(grid[row][col]);
                }
            }
            
            // Слияние одинаковых плиток
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    score += column[i];
                    column.splice(i - 1, 1);
                    moved = true;
                    i--; // Пропустить следующую плитку, так как она была объединена
                }
            }
            
            // Заполнение нулями сверху
            while (column.length < gridSize) {
                column.unshift(0);
            }
            
            // Проверка на изменение
            for (let row = 0; row < gridSize; row++) {
                if (grid[row][col] !== column[row]) {
                    moved = true;
                }
                grid[row][col] = column[row];
            }
        }
        
        return moved;
    }
    
    // Проверка возможности движения
    function canMove() {
        // Проверка наличия пустых ячеек
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (grid[row][col] === 0) {
                    return true;
                }
            }
        }
        
        // Проверка возможности слияния по горизонтали
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize - 1; col++) {
                if (grid[row][col] === grid[row][col + 1]) {
                    return true;
                }
            }
        }
        
        // Проверка возможности слияния по вертикали
        for (let col = 0; col < gridSize; col++) {
            for (let row = 0; row < gridSize - 1; row++) {
                if (grid[row][col] === grid[row + 1][col]) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // Обработка движения
    function handleMove(direction) {
        if (gameOver) return;
        
        // Сохранение состояния перед ходом
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
            // Добавление в историю
            history.push(prevState);
            
            // Ограничение истории (максимум 10 ходов назад)
            if (history.length > 10) {
                history.shift();
            }
            
            addRandomTile();
            updateScore();
            updateGrid();
            saveGameState();
            
            // Проверка на победу
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
            
            // Проверка на окончание игры
            if (!canMove()) {
                gameOver = true;
                showGameMessage('Игра окончена!', true);
            }
        }
    }
    
    // Отмена хода
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
    
    // Новая игра
    function newGame() {
        gameMessage.classList.remove('active');
        initGame();
    }
    
    // Показать сообщение о конце игры
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
    
    // Сохранение результата
    function saveScore() {
        const name = nameInput.value.trim();
        
        if (name === '') {
            alert('Пожалуйста, введите ваше имя');
            return;
        }
        
        // Получение текущих рекордов
        const leaderboardData = JSON.parse(localStorage.getItem('leaderboard2048')) || [];
        
        // Добавление нового рекорда
        leaderboardData.push({
            name: name,
            score: score,
            date: new Date().toLocaleDateString('ru-RU')
        });
        
        // Сортировка по убыванию счета
        leaderboardData.sort((a, b) => b.score - a.score);
        
        // Ограничение до 10 лучших результатов
        if (leaderboardData.length > 10) {
            leaderboardData.splice(10);
        }
        
        // Сохранение в localStorage
        localStorage.setItem('leaderboard2048', JSON.stringify(leaderboardData));
        
        // Обновление интерфейса
        nameInput.style.display = 'none';
        saveBtn.style.display = 'none';
        messageTitle.textContent = 'Ваш рекорд сохранен!';
    }
    
    // Показать таблицу лидеров
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
    
    // Обработка событий клавиатуры
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
    
    // Обработка свайпов для мобильных устройств
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
    
    // Обработка свайпов
    function handleSwipe() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        const minSwipeDistance = 30; // Минимальное расстояние для регистрации свайпа
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Горизонтальный свайп
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    handleMove('right');
                } else {
                    handleMove('left');
                }
            }
        } else {
            // Вертикальный свайп
            if (Math.abs(diffY) > minSwipeDistance) {
                if (diffY > 0) {
                    handleMove('down');
                } else {
                    handleMove('up');
                }
            }
        }
    }
    
    // Загрузка состояния игры при запуске
    loadGameState();
});