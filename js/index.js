/**
 * Initializes the application by performing necessary setup tasks.
 */
async function init() {
    await getUserData();
    checkRememberMe();
    checkMsg();
}

/**
 * Retrieves user data from the server and populates the 'users' variable.
 */
async function getUserData() {
    users = JSON.parse(await backend.getItem('users'));
}

/**
 * Checks if the "Remember Me" option is enabled and populates the login form if necessary.
 */
function checkRememberMe() {
    let email = getLocalStorageEmail();
    let password = getLocalStoragePassword();

    if (getLocalStorageEmail() && getLocalStoragePassword()) {
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        document.getElementById('rememberMe').checked = true;
    }
}

/**
 * Retrieves the email stored in the local storage for the current user.
 * @returns {string} - The email of the current user retrieved from the local storage.
 */
function getLocalStorageEmail() {
    return localStorage.getItem('currentUser-email');
}

/**
 * Retrieves the password stored in the local storage for the current user.
 * @returns {string} - The password of the current user retrieved from the local storage.
 */
function getLocalStoragePassword() {
    return localStorage.getItem('currentUser-password');
}

/**
 * Checks if there is a message parameter in the URL and displays it on the page.
 */
function checkMsg() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    if (msg == 'success') {
        setTimeout(() => {
            document.getElementById("msgBox").classList.remove('d-none');
            document.getElementById("msgBox").classList.add('fadeIn');
        }, 1000);
        setTimeout(() => {
            document.getElementById("msgBox").classList.add('fadeOut');
        }, 3000);
        document.getElementById("msgBox").classList.add('d-none');
    }
}

/**
 * Adds a user to the system.
 */
async function addUser() {
    if (validateAddUser()) {
        await generateUser();
        createUserSuccess();
    } else {
        createUserError();
    }
}

/**
 * Displays an error message for creating a user with an invalid password.
 * @param {string} password - The invalid password.
 */
function createUserError() {
    if (!validateUsername(document.getElementById('name').value) || document.getElementById('name').value == "") {
        document.getElementById('wrongName').innerText = "Please enter a valid Username!";
    } else {
        document.getElementById('wrongName').innerText = "";
    }
    if (!validateEmail(email.value)) {
        document.getElementById('wrongEmail').innerText = "Please enter a valid E-Mail Adress!";
    } else {
        document.getElementById('wrongEmail').innerText = "";
    }
    if (!validatePassword(password.value)) {
        document.getElementById('wrongPassword').innerText = "Your password must contain at least 8 letter including a special character!";
    } else {
        document.getElementById('wrongPassword').innerText = "";
    }
}

/**
 * Redirects the user to the index page with a success message.
 */
function createUserSuccess() {
    window.location.href = 'index.html?msg=success';
}

/**
 * Generates a new user and adds it to the system.
 */
async function generateUser() {
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    users.push(createUser(name, email, password));
    await backend.setItem('users', JSON.stringify(users));
}

/**
 * Creates a new user object.
 * @returns {Object} A new user object.
 */
function createUser(name, email, password) {
    return {
        name: name.value,
        email: email.value,
        password: password.value,
    };
}

/**
 * Validates the input fields for adding a new user.
 * @returns {boolean} True if all input fields are valid, false otherwise.
 */
function validateAddUser() {
    return validateUsername(document.getElementById('name').value) &&
        validateEmail(email.value) &&
        validatePassword(password.value);
}

/**
 * Retrieves the email and password from the input fields.
 * @returns {Object} An object containing the email and password.
 */
function getEmailAndPassword() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    return {
        email: email,
        password: password
    };
}

/**
 * Performs the login operation.
 */
async function login() {
    const loginData = getEmailAndPassword();
    let user = users.find(user => user.email == loginData.email && user.password == loginData.password);
    if (user) {
        await setCurrentUser(user);
        redirectToSummary();
        setRememberMe();
    } else {
        loginFail.innerHTML = 'Wrong E-Mail or Password!';
    }
}

/**
 * Generates the current user based on the provided user information.
 * @param {Object} user - The user object containing the user information.
 */
async function setCurrentUser(user) {
    currentUser = {
        name: user.name,
        email: user.email,
        password: user.password
    };
    await backend.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('greetingLoaded', 'false');
}

/**
 * Performs a guest login by setting up a guest account.
 */
async function guestLogin() {
    await setCurrentUser(guest);
    redirectToSummary();
}

/**
 * Handles the form submission event.
 * @param {Event} event - The form submission event.
 */
// async function onSubmit(event) {
//     if (!validateEmail(email.value)) {
//         document.getElementById('wrongEmail').innerText = "Please enter a valid E-Mail Adress!";
//     } else {
//         document.getElementById('wrongEmail').innerText = "";
//         event.preventDefault();
//         await getUserData();
//         let formData = new FormData(event.target);
//         let response = await sendMail(formData); //formdata ist vermutlich nur das input feld der emailadresse
//         checkIfUserExists(response);
//     }
// }

