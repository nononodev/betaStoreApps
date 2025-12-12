function Goonermon() {
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
    var appsname = "Goonermon";
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var tileSize = 32;
    var viewWidth = 50;
    var viewHeight = 20;
    var playerX = 2;
    var playerY = 2;
    var playerDir = 'down';
    var goonmons = [];
    var currency = 0;
    var items = [];
    var encounterChance = 0.1;
    var gameInterval;
    var isPaused = true;
    var inBattle = false;
    var currentOpponent = null;
    var currentGoonmon = null;
    var battleMessages = [];
    var menuOpen = false;
    var shopMenu = false;
    var currentMap = 'home';
    var maps = {
        world: {
            width: 50,
            height: 50,
            tiles: [],
            entrances: []
        },
        home: {
            width: 7,
            height: 7,
            tiles: [],
            entrances: [{x: 3, y: 5, to: 'world', spawnX: 26, spawnY: 27}]  // ← Y=5, not 6
        },
        shop: {
            width: 5,
            height: 5,
            tiles: [],
            entrances: [{x: 2, y: 3, to: 'world', spawnX: 12, spawnY: 15}]
        },
        building: {
            width: 6,
            height: 6,
            tiles: [],
            entrances: [{x: 3, y: 4, to: 'world', spawnX: 41, spawnY: 43}]
        }
    };
    var tileTypes = {
        0: {color: '#228B22', walkable: true},
        1: {color: '#006400', walkable: false},
        2: {color: '#A52A2A', walkable: false},
        3: {color: '#FFD700', walkable: true},
        4: {color: '#87CEEB', walkable: true},
        5: {color: '#FF4500', walkable: true}
    };
    var goonmonData = [
        {name: 'Hot Solo', hp: 100, maxHp: 100, attacks: ['Stroke', 'Tease'], power: 20},
        {name: 'Intense Duo', hp: 120, maxHp: 120, attacks: ['Edge', 'Thrust'], power: 25},
        {name: 'Wild Group', hp: 150, maxHp: 150, attacks: ['Orgasm', 'Dominate'], power: 30},
        {name: 'Kinky Fetish', hp: 110, maxHp: 110, attacks: ['Bind', 'Whip'], power: 22},
        {name: 'Sensual Tease', hp: 90, maxHp: 90, attacks: ['Lick', 'Caress'], power: 18}
    ];
    var shopItems = [
        {name: 'Lube', price: 50, effect: 'heal'},
        {name: 'Toy', price: 100, effect: 'powerup'},
        {name: 'Rare Video', price: 200, effect: 'newgoonmon'},
        {name: 'Chastity Cage', price: 500, effect: 'powerup'}
    ];
    var messages = [];
    var gameSize = 500;
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
    close.className = "appheadbutt";

    fullscreen.title = 'Fullscreen';
    fullscreen.id = "fullscreen";
    fullscreen.type = 'image';
    fullscreen.src = "images/fullscreen.png";
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
        document.removeEventListener('keydown', keyHandler);
        desktopbody.removeChild(app);
    };

    fullscreen.onclick = function() {
        if (isfull == false) {
            app.style.width = '100%';
            app.style.height = 'calc(100% - 50px)';
            app.style.top = '0px';
            app.style.left = '0%';
            isfull = true;
        } else {
            app.style.width = '50%';
            app.style.height = '50%';
            app.style.top = '25%';
            app.style.left = '25%';
            isfull = false;
        }
        if (savedtheme) app.style.backgroundColor = localStorage.getItem('theme');
    };

    minimize.onclick = function() { minimizer(appsname + "(" + appnumber + ")"); };

    canvas.style.width = "100%";
    canvas.style.height = "calc(100% - 60px)";
    canvas.width = viewWidth * tileSize;
    canvas.height = viewHeight * tileSize;
    appbody.appendChild(canvas);
    appbody.appendChild(startButton);
    appbody.appendChild(pauseButton);

    // ──────────────────────────────────────
    // MAP GENERATION
    // ──────────────────────────────────────
    function generateMap(type) {
        var map = maps[type];
        map.tiles = [];
        for (var y = 0; y < map.height; y++) {
            map.tiles[y] = [];
            for (var x = 0; x < map.width; x++) {
                map.tiles[y][x] = 0;
            }
        }

        if (type === 'world') {
            // Random trees
            for (var y = 0; y < map.height; y++) {
                for (var x = 0; x < map.width; x++) {
                    if (Math.random() < 0.15) map.tiles[y][x] = 1;
                }
            }
            // Place buildings with doors
            placeBuilding(24, 24, 4, 4, 'home');
            placeBuilding(10, 10, 5, 5, 'shop');
            placeBuilding(40, 40, 5, 5, 'building');
        } else {
            // Interior floors + walls
            for (var y = 0; y < map.height; y++) {
                for (var x = 0; x < map.width; x++) {
                    if (y === 0 || y === map.height - 1 || x === 0 || x === map.width - 1) {
                        map.tiles[y][x] = 1; // wall
                    } else {
                        map.tiles[y][x] = 4; // floor
                    }
                }
            }
            // Furniture
            if (type === 'home') map.tiles[3][3] = 5;
            if (type === 'shop') {
                map.tiles[1][2] = 5;
                map.tiles[1][3] = 5;
            }
        }
    }

    function placeBuilding(startX, startY, w, h, toMap) {
        for (var y = startY; y < startY + h; y++) {
            for (var x = startX; x < startX + w; x++) {
                maps.world.tiles[y][x] = 2; // building wall
            }
        }
        var doorX = startX + Math.floor(w / 2);
        var doorY = startY + h - 1;
        maps.world.tiles[doorY][doorX] = 3; // door
        maps.world.entrances.push({
            x: doorX, y: doorY,
            to: toMap,
            spawnX: Math.floor(maps[toMap].width / 2),
            spawnY: maps[toMap].height - 2
        });
    }

    Object.keys(maps).forEach(generateMap);

    // ──────────────────────────────────────
    // GAME LOOP & INPUT
    // ──────────────────────────────────────
    function startGame() {
        goonmons = [];
        currency = 200;
        items = [];
        currentMap = 'home';
        playerX = 3;
        playerY = 4;
        messages = ['Welcome to Goon Pokemon! WASD/Arrows to move • M = Menu • E = Interact'];
        isPaused = false;
        menuOpen = false;
        shopMenu = false;
        inBattle = false;
        startButton.disabled = true;
        gameInterval = setInterval(draw, 1000/60);
    }

    function stopGame() {
        clearInterval(gameInterval);
        startButton.disabled = false;
    }

    function pauseGame() {
        if (isPaused) {
            isPaused = false;
            gameInterval = setInterval(draw, 1000/60);
            pauseButton.innerText = 'Pause Game';
        } else {
            clearInterval(gameInterval);
            isPaused = true;
            pauseButton.innerText = 'Resume Game';
        }
    }

    function draw() {
        if (isPaused && !menuOpen && !shopMenu) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var map = maps[currentMap];
        var offsetX = canvas.width/2 - playerX*tileSize - tileSize/2;
        var offsetY = canvas.height/2 - playerY*tileSize - tileSize/2;

        // Tiles
        for (var y = 0; y < map.height; y++) {
            for (var x = 0; x < map.width; x++) {
                var tile = map.tiles[y][x];
                var dx = x * tileSize + offsetX;
                var dy = y * tileSize + offsetY;
                if (dx + tileSize < 0 || dx > canvas.width || dy + tileSize < 0 || dy > canvas.height) continue;

                ctx.fillStyle = tileTypes[tile].color;
                ctx.fillRect(dx, dy, tileSize, tileSize);

                // Simple graphics
                if (tile === 1) { // tree / wall
                    ctx.fillStyle = currentMap === 'world' ? '#228B22' : '#444';
                    ctx.fillRect(dx + 8, dy + 4, 16, 24);
                }
                if (tile === 3) { // door
                    ctx.fillStyle = '#8B4513';
                    ctx.fillRect(dx + 8, dy + 12, 16, 20);
                }
                if (tile === 5) { // furniture
                    ctx.fillStyle = '#4B0082';
                    ctx.fillRect(dx + 4, dy + 4, 24, 24);
                }
            }
        }

        // Player
        var px = canvas.width/2;
        var py = canvas.height/2;
        ctx.fillStyle = '#FF1493';
        ctx.beginPath();
        ctx.arc(px, py - 8, 10, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.fillRect(px - 8, py - 4, 16, 20);

        // HUD
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(`Goonmons: ${goonmons.length}  Coins: ${currency}`, 10, 20);
        for (var i = 0; i < messages.length; i++) {
            ctx.fillText(messages[i], 10, 45 + i*18);
        }
        if (messages.length > 6) messages.shift();
                // DEBUG HUD - Shows your exact position
        ctx.fillStyle = '#FFD700'; // Gold
        ctx.font = 'bold 16px Arial';
        ctx.fillText("Your Pos: X=" + playerX + " Y=" + playerY, 10, canvas.height - 80);
        
        if (currentMap === 'home') {
            ctx.fillText("DOOR EXIT: X=3 Y=6", 10, canvas.height - 60);
            ctx.fillText("Press DOWN ONCE from start → E", 10, canvas.height - 45);
        }
        
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText("E = Interact | M = Menu | ESC = Close Menus", 10, canvas.height - 25);

        if (inBattle) drawBattle();
        if (menuOpen) drawMenu();
        if (shopMenu) drawShopMenu();
    }

    // ──────────────────────────────────────
    // INPUT HANDLER (fixed!)
    // ──────────────────────────────────────
        function keyHandler(e) {
        if (isPaused && !menuOpen && !shopMenu) return;
        var key = e.key.toLowerCase();

        if (key === 'm') { menuOpen = !menuOpen; draw(); return; }
        if (key === 'escape') { menuOpen = shopMenu = inBattle = false; draw(); return; }

        if (menuOpen) { handleMenu(key); return; }
        if (shopMenu) { handleShop(key); return; }
        if (inBattle) { handleBattle(key); return; }

        // MOVEMENT
        var dx = 0, dy = 0;
        if (key === 'w' || key === 'arrowup') dy = -1;
        if (key === 's' || key === 'arrowdown') dy = 1;
        if (key === 'a' || key === 'arrowleft') dx = -1;
        if (key === 'd' || key === 'arrowright') dx = 1;

        if (key === 'e' || key === 'E') { 
            interact(); 
            return; 
        }

        if (dx || dy) movePlayer(dx, dy);
    }
    document.addEventListener('keydown', keyHandler);

    function movePlayer(dx, dy) {
        var map = maps[currentMap];
        var nx = playerX + dx;
        var ny = playerY + dy;

        if (nx < 0 || nx >= map.width || ny < 0 || ny >= map.height) return;
        if (!tileTypes[map.tiles[ny][nx]].walkable) return;

        playerX = nx;
        playerY = ny;

        if (currentMap === 'world' && Math.random() < encounterChance) {
            startEncounter();
        }
        draw();
    }

    function interact() {
        var map = maps[currentMap];
        
        // Check if you're standing on an entrance (door) defined in the map
        var entrance = map.entrances.find(e => e.x === playerX && e.y === playerY);
        if (entrance) {
            currentMap = entrance.to;
            playerX = entrance.spawnX;
            playerY = entrance.spawnY;
            messages.push("Entered " + currentMap + "!");
            draw();
            return;
        }
        
        messages.push("Nothing here.");
    }

    function startEncounter() {
        if (Math.random() < 0.65 && goonmons.length < 6) {
            var g = JSON.parse(JSON.stringify(goonmonData[Math.floor(Math.random()*goonmonData.length)]));
            goonmons.push(g);
            messages.push("You found and captured " + g.name + "!");
        } else {
            if (goonmons.length === 0) { messages.push("A wild gooner appeared… but you have nothing to fight with!"); return; }
            inBattle = true;
            currentGoonmon = goonmons[0];
            currentOpponent = JSON.parse(JSON.stringify(goonmonData[Math.floor(Math.random()*goonmonData.length)]));
            battleMessages = ["Wild " + currentOpponent.name + " appeared!"];
        }
        draw();
    }

    function handleBattle(key) {
        var i = parseInt(key) - 1;
        if (i < 0 || i >= currentGoonmon.attacks.length) return;

        var dmg = 15 + Math.floor(Math.random() * currentGoonmon.power);
        currentOpponent.hp -= dmg;
        battleMessages.push(currentGoonmon.name + " used " + currentGoonmon.attacks[i] + "! (" + dmg + ")");

        if (currentOpponent.hp <= 0) {
            battleMessages.push("Opponent climaxed! You win 60 coins!");
            currency += 60;
            inBattle = false;
            draw();
            return;
        }

        // Enemy turn
        var eDmg = 10 + Math.floor(Math.random() * currentOpponent.power);
        currentGoonmon.hp -= eDmg;
        battleMessages.push("Enemy used " + currentOpponent.attacks[Math.floor(Math.random()*currentOpponent.attacks.length)] + "! (" + eDmg + ")");

        if (currentGoonmon.hp <= 0) {
            battleMessages.push("Your goonmon fainted! Lost 30 coins...");
            currency = Math.max(0, currency - 30);
            currentGoonmon.hp = currentGoonmon.maxHp;
            inBattle = false;
        }
        if (battleMessages.length > 4) battleMessages.shift();
        draw();
    }

    function handleMenu(key) {
        switch (key) {
            case '1': messages.push("Goonmons: " + goonmons.map(g=>g.name + " ("+g.hp+"/"+g.maxHp+")").join(", ")); break;
            case '2': messages.push("Items: " + (items.length ? items.join(", ") : "none")); break;
            case '3':
                localStorage.setItem('goonPokemonSave', JSON.stringify({goonmons, currency, items}));
                messages.push("Game saved to betaOS localStorage!");
                break;
            case '4':
                var s = localStorage.getItem('goonPokemonSave');
                if (s) {
                    var d = JSON.parse(s);
                    goonmons = d.goonmons || [];
                    currency = d.currency || 0;
                    items = d.items || [];
                    messages.push("Game loaded!");
                } else messages.push("No save found.");
                break;
        }
        draw();
    }

    function handleShop(key) {
        if (key === 'e' || key === 'escape') { shopMenu = false; draw(); return; }
        var i = parseInt(key) - 1;
        if (i >= 0 && i < shopItems.length) {
            var it = shopItems[i];
            if (currency >= it.price) {
                currency -= it.price;
                if (it.effect === 'newgoonmon') {
                    var g = JSON.parse(JSON.stringify(goonmonData[Math.floor(Math.random()*goonmonData.length)]));
                    goonmons.push(g);
                    messages.push("Bought " + g.name + "!");
                } else {
                    items.push(it.name);
                    messages.push("Bought " + it.name + "!");
                }
            } else messages.push("Not enough coins!");
            draw();
        }
    }

    function drawBattle() {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, canvas.height - 220, canvas.width, 220);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText(`${currentGoonmon.name} HP: ${currentGoonmon.hp}/${currentGoonmon.maxHp}`, 20, canvas.height - 190);
        ctx.fillText(`Enemy ${currentOpponent.name} HP: ${currentOpponent.hp}/${currentOpponent.maxHp}`, 20, canvas.height - 160);
        for (var i = 0; i < currentGoonmon.attacks.length; i++) {
            ctx.fillText((i+1) + ": " + currentGoonmon.attacks[i], 20, canvas.height - 130 + i*25);
        }
        for (var i = 0; i < battleMessages.length; i++) {
            ctx.fillText(battleMessages[i], 20, canvas.height - 50 + i*20);
        }
    }

    function drawMenu() {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);
        ctx.fillStyle = '#FFD700';
        ctx.font = '20px Arial';
        ctx.fillText("≡ GOON MENU ≡", 140, 140);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText("1 • View Goonmons", 140, 180);
        ctx.fillText("2 • View Items", 140, 210);
        ctx.fillText("3 • Save Game", 140, 240);
        ctx.fillText("4 • Load Game", 140, 270);
        ctx.fillText("M or ESC • Close", 140, 320);
    }

    function drawShopMenu() {
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.fillRect(80, 80, canvas.width - 160, canvas.height - 160);
        ctx.fillStyle = '#FF4500';
        ctx.font = '22px Arial';
        ctx.fillText("GOON SHOP", 140, 120);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText("Coins: " + currency, 140, 150);
        shopItems.forEach((it, i) => {
            ctx.fillText((i+1) + " • " + it.name + " — " + it.price + " coins", 140, 190 + i*30);
        });
        ctx.fillText("Press number to buy • E/ESC to leave", 140, 190 + shopItems.length*30 + 20);
    }

    bringToFront(app.id);
}