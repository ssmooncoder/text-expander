let removeButton = document.getElementById("remove-entry");
let addButton = document.getElementById("add-entry-button");
let addForm = document.getElementById("add-entry-form");
let expansionList = document.getElementById("expansion-list");

// Pressing enter also posts form. No spaces allowed.
let inputs = document.querySelectorAll("input.entry-field");
for (let input of inputs) {
  input.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      addNewEntry();
    } else if (event.keyCode === 32) {
      event.preventDefault();
    }
  });
}

function addNewEntry() {
  let formData = new FormData(addForm);
  let data = Object.fromEntries(formData);
  let key = data["entry-key"];
  let value = data["entry-value"];
  
  chrome.storage.local.set({ [key]: value });
  repopulate();  
}

addButton.addEventListener("click", addNewEntry);

function removeSelectedEntries() {
  let entries = document.querySelectorAll('div[data="local-storage"] input.mark-remove');
  
  let checkedList = [...entries].filter(entry => entry.checked);
  
  let keys = checkedList.map(checked => checked.name);
  
  chrome.storage.local.remove(keys, repopulate);
  // repopulate();
}

removeButton.addEventListener("click", removeSelectedEntries);

function handleRemove(e) {
  let entries = document.querySelectorAll('div[data="local-storage"] input.mark-remove');
  console.log(entries);
  
  removeButton.disabled = ![...entries].some(entry => {
    return entry.checked;
  });
}

function repopulate() {
  while (expansionList.firstChild) {
    expansionList.removeChild(expansionList.firstChild);
  }
  
  chrome.storage.local.get(null, (entries) => {
    console.log(entries);
    for (let [key, value] of Object.entries(entries)) {
      let entryContainer = document.createElement("div");
      entryContainer.setAttribute("data", "local-storage");
      let checkBox = document.createElement("input")
      checkBox.classList.add("mark-remove");
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("name", key);
      checkBox.addEventListener("change", handleRemove);
      entryContainer.appendChild(checkBox);
      let entryItem = document.createElement("ul");
      entryItem.classList.add("stored-item");
      let entryKey = document.createElement("li");
      entryKey.classList.add("stored-key");
      entryKey.textContent = key;
      let entryValue = document.createElement("li");
      entryValue.classList.add("stored-value");
      entryValue.textContent = value;
      entryItem.appendChild(entryKey);
      entryItem.appendChild(entryValue);
      entryContainer.appendChild(entryItem);
      expansionList.appendChild(entryContainer);
    }
  });
  
}

repopulate();