// // Sends the password reset email
// function sendMail(formData) {
//     const input = 'https://elijah-degen.developerakademie.net/send_mail.php';
//     const requestInit = {
//         method: 'post',
//         body: formData
//     };
//     return fetch(input, requestInit);
// }

// Sends a password reset email if the user exists
async function onSubmit(event) {
    event.preventDefault();
    await getUserData();
    let mailValue = document.getElementById('email').value;
    let response = await action({ "email": mailValue });
    checkIfUserExists(response);
}

// Sends the password reset email
function action(formData) {
    const input = 'https://elijah-degen.developerakademie.net/send_mail.php';
    const requestInit = {
        method: 'post',
        body: formData
    };
    return fetch(input, requestInit);
}

/**
 * Checks if the user exists based on the response and performs corresponding animations.
 * @param {any} response - The response received from an action.
 */
function checkIfUserExists() {
    let user = users.find(user => user.email == email.value);
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        deletePopUp(999);
        document.getElementById('confirmationPopUp').innerHTML = 'An E-Mail has been sent to you';
    } else {
        deletePopUp(999);
        document.getElementById('confirmationPopUp').innerHTML = 'No user registered with this email';
    }
}

/**
 * Handles actions to be performed when the page loads. forgot password page
 */
async function onPageLoad() {
    email = getEmailUrlParameter();
    users = await getUserData();
}

/**
 * Retrieves the value of the "email" parameter from the URL query string.
 * @returns {string|null} - The value of the "email" parameter or null if it doesn't exist.
 */
function getEmailUrlParameter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    return email;
}

/**
 * Retrieves the values of the "setPassword" and "confirmPassword" input fields.
 * @returns {Object} - An object containing the values of the "setPassword" and "confirmPassword" fields.
 */
function getPasswords() {
    const setPassword = document.getElementById('setPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    return {
        setPassword: setPassword,
        confirmPassword: confirmPassword
    };
}

/**
 * Changes the password for the reset user.
 * It retrieves the passwords from the input fields, validates them,
 * updates the password for the reset user, updates the users array,
 * and redirects to the index page.
 */
async function changePassword() {
    const passwords = getPasswords();
    let resetUser = getResetUserFromLocalStorage();

    if (arePasswordsMatching(passwords.setPassword, passwords.confirmPassword)) {
        updatePassword(resetUser, passwords.confirmPassword);
        updateUsersArray();
        redirectToIndex();
    }
}

/**
 * Updates the users array with the updated reset user.
 * It retrieves the user data, finds the user with the matching email,
 * updates the users array with the updated reset user, and saves the updated users array to the backend.
 */
async function updateUsersArray() {
    await getUserData();
    let user = users.find(user => user.email == resetUser.email);
    if (user) {
        let index = users.indexOf(user);
        users.splice(index, 1, resetUser);
        await backend.setItem('users', JSON.stringify(users));
    }
}

/**
 * Redirects the user to the summary page.
 */
function redirectToSummary() {
    window.location.href = '../html/summary.html';
}

/**
 * Redirects the user to the index page.
 */
function redirectToIndex() {
    window.location.href = '../index.html';
}

/**
 * Retrieves the reset user from the local storage.
 * It retrieves the stored user data from the local storage
 * and parses it to convert it back to an object.
 * @returns {object} - The reset user object retrieved from the local storage.
 */
function getResetUserFromLocalStorage() {
    const storedUser = localStorage.getItem('user');
    return JSON.parse(storedUser);
}

/**
 * Updates the password of the specified user.
 * @param {object} user - The user object to update.
 * @param {string} newPassword - The new password to set.
 */
function updatePassword(user, newPassword) {
    user.password = newPassword;
}

/**
 * Checks if the given password and confirm password match.
 * @param {string} password - The password to compare.
 * @param {string} confirmPassword - The confirm password to compare.
 * @returns {boolean} - True if the passwords match, false otherwise.
 */
function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

/**
 * Sets the remember me data in the local storage.
 * It stores the email and password of the current user in the local storage.
 */
function setRememberMe() {
    localStorage.setItem('currentUser-email', currentUser.email);
    localStorage.setItem('currentUser-password', currentUser.password);
}

/**
 * Validates the username to ensure it contains only alphabetic characters and an optional space.
 * @param {string} username - The username to be validated.
 * @returns {boolean} - True if the username is valid, false otherwise.
 */
function validateUsername(username) {
    const regex = /^[a-zA-Z]+([a-zA-Z]+\s*)?$/;
    return regex.test(username.trim());
}

/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to be validated.
 * @returns {boolean} - True if the email address is valid, false otherwise.
 */
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Validates a password using a regular expression.
 * @param {string} password - The password to be validated.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
function validatePassword(password) {
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    const passwordRegex = /^(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
}

// Function to render the password reset page.
function renderForgotPw() {
    document.getElementById('container').innerHTML = forgotPwHTML();
}

// Function to render the sign-up page.
function renderSignUp() {
    document.getElementById('container').innerHTML = signUpHTML();
}