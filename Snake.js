function Snake() {
    var app = document.createElement('div');
    var apphead = document.createElement('div');
    var appheadtext = document.createElement('ui');
    var appbody = document.createElement('div');
    var close = document.createElement('button');
    var fullscreen = document.createElement('button');
    var minimize = document.createElement('button');
    var isfull = false;
    var headbuttdiv = document.createElement('div');
    var headtextdiv = document.createElement('div');
    var appnumber = Math.random();
    var appsname = "Snake";
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var snake = [{ x: 10, y: 10 }];
    var snakeLength = 1;
    var food = { x: 0, y: 0 };
    var dx = 1, dy = 0; // Movement direction
    var gameInterval; // Size of the canvas
    var isPaused = false;
    var gameSize = 800;

    app.scroll = false;
    appbody.scroll = false;
    app.onerror = function() { errorsound.play(); };

    headtextdiv.style.textAlign = 'left';
    headtextdiv.style.width = '50%';
    headtextdiv.style.cssFloat = 'left';

    headbuttdiv.style.textAlign = 'right';
    headbuttdiv.style.width = '50%';
    headbuttdiv.style.cssFloat = 'right';

    app.className = 'app';
    apphead.className = 'appheader';
    appheadtext.className = 'appheadtxt';
    appheadtext.innerText = appsname;

    close.type = 'image';
    close.id = "close";
    close.title = 'Close';
    close.style.fontFamily = "Arial";
    close.className = "appheadbutt";

    fullscreen.title = 'Fullscreen';
    fullscreen.id = "fullscreen";
    fullscreen.type = 'image';
    fullscreen.style.textAlign = 'right';
    fullscreen.className = "appheadbutt";

    appbody.className = 'appbody';

    minimize.type = 'image';
    minimize.title = 'Minimize';
    minimize.id = "minimize";
    minimize.className = "appheadbutt";

    var startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    startButton.onclick = startGame;

    var pauseButton = document.createElement('button');
    pauseButton.innerText = 'Pause Game';
    pauseButton.onclick = pauseGame;

    headtextdiv.append(appheadtext);
    apphead.append(headtextdiv);
    apphead.append(headbuttdiv);
    headbuttdiv.append(minimize);
    headbuttdiv.append(fullscreen);
    headbuttdiv.append(close);
    app.appendChild(apphead);
    app.appendChild(appbody);

    if (savedtheme) {
        app.style.backgroundColor = localStorage.getItem('theme');
    } else {
        app.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }

    desktopbody.appendChild(app);
    app.id = appsname + "(" + appnumber + ")";
    apphead.id = app.id + "header";
    dragWindow(document.getElementById(app.id));

    app.onclick = function() { bringToFront(app.id); };

    close.onclick = function() {
        stopGame();
        desktopbody.removeChild(app);
    };

    fullscreen.onclick = function() {
        if (isfull == false) {
            app.style.width = '100%';
            app.style.height = 'calc(100% - 50px)';
            app.style.top = '0px';
            app.style.left = '0%';
            if (savedtheme) {
                app.style.backgroundColor = localStorage.getItem('theme');
            }
            isfull = true;
        } else {
            app.style.width = '50%';
            app.style.height = '50%';
            app.style.top = '25%';
            app.style.left = '25%';
            isfull = false;
            if (savedtheme) {
                app.style.backgroundColor = localStorage.getItem('theme');
            }
        }
    };

    minimize.onclick = function() { minimizer(appsname + "(" + appnumber + ")"); };

    // Initialize canvas
    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 60px)";
    canvas.height = gameSize;
    canvas.width = gameSize;
    canvas.backgroundColor = 'light-blue';
    canvas.style.backgroundColor = 'black';
    appbody.appendChild(canvas);
    appbody.appendChild(startButton);
    appbody.appendChild(pauseButton);

       document.addEventListener('keydown', changeDirection);
    
    function startGame() {
        snake = [{ x: 10, y: 10 }];
        snakeLength = 1;
        dx = 1; dy = 0; // Reset direction
        generateFood();
        startButton.disabled = true; // Disable the start button
        isPaused = false;
        gameInterval = setInterval(draw, 100);
    }

    function stopGame() {
        clearInterval(gameInterval);
        startButton.disabled = false; // Enable the start button
    }

    function pauseGame() {
        if (isPaused) {
            isPaused = false;
            gameInterval = setInterval(draw, 100);
            pauseButton.innerText = 'Pause Game';
        } else {
            clearInterval(gameInterval);
            isPaused = true;
            pauseButton.innerText = 'Resume Game';
        }
    }

    function draw() {
        if (isPaused) return; // Prevent drawing when paused

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the snake
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = i === 0 ? 'green' : 'lightgreen'; // Head and body color
            ctx.fillRect(snake[i].x * 20, snake[i].y * 20, 18, 18); // Draw each segment
            ctx.strokeStyle = 'darkgreen';
            ctx.strokeRect(snake[i].x * 20, snake[i].y * 20, 18, 18);
        }

        // Draw food
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * 20, food.y * 20, 18, 18);

        // Move the snake
        var head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
            snakeLength++;
            generateFood();
        }

        // Add new head to the snake
        snake.unshift(head);

        // Remove the tail if the snake hasn't grown
        if (snake.length > snakeLength) {
            snake.pop();
        }

        // Check for collisions with walls or self
        if (head.x < 0 || head.x >= gameSize / 20 || head.y < 0 || head.y >= gameSize / 20 || collision(head, snake)) {
            alert("Game Over! Your score: " + (snakeLength - 1));
            stopGame();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * (gameSize / 20));
        food.y = Math.floor(Math.random() * (gameSize / 20));
        // Ensure food doesn't appear on the snake
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
            }
        }
    }

    function changeDirection(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (dy === 0) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy === 0) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx === 0) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx === 0) { dx = 1; dy = 0; }
                break;
        }
    }

    function collision(head, arr) {
        for (let i = 1; i < arr.length; i++) {
            if (head.x === arr[i].x && head.y === arr[i].y) {
                return true;
            }
        }
        return false;
    }

    bringToFront(app.id);
}
