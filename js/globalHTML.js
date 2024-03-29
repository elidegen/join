
//login

//summary
function getGreetingHTML(greeting) {
    return `
    <div class="greetingAnimation">
        <h1>${greeting}</h1>
         <span class="blue-text">
            <h1>${currentUser['name']}</h1>
         </span>
    </div>
    `;
}

//board

/**
 * this function returns the HTML code that is used to render the edit popup
 * @returns HTML code for the edit popup
 */
function renderPopup() {
    return /*html*/ `
    <h1>Add Task</h1>
        <img class="close" style="z-index: 999;" onclick="closeFullscreen()" src="../img/blackCross.svg">
        <div class="addTaskLR">
            <div class="addTaskLeft">
                <div class="center">
                    <h4>Title</h4>
                    <input  id="titleField" type="text" class="textAreaStyle1" placeholder="enter a Title">
                    <span class="formValidate" id="validateTitle"> </span>
                    <h4>Description</h4>
                    <textarea  id="descriptionField" class="textAreaStyle1" placeholder="enter a description"></textarea>
                    <span class="formValidate" id="validateDescription"> </span>
                    <h4>Category</h4>
                    <div class="d-none" id="newCategory">
                        <input id="customCategory" type="text" placeholder="new Category">
                        <div>
                            <img onclick="reverseCategory()" src="../img/blackCross.svg"><img id="tick"
                                onclick="addCustomCategory()" src="../img/tick.svg">
                        </div>
                    </div>
                    <div class="dropdown" id="categoryDropdown">
                        <button type="button" onclick="showDropdown('myDropdown')" class="dropbtn">
                            <span id="dropbtnCategory">choose Category</span>
                            <img src="../img/arrowDropDown.png">
                        </button>
                        <div id="myDropdown" class="dropdown-content d-none">
                        </div>
                    </div>
                    <div class="d-none" id="categoryColors">
                        <div class="categoryColor" id="1" style="background-color: #8aa4ff;"
                            onclick="chooseColor(1, '#8aa4ff')"></div>
                        <div class="categoryColor" id="2" style="background-color: #ff0000;"
                            onclick="chooseColor(2, '#ff0000')"></div>
                        <div class="categoryColor" id="3" style="background-color: #2ad300;"
                            onclick="chooseColor(3, '#2ad300')"></div>
                        <div class="categoryColor" id="4" style="background-color: #ff8a00;"
                            onclick="chooseColor(4, '#ff8a00')"></div>
                        <div class="categoryColor" id="5" style="background-color: #e200be;"
                            onclick="chooseColor(5, '#e200be')"></div>
                        <div class="categoryColor" id="6" style="background-color: #0038ff;"
                            onclick="chooseColor(6, '#0038ff')"></div>
                    </div>
                    <span class="formValidate" id="validateCategory"> </span>
                    <h4>Assigned to</h4>
                    <div class="dropdown">
                        <button type="button" onclick="showDropdown('myAssignedDropdown')" class="dropbtn">
                            <span id="dropbtnAssigned">choose Contact</span>
                            <img src="../img/arrowDropDown.png"></button>
                        <div id="myAssignedDropdown" class="dropdown-content d-none">
                        </div>
                    </div>
                    <div id="assignedAddTask"></div>
                    <span class="formValidate" id="validateAssigned"> </span>
                </div>
            </div>
            <div class="centerLine">
                <div class="dividingLine"></div>
            </div>
            <div class="addTaskRight">
                <div class="center">
                    <h4>Due date</h4>
                    <input  id="dueDateField" name="dueDateField" class="textAreaStyle1" type="date">
                    <span class="formValidate" id="validateDueDate"> </span>
                    <h4>Prio</h4>
                    <div id="prioField" class="prio">
                        <div id="Urgent-button" onclick="changeColor('Urgent')" class="button1">Urgent <img
                                id="Urgent" src="../img/prioUrgent.svg"></div>
                        <div id="Medium-button" onclick="changeColor('Medium')" class="button1">Medium<img id="Medium" src="../img/prioMedium.svg"></div>
                        <div id="Low-button" onclick="changeColor('Low')" class="button1">Low <img id="Low"
                                src="../img/prioLow.svg"></div>
                    </div>
                    <span class="formValidate" id="validatePrio"> </span>
                    <h4>Subtasks</h4>
                    <div id="subtaskField">
                        <div>
                            <input id="subtaskInput" type="text" placeholder="new Subtask">
                            <img onclick="addSubtask()" src="../img/tick.svg">
                        </div>
                    </div>
                </div>
            </div>
            <div class="finishButtons">
                <button class="buttonGlobal2" onclick="closeFullscreen()">Cancel</button>
                <button class="buttonGlobal1" id="createTaskButton" onclick="createTask()">Create Task</button>
            </div>
        </div>
    `;
}

