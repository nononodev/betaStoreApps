function Pong() {
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
    var appsname = "Pong";
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var dx = 2;
    var dy = 2;
    var paddleHeight = 75;
    var paddleWidth = 10;
    var playerPaddleY = (canvas.height - paddleHeight) / 2;
    var computerPaddleY = (canvas.height - paddleHeight) / 2;
    var playerScore = 0;
    var computerScore = 0;
    var gameInterval;
    var isPaused = true;
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
    close.src = "images/close.png";
    close.style.fontFamily = "Arial";
    close.className = "appheadbutt";

    fullscreen.title = 'Fullscreen';
    fullscreen.id = "fullscreen";
    fullscreen.type = 'image';
    fullscreen.src = "images/fullscreen.png";
    fullscreen.style.textAlign = 'right';
    fullscreen.className = "appheadbutt";

    appbody.className = 'appbody';

    minimize.type = 'image';
    minimize.title = 'Minimize';
    minimize.id = "minimize";
    minimize.className = "appheadbutt";
    minimize.style.backgroundImage = "url(images/minimize.png)";

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
    canvas.width = gameSize;
    canvas.height = gameSize;
    appbody.appendChild(canvas);
    appbody.appendChild(startButton);
    appbody.appendChild(pauseButton);

    document.addEventListener('keydown', controlPaddle);

    function startGame() {
        x = canvas.width / 2; // Reset ball position
        y = canvas.height / 2;
        dx = 2; // Reset ball direction
        dy = 2;
        playerScore = 0; // Reset score
        computerScore = 0;
        isPaused = false;
        startButton.disabled = true; // Disable start button
        gameInterval = setInterval(draw, 10);
    }

    function stopGame() {
        clearInterval(gameInterval);
        startButton.disabled = false; // Enable start button
    }

    function pauseGame() {
        if (isPaused) {
            isPaused = false;
            gameInterval = setInterval(draw, 10);
            pauseButton.innerText = 'Pause Game';
        } else {
            clearInterval(gameInterval);
            isPaused = true;
            pauseButton.innerText = 'Resume Game';
        }
    }

    function draw() {
        if (isPaused) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the paddles and ball
        ctx.fillStyle = 'lightgray';
        ctx.fillRect(0, playerPaddleY, paddleWidth, paddleHeight); // Player paddle
        ctx.fillRect(canvas.width - paddleWidth, computerPaddleY, paddleWidth, paddleHeight); // Computer paddle

        // Draw the ball
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();

        // Ball movement
        x += dx;
        y += dy;

        // Ball bouncing off top and bottom
        if (y + ballRadius > canvas.height || y - ballRadius < 0) {
            dy = -dy;
        }

        // Ball bouncing off paddles
        if (x + ballRadius > canvas.width - paddleWidth) {
            if (y > computerPaddleY && y < computerPaddleY + paddleHeight) {
                dx = -dx;
            } else {
                playerScore++;
                resetBall();
            }
        }
        if (x - ballRadius < paddleWidth) {
            if (y > playerPaddleY && y < playerPaddleY + paddleHeight) {
                dx = -dx;
            } else {
                computerScore++;
                resetBall();
            }
        }

        // Move the computer paddle
        computerPaddleY += (y - (computerPaddleY + paddleHeight / 2)) * 0.1; // Simple AI

        // Draw scores
        ctx.font = '15px Arial';
        ctx.fillText("Player: " + playerScore, 10, 20);
        ctx.fillText("Computer: " + computerScore, canvas.width - 100, 20);
    }

    function resetBall() {
        x = canvas.width / 2; // Reset ball position
        y = canvas.height / 2;
        dx = 2 * (Math.random() < 0.5 ? 1 : -1); // Randomize ball direction
        dy = 2; // Reset vertical direction
    }

    function controlPaddle(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (playerPaddleY > 0) {
                    playerPaddleY -= 20; // Move paddle up
                }
                break;
            case 'ArrowDown':
                if (playerPaddleY < canvas.height - paddleHeight) {
                    playerPaddleY += 20; // Move paddle down
                }
                break;
        }
    }

    bringToFront(app.id);
}

