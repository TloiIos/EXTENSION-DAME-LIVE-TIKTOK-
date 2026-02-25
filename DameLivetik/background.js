chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.includes("facebook.com")) {
    try {
      await chrome.tabs.sendMessage(tab.id, {action: "TOGGLE_GUI"});
    } catch (err) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      }, () => {
        chrome.tabs.sendMessage(tab.id, {action: "TOGGLE_GUI"});
      });
    }
  }
});