/** 
 * this function generates the html code of the task with index i
 */
function generateTaskHTML(i) {
    return /*html */`
        <div draggable="true" onclick="openTask(${i})" ondragstart="startDragging(${i}), tilt(${i})" ondragend="tilt(${i})" class="todoBox" id="task${i}">
            <p class="category" id="category${i}">${tasks[i]['category']['name']}</p>
            <h4>${tasks[i]['title']}</h4>
            <p class="taskDescription">${tasks[i]['description']}</p>
            <div class="subtaskTrack" id="subtaskTrack${i}"></div>
            <div class="contactPrio" id="contactPrio${i}"></div>
            <div onclick="stopProp(event); deletePopUp(${i})" class="trash"></div>
            <div onclick="stopProp(event); moveTask(${i})" class="drag colorChanged" id="mobileDrag"></div>
        </div>
    `;
}

/**
 * this function returns the html code which is needed to render the subtask bar
 * @param {number} i this is the index of the task of which you want to render the subtaskbar
 * @param {number} howmanyDone this number shows how many subtasks are already done
 * @returns HTML code for the subtaskbar
 */
function generateSubtaskHTML(i, howmanyDone) {
    return /*html*/`
        <div class="subtaskBar">
            <div class="subtaskProgress" id="subtaskProgress${i}"></div>
        </div>
        <p>${howmanyDone}/${tasks[i]['subtasks'].length} Done</p>
    `;
}

function renderContactPrioHTML(i) {
    return /*html*/`
        <div class="assigned" id="assigned${i}"></div>
        <img class="prioIcon" src="../img/prio${tasks[i]['prio']}.svg">
    `;
}

/**
 * this function returns the html code of the task popup
 * @param {number} i index of task
 * @returns HTML of popup
 */
function generateFullscreenTaskHTML(i) {
    return /*html*/`        
        <div class="FsTopBar">
            <div class="FsCategory" style="Background-color: ${tasks[i]['category']['color']};">${tasks[i]['category']['name']}</div>
            <img onclick="closeFullscreen()" src="../img/blackCross.svg">
        </div>
        <div class="FsTitle">
            <h1>${tasks[i]['title']}</h1>
        </div>
        <div class="FsDescription">
            <p>${tasks[i]['description']}</p>
        </div>
        <div class="FsDate">
            <h4>Due Date:</h4><p class="marginLeft">${tasks[i]['dueDate']}</p>                
        </div>
        <div class="FsDate">
            <h4>Priority:</h4><div class="marginLeft FsPrio bg-${tasks[i]['prio']}">${tasks[i]['prio']} <img src="../img/prio${tasks[i]['prio']}White.svg"></div>               
        </div>
        <div class="FsSubtasks">
            <h4>Subtasks:</h4><div id="subtasksFs"></div>
        </div>
        <div class="FsAssigned">
            <h4>Assigned To:</h4>
            <div id="assigned"></div>
        </div>
        <div class="buttonPosition">
        <div class="buttonGlobal1" style="padding: 0 15px !important;" onclick="editTask(${i})">
            <img src="../img/whitePencil.svg">
        </div>
    </div>
    `;
}

