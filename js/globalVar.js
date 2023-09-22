let links = [true, false, false, false];
let id;
let index;
let priorityClicked = 'unclicked';
let mobileView;
let currentDrag;
let currentColor;
let currentCategory;
let users = [];
let currentUser;
const storageToken = 'SKJ8MQPWD1GEH3CAS71VTWBXR0RFFCA7K90O1BVC';
const storageUrl = 'https://remote-storage.developerakademie.org/item';
let currentAssigned = [];
let contactList = [
    // {
    //     firstName: firstName,
    //     lastName: lastName,
    //     email: email,
    //     phone: phone,
    //     userColor: getRandomColor(),
    //     user: currentUser.email
    // }
];
let mediaQuery = window.matchMedia("(max-width: 1200px)");
let assignedContacts = [];
let dropClicked = false;
let subtasks = [];
let tasks = [];
let previouslySelectedContact;
let datesForSummary = [];
let greetingIsLoaded = 'false';
// let colors = ['#F94144', '#F3722C', '#F8961E', '#F9844A', '#F9C74F', '#90BE6D', '#43AA8B', '#4D908E', '#277DA1', '#2A9D8F'];
let categories = [];
let newCat = 0;
let contactClicked;
let newTaskStatus = null;