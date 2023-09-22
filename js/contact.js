/**
 * initialize contacts page
 */
function init() {
  includeHTML(3);
  loadContact();
}

/**
 * checks if mobile view and exit contact fullscreen if desktop page
 */
window.onresize = checkWidth;
function checkWidth() {
  if (window.innerWidth > 800) {
    exitContact();
  }
}

/**
 * loads contacts from backend and renders contactlist on the left
 */
async function loadContact() {
  await sortContacts();
  createContactRightSide();
  await downloadFromServer();
  contactList = JSON.parse(backend.getItem('contactList')) || [];
  renderContactList(contactList);
}

/**
 * closes popup and dark background on contacts page
 */
function closeFullscreenContacts() {
  document.getElementById('popUpWindow').classList.add('d-none');
  document.getElementById('fullscreenBackground').classList.add('d-none');
}

/**
 * opens popup where you can add contact
 */
function newContactPopup() {
  document.getElementById('fullscreenBackground').classList.remove('d-none');
  document.getElementById('popUpWindow').classList.remove('d-none');
  document.getElementById('popUpWindow').innerHTML = renderNewContactPopup();
}

/**
 * opens popup where you can edit contact
 */
function editContactPopup(i) {
  document.getElementById('fullscreenBackground').classList.remove('d-none');
  document.getElementById('popUpWindow').classList.remove('d-none');
  let initials = contactList[i].firstName.charAt(0) + contactList[i].lastName.charAt(0);
  document.getElementById('popUpWindow').innerHTML = renderEditContactPopup(i, initials);
}

/**
 * generates list of contacts on the left side of screen
 */
function renderContactList(contactList) {
  if (contactList.length > 0) {
    let currentLetter = "";
    let html = "";
    for (let i = 0; i < contactList.length; i++) {
      let contact = contactList[i];
      let firstLetter = contact.firstName[0];
      let result = createContactListSections(firstLetter, currentLetter, html);
      currentLetter = result.currentLetter;
      html = result.html;
      html = createContactListElements(i, contact, html);
    }
    document.getElementById('renderContacts').innerHTML = html;
  } else {
    document.getElementById('renderContacts').innerHTML = noContactsHTML();
  }
}

/**
 * creates a single section of contact list
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
 * generates the area where your clicked contact will be shown in full detail
 */
function createContactRightSide() {
  document.getElementById('contactDisplay').innerHTML = displayContactHTML();
}

/**
 * displays clicked contact[i] on right side
 */
function loadContactInfo(i) {
  if (window.innerWidth <= 800) {
    document.getElementById('contactDisplay').classList.add('d-block');
    document.getElementById('contactList').classList.add('d-none');
  } else {
    changeBackgroundColor(i);
  }
  document.getElementById('contactDetails').innerHTML = contactDetailsHTML(i, contactList);
}

/**
 * exit fullscreen view of contact in mobile view
 */
function exitContact() {
  document.getElementById('contactDisplay').classList.remove('d-block');
  document.getElementById('contactList').classList.remove('d-none');  
}


/**
 * Generates HTML code for contact information sorted by first name.
 * @param {Array} contactList - An array of contact objects.
 * @param {string} a.firstName - The first name of a contact object.
 * @param {string} b.firstName - The first name of another contact object.
 * @returns {string} HTML code for the contact information.
 */
async function sortContacts() {
  await downloadFromServer();
  contactList = await JSON.parse(backend.getItem('contactList')) || [];
  contactList.sort((a, b) => {
    if (a.firstName < b.firstName)
      return -1;

    if (a.firstName > b.firstName)
      return 1;

    return 0;
  });
  await backend.setItem('contactList', JSON.stringify(contactList));
}

/**
 * Generates HTML code for a sorted list of contacts.
 * @returns {string} HTML code for the contact list.
 */
async function sortContactsList() {
  await downloadFromServer();
  contactList = await JSON.parse(backend.getItem('contactList')) || [];
  await contactList.sort(function (a, b) {
    if (a.firstName < b.firstName)
      return -1;
    if (a.firstName > b.firstName)
      return 1;

    return 0;
  });
  await backend.setItem('contactList', JSON.stringify(contactList));
}

/**
 * Changes the background color of the selected contact and removes the selection from the previous contact.
 */
function changeBackgroundColor(i) {
  let previousSelectedContact = document.querySelector(".selected");
  if (previousSelectedContact) {
    previousSelectedContact.classList.remove("selected");
  }
  document.getElementById(`contact-${i}`).classList.add("selected");
}

/**
 * Updates the background color of the logo overlay to the specified color.
 * @param {string} color - The new background color for the logo overlay.
 */
function updateSelectedColor(color) {
  const logoOverlay = document.querySelector(".logoOverlay");
  logoOverlay.style.backgroundColor = color;
}

/**
 * Saves the edited contact information.
 * @param {number} i - The index of the contact being edited.
 */