function generateMoveToHTML() {
    return /*html*/`
        <div class="moveDiv">
            <div onclick="stopProp(event); renderTasks()" class="dragEdit colorChanged" id="mobileDrag"></div>
            <div class="dragLinks">
                <h4>Move To:</h4>
                <div class="dragLink" onclick="stopProp(event); moveTo('todoTask')">Todo</div>
                <div class="dragLink" onclick="stopProp(event); moveTo('inProgressTask')">In progress</div>
                <div class="dragLink" onclick="stopProp(event); moveTo('awaitingFeedbackTask')">Awaiting Feedback</div>
                <div class="dragLink" onclick="stopProp(event); moveTo('doneTask')">Done</div>
            </div>
        </div>
    `;
}

function generateAssignedHTML(element) {
    return /*html */`
    <div class="assignedContact">
        <div class="contactBubble" style="background-color: ${element['userColor']};">${element['firstName'].charAt(0)}${element['lastName'].charAt(0)}</div>
        <p> ${element['firstName']} ${element['lastName']}</p>
    </div>
`;
}

/**
 * this function returns the html code that is required to render the edit view
 * @param {number} i index of task
 * @param {string} title title of task
 * @param {string} description description of task
 * @param {date} dueDate due date of task
 * @returns 
 */
function renderEditTaskHTML(i, title, description, dueDate) {
    return /*html*/`
        <div class="FsTopBar">
            <div class="FsCategory" style="Background-color: ${tasks[i]['category']['color']};">${tasks[i]['category']['name']}</div>
            <img onclick="closeFullscreen()" src="../img/blackCross.svg">
        </div>
        <div class="FsDescription">
        <h4>Title:</h4>
            <input id="inputTitle"  type="text" value="${title}">
        </div>
        <span class="formValidate" id="validateTitle"> </span>
        <div class="FsDescription">
        <h4>Description:</h4>
            <textarea id="inputDescription"  type="text">${description}</textarea>
        </div>
        <span class="formValidate" id="validateDescription"> </span>
        <div class="FsDescription">
        <h4>Due Date:</h4>
            <input id="inputDueDate"  name="dueDateField" type="date" value="${dueDate}">             
        </div>
        <span class="formValidate" id="validateDueDate"> </span>
        <div class="FsDescription">
            <h4>Priority:</h4>
            <div class="prioBtnEdit">
                <div id="Urgent-buttonEdit" onclick="changeColorEdit('Urgent')" class="button1">Urgent<img id="UrgentEdit" src="../img/prioUrgent.svg"></div>
                <div id="Medium-buttonEdit" onclick="changeColorEdit('Medium')" class="button1">Medium<img id="MediumEdit" src="../img/prioMedium.svg"></div>
                <div id="Low-buttonEdit" onclick="changeColorEdit('Low')" class="button1">Low<img id="LowEdit" src="../img/prioLow.svg"></div>              
            </div>
        <span class="formValidate" id="validatePrio"> </span>
        </div>
        <div class="FsAssigned">
            <h4>Assigned To:</h4>
            <div class="dropdown">
                <button type="button" onclick="showDropdown('myAssignedEditDropdown')" class="dropbtn dropDownPopup">
                    <span id="dropbtnAssigned">choose Contact</span>
                    <img src="../img/arrowDropDown.png"></button>
                <div id="myAssignedEditDropdown" class="dropdown-content d-none" style="width: 298px !important">
                </div>
            </div>
            <div id="assignedContactsEdit"></div>
        <span class="formValidate" id="validateAssigned"> </span>
        </div>
        <div class="buttonPosition">
        <button class="buttonGlobal1" onclick="saveEdit(index)" style="padding: 0 10px;">
            Ok<img style="filter: invert(1);" src="../img/tick.svg">
        </button>
        </div>
    `;
}

//addtask

//contacts

/**
 * this function returns the html code to load the contact info
 * @param {i} 
 * @param {contactList} 
 * @param {firstNameInitial} 
 * @param {lastNameInitial} 
 * @returns HTML code for the contactInfo
 */
