chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        id: "englishCheck",
        title: "English check",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "englishCheck") {
        chrome.tabs.sendMessage(tab.id, { text: "englishCheck", selectionText: info.selectionText });
    }
});


