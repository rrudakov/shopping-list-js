/** @type {HTMLFormElement} */
const itemForm = document.getElementById('item-form');

/** @type {HTMLInputElement} */
const itemInput = document.getElementById('item-input');

/** @type {HTMLUListElement} */
const itemList = document.getElementById('item-list');

/** @type {HTMLButtonElement} */
const clearBtn = document.getElementById('clear');

/** @type {HTMLInputElement} */
const itemFilter = document.getElementById('filter');

/** @type {HTMLButtonElement} */
const formBtn = itemForm.querySelector('button');

/** @type {boolean} */
let isEditMode = false;

/**
 * Render filter input and clear button if shopping list is not empty.
 */
const checkUI = () => {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.background = '#333';

  isEditMode = false;
};

/**
 * Return new FontAwesome icon with provided classes.
 *
 * @param {String} classes - classes for new element;
 * @returns {HTMLElement}
 */
const createIcon = (classes) => {
  const i = document.createElement('i');
  i.className = classes;
  return i;
};

/**
 * Return new button with provided classes.
 *
 * @param {String} classes - classes for new button.
 * @returns {HTMLButtonElement}
 */
const createButton = (classes) => {
  const btn = document.createElement('button');
  btn.className = classes;
  const i = createIcon('fa-solid fa-xmark');
  btn.appendChild(i);
  return btn;
};

/**
 * Add new item to the shopping list UI.
 *
 * @param {String} item - new item name.
 */
const addItemToDOM = (item) => {
  // Create List item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  // Add li to the DOM
  itemList.appendChild(li);
};

/**
 * Return items list from the local storage as an JavaScript array.
 * @returns {Array<string>}
 */
const getItemsFromStorage = () => {
  return JSON.parse(localStorage.getItem('items')) || [];
};

/**
 * Append item to the local storage.
 *
 * @param {String} item - new item name.
 */
const addItemToStorage = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to array
  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
};

/**
 * Remove item from local storage.
 *
 * @param {String} item - item name to remove.
 */
const removeItemFromStorate = (item) => {
  const itemsFromStorage = getItemsFromStorage();

  const filteredItems = itemsFromStorage.filter((i) => i !== item);

  localStorage.setItem('items', JSON.stringify(filteredItems));
};

/**
 * Check if item was already added to the shopping list.
 *
 * @param {string} item - item name to check.
 * @returns {boolean}
 */
const checkIfItemExists = (item) => {
  getItemsFromStorage().includes(item);
};

/**
 * Add item to the shopping list on form submit.
 *
 * @param {SubmitEvent} e - submit form event.
 */
const onAddItemSubmit = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorate(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists!');
      return;
    }
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
};

/**
 * Remove item from the shopping list.
 *
 * @param {HTMLLIElement} item - item to remove.
 */
const removeItem = (item) => {
  if (confirm('Are you sure?')) {
    item.remove();
    removeItemFromStorate(item.textContent);
    checkUI();
  }
};

/**
 * @param {HTMLElement} item
 */
const setItemToEdit = (item) => {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.background = '#228B22';
  itemInput.value = item.textContent;
};

/**
 * Handler click on a shopping list item.
 *
 * @param {PointerEvent} e - click event.
 */
const onClickItem = (e) => {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
};

/**
 * Remove all items from the shopping list.
 */
const clearItems = () => {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }

  // Clear from localStorage
  localStorage.removeItem('items');

  checkUI();
};

/**
 * Read input of the filterInput and filter shopping list items.
 *
 * @param {InputEvent} e - input event from filter input.
 */
const filterItems = (e) => {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
};

/**
 * Fetch shopping items from local storage and display them as list.
 */
const displayItems = () => {
  getItemsFromStorage().forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
};

/**
 * Initialize app.
 *
 * Set all event listeners for the application and run checkUI.
 */
const init = () => {
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
};

init();
