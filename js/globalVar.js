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
let currentAssigned = [];
let contactList = [];
let mediaQuery = window.matchMedia("(max-width: 1200px)");
let assignedContacts = [];
let dropClicked = false;
let subtasks = [];
let tasks = [];
let previouslySelectedContact;
let datesForSummary = [];
let greetingIsLoaded = 'false';
let categories = [];
let newCat = 0;
let contactClicked;
let newTaskStatus = null;
let formValidatorActive = 0;
let guest = {
    name: "Guest",
    email: "guest",
    password: "",
    contacts: contactList
};
const storageToken = 'SKJ8MQPWD1GEH3CAS71VTWBXR0RFFCA7K90O1BVC';
const storageUrl = 'https://remote-storage.developerakademie.org/item';