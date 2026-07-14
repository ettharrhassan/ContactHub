var totalContactsNumber = document.getElementById("totalContacts");
var favoriteContactsNumber = document.getElementById("favoriteContacts");
var emergencyContactsNumber = document.getElementById("emergencyContacts");

var emptyList = document.getElementById("emptyList");
var imageInput = document.getElementById("photoInput");
var fullNameInput = document.getElementById("fullName");
var phoneNumberInput = document.getElementById("phoneNumber");
var emailInput = document.getElementById("email");
var addressInput = document.getElementById("address");
var groupSelectInput = document.getElementById("groupSelect");
var notesInput = document.getElementById("notes");
var favoriteInput = document.getElementById("favorite");
var emergencyInput = document.getElementById("emergency");
var searchInput = document.getElementById("searchInput");
var contactList = [];
var selectedImage = "";

var mentionedIndex = "";

var hiddenEnvelope = document.getElementById("hiddenEnvelope");

var blueBackGround = document.getElementsByClassName("blueBackGround");
var orangeBackGround = document.getElementsByClassName("orangeBackGround");
var twoChars = document.getElementById("twoChars");
var randomColor = ["blueBackGround", "orangeBackGround"];

var nameError = document.getElementById("nameError");
var phoneError = document.getElementById("phoneError");

if (localStorage.getItem("contactList")) {
  contactList = JSON.parse(localStorage.getItem("contactList"));
}
showContact();
updateAll();

function validateForm() {
  var name = fullNameInput.value.trim();
  var nameRegex = /^[A-Za-z ]{3,50}$/;
  var phone = phoneNumberInput.value.trim();
  var egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

  if (name === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a full name!",
    });
    return false;
  }

  if (!nameRegex.test(name)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (3-50 characters)",
    });
    return false;
  }

  if (phone === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Phone",
      text: "Please enter a phone number!",
    });
    return false;
  }

  if (!egyptianPhoneRegex.test(phone)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678).",
    });
    return false;
  }

  if (!egyptianPhoneRegex.test(phone)) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678).",
    });
    return false;
  }

  var duplicateContact = getDuplicatePhoneContact(phone);
  if (duplicateContact) {
    Swal.fire({
      icon: "error",
      title: "Duplicate Phone Number",
      text: `A contact with this phone number already exists: ${duplicateContact.name}`,
    });
    return false;
  }

  return true;
}

function getInitials(name) {
  if (!name || !name.trim()) {
    return "";
  }

  var parts = name.trim().split(/\s+/);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  } else {
    return parts[0][0].toUpperCase();
  }
}

function updateAll() {
  totalContactsNumber.textContent = contactList.length;

  var favCount = 0;
  var emeCount = 0;
  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite) favCount++;
    if (contactList[i].emergency) emeCount++;
  }
  favoriteContactsNumber.textContent = favCount;
  emergencyContactsNumber.textContent = emeCount;

  renderFavorites();
  renderEmergency();
}

function closeModal() {
  var modalEl = document.getElementById("scrollableCenterBackdrop");
  modalEl.classList.remove("show");
  modalEl.style.display = "none";

  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";

  var backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.remove();
  }
}

function addContact() {
  if (!validateForm()) {
    return;
  }

  var isNewContact = mentionedIndex === "";

  var newContact = {
    name: fullNameInput.value,
    phoneNumber: phoneNumberInput.value,
    email: emailInput.value,
    address: addressInput.value,
    groupSelect: groupSelectInput.value,
    notes: notesInput.value,
    favorite:
      mentionedIndex === "" ? false : contactList[mentionedIndex].favorite,
    emergency:
      mentionedIndex === "" ? false : contactList[mentionedIndex].emergency,
    image: imageInput.files[0]
      ? `./images/${imageInput.files[0].name}`
      : "./images/placeholder.jpg",
    randomColor:
      mentionedIndex === ""
        ? randomColor[Math.floor(Math.random() * randomColor.length)]
        : contactList[mentionedIndex].randomColor,
  };

  if (mentionedIndex === "") {
    contactList.push(newContact);
  } else {
    contactList[mentionedIndex] = newContact;
    mentionedIndex = "";
  }

  closeModal();

  if (isNewContact) {
    Swal.fire({
      title: "Added!",
      text: "Contact has been added successfully.",
      icon: "success",
      draggable: true,
    });
  } else {
    Swal.fire({
      title: "Updated!",
      text: "Contact has been updated successfully.",
      icon: "success",
      draggable: true,
    });
  }

  clearForm();
  showContact();
  updateAll();
  localStorage.setItem("contactList", JSON.stringify(contactList));
}

