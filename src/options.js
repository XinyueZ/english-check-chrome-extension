document.getElementById("optionsForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var apiKey = document.getElementById("apiKey").value;
    chrome.storage.sync.set({apiKey: apiKey}, function() {
      if (chrome.runtime.lastError) {
        console.log("Error: " + chrome.runtime.lastError.message);
      } else {
        console.log("API key saved.");
      }
    });
  });
  
  window.onload = function() {
    chrome.storage.sync.get("apiKey", function(data) {
      if (chrome.runtime.lastError) {
        console.log("Error: " + chrome.runtime.lastError.message);
      } else {
        document.getElementById("apiKey").value = data.apiKey || "";
      }
    });
  };
  