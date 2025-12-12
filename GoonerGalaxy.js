function GoonerGalaxy() {
    var appsname = "GoonerGalaxy";           // Change this once, name changes everywhere
    var appnumber = (window.goonerGalaxyCount || 0) + 1;
    window.goonerGalaxyCount = appnumber;

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
    var canvas = document.createElement('canvas');
    var startbutt = document.createElement('button');
    var pausebutt = document.createElement('button');
    var ctx;
    var gameRunning = false;
    var enemies = [];
    var bullets = [];
    var score = 0;
    var lives = 3;

    var player = { x: 200, y: 350, width: 50, height: 70, speed: 7 };

    app.scroll = false;
    appbody.scroll = false;

    headtextdiv.style.textAlign = 'left';
    headtextdiv.style.width = '50%';
    headtextdiv.style.cssFloat = 'left';
    headbuttdiv.style.textAlign = 'right';
    headbuttdiv.style.width = '50%';
    headbuttdiv.style.cssFloat = 'right';

    app.className = 'app';
    apphead.className = 'appheader';
    appheadtext.className = 'appheadtxt';
    appheadtext.innerText = appsname + (appnumber > 1 ? appnumber : "");

    close.type = 'image'; 
    close.id = "close"; 
    close.title = 'Close';
    close.className = "appheadbutt";
    fullscreen.title = 'Fullscreen'; 
    fullscreen.id = "fullscreen"; fullscreen.type = 'image';
    fullscreen.src = "images/fullscreen.png"; 
    fullscreen.className = "appheadbutt";
    appbody.className = 'appbody';
    minimize.type = 'image'; 
    minimize.title = 'Minimize'; 
    minimize.id = "minimize";
    minimize.className = "appheadbutt";

    close.onclick = function() { 
        desktopbody.removeChild(app); 
        cancelAnimationFrame(gameLoopId);
    };

    fullscreen.onclick = function () {
        if (isfull == false){
            app.style.width = '100%';
            app.style.height = 'calc(100% - 80px)'; 
            app.style.top = '0px'; 
            app.style.left = '0%';
            if(savedtheme){
                app.style.backgroundColor = localStorage.getItem('theme');
            }
            isfull = true;
        } else if (isfull == true){
            app.style.width = '50%'; 
            app.style.height = '50%';
            app.style.top = '25%'; 
            app.style.left = '25%';
            isfull = false;
            if(savedtheme){
                app.style.backgroundColor = localStorage.getItem('theme');
            }
        }
    };

    minimize.onclick = function() { minimizer(appsname + "(" + appnumber + ")"); };

    desktopbody.appendChild(app);
    app.id = appsname + "(" + appnumber + ")"
    apphead.id = app.id + "header";
    dragWindow(document.getElementById(app.id));   // your OS drag works perfectly

    headtextdiv.append(appheadtext);
    apphead.append(headtextdiv);
    apphead.append(headbuttdiv);
    headbuttdiv.append(minimize);
    headbuttdiv.append(fullscreen);
    headbuttdiv.append(close);
    app.appendChild(apphead);
    app.appendChild(appbody);

    startbutt.innerHTML = 'Start Gooning';
    pausebutt.innerHTML = 'Stop';
    startbutt.style.margin = '10px';
    pausebutt.style.margin = '10px';
    startbutt.onclick = startGame;
    pausebutt.onclick = stopGame;

    appbody.appendChild(startbutt);
    appbody.appendChild(pausebutt);
    appbody.appendChild(canvas);

    canvas.style.background = '#000010';
    canvas.style.display = 'block';
    canvas.style.margin = '10px auto';
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = appbody.clientWidth - 20;
        canvas.height = appbody.clientHeight - 100;
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - player.height - 20;
    }

    // This is the magic: listen to YOUR app's size, not the browser window
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(appbody);           // watches when YOU resize the app with the corner handle
    resizeCanvas();               // initial size

    const keys = {};
    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);
    canvas.addEventListener('click', shoot);

    function shoot() {
        if (!gameRunning) return;
        bullets.push({
            x: player.x + player.width/2 - 3,
            y: player.y + 10,
            width: 6,
            height: 20,
            speed: 12
        });
    }

    let gameLoopId;

    function startGame() {
        if (gameRunning) return;
        gameRunning = true;
        score = 0;
        lives = 3;
        enemies = [];
        bullets = [];
        spawnEnemy();
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function stopGame() { gameRunning = false; }

    function spawnEnemy() {
        if (!gameRunning) return;
        const types = ['vagina', 'girlcock', 'goontext', 'betatext','prejactext', 'addicttext'];
        const type = types[Math.floor(Math.random() * types.length)];
        const size = Math.random() * 40 + 40;

        enemies.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size * 1.3,
            speed: Math.random() * 2 + 1.5,
            type: type,
            throb: Math.random() * Math.PI * 2,
            text: type === 'goontext' ? 'GOON' : (type === 'betatext' ? 'BETA' : ''),
        });

        enemies.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size * 1.3,
            speed: Math.random() * 2 + 1.5,
            type: type,
            throb: Math.random() * Math.PI * 2,
            text: type === 'prejactext' ? 'PREJAC' : (type === 'addicttext' ? 'ADDICT' : ''),
        });

        setTimeout(spawnEnemy, Math.random() * 700 + 300);
    }

    function gameLoop() {
        if (!gameRunning) return;

        if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
        if (keys['ArrowRight'] && player.x < canvas.width - player.width) player.x += player.speed;
        if (keys[' '] || keys['Spacebar']) shoot();

        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y -= bullets[i].speed;
            if (bullets[i].y < -20) bullets.splice(i, 1);
        }

        enemies.forEach(e => { e.y += e.speed; e.throb += 0.15; });

        outer: for (let i = enemies.length - 1; i >= 0; i--) {
            for (let j = bullets.length - 1; j >= 0; j--) {
                const e = enemies[i], b = bullets[j];
                if (b.x < e.x + e.width && b.x + b.width > e.x &&
                    b.y < e.y + e.height && b.y + b.height > e.y) {
                    enemies.splice(i, 1);
                    bullets.splice(j, 1);
                    score += 15;
                    continue outer;
                }
            }
        }

        enemies = enemies.filter(e => {
            if (player.x < e.x + e.width && player.x + player.width > e.x &&
                player.y < e.y + e.height && player.y + player.height > e.y) {
                lives--;
                if (lives <= 0) {
                    gameRunning = false;
                    setTimeout(() => alert("CUM RELEASED. YOU LOST. GOONING DAY 0."), 100);
                }
                return false;
            }
            return e.y < canvas.height + 100;
        });

        draw();
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // stars
        ctx.fillStyle = 'white';
        for (let i = 0; i < 120; i++) {
            let x = (i * 89 + Date.now() * 0.01) % canvas.width;
            let y = (i * 67) % canvas.height;
            ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.001 + i) * 0.5;
            ctx.fillRect(x, y, 2, 2);
        }
        ctx.globalAlpha = 1;

        // player cage gooner
        ctx.fillStyle = '#ff3388'; ctx.fillRect(player.x + 12, player.y, 26, 45);
        ctx.fillStyle = '#ff99cc'; ctx.fillRect(player.x + 15, player.y + 45, 20, 25);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(player.x + 22, player.y + 68, 6, 15);

        // enemies (same degenerate art you love)
        enemies.forEach(e => {
            const pulse = Math.sin(e.throb) * 10;
            if (e.type === 'vagina') {
                ctx.fillStyle = '#ff66aa';
                ctx.beginPath(); ctx.ellipse(e.x + e.width/2, e.y + e.height/2 + pulse/2, e.width/2 + pulse, e.height/2.5, 0, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#ff99dd';
                ctx.beginPath(); ctx.ellipse(e.x + e.width/2, e.y + e.height/2 + 5, e.width/3.5, 15 + pulse, 0, 0, Math.PI); ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(e.x + e.width/2 - 2, e.y + e.height - 10, 4, 15 + pulse);
            } else if (e.type === 'girlcock') {
                ctx.fillStyle = '#ff88cc';
                ctx.fillRect(e.x + e.width/2 - 12 - pulse/2, e.y + 10, 24 + pulse, e.height - 20);
                ctx.fillStyle = '#ff3399';
                ctx.beginPath(); ctx.arc(e.x + e.width/2, e.y + e.height - 15, 18 + pulse, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.beginPath(); ctx.arc(e.x + e.width/2, e.y + e.height - 20, 8 + pulse/2, 0, Math.PI*2); ctx.fill();
            } else {
                ctx.font = `bold ${e.width + pulse}px Arial`;
                ctx.fillStyle = e.type === 'goontext' ? '#ff00ff' : '#00ffff';
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.shadowBlur = 20; ctx.shadowColor = ctx.fillStyle;
                ctx.fillText(e.text, e.x + e.width/2, e.y + e.height/2);
                ctx.shadowBlur = 0;
            }
        });

        // bullets
        ctx.fillStyle = '#ffffff';
        bullets.forEach(b => {
            ctx.fillRect(b.x, b.y, b.width, b.height);
            ctx.fillRect(b.x - 4, b.y + 8, b.width + 8, 10);
        });

        // HUD
        ctx.fillStyle = '#00ff00'; ctx.font = '22px Arial'; ctx.textAlign = 'left';
        ctx.fillText(`Streak: ${score} days`, 20, 40);
        ctx.fillStyle = lives > 1 ? '#00ff00' : '#ff0066';
        ctx.fillText(`Stamina Left: ${lives}`, 20, 70);
    }
}