function clearForm() {
  fullNameInput.value = "";
  phoneNumberInput.value = "";
  emailInput.value = "";
  addressInput.value = "";
  groupSelectInput.value = "";
  imageInput.value = "";
  notesInput.value = "";
}

function showContact(list) {
  var contactsToShow = list ? list : contactList;
  var box = "";
  for (var i = 0; i < contactsToShow.length; i++) {
    var contact = contactsToShow[i];
    var realIndex = contactList.indexOf(contact);

    box += `
       <div class="contactProfile mb-3">
      <div class="contactCard p-4 pb-3">
        <div class="headerInfo d-flex gap-3">
          <div class="leftContact position-relative">
<div
  class="firstChars ${contact.randomColor} d-flex align-items-center justify-content-center"
  id="twoChars">
  ${
    contact.image && contact.image !== "./images/placeholder.jpg"
      ? `<img src="${contact.image}" style="width:100%;height:100%;border-radius:8px;object-fit:cover;" onerror="this.replaceWith(document.createTextNode('${getInitials(contact.name)}'));">`
      : getInitials(contact.name)
  }
</div>
            <div class="favBadge position-absolute ${contact.favorite ? "" : "d-none"}">
              <i class="fa-solid fa-star"></i>
            </div>
            <div class="emeBadge position-absolute ${contact.emergency ? "" : "d-none"}">
              <i class="fa-solid fa-heart-pulse"></i>
            </div>
          </div>
          <div class="rightContact">
            <h3>${contact.name}</h3>
            <div class="phoneCallNum mt-1 gap-2 d-flex align-items-center">
              <i class="fa-solid fa-phone d-flex align-items-center justify-content-center"
                style="color:#155dfc;background-color:#dbeafe;width:24px;height:24px;font-size:9px;border-radius:6px;"></i>
              <span style="font-size:14px;line-height:1.4;color:#6a7282;">${contact.phoneNumber}</span>
            </div>
          </div>
        </div>
        <div class="emailContent mt-3 mb-2 d-flex align-items-center ${contact.email ? "" : "d-none"}">
          <i class="fa-solid fa-envelope d-flex align-items-center justify-content-center"></i>
          <span id="userEmail">${contact.email}</span>
        </div>
        <div class="locationContent mb-2 d-flex align-items-center ${contact.address ? "" : "d-none"}">
          <i class="fa-solid fa-location-dot d-flex align-items-center justify-content-center"></i>
          <span id="userLocation">${contact.address}</span>
        </div>
  <div class="notesSpans d-flex gap-2 flex-wrap">
  <div class="px-2 py-1 ${contact.groupSelect === "work" ? "" : "d-none"}" id="work"><span>Work</span></div>
  <div class="px-2 py-1 ${contact.groupSelect === "school" ? "" : "d-none"}" id="school"><span>School</span></div>
  <div class="px-2 py-1 ${contact.groupSelect === "family" ? "" : "d-none"}" id="family"><span>Family</span></div>
  <div class="px-2 py-1 ${contact.groupSelect === "friends" ? "" : "d-none"}" id="friends"><span>Friends</span></div>
  <div class="px-2 py-1 ${contact.groupSelect === "other" ? "" : "d-none"}" id="other"><span>Other</span></div>
  <div class="px-2 py-1 favTag d-flex align-items-center gap-1 ${contact.favorite ? "" : "d-none"}">
    <i class="fa-solid fa-star"></i><span>Favorite</span>
  </div>
  <div class="px-2 py-1 emeTag d-flex align-items-center gap-1 ${contact.emergency ? "" : "d-none"}">
    <i class="fa-solid fa-heart-pulse"></i><span>Emergency</span>
  </div>
  </div>
        <div class="notesContent mt-2 ${contact.notes ? "" : "d-none"}">
          <p class="mb-0" style="font-size:13px;color:#6a7282;">${contact.notes}</p>
        </div>
      </div>
      <div class="footer d-flex justify-content-between align-items-center">
        <div class="footerLeft d-flex gap-2">
          <a href="tel:${contact.phoneNumber}" title="Call"><i class="fa-solid fa-phone d-flex align-items-center justify-content-center"></i></a>
          <a href="mailto:${contact.email}" title="Email"><i class="fa-solid fa-envelope d-flex align-items-center justify-content-center"></i></a>
        </div>
        <div class="footerRight d-flex align-items-center">
<button onclick="toggleFavorite(${realIndex})" class="${contact.favorite ? "favActive" : ""}"><i class="fa-solid fa-star d-flex align-items-center justify-content-center"></i></button>
<button onclick="toggleEmergency(${realIndex})" class="${contact.emergency ? "emeActive" : ""}"><i class="fa-solid fa-heart-pulse d-flex align-items-center justify-content-center"></i></button>
          <button onclick="updateContact(${realIndex})" data-bs-toggle="modal" data-bs-target="#scrollableCenterBackdrop"><i class="fa-solid fa-pen d-flex align-items-center justify-content-center"></i></button>
          <button onclick="deleteContact(${realIndex})"><i class="fa-solid fa-trash d-flex align-items-center justify-content-center"></i></button>
        </div>
      </div>
    </div>
    `;
  }
  document.getElementById("cardsWrappper").innerHTML = box;

  if (contactsToShow.length === 0) {
    emptyList.classList.remove("d-none");
  } else {
    emptyList.classList.add("d-none");
  }
}

