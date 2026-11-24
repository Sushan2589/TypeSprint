const quoteElement = document.getElementById("quote");
const inputElement = document.getElementById("input");
const restartButton = document.getElementById("restart");

const timerElement = document.getElementById("timer");
const wpmElement = document.getElementById("wpm");
const accuracyElement = document.getElementById("accuracy");

const resultsElement = document.getElementById("results");
const finalWpmElement = document.getElementById("finalWpm");
const finalAccuracyElement = document.getElementById("finalAccuracy");
const finalTimeElement = document.getElementById("finalTime");
const tryAgainButton = document.getElementById("tryAgain");

const highScoreElement = document.getElementById("highScore");

let highScore = localStorage.getItem("highScore") || 0;

highScoreElement.textContent = "High Score: " + highScore + " WPM";

let originalText = "";
let elapsedSeconds = 0;
let timerInterval = null;
let isRunning = false;
let testEnded = false;

import passages from "./passages.js";

async function loadQuote() {
  clearInterval(timerInterval);

  elapsedSeconds = 0;
  isRunning = false;
  testEnded = false;

  timerElement.textContent = "0s";
  wpmElement.textContent = "0 WPM";
  accuracyElement.textContent = "100% Accuracy";

  resultsElement.hidden = true;
  inputElement.value = "";
  inputElement.disabled = true;

  quoteElement.textContent = "Loading passage...";

  try {
    const randomIndex = Math.floor(Math.random() * passages.length);


    
    originalText = passages[randomIndex];

    displayQuote();

    inputElement.disabled = false;
    inputElement.focus();
  } catch (error) {
    quoteElement.textContent = "Could not load passage. Try again.";
    console.error(error);
  }
}

function displayQuote() {
  quoteElement.innerHTML = "";

  for (let i = 0; i < originalText.length; i++) {
    const character = document.createElement("span");

    character.textContent = originalText[i];
    character.className = "pending";

    quoteElement.appendChild(character);
  }
}

function startTimer() {
  isRunning = true;

  timerInterval = setInterval(() => {
    elapsedSeconds++;

    timerElement.textContent = elapsedSeconds + "s";

    updateStats();

    if (elapsedSeconds >= 60) {
      endTest();
    }
  }, 1000);
}

function checkInput() {
  if (testEnded) return;

  const typedText = inputElement.value;
  const characters = quoteElement.querySelectorAll("span");

  if (!isRunning && typedText.length > 0) {
    startTimer();
  }

  characters.forEach((character, index) => {
    character.className = "";

    if (index >= typedText.length) {
      character.className = "pending";
    } else if (typedText[index] === originalText[index]) {
      character.className = "correct";
    } else {
      character.className = "incorrect";
    }

    if (index === typedText.length) {
      character.classList.add("current");
    }
  });

  updateStats();

  if (typedText.length >= originalText.length) {
    endTest();
  }
}

function updateStats() {
  const typedText = inputElement.value;

  let correctCharacters = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === originalText[i]) {
      correctCharacters++;
    }
  }

  const minutes = elapsedSeconds / 60;

  let wpm = 0;

  if (minutes > 0) {
    wpm = Math.round(correctCharacters / 5 / minutes);
  }

  let accuracy = 100;

  if (typedText.length > 0) {
    accuracy = Math.round((correctCharacters / typedText.length) * 100);
  }

  wpmElement.textContent = wpm + " WPM";
  accuracyElement.textContent = accuracy + "% Accuracy";
}

function endTest() {
  if (testEnded) return;

  clearInterval(timerInterval);

  isRunning = false;
  testEnded = true;

  inputElement.disabled = true;

  updateStats();

  const currentWpm = parseInt(wpmElement.textContent);

  if (currentWpm > highScore) {
    highScore = currentWpm;

    localStorage.setItem("highScore", highScore);

    highScoreElement.textContent = "High Score: " + highScore + " WPM";
  }

  finalWpmElement.textContent = wpmElement.textContent;
  finalAccuracyElement.textContent = accuracyElement.textContent;
  finalTimeElement.textContent = elapsedSeconds + "s";

  resultsElement.hidden = false;
}

inputElement.addEventListener("input", checkInput);

restartButton.addEventListener("click", loadQuote);

tryAgainButton.addEventListener("click", loadQuote);

loadQuote();