function contactDetailsHTML(i, contactList) {
    return /*html*/`
        <div class="fadeIn">
            <div class="contactNameAndImg">
                <div class="miniContactPic bigContactPic" style="background-color: ${contactList[i].userColor}">${contactList[i].firstName[0].toUpperCase()}${contactList[i].lastName[0].toUpperCase()}</div>
                <div class="contactNameAndButtons">
                    <p class="contactDisplayName">${contactList[i].firstName} ${contactList[i].lastName}</p>
                    <div class="contactDetailButtons">
                        <div onclick="editContactPopup(${i})" class="editButton">
                            <img id="editIcon" src="../img/editPencilDark.svg"><p>Edit</p>
                        </div>
                        <div class="deleteButton" onclick="deletePopUp(${i})">
                            <img id="deleteIcon" src="../img/darkBinSmall.svg"><p>Delete</p>
                        </div>
                        <div onclick="setContact(${i})">
                            <p>+Add Task</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contactInformation">
                <p style="font-size: 26px;">Contact Information</p>
                <h4>E-Mail</h4>
                <a href="mailto:${contactList[i].email}">${contactList[i].email}</a>
                <h4>Phone</h4>
                <a href="tel:${contactList[i].phone}">${contactList[i].phone}</a>
            </div>
        </div>
        <img class="exitContact" src="../img/blackCross.svg" onclick="exitContact()">
    `;
}

function generateContactInfoHTML(i, contactList, firstNameInitial, lastNameInitial) {
    return /*html*/`
    <div id="contactDataContainer" class="contactDataContainer">
        <div class="closeInfoContainer" onclick="closeContactInfo()">
            <img src="/img/backArrowBlack.png">
        </div>
        <span onclick="overlayEditContact(${i})"class ="editContactMobile">
            <img src="/img/editMobile.png">
        </span>
        <div class="picAndData">
            <div class="containerFirst">
                <div id="contactImg1${i}" class="contactImg1" style="background-color: ${contactList[i]['userColor']}">
                    ${firstNameInitial}${lastNameInitial}
                </div>
                <div class="contactContainer1">
                    <div class="contactData1">
                        ${contactList[i].firstName} ${contactList[i].lastName}
                    </div>
                    <a onclick="setContact(${i})" class="addTask1">+ Add Task</a>
                </div>
            </div>
            <div class="contactInformation1">
                <div class="infoContakt1">Contact Information</div>
                <div onclick="overlayEditContact(${i})" class="editConact1">
                    <img src="/img/editPencilDark.png">Edit Contact
                </div>
                <div onclick="deletePopUp(${i})" class="contactDeleat">
                    <img src="/img/blackBin.png">Delete
                </div>
            </div>
            <div class="emailPhoneContainer">
                <div>
                    <div class="mailText">Email</div>
                    <div class="mail1">${contactList[i].email}</div>
                </div>
                <div>
                    <div class="phone1">Phone</div>
                    <div class="phoneText1">${contactList[i].phone}</div>
                </div>
            </div>
        </div>
    </div>
  `;
}

function renderEditContactPopup(i, initials) {
    return /*html*/`
            <div class="blueSide">
                <div class="blueSideContent">
                    <img src="../img/logoLight.svg">
                    <h1>Edit contact</h1>
                    <p></p>
                </div>
            </div>
            <div class="whiteSide">
                <div class="whiteSideContent">
                    <div class="miniContactPic bigContactPic" style="background-color: ${contactList[i].userColor};">${initials}</div>
                    <div class="addContactForm">
                        <div class="globalInput">
                            <input id="nameEdit" type="text" placeholder="Name" value="${contactList[i].firstName + " " + contactList[i].lastName}">
                            <img src="../img/nameIcon.png" alt="">
                        </div>
                        <div id="validateNameEdit" class="formValidate"></div>
                        <div class="globalInput">
                            <input id="emailEdit" type="email" placeholder="E-Mail" value="${contactList[i].email}">
                            <img src="../img/emailIcon.png" alt="">
                        </div>
                        <div id="validateEmailEdit" class="formValidate"></div>
                        <div class="globalInput">
                            <input id="telEdit" type="number" placeholder="Phone" value="${contactList[i].phone}">
                            <img src="../img/phoneIcon.png" alt="">
                        </div>
                        <div id="validatePhoneEdit" class="formValidate"></div>
                        <div class="overlayButtons">
                            <button class="buttonGlobal2" onclick="closeFullscreenContacts()">
                                <p>Cancel</p>
                            </button>
                            <button class="buttonGlobal1" onclick="saveEditContact(${i})">
                                <p>Save</p> <img src="../img/whiteCheckAddC.svg">
                            </button>
                        </div>
                    </div>
                </div>                
            </div>
    `;
}