function deleteContact(index) {
  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contactList[index].name} ? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DC2626",
    cancelButtonColor: "#6B7280",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      contactList.splice(index, 1);
      showContact();
      updateAll();
      localStorage.setItem("contactList", JSON.stringify(contactList));

      Swal.fire({
        title: "Deleted!",
        text: "Contact has been deleted.",
        icon: "success",
      });
    }
  });
}

function renderFavorites() {
  var favContainer = document.querySelector(".favContainer");
  var favorites = [];

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].favorite) {
      favorites.push(contactList[i]);
    }
  }

  if (favorites.length === 0) {
    favContainer.innerHTML = `<p class="noFav">No favorites yet</p>`;
    return;
  }

  var box = `<div class="favoriteContactsSaved d-flex scrollbar-hide flex-column gap-2">`;

  for (var i = 0; i < favorites.length; i++) {
    box += `
      <div class="favContact savedContactSummary d-flex justify-content-between align-items-center">
        <div class="leftProfile d-flex align-items-center">
          <div
           class="firstChars ${favorites[i].randomColor} d-flex align-items-center justify-content-center"
            id="firstChars">
            ${getInitials(favorites[i].name)}
          </div>
          <div class="favText">
            <div class="profile">
              <h4>${favorites[i].name}</h4>
              <p>${favorites[i].phoneNumber}</p>
            </div>
          </div>
        </div>

         <a href="tel:${favorites[i].phoneNumber}" class="callICon">
  <i class="fa-solid fa-phone d-flex align-items-center justify-content-center"></i>
</a>

      </div>
    `;
  }

  box += `</div>`;
  favContainer.innerHTML = box;
}

