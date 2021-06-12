chrome.commands.onCommand.addListener(function(command) {
  // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab[0].id },
      files: ['expand.js']
    });
  });
});