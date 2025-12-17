function Clock(){
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
    var appsname = 'Clock';
    app.scroll = false;
    appbody.scroll = true;
    tasks++;
    app.onerror = function(){errorsound.play();};
    headtextdiv.style.textAlign = 'left';
    headtextdiv.style.width = '50%';
    headtextdiv.style.cssFloat = 'left';
    headbuttdiv.style.textAlign = 'right';
    headbuttdiv.style.width = '50%';
    headbuttdiv.style.cssFloat = 'right';
    appnumber++;
    app.className = 'app';
    apphead.className = 'appheader';
    appheadtext.className = 'appheadtxt';
    appheadtext.innerText = appsname;
    close.type = 'image';
    close.id = "close"
    close.title = 'Close';
    close.style.fontFamily = "Arial";
    close.className = "appheadbutt";
    fullscreen.title = 'Fullscreen';
    fullscreen.id = "fullscreen";
    fullscreen.type = 'image';
    fullscreen.style.textAlign = 'right';
    fullscreen.className = "appheadbutt";
    minimize.type = 'image';
    minimize.title = 'Small';
    minimize.id = "minimize";
    minimize.className = "appheadbutt";
    appbody.className = 'appbody';
    headtextdiv.append(appheadtext);
    apphead.append(headtextdiv);
    apphead.append(headbuttdiv);
    headbuttdiv.append(minimize);
    headbuttdiv.append(fullscreen);
    headbuttdiv.append(close);
    app.appendChild(apphead);
    app.appendChild(appbody);
    if(savedtheme){
        app.style.backgroundColor = localStorage.getItem('theme');
    } else{
        app.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }
    desktopbody.appendChild(app);
    app.id = appsname + "(" + appnumber + ")";
    apphead.id = app.id + "header";
    dragWindow(document.getElementById(app.id));
    app.onload = bringToFront(app.id);
    app.onclick = function () {bringToFront(app.id)};
    close.onclick = function () { desktopbody.removeChild(app); tasks--;};
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
    minimize.onclick = function () {minimizer(appsname + "(" + appnumber + ")")};

    // App content: Clock
    var digital = document.createElement('div');
    digital.style.fontSize = '40px';
    digital.style.textAlign = 'center';
    digital.style.marginTop = '20px';
    digital.style.fontFamily = 'Arial';
    
    var analog = document.createElement('div');
    analog.style.width = '200px';
    analog.style.height = '200px';
    analog.style.border = '10px solid #fff';
    analog.style.borderRadius = '50%';
    analog.style.position = 'relative';
    analog.style.margin = '40px auto';
    
    var hourHand = document.createElement('div');
    hourHand.style.width = '6px';
    hourHand.style.height = '60px';
    hourHand.style.background = '#fff';
    hourHand.style.position = 'absolute';
    hourHand.style.top = '40px';
    hourHand.style.left = '97px';
    hourHand.style.transformOrigin = 'bottom center';
    
    var minHand = document.createElement('div');
    minHand.style.width = '4px';
    minHand.style.height = '90px';
    minHand.style.background = '#fff';
    minHand.style.position = 'absolute';
    minHand.style.top = '10px';
    minHand.style.left = '98px';
    minHand.style.transformOrigin = 'bottom center';
    
    var secHand = document.createElement('div');
    secHand.style.width = '2px';
    secHand.style.height = '100px';
    secHand.style.background = '#f00';
    secHand.style.position = 'absolute';
    secHand.style.top = '0px';
    secHand.style.left = '99px';
    secHand.style.transformOrigin = 'bottom center';
    
    analog.appendChild(hourHand);
    analog.appendChild(minHand);
    analog.appendChild(secHand);
    
    appbody.appendChild(digital);
    appbody.appendChild(analog);
    
    function updateClock() {
        var now = new Date();
        digital.innerText = now.toLocaleTimeString();
        
        var sec = now.getSeconds() * 6;
        var min = now.getMinutes() * 6 + sec / 60;
        var hour = ((now.getHours() % 12) * 30) + min / 12;
        
        secHand.style.transform = 'rotate(' + sec + 'deg)';
        minHand.style.transform = 'rotate(' + min + 'deg)';
        hourHand.style.transform = 'rotate(' + hour + 'deg)';
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}