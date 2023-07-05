document.addEventListener("mousedown", function (event) {
    // Check if the right button was clicked
    if (event.button == 2) {
        // Store the mouse position in localStorage
        localStorage.setItem("mouseX", event.pageX);
        localStorage.setItem("mouseY", event.pageY);
    }
}, true);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.text === "englishCheck") {
        chrome.storage.sync.get("apiKey", function (data) {
            fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + data.apiKey
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: request.selectionText
                        }
                    ]
                })
            })
                .then(response => response.json())
                .then(data => {
                    var content = data.choices[0].message.content;

                    // Create a new div element for the modal
                    var modal = document.createElement("div");
                    modal.style.position = "fixed";
                    modal.style.left = "0";
                    modal.style.top = "0";
                    modal.style.width = "100%";
                    modal.style.height = "100%";
                    modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    modal.style.display = "flex";
                    modal.style.justifyContent = "center";
                    modal.style.alignItems = "center";
                    modal.style.zIndex = "10000";
                    modal.style.flexDirection = "column"; // Add this line

                    // Create a new div element for the header
                    var header = document.createElement("div");
                    header.style.display = "flex";
                    header.style.justifyContent = "flex-start"; 
                    header.style.alignItems = "center";
                    header.style.padding = "10px";
                    header.style.backgroundColor = "white";
                    header.style.borderBottom = "1px solid black";
                    header.style.width = "80%"; // Make the header full width

                    // Create a new img element for the icon
                    var icon = document.createElement("img");
                    icon.src = chrome.runtime.getURL("app-icon.png"); // Replace with the path of your icon
                    icon.width = 24;
                    icon.height = 24;
                    header.appendChild(icon);

                    // Create a space between the icon and the button
                    var spacer = document.createElement("div");
                    spacer.style.width = "10px"; // Adjust the width as needed
                    header.appendChild(spacer);

                    // Create a new button element for the copy button
                    var copyButton = document.createElement("button");
                    copyButton.textContent = "Copy"; // Or set the icon of the button
                    copyButton.addEventListener("click", function () {
                        // Use the Clipboard API to copy the text
                        navigator.clipboard.writeText(content).then(function () {
                            // The copy operation was successful
                            console.log("Copy to clipboard successful!");
                        }, function (err) {
                            // The copy operation failed
                            console.error("Copy to clipboard failed!", err);
                        });
                    });
                    header.appendChild(copyButton);

                    // Add header
                    modal.appendChild(header);

                    // Create a new div element for the dialog
                    var dialog = document.createElement("div");
                    dialog.style.backgroundColor = "white";
                    dialog.style.border = "1px solid black";
                    dialog.style.padding = "10px";
                    dialog.style.maxWidth = "80%";
                    dialog.style.maxHeight = "80%";
                    dialog.style.overflow = "auto";
                    dialog.style.color = "black";
                    
                    // Set the content of the dialog
                    dialog.textContent = content;

                    // Add the dialog to the modal
                    modal.appendChild(dialog);

                    // Add an event listener to the modal
                    modal.addEventListener("click", function () {
                        // Remove the modal from the body
                        document.body.removeChild(modal);
                    });

                    // Add the modal to the body
                    document.body.appendChild(modal);
                });
        });
    }
});
