// content.js

var textNodes; // Declare textNodes as a global variable

function processTextContent() {
  var bodyTextNodes = document.evaluate(
    "//body//text()[not(ancestor::script)][not(ancestor::style)][not(ancestor::textarea)][not(ancestor::option)][not(ancestor::script[not(@src)])][not(ancestor::style[not(@src)])]",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  var headingTextNodes = document.evaluate(
    "//h1|//h2|//h3|//h4|//h5|//h6",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null
  );

  var textContent = ""; // Variable to store the text content from the page

  for (var i = 0; i < bodyTextNodes.snapshotLength; i++) {
    var node = bodyTextNodes.snapshotItem(i);
    var content = node.textContent;
    textContent += content + " "; // Concatenate the text from each body node
  }

  for (var i = 0; i < headingTextNodes.snapshotLength; i++) {
    var node = headingTextNodes.snapshotItem(i);
    var content = node.textContent;
    textContent += content + " "; // Concatenate the text from each heading node
  }
  // Remove unnecessary special characters
  textContent = textContent.replace(/[^a-zA-Z0-9\s]/g, "");

  // Remove unnecessary whitespace
  textContent = textContent.replace(/\s+/g, " ");

  console.log("Text Content:", textContent);

  if (textContent.trim().length > 0) {
    fetch("http://localhost:8000/api/check_hatespeech/", {
      method: "POST",
      body: JSON.stringify({ text: textContent }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response:", data);
        if (data.is_hatespeech) {
          for (var i = 0; i < bodyTextNodes.snapshotLength; i++) {
            var node = bodyTextNodes.snapshotItem(i);
            var content = node.textContent;
            var censoredContent = content.replace(
              /(\b\S+hatespeech\S+\b)/gi,
              "***"
            );
            node.textContent = censoredContent;
          }
          for (var i = 0; i < headingTextNodes.snapshotLength; i++) {
            var node = headingTextNodes.snapshotItem(i);
            var content = node.textContent;
            var censoredContent = content.replace(
              /(\b\S+hatespeech\S+\b)/gi,
              "***"
            );
            node.textContent = censoredContent;
          }

          // Send a message to the background script to show the notification
          chrome.runtime.sendMessage({ message: "hatespeechResult", isHatespeech: true });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Send a message to the background script to check for hate speech
    chrome.runtime.sendMessage({ message: "checkHatespeech" });
  }
}

function censorTextNodes(nodeList) {
  for (const node of nodeList) {
    if (node.nodeType === Node.TEXT_NODE) {
      const originalText = node.textContent.trim();
      
      // Mengirim permintaan ke API Django
      fetch('http://localhost:8000/api/check_hatespeech/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: originalText }),
      })
        .then(response => response.json())
        .then(data => {
          const isHateSpeech = data.is_hatespeech;
          if (isHateSpeech) {
            const censoredText = "*".repeat(originalText.length);
            const newNode = document.createTextNode(censoredText);
            node.parentNode.replaceChild(newNode, node);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      censorTextNodes(node.childNodes);
    }
  }
}

censorTextNodes(document.body.childNodes);


// Process the text content when the page is fully loaded
window.addEventListener("load", processTextContent);
