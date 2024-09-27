const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('api_key');
  const saveApiKeyButton = document.getElementById('save_api_key');
  const contentElement = document.getElementById('content');
  const btnAnalyze = document.getElementById('btn_analyze');
  const resultText = document.getElementById('result_text');
  const toggleInput = document.getElementById('toggle_input');
  const toggleLabel = document.getElementById('toggle_label');
  const contentWrapper = document.getElementById('content_wrapper');

  // Load stored API key and highlighted text
  chrome.storage.local.get(['apiKey', 'highlightedText'], (result) => {
    apiKeyInput.value = result.apiKey || '';
    updateContent();
  });

  // Save API key
  saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    chrome.storage.local.set({ apiKey }, () => {
      alert('API key saved!');
    });
  });

  // Analyze button click event
  btnAnalyze.addEventListener('click', () => {
    sendToGemini(toggleInput.checked ? 'pageContent' : 'highlightedText');
  });

  // Toggle input change event
  toggleInput.addEventListener('change', () => {
    toggleLabel.textContent = toggleInput.checked ? 'Analyze From Page HTML' : 'Analyze From Highlighted Text';
    updateContent();
  });

  function updateContent() {
    if (toggleInput.checked) {
      contentWrapper.style.display = 'none';
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.runtime.sendMessage({action: "getPageContent", tabId: tabs[0].id}, (response) => {
          if (response && response.pageContent) {
            chrome.storage.local.set({ pageContent: response.pageContent });
          } else {
            console.error('Error: ' + (response ? response.error : 'Could not retrieve page content'));
          }
        });
      });
    } else {
      contentWrapper.style.display = 'block';
      chrome.storage.local.get(['highlightedText'], (result) => {
        contentElement.innerText = result.highlightedText || 'No Hext Highlighted';
      });
    }
  }

  function sendToGemini(contentType) {
    btnAnalyze.disabled = true;
    resultText.innerText = 'Analyzing...';

    chrome.storage.local.get(['apiKey', contentType], (result) => {
      const apiKey = result.apiKey;
      const prompt = "You are an expert in logical fallacies and manipulation techniques. I am going to give you a piece of text, and I want you to give me a score one through 100 on how fallacious, misleading, manipulative, or otherwise misinformative the text is. Only output the score in this format: X/100. To be clear, if you output a score below 50, there is little to no problematic text, if you output from 50-75 then there is some problematic text, and if you output above 75 then there is very high likelihood that the text is intentionally trying to mislead or manipulate the reader.";
      const content = prompt + (result[contentType] || '');

      if (!apiKey) {
        alert('Please set your API key first.');
        btnAnalyze.disabled = false;
        return;
      }

      fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: content
            }]
          }]
        })
      })
      .then((response) => response.json())
      .then((result) => {
        btnAnalyze.disabled = false;
        const scoreText = result.candidates && result.candidates[0].content.parts[0].text.trim() || 'N/A';
        const scoreNumber = parseInt(scoreText.split('/')[0]);
        resultText.innerText = scoreText;
        
        if (!isNaN(scoreNumber)) {
          if (scoreNumber >= 75) {
            resultText.style.color = 'red';
          } else if (scoreNumber >= 50) {
            resultText.style.color = 'orange';
          } else {
            resultText.style.color = 'green';
          }
        } else {
          resultText.style.color = 'black'; // Default color if score is not a number
        }
        resultText.style.fontSize = '36px';
      })
      .catch((error) => {
        btnAnalyze.disabled = false;
        resultText.innerText = 'Error: ' + error.message;
        resultText.style.fontSize = '16px';
      });
    });
  }
});
