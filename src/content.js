chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.text === "englishCheck") {
        // Create a new div element for the loading indicator
        const loading = document.createElement("div");
        const content = "Checking....";
        const goldenRatio = 1.618;
        const fontSize = 16;
        const width = content.length * fontSize * goldenRatio;
        const height = width / goldenRatio;
        const backgroundColor = window.getComputedStyle(document.body).backgroundColor;
        const rgb = backgroundColor.match(/\d+/g);
        const foregroundColor = `rgb(${255 - rgb[0]}, ${255 - rgb[1]}, ${255 - rgb[2]})`;
        loading.style.position = "fixed";
        loading.style.left = "50%";
        loading.style.top = "50%";
        loading.style.transform = "translate(-50%, -50%)";
        loading.style.zIndex = "10000";
        loading.style.display = "flex";
        loading.style.flexDirection = "column";
        loading.style.alignItems = "center";
        loading.style.justifyContent = "center";
        loading.style.borderRadius = "50%";
        loading.style.width = `${width}px`;
        loading.style.height = `${height}px`;
        loading.style.backgroundColor = backgroundColor;
        loading.textContent = "Checking....";
        loading.style.color = foregroundColor;

        // Add the loading indicator to the body
        document.body.appendChild(loading);

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
                            content: "English syntax, gramma check, update it if needed, otherwise give me the origin text(response with correct sentence only):\n\n" + request.selectionText
                        }
                    ]
                })
            })
                .then(response => response.json())
                .then(data => {
                    // Remove the loading indicator from the body
                    document.body.removeChild(loading);

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
                    header.style.backgroundColor = backgroundColor;
                    header.style.display = "flex";
                    header.style.alignItems = "center";
                    header.style.padding = "10px";
                    header.style.borderBottom = "1px solid black";
                    header.style.width = "100%"; // Set the width to 100%
                    header.style.justifyContent = "flex-start";

                    var contentDiv = document.createElement("div");
                    contentDiv.style.backgroundColor = backgroundColor;
                    contentDiv.style.color = foregroundColor;
                    contentDiv.style.padding = "10px";
                    contentDiv.style.width = "100%"; // Set the width to 100%
                    contentDiv.style.overflow = "auto";
                    contentDiv.textContent = content;

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



                    // Create a new div element for the content
                    var contentDiv = document.createElement("div");
                    contentDiv.style.backgroundColor = backgroundColor;
                    contentDiv.style.color = foregroundColor;
                    contentDiv.style.padding = "10px";
                    contentDiv.style.width = "100%"; // Set the width to 100%
                    contentDiv.style.overflow = "auto";
                    contentDiv.textContent = content;

                    // Create a new div element for the dialog
                    var dialog = document.createElement("div");
                    dialog.style.backgroundColor = backgroundColor;
                    dialog.style.border = "1px solid black";
                    dialog.style.padding = "10px";
                    dialog.style.maxWidth = "80%";
                    dialog.style.maxHeight = "80%";
                    dialog.style.overflow = "auto";
                    dialog.style.color = foregroundColor;

                    dialog.appendChild(header);
                    dialog.appendChild(contentDiv);

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