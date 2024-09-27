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
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageContent") {
      chrome.scripting.executeScript({
        target: { tabId: request.tabId },
        function: () => document.body.innerText
      }, (result) => {
        if (chrome.runtime.lastError) {
          sendResponse({error: chrome.runtime.lastError.message});
        } else {
          sendResponse({pageContent: result[0].result});
        }
      });
      return true; // Indicates that the response is sent asynchronously
    }
  });
