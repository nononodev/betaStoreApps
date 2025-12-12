function GoonComp() {
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
    var appsname = "GoonComp";
    var addButton = document.createElement('button');
    var fileInput = document.createElement('input');
    var compileButton = document.createElement('button');
    var clearButton = document.createElement('button');
    var videoPlayer = document.createElement('video');
    var videos = [];

    app.scroll = false;
    appbody.scroll = true;

    // App styling
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

    close.onclick = function() { desktopbody.removeChild(app); };

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

    // File input for adding videos
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.multiple = true;

    addButton.innerText = 'Add Videos';
    addButton.onclick = addVideos;

    compileButton.innerText = 'Compile & Play';
    compileButton.onclick = playVideos;

    clearButton.innerText = 'Clear Videos';
    clearButton.onclick = clearVideos;

    // Set dimensions for the video player to maintain size with the window
    videoPlayer.controls = true;
    videoPlayer.style.width = '90%';   // Full width of the container
    videoPlayer.style.height = 'calc(90% - 60px)';  // Full height of the container



    appbody.appendChild(fileInput);
    appbody.appendChild(addButton);
    appbody.appendChild(compileButton);
    appbody.appendChild(clearButton);
    appbody.appendChild(videoPlayer);

    function addVideos() {
        const files = fileInput.files;
        videos = []; // Clear the existing videos

        for (let i = 0; i < files.length; i++) {
                        const videoURL = URL.createObjectURL(files[i]);
            videos.push(videoURL);
        }
    }

    // Function to clear the video feed
    function clearVideos() {
        videos = [];  // Clear the video array
        videoPlayer.src = '';  // Clear the video player source
        alert("Video feed has been cleared."); // Optional notification
    }

    function playVideos() {
        if (videos.length === 0) {
            alert("No videos to play!");
            return;
        }

        let currentVideoIndex = 0;

        function playNextVideo() {
            if (currentVideoIndex < videos.length) {
                videoPlayer.src = videos[currentVideoIndex];
                
                // Hide controls initially for each clip
                videoPlayer.controls = false; 

                videoPlayer.play().then(() => {
                    // Show controls on hover
                    videoPlayer.addEventListener('mouseover', function() {
                        videoPlayer.controls = true; // Show controls when hovered
                    });

                    videoPlayer.addEventListener('mouseout', function() {
                        // Optionally hide controls again when not hovered
                        videoPlayer.controls = false; // Change this logic based on your needs
                    });

                    videoPlayer.onended = function() {
                        currentVideoIndex++;
                        playNextVideo(); // Play the next video, which will hide controls again
                    };
                }).catch(error => {
                    console.error("Playback failed:", error);
                    currentVideoIndex++;
                    playNextVideo();
                });
            } else {
                alert("All videos have finished playing!");
                videoPlayer.controls = true; // Restore controls after all videos
            }
        }

        playNextVideo(); // Start playing the first video
    }

    bringToFront(app.id);
}
