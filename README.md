[![build ](https://github.com/viliusddd/key-ninja/actions/workflows/deploy.yaml/badge.svg)](https://github.com/viliusddd/key-ninja/actions/workflows/deploy.yaml)

# KeyNinja App

<img align=right src="images/screenrecording.gif" width="40%"/>

Discover the dark art of typing without looking, transforming your clumsy keystrokes into a symphony of speed and accuracy. Become the keyboard wizard your fingers always dreamed of being, and let your newfound powers impress colleagues and mystify friends!

- [KeyNinja App](#keyninja-app)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Setup](#setup)

## Features
- Countdown starts with the press of any key;
- Press `Enter` to restart with the same text or `Esc`/"Restart" button to restart with the change of the text;
- **WPM** and **Accuracy** stats are shown "real-time", i.e. are updated every second;
- At the end of each session chart shows up where it shows the game-play history of up to 20 sessions back. More details can be seen hovering mouse on each session indicator circle:
  * date and time test was taken;
  * WPM - words per minute;
  * accuracy - percentage of correct words;
  * correct words count;
  * wrong words count;
  * corrections - how many times backspace was used.
- It allows to go back only at the limits of the same word;
- Countdown time can be changed in `src/config.js` file.
- Incorrect letters at the end of the word will be appended:
  * only up to `5` letters (it can be adjusted at `src/config.js`) or the edge of input window border;

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
