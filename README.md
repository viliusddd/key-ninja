[![build ](https://github.com/viliusddd/key-ninja/actions/workflows/deploy.yaml/badge.svg)](https://github.com/viliusddd/key-ninja/actions/workflows/deploy.yaml)

# KeyNinja App

<img align=right src="images/screenrecording.gif" width="40%"/>

Discover the dark art of typing without looking, transforming your clumsy keystrokes into a symphony of speed and accuracy. Become the keyboard wizard your fingers always dreamed of being, and let your newfound powers impress colleagues and mystify friends!

- [KeyNinja App](#keyninja-app)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Setup](#setup)

## Features
- The countdown starts upon pressing any key.
- Press `Enter` to restart with the same text or `Esc`/"Restart" button to restart with different text.
- **WPM** and **Accuracy** stats are displayed in real-time, updating every second.
- At the end of each session, a chart appears showing the gameplay history of up to 20 previous sessions. More details can be viewed by hovering the mouse over each session indicator circle:
  - Date and time the test was taken.
  - WPM - words per minute.
  - Accuracy - percentage of correct words.
  - Count of correct words.
  - Count of wrong words.
  - Corrections - how many times backspace was used.
- It only allows going back within the boundaries of the same word.
- The countdown time can be adjusted in the `src/config.js` file.
- Incorrect letters at the end of the word will be appended:
  - Up to `5` letters (adjustable in `src/config.js`) or until reaching the edge of the input window border.

## Tech Stack

![JavaScript](https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=000&style=flat)
![Chart.js](https://img.shields.io/badge/Chart.js-F5788D.svg?style=flat&logo=chart.js&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-%232671E5.svg?style=flat&logo=githubactions&logoColor=white)
![ESLint](https://img.shields.io/badge/ESlint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Github Pages](https://img.shields.io/badge/GitHub%20Pages-121013?style=flat&logo=github&logoColor=white)

## Setup
Use vscode live server to run the application.
