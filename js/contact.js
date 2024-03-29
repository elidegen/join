/**
 * initialize contacts page
 */
function init() {
  includeHTML(3);
  loadContactList();
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
async function loadContactList() {
  await sortContacts('firstName');
  createContactRightSide();
  contactList = JSON.parse(await backend.getItem('contactList')) || [];
  renderContactList(contactList);
}

/**
 * closes popup and dark background on contacts page
 */
function closeFullscreenContacts() {
  document.getElementById('popUpWindow').classList.remove('show');
  setTimeout(() => {
    document.getElementById('fullscreenBackground').classList.add('d-none');
  }, 750);
}

/**
 * opens popup where you can add contact
 */
function newContactPopup() {
  document.getElementById('fullscreenBackground').classList.remove('d-none');
  document.getElementById('popUpWindow').classList.add('show');
  document.getElementById('popUpWindow').innerHTML = renderNewContactPopup();
}

/**
 * opens popup where you can edit contact
 */
function editContactPopup(i) {
  document.getElementById('fullscreenBackground').classList.remove('d-none');
  document.getElementById('popUpWindow').classList.add('show');
  let initials = contactList[i].firstName.charAt(0) + contactList[i].lastName.charAt(0);
  document.getElementById('popUpWindow').innerHTML = renderEditContactPopup(i, initials);
}

/**
 * renders contactList depending on if there are contacts available
 */
function renderContactList(contactList) {
  document.getElementById('renderContacts').innerHTML = contactList.length > 0 ? generateContactList() : noContactsHTML();
}

/**
 * @returns html code for contactList section
 */
function generateContactList() {
  let currentLetter = "";
  let html = "";
  for (let i = 0; i < contactList.length; i++) {
    let contact = contactList[i];
    let firstLetter = contact.firstName[0];
    let letterSectionJSON = createContactListSections(firstLetter, currentLetter, html);
    currentLetter = letterSectionJSON.currentLetter;
    html = letterSectionJSON.html;
    html = createContactListElements(i, contact, html);
  }
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
async function sortContacts(param) {
  contactList = await JSON.parse(await backend.getItem('contactList')) || [];
  contactList.sort((a, b) => {
    if (a[param] < b[param])
      return -1;

    if (a[param] > b[param])
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
      id: contactList[i].id
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
  await loadContactList();
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
    addContactToList(await createContactObject(nameAdd.value, emailAdd.value, telAdd.value));
    await saveContactList();
    closeFullscreenContacts();
    await loadContactList();
    openNewContact(emailAdd.value);
  }
}

/**
 * opens new created contact by comparing email of new contact
 */
function openNewContact(contactEmail) {
  for (let i = 0; i < contactList.length; i++) {
    if(contactList[i].email == contactEmail){
      loadContactInfo(i);
    }    
  }
}

/**
 * Creates a new contact object based on the provided name, email, and phone.
 * @param {string} name - The full name of the contact.
 * @param {string} email - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {object} The newly created contact object.
 */
async function createContactObject(name, email, phone) {
  let cleanName = clearName(name);
  const firstName = capitalizeFirstLetter(cleanName.split(' ')[0]);
  const lastName = capitalizeFirstLetter(cleanName.split(' ')[1] || '');
  return {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phone: phone,
    userColor: getRandomColor(),
    user: currentUser.email,
    id: await generateContactID()
  };
}

/**
 * returns an id for new contact that is unique
 */
async function generateContactID() {
  await sortContacts('id');
  let contactID = 0;
  for (let i = 0; i < contactList.length; i++) {
    if (contactList[i].id == contactID) {
      contactID = contactList[i].id + 1;
    } else {
      return contactID;
    }
  }
  return contactID;
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
  loadContactList();
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
  backend.setItem('tasks', tasks);
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