function renderEmergency() {
  var emeContainer = document.querySelector(".emeContainer");
  var emergencyContacts = [];

  for (var i = 0; i < contactList.length; i++) {
    if (contactList[i].emergency) {
      emergencyContacts.push(contactList[i]);
    }
  }

  if (emergencyContacts.length === 0) {
    emeContainer.innerHTML = `<p class="noEme">No emergency contacts</p>`;
    return;
  }

  var box = `<div class="emergencyContactsSaved d-flex scrollbar-hide flex-column gap-2">`;

  for (var i = 0; i < emergencyContacts.length; i++) {
    box += `
      <div class="emContact savedContactSummary d-flex justify-content-between align-items-center">
        <div class="leftProfile d-flex align-items-center">
          <div
           class="firstChars ${emergencyContacts[i].randomColor} d-flex align-items-center justify-content-center"
            id="firstChars">
            ${getInitials(emergencyContacts[i].name)}
          </div>
          <div class="emeText">
            <div class="profile">
              <h4>${emergencyContacts[i].name}</h4>
              <p>${emergencyContacts[i].phoneNumber}</p>
            </div>
          </div>
        </div>
      <a href="tel:${emergencyContacts[i].phoneNumber}" class="callICon">
  <i class="fa-solid fa-phone d-flex align-items-center justify-content-center"></i>
</a>
      </div>
    `;
  }

  box += `</div>`;
  emeContainer.innerHTML = box;
}

function updateContact(index) {
  mentionedIndex = index;
  var updateContact = contactList[index];

  fullNameInput.value = updateContact.name;
  phoneNumberInput.value = updateContact.phoneNumber;
  emailInput.value = updateContact.email;
  addressInput.value = updateContact.address;
  groupSelectInput.value = updateContact.groupSelect;
  notesInput.value = updateContact.notes;
}

function toggleFavorite(index) {
  contactList[index].favorite = !contactList[index].favorite;
  showContact();
  updateAll();
  localStorage.setItem("contactList", JSON.stringify(contactList));
}

function toggleEmergency(index) {
  contactList[index].emergency = !contactList[index].emergency;
  showContact();
  updateAll();
  localStorage.setItem("contactList", JSON.stringify(contactList));
}

function searchContact() {
  var searchText = searchInput.value.trim().toLowerCase();

  if (!validsearch()) {
    showContact();
    return;
  }

  var filtered = [];
  for (var i = 0; i < contactList.length; i++) {
    var name = contactList[i].name.toLowerCase();
    var phone = contactList[i].phoneNumber.toLowerCase();
    var email = contactList[i].email ? contactList[i].email.toLowerCase() : "";
    var address = contactList[i].address
      ? contactList[i].address.toLowerCase()
      : "";

    if (
      name.indexOf(searchText) !== -1 ||
      phone.indexOf(searchText) !== -1 ||
      email.indexOf(searchText) !== -1 ||
      address.indexOf(searchText) !== -1
    ) {
      filtered.push(contactList[i]);
    }
  }

  showContact(filtered);
}

function validsearch() {
  var searchText = searchInput.value.trim();
  return searchText.length > 0;
}

function getDuplicatePhoneContact(phone) {
  for (var i = 0; i < contactList.length; i++) {
    var isSameContact = mentionedIndex !== "" && i === Number(mentionedIndex);
    if (!isSameContact && contactList[i].phoneNumber === phone) {
      return contactList[i];
    }
  }
  return null;
}

fullNameInput.addEventListener("input", function () {
  var name = fullNameInput.value.trim();
  var nameRegex = /^[A-Za-z ]{3,50}$/;

  if (name === "") {
    nameError.innerText = "";
  } else if (!nameRegex.test(name)) {
    nameError.innerText =
      "Name should contain only letters and spaces (3-50 characters)";
  } else {
    nameError.innerText = "";
  }
});

phoneNumberInput.addEventListener("input", function () {
  var phone = phoneNumberInput.value.trim();
  var egyptianPhoneRegex = /^01[0125][0-9]{8}$/;

  if (phone === "") {
    phoneError.innerText = "";
  } else if (!egyptianPhoneRegex.test(phone)) {
    phoneError.innerText = "Please enter a valid Egyptian phone number";
  } else {
    phoneError.innerText = "";
  }
});

imageInput.addEventListener("change", function () {
  if (imageInput.files[0]) {
    var imagePath = `./images/${imageInput.files[0].name}`;
    document.getElementById("imgCircle").innerHTML =
      `<img src="${imagePath}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.replaceWith(document.createTextNode('?'));">`;
  }
});

searchInput.addEventListener("input", searchContact);