async function saveEditContact(i) {
  if (checkFormEditContact(i)) {
    let contactDetails = getContactDetails();
    let firstName = contactDetails.name.split(" ")[0];
    let lastName = contactDetails.name.split(" ")[1];
    firstName = firstName.charAt(0).toUpperCase() + (firstName).slice(1).toLowerCase();
    lastName = lastName.charAt(0).toUpperCase() + (lastName).slice(1).toLowerCase();
    let updatedContact = {
      firstName: firstName,
      lastName: lastName,
      email: contactDetails.email,
      phone: contactDetails.tel,
      user: currentUser.email,
      userColor: contactList[i].userColor,
    };
    await checkExistingContact(i, updatedContact);
  }
}

/**
 * Retrieves the contact details from the input fields.
 * @returns {Object} - An object containing the email, name, and telephone number.
 */
function getContactDetails() {
  let email = document.getElementById("emailEdit").value;
  let name = document.getElementById("nameEdit").value;
  let tel = document.getElementById("telEdit").value;
  return {
    email: email,
    name: name,
    tel: tel
  };
}

/**
 * Checks if contact already exists and performs necessary updates.
 * @param {number} i - The index of the contact being checked.
 * @param {Object} updatedContact - The updated contact object.
 */
async function checkExistingContact(i, updatedContact) {
  await updateAssigned(i, updatedContact);
  updateContact(i, updatedContact);
  await backend.setItem('contactList', JSON.stringify(contactList));
  closeFullscreenContacts();
  await loadContact();
  loadContactInfo(generateExistingContactIndex(updatedContact));
}

/**
 * Checks if an existing contact already exists and performs necessary updates.
 * @param {number} i - The index of the contact being checked.
 * @param {Object} updatedContact - The updated contact object.
 */
function generateExistingContactIndex(updatedContact) {
  return contactList.findIndex(contact =>
    contact.phone === updatedContact.phone
  );
}

/**
 * Updates the contact in the contact list with the updated contact information.
 * @param {number} existingContactIndex - The index of the existing contact to be updated.
 * @param {Object} updatedContact - The updated contact object.
 */
function updateContact(existingContactIndex, updatedContact) {
  contactList = contactList.map((contact, index) => {
    if (index === existingContactIndex) {
      return {
        ...contact,
        firstName: updatedContact.firstName,
        lastName: updatedContact.lastName,
        email: updatedContact.email,
        phone: updatedContact.phone,
      };
    }
    return contact;
  });
}

/**
 * Saves a new contact to the contact list if the form has been validated.
 */
async function saveContact() {
  if (checkFormAddContact()) {
    addContactToList(createContactObject(nameAdd.value, emailAdd.value, telAdd.value));
    await saveContactList();
    closeFullscreenContacts();
    loadContact();
  }
}

/**
 * Creates a new contact object based on the provided name, email, and phone.
 *
 * @param {string} name - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {object} The newly created contact object.
 */
function createContactObject(name, email, phone) {
  const firstName = capitalizeFirstLetter(name.split(' ')[0]);
  const lastName = capitalizeFirstLetter(name.split(' ')[1] || '');

  return {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    userColor: getRandomColor(),
    user: currentUser.email
  };
}

/**
 * Adds the provided contact object to the contactList array.
 * @param {object} contact - The contact object to be added to the contactList.
 */
function addContactToList(contact) {
  contactList.push(contact);
}

/**
 * Saves the contactList array to the backend storage.
 */
async function saveContactList() {
  await backend.setItem('contactList', JSON.stringify(contactList));
}

/**
 * Capitalizes the first letter of a string and lower case the rest.
 * @param {string} str - The input string.
 * @returns {string} The modified string.
 */
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
Deletes a contact from the contact list.
@param {number} i - The index of the contact to be deleted.
*/
async function deleteContact(i) {
  await removeContactFromTask(i);
  contactList.splice(i, 1);
  await backend.setItem('contactList', JSON.stringify(contactList));
  loadContact();
  contactClicked = null;
  exitContact();
}

/**
 * removes the deleted contact from assigned tasks
 */
async function removeContactFromTask(i) {
  await getBackendTasks();
  let deletedContact = contactList[i];
  tasks.forEach(task => {
    task.assignedTo.forEach(assignedContact => {
      if (deletedContact.phone == assignedContact.phone) {
        task.assignedTo.splice(task.assignedTo.indexOf(assignedContact), 1);
      }
    });
  });
  setBackendTasks();
}

/**
 * sets the current contact as assigned
 * @param {number} i index of contact
 */
async function setContact(i) {
  await openPopup('todoTask');
  document.getElementById('assignedAddTask').innerHTML = '';
  document.getElementById(`check${i}`).src = '../img/blackCircle.png';
  assignedContacts.push(contactList[i]);
  document.getElementById('assignedAddTask').innerHTML += /*html */`            
    <div class="contactBubble" style="background-color: ${contactList[i]['userColor']};">${(contactList[i]['firstName']).charAt(0)}${(contactList[i]['lastName']).charAt(0)}</div>
  `;
}