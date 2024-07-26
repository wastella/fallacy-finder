const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

document.addEventListener('DOMContentLoaded', () => {
  const apiKeyInput = document.getElementById('api_key');
  const saveApiKeyButton = document.getElementById('save_api_key');
  const contentElement = document.getElementById('content');
  const btnGemini = document.getElementById('btn_gemini');
  const resultText = document.getElementById('result_text');

  // Load stored API key and highlighted text
  chrome.storage.local.get(['apiKey', 'highlightedText'], (result) => {
    apiKeyInput.value = result.apiKey || '';
    contentElement.innerText = result.highlightedText || 'No text highlighted';
  });

  // Save API key
  saveApiKeyButton.addEventListener('click', () => {
    const apiKey = apiKeyInput.value.trim();
    chrome.storage.local.set({ apiKey }, () => {
      alert('API key saved!');
    });
  });

  // Send highlighted text to Gemini API
  btnGemini.addEventListener('click', () => {
    btnGemini.disabled = true;
    resultText.innerText = 'Processing...';

    chrome.storage.local.get(['apiKey', 'highlightedText'], (result) => {
      const apiKey = result.apiKey;
      const prompt = "You are an expert in logical fallacies and manipulation techniques. I am going to give you a piece of text, and I want you to tell me about every logical fallacy in it using this specific format: 1. (first fallacy) (explaination of why the text exhibits this fallacy) 2. (second fallacy) (explanation of why the text exhibits this second fallacy). Continue for as many fallacies as you find. The text is: "
      const highlightedText = (prompt + result.highlightedText) || '';

      if (!apiKey) {
        alert('Please set your API key first.');
        btnGemini.disabled = false;
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
              text: highlightedText
            }]
          }]
        })
      })
      .then((response) => response.json())
      .then((result) => {
        btnGemini.disabled = false;
        resultText.innerText = result.candidates && result.candidates[0].content.parts[0].text || 'No response from AI';
      })
      .catch((error) => {
        btnGemini.disabled = false;
        resultText.innerText = 'Error: ' + error.message;
      });
    });
  });
});