function renderNewContactPopup() {
    return /*html*/`
            <div class="blueSide">
                <div class="blueSideContent">
                    <img src="../img/logoLight.svg">
                    <h1>Add contact</h1>
                    <p>Tasks are better with a Team!</p>
                </div>
            </div>
            <div class="whiteSide">
                <div class="whiteSideContent">
                    <div class="addContactImg">
                        <img src="../img/nameIconBig.png">
                    </div>
                    <div class="addContactForm">
                        <div class="globalInput">
                            <input id="nameAdd" type="text" placeholder="Name">
                            <img src="../img/nameIcon.png" alt="">
                        </div>
                        <div id="validateName" class="formValidate"></div>
                        <div class="globalInput">
                            <input id="emailAdd" type="email" placeholder="E-Mail">
                            <img src="../img/emailIcon.png" alt="">
                        </div>
                        <div id="validateEmail" class="formValidate"></div>
                        <div class="globalInput">
                            <input id="telAdd" type="number" placeholder="Phone">
                            <img src="../img/phoneIcon.png" alt="">
                        </div>
                        <div id="validatePhone" class="formValidate"></div>
                        <div class="overlayButtons">
                            <button class="buttonGlobal2" onclick="closeFullscreenContacts()">
                                <p>Cancel</p>
                            </button>
                            <button class="buttonGlobal1" onclick="saveContact()" style="width: 185px;">
                                <p>Create contact</p> <img src="../img/whiteCheckAddC.svg">
                            </button>
                        </div>
                    </div>
                </div>                
            </div>
    `;
}

/**
 * this function returns the html code to load the overlay add contact 
 * @returns HTML code for the overlay add contact
 */

function generateoverlayAddContactHTML() {
    return /*html*/`
    <div class="autoLayout">
        <img src="../img/logoLight.svg" class="addLogo">
        <span class="overlayTextAdd">Add contact</span>
        <span class="overlayText2Add">Tasks are better with a team!</span>
        <span class="overlayborderAdd"></span>
        <div class="logoOverlay">
            <img src="/img/nameIconBig.png" id="logoImg">
        </div> 
    </div>
      <div>
        <div class="containerOverRightSide">
            <img src="../img/whiteCross.png" class="closeOverlayWhite" onclick="closeAddContact()">
          <img src="/img/darkCross.png" class="closeOverlay" onclick="closeAddContact()">
          <div class="inputContainer">
            <input id="nameAdd"  type="text" class="overlayInput" placeholder="First and last name">
                        <span class="formValidate" id="validateName"></span>
            <input id="emailAdd" type="email" class="overlayInput" placeholder="E-Mail">
                        <span class="formValidate" id="validateEmail"></span>
            <input id="telAdd" class="overlayInput" placeholder="Phone"> 
                        <span class="formValidate" id="validatePhone"></span>
          </div>
          <div class="buttons">
            <button id="cancelButton" class="cancel buttonGlobal2" onclick="closeAddContact()">Cancel 
                <img src="../img/darkCross.png" alt="">
            </button>
            <button onclick="saveContact()" class="buttonGlobal1 create-contact">Create Contact
              <img src="../img/whiteCheckThin.png"> 
            </button>
          </div>
        </div>
    </div>
    `;
}

/**
 * this function returns the html code to load the right side info 
 * @returns HTML code for the right side info
 */

function displayContactHTML() {

    return /*html*/`
        <div class="headline">
          <h1>Contacts</h1>
          <div class="contactsBar"></div>
          <p class="headline2">Better with a team</p>
        </div>
        <div id="contactDetails">

        </div>
    `;
}

function generateCategoryHTML(i) {
    return /*html*/`
    <a onclick="chooseCategory('${i}')">
        ${categories[i]['name']}
        <div class="categoryX">
            <img onclick="deleteCategory(${i}, event)" src="../img/blackCross.svg">
            <div class="categoryColor" style="background-color: ${categories[i]['color']}"></div>
        </div>
    </a>
    `;
}

function forgotPwHTML() {
    return /*html*/`
        <form class="login" id="login" onsubmit="onSubmit(event);return false">
            <h1>I forgot my password</h1>
            <p class="forgotPWText">Don't worry! We will send you an email with the instructions to reset your password.</p>
            <div class="loginFields">
                <div class="globalInput">
                    <input id="email" name="email" placeholder="E-Mail"> <img src="../img/emailIcon.png">
                </div>
                <div id="wrongEmail" class="wrongLogin"></div>
            </div>
            <button class="buttonGlobal1" type="submit">
                <p>Send me the E-Mail</p>
            </button>
            <a href="../index.html" class="backBtn"><img src="../img/arrowBack.png"></a>
        </form>
        <div id="deleteBackground" class="d-none">
        <div class="deletePopup">
            <p id="confirmationPopUp">An E-Mail has been sent to you</p>
            <div>
                <button class="buttonGlobal1" onclick="closeDeletePopUp();">Ok</button>
            </div>
        </div>
    </div>
    `;
}

function signUpHTML() {
    return /*html*/`
        <div class="login">
            <h1>Sign up</h1>
            <div class="loginFields">
                <div class="globalInput">
                    <input id="name" type="text" placeholder="Username"> <img src="../img/nameIcon.png">
                </div>
                <div id="wrongName" class="wrongLogin"></div>
                <div class="globalInput">
                    <input id="email" type="email" placeholder="E-Mail"> <img src="../img/emailIcon.png">
                </div>
                <div id="wrongEmail" class="wrongLogin"></div>
                <div class="globalInput">
                    <input id="password" placeholder="Password" type="password"> <img src="../img/passwordIcon.png">
                </div>
                <div id="wrongPassword" class="wrongLogin"></div>
            </div>
            <div class="buttonGlobal1" onclick="addUser()">
                <p>Sign up</p>
            </div>
        <a href="../index.html" class="backBtn"><img src="../img/arrowBack.png"></a>
        </div>
    `;
}

function noContactsHTML() {
    return /*html*/ `
        <div class="noContacts">
            no contacts available
        </div>
    `;
}

/**
 * creates the single contact in the contact list
 */
function createContactListElements(i, contact, html) {
  html += /*html*/`
    <div class="selectContact" id="contact-${i}" onclick="loadContactInfo(${i})">
      <div id="picImg${i}" class="miniContactPic" style="background-color: ${contact['userColor']}">${contact.firstName[0].charAt(0).toUpperCase()}${contact.lastName[0].charAt(0).toUpperCase()}</div>
      <div class="contactInfoPreview">
        <div class="contactListName">${contact.firstName} ${contact.lastName}</div>
        <div class="contactListMail">${contact.email}</div>
      </div>
    </div>
  `;
  return html;
}

/**
 * creates a single section of contact list and adds to html variable
 */
function createContactListSections(firstLetter, currentLetter, html) {
  if (firstLetter.toLowerCase() !== currentLetter.toLowerCase()) {
    currentLetter = firstLetter;
    html += /*html*/`
          <div class="contactListSide">
            <div class="sortingLetter">${firstLetter.toUpperCase()}</div>
            <span class="dividingBar"></span>
          </div>
        `;
  }
  return { currentLetter, html };
}