// NEW SUMMARY JS
async function initSummary() {
    includeHTML(0); //
    await getCurrentUser(); //
    await getBackendTasks(); // 
    getTaskCount(); //
    getUpcomingDeadline(); //
    greeting();
    greetingInMobile();
}

/**
 * greet User with the right name, loaded out of backend 
 */
async function getCurrentUser() {
    currentUser = JSON.parse(await backend.getItem('currentUser'));
    document.getElementById('profileName').innerHTML = currentUser.name;
}

/**
 * greet user only in mobile view
 */
function greetingInMobile() {
    let container = document.getElementById('greetingAnimation');
    greetingIsLoaded = localStorage.getItem('greetingLoaded');
    if (greetingIsLoaded == 'false') {
        animationGreeting(container);
    }
}

/**
 * play greeting animation 
 * @param {element} container greeting animation container 
 */
function animationGreeting(container) {
    container.classList.remove('d-none');
    greetingIsLoaded = 'true';
    localStorage.setItem('greetingLoaded', greetingIsLoaded);
    setTimeout(() => container.style.opacity = 0, 1000);
    setTimeout(() => container.classList.add('d-none'), 3000);
}

/**
 * get counts of how many tasks of certain type are in board
 */
async function getTaskCount() {
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
 * greet the user different, when its morning or evening..
 */
function greeting() {
    let transition = document.getElementById('greetingAnimation');
    let hour = new Date().getHours();
    let greeting;
    if (hour < 12) greeting = "Good morning,";
    else if (hour < 18) greeting = "Good afternoon,";
    else greeting = "Good evening,";
    if (transition) {
        transition.innerHTML = getGreetingHTML(greeting);
    }
    document.getElementById("greetingContainer").innerHTML = greeting;
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

function redirectToBoard() {
    window.location.href = "../html/board.html";
}