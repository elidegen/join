/**
 * this function gets the contactlist from backend
 */
async function setUserContacts() {
    contactList = JSON.parse(await backend.getItem('contactList')) || [];
}

/**
 * pushes tasks in backend
 */
async function setBackendTasks() {
    console.log('setbackendtasks obvi useless function');
    let arrayAsText = JSON.stringify(tasks);
    await backend.setItem('tasks', arrayAsText);
}

/**
 * pulls tasks in backend
 */
async function getBackendTasks() {
    let arrayAsText = await backend.getItem('tasks');
    if (arrayAsText) {
        tasks = await JSON.parse(arrayAsText);
    }
}

/**
 * will empty a div of certain id
 * @param {string} id id of div you want to clear
 */
function empty(id) {
    document.getElementById(id).innerHTML = '';
}

/**
 * @returns will return a random color from the array
 */
function getRandomColor() {
    let userColors = ['#ff7f50', '#83bdbf', '#609669', '#7a76e5', '#f77fbe', '#ffcf40', '#b35252', '#5398fe']; // orange türkis grün lila rosa gelb rot blau
    return userColors[Math.round(Math.random() * (userColors.length - 1))];
}

/**
 * will show the delete popup
 * @param {number} i index of contact
 */
function deletePopUp(i) {
    document.getElementById('deleteBackground').classList.remove('d-none');
    setTimeout(() => {
        document.querySelector('.deletePopup').classList.add('show');
        contactClicked = i;
    }, 100);
}

/**
 * will close the delete popup
 */
function closeDeletePopUp() {
    document.querySelector('.deletePopup').classList.remove('show');
    setTimeout(() => {
        document.getElementById('deleteBackground').classList.add('d-none');
        contactClicked = null;
    }, 750);
}