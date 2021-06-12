let removeButton = document.getElementById("remove-entry");
let addButton = document.getElementById("add-entry-button");
let addForm = document.getElementById("add-entry-form");
let expansionList = document.getElementById("expansion-list");

// Pressing enter also posts form. No spaces allowed.
let inputs = document.querySelectorAll("input.entry-field");
for (let input of inputs) {
  input.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
      addEntry();
    } else if (event.keyCode === 32) {
      event.preventDefault();
    }
  });
}

// let status = !("true" === e.currentTarget.getAttribute("expanded"))
// e.currentTarget.setAttribute("expanded", status ? "true" : "false");

addButton.addEventListener("click", (e) => {
  let formData = new FormData(addForm);
  let data = Object.fromEntries(formData);
  let key = data["entry-key"];
  let value = data["entry-value"];
  
  chrome.storage.local.set({ [key]: value });
  repopulate();
});

// clear.addEventListener("click", () => {
//   chrome.storage.local.clear();
//   repopulate();
// });

removeButton.addEventListener("click", function(event) {
  let checkedList = document.querySelectorAll('input:checked');
  
  let extracted = [...checkedList].map(checked => checked.name);
  
  chrome.storage.local.remove(extracted, function() {
    repopulate();
  });
  // repopulate();
});

function handleRemove(e) {
  
  let entries = document.querySelectorAll('div[data="local-storage"]');
  for (entry of entries) {
    let checkBox = entry.firstChild;
    if (checkBox.checked) {
      removeButton.disabled = false;
      return;
    }
  }
  removeButton.disabled = true;
}

function repopulate() {
  let clone = expansionList.cloneNode();
  
  
  
  chrome.storage.local.get(null, (entries) => {
    for (let [key, value] of Object.entries(entries)) {
      let entryContainer = document.createElement("div");
      entryContainer.setAttribute("data", "local-storage");
      let checkBox = document.createElement("input")
      checkBox.setAttribute("type", "checkbox");
      checkBox.setAttribute("name", key);
      checkBox.addEventListener("change", handleRemove);
      entryContainer.appendChild(checkBox);
      let entryItem = document.createElement("ul");
      let entryKey = document.createElement("li");
      entryKey.textContent = key;
      let entryValue = document.createElement("li");
      entryValue.textContent = value;
      entryItem.appendChild(entryKey);
      entryItem.appendChild(entryValue);
      entryContainer.appendChild(entryItem);
      clone.appendChild(entryContainer);
    }
  });
  
  expansionList.replaceWith(clone);
  // expansionList.appendChild(clone);
}

repopulate();