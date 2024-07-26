chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "highlightPopup",
      title: "Fallacy Finder",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "highlightPopup") {
      chrome.storage.local.set({ highlightedText: info.selectionText });
    }
  });
  