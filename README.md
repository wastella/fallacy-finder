# Fallacy Finder
Fallacy Finder is a Google Chrome Extension that allows you to check text of your choice for fallacies and manipulation techniques using [Google Gemini AI](https://gemini.google.com/app).

![Fallacy Finder Screenshot](https://github.com/wastella/fallacy-finder/blob/main/screenshot.png?raw=true)

## Installation
Until I put this on the Google Chrome Store, you can load it in locally quite easily.

1. Clone the repository
You can use this command:
`git clone https://github.com/wastella/fallacy-finder`

2. Open your Google Chrome browser and go to <chrome://extensions/> 

3. Enable developer mode by switching the toggle on the top right of the screen

4. Click the **Load Unpacked** button on the top left of the screen

5. Choose the **fallacy-finder** directory on your cloned version of this repository

After these steps, it should be in your extensions bar.

## Use

### API Key
You will need your own Gemini API Key, but they are free and easy to create.

Just go to the [Google AI Studio](https://aistudio.google.com/) and create an API Key.

Then enter this API key into the menu when you click on the extension's icon, and you should get an alert saying that you have successfuly registered the API key.

### How To Actually Use It
Fallacy Finder has two modes, **Highlighted Text** and **Page HTML**. In the first mode, you highlight a bit of text and right click. After that you should see an option on the menu called Fallacy Finder. If you click on it the text should appear in the popup. After that, just click the **Analyze** button, and after a few seconds then it will give you a score based on how fallacious, misleading, manipulative, or otherwise misinformative it is. 

In the second mode, you toggle the switch to **Analyze From Page HTML** Then click the **Analyze** button. This should send the entire HTML of the page that you are currently on to the AI. It will then analyze the text of the page (usually an article or some type of post) and then it will give you a score based on how fallacious, misleading, manipulative, or otherwise misinformative it is.
If you have a new bit of text, just rinse and repeat.

### Score Classifications
- If the score is **RED** (100-75), then the text is very fallacious and manipulative.
- If the score is **ORANGE** (74-50), then the text is somewhat fallacious and manipulative.
- If the score is **GREEN** (49-0), then the text is not fallacious and not manipulative whatsoever.


