function TodoList() {
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
    var appsname = "TodoList";
    var taskList = document.createElement('ul');
    var taskInput = document.createElement('input');
    var taskTimeInput = document.createElement('input');
    var amPmSelect = document.createElement('select');
    var addButton = document.createElement('button');
    var tasks = [];

    app.scroll = false;
    appbody.scroll = true;
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

    appbody.appendChild(taskInput);
    appbody.appendChild(taskTimeInput);
    appbody.appendChild(amPmSelect);
    appbody.appendChild(addButton);
    appbody.appendChild(taskList);

    addButton.innerText = 'Add Task';
    addButton.style.margin = '10px';
    addButton.style.fontSize = '40px';
    addButton.onclick = addTask;

    taskInput.placeholder = 'Task Description';
    taskInput.type = 'text';
    taskInput.style.width = '40%'
    taskTimeInput.type = 'text';
    taskTimeInput.style.width = '40%';
    taskTimeInput.placeholder = 'Set Time (HH:MM)';
    
    // AM/PM selection
    var amPmOptions = ['AM', 'PM'];
    amPmOptions.forEach(option => {
        var opt = document.createElement('option');
        opt.value = option;
        opt.innerText = option;
        amPmSelect.appendChild(opt);
    });

    function addTask() {
        var description = taskInput.value;
        var time = taskTimeInput.value;
        var amPm = amPmSelect.value;
        
        if (description) {
            var taskItem = document.createElement('li');
            taskItem.innerText = description;

            // Create delete button for the task
            var deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.style.marginLeft = '10px';

            deleteButton.onclick = function() {
                taskList.removeChild(taskItem);
                clearTimeout(taskItem.timeoutId); // Clear notification if exists
            };

            taskItem.appendChild(deleteButton);

            // Set up time notification if a time is provided
            if (time) {
                var [hours, minutes] = time.split(':').map(Number);
                if (amPm === 'PM' && hours < 12) hours += 12; // Convert to 24-hour format
                if (amPm === 'AM' && hours === 12) hours = 0; // Midnight case

                var now = new Date();
                var targetTime = new Date();
                targetTime.setHours(hours);
                targetTime.setMinutes(minutes);
                targetTime.setSeconds(0);

                // Calculate the delay until the notification
                var delay = targetTime - now;

                if (delay > 0) {
                    taskItem.timeoutId = setTimeout(function() {
                        pushNotification(appsname, "Time to do: " + description);
                    }, delay);
                } else {
                    alert("The time set has already passed.");
                }
            }

            // Append the task item to the list
            taskList.appendChild(taskItem);
            taskInput.value = ''; // Clear input field
            taskTimeInput.value = ''; // Clear time input field
            amPmSelect.selectedIndex = 0; // Reset AM/PM selection
        } else {
            alert("Please enter a task description.");
        }
    }

    bringToFront(app.id);
}
