function SpankBang() {
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
    var appsname = "Spank Bang";
    app.scroll = false;
    appbody.scroll = true;
    tasks++;
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
    
    close.onclick = function() { desktopbody.removeChild(app); tasks--; };
    
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

    var vistbox = document.createElement('iframe');
    vistbox.src = 'https://spankbang.com';
    vistbox.style.width = '100%';
    vistbox.style.height = 'calc(100% - 50px)'; // Adjust based on header height
    
    // Add handling for navigation
    vistbox.onload = function() {
        vistbox.contentWindow.addEventListener('click', function(event) {
            var target = event.target;
            var link = target.closest('a'); // Find the nearest link
            
            if (link && link.href) {
                event.preventDefault(); // Prevent default link behavior
                vistbox.src = link.href; // Change the iframe's src to the link's href
           
            }
        });
    };

    appbody.appendChild(vistbox);
    bringToFront(app.id);
}
