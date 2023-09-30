// NEW SUMMARY JS
async function initSummary() {
    includeHTML(0); //
    await getCurrentUser(); //
    greeting();
    await getBackendTasks(); // 
    getTaskNumbers(); //
    getUpcomingDeadline(); //
}

/**
 * adjust greeting container if screen size changes
 */
window.addEventListener('resize', checkGreetContainer);
function checkGreetContainer() {
    console.log('checkgreet');
    if (window.innerWidth > 1200) {
        document.getElementById('greeting').classList.remove('d-none');
    } else {
        document.getElementById('greeting').classList.add('d-none');
    }
}

/**
 * greet User with the right name, loaded out of backend 
 */
async function getCurrentUser() {
    currentUser = JSON.parse(await backend.getItem('currentUser'));
    document.getElementById('profileName').innerHTML = currentUser.name;
}

/**
 * get counts of how many tasks of certain type are in board
 */
async function getTaskNumbers() {
    let status = ['todoTask', 'awaitingFeedbackTask', 'inProgressTask', 'doneTask'];
    for (let i = 0; i < status.length; i++) {
        getTasksCount('status', status[i]);
    }
    document.getElementById('tasksInBoard').innerHTML = tasks.length;
    getTasksCount('prio', 'Urgent');
}

/**
 * returns how many of param are inside loc inside the tasks array
 * @param {string} loc location in tasks[i] where to search
 * @param {string} param you searching for the amount of param inside loc
 */
function getTasksCount(loc, param) {
    let bubble = document.getElementById(param);
    let count = 0;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i][loc] == param) {
            count++;
        }
    }
    bubble.innerHTML = count;
}

/**
 * greet the user different, depending on daytime.
 */
function greeting() {
    console.log('greeting');
    // debugger
    greetingIsLoaded = localStorage.getItem('greetingLoaded');
    document.getElementById("greetingContainer").innerHTML = getDayTime();
    if (window.innerWidth < 1201 && greetingIsLoaded == 'false') {
        document.getElementById('greeting').classList.add('greetingAnimation');
        greetingIsLoaded = 'true';
        localStorage.setItem('greetingLoaded', greetingIsLoaded);
    } else if(window.innerWidth < 1201 && greetingIsLoaded == 'true') {
        document.getElementById('greeting').classList.add('d-none');
    }    
}

/** 
 * @returns greeting according to daytime
 */
function getDayTime() {
    let hour = new Date().getHours();
    if (hour < 12) return "Good morning,";
    else if (hour < 18) return "Good afternoon,";
    else return "Good evening,";
}

/**
 * gets the next coming date in tasks, and displays the next coming deadline.
 */
function getUpcomingDeadline() {
    tasks.forEach(task => {
        datesForSummary.push(`${task['dueDate']}`);
    });
    datesForSummary.sort();
    document.getElementById('summaryDate').innerHTML = datesForSummary[0];
    if (tasks.length == 0) {
        document.getElementById('summaryDate').innerHTML = 'No Tasks available';
    }
}

/**
 * redirects to board
 */
function redirectToBoard() {
    window.location.href = "../html/board.html";
}