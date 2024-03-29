async function includeHTML(x) {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
  bgDark(x);
  setInitials();
}

/**
 * bgDark()
 * @param {*} x 
 */
function bgDark(x) {
  if (x < 5) {
    document.getElementById(`side-menu-link${x}`).classList.add('bg-dark');
  } else {
    document.getElementById('questionMark').src = '../img/questionMarkDark.svg';
  }
}

/**
 * get informations from server
 */
async function setInitials() {
  currentUser = JSON.parse(await backend.getItem('currentUser')) || [];
  let profile = document.getElementById('initials');

  let firstName = (currentUser.name.split(' ')[0]).charAt(0).toUpperCase();
  profile.innerHTML = firstName;
  if (currentUser.name.split(' ')[1]) {
    let lastName = (currentUser.name.split(' ')[1]).charAt(0).toUpperCase();
    profile.innerHTML += lastName;
  }
}

/**
 * opens the dropdown in mobile view, if you click on your initials on the right top corner
 */
function openDropdown() {
  if (window.innerWidth > 1000) {
    let logout = document.getElementById('logout');
    if (logout.classList.contains('d-none')) logout.classList.remove('d-none');
    else logout.classList.add('d-none');
  }
  if (window.innerWidth < 1000) {
    let mobileDropDown = document.getElementById('mobileDropDown');
    if (mobileDropDown.classList.contains('d-none')) mobileDropDown.classList.remove('d-none');
    else mobileDropDown.classList.add('d-none');
  }
}

/**
 * close logout automatically if window width is under 1000px, close mobile dropdown automatically 
 * if window width is over 1000px
 */

window.onresize = function () {
  if (window.innerWidth < 1000 && document.getElementById('logout')) document.getElementById('logout').classList.add('d-none');
  if (window.innerWidth > 1000) document.getElementById('mobileDropDown').classList.add('d-none');
};

/**
 * leads out of join, back to the login 
 */
function logout() {
  currentUser = null;
  window.location.href = "../index.html";
}