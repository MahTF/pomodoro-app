const POMODORO = 1500;
const SHORT_BREAK = 300;
const LONG_BREAK = 900;

const timerButtons = document.querySelectorAll(".timer-btn");
const circle = document.querySelector(".circle");
const innerCircle = document.querySelector(".inner-circle");
const countdownElement = document.querySelector(".countdown h1");
const playPauseElement = document.querySelector(".play-pause");

const buttonSound = new Audio("/sounds/sound_button-sound.mp3");
const bellSound = new Audio("/sounds/sound_bell-sound.mp3");

let timer;
let countdown;
let currentDuration;
let isPaused = true;
let isStarted = false;
let endTime;
let pausedTimeRemaining;

const COLORS = {
  [POMODORO]: {
    bg: "rgb(255, 146, 172)",
    border: "rgb(149, 9, 41)",
    shadow: "rgba(149, 9, 41, 0.7)"
  },
  [SHORT_BREAK]: {
    bg: "rgb(187, 255, 179)",
    border: "rgb(10, 97, 84)",
    shadow: "rgba(10, 97, 84, 0.7)"
  },
  [LONG_BREAK]: {
    bg: "rgb(134, 140, 255)",
    border: "rgb(19, 27, 175)",
    shadow: "rgba(19, 27, 175, 0.7)"
  }
};

function startTimer() {
  if (!isStarted) {
    isStarted = true;
    endTime = Date.now() + countdown * 1000;
    timer = setInterval(() => {
      if (!isPaused) {
        const currentTime = Date.now();
        const remainingTime = Math.floor((endTime - currentTime) / 1000);

        if (remainingTime <= 0) {
          clearInterval(timer);
          handleTimerEnd();
          return;
        }

        countdown = remainingTime;
        updateDisplay(countdown);

        const progress = (countdown / currentDuration) * 360;
        updateInnerCircle(progress);
      }
    }, 1000);
    playPauseElement.textContent = "Pause";
  }
}

function handleTimerEnd() {
  countdown = 0;
  playPauseElement.style.display = "none";
  bellSound.play();
  updateDisplay(0);
  updateInnerCircle(0);

  setTimeout(() => {
    resetTime(POMODORO);
    currentDuration = POMODORO;
    countdown = POMODORO;
    isPaused = true;
    playPauseElement.textContent = "Play"
  }, 5000);
}

function updateDisplay(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  countdownElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

function updateInnerCircle(progress) {
  const color = COLORS[currentDuration].bg;
  innerCircle.style.background = `conic-gradient(${color} ${progress}deg, transparent 0%)`
}

function resetTime(duration) {
  clearInterval(timer);
  isStarted = false;
  isPaused = true;

  countdown = duration;
  currentDuration = duration;

  updateDisplay(duration);

  playPauseElement.style.display = "block";
  playPauseElement.textContent = "Play"

  const { bg, border, shadow } = COLORS[duration];
  innerCircle.style.background = `conic-gradient(${bg} 360deg, transparent 0%)`;
  circle.style.borderColor = border;
  circle.style.boxShadow = `0 0 40px 20px ${shadow}`
}

timerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    timerButtons.forEach((btn) => {
      btn.classList.remove("active")
    });
    button.classList.add("active");
    const newDuration = parseInt(button.dataset.time);
    resetTime(newDuration);
  })
});

playPauseElement.addEventListener("click", () => {
  buttonSound.play();
  isPaused = !isPaused;
  playPauseElement.textContent = isPaused ? "Play" : "Pause"

  if (isPaused) {
    pausedTimeRemaining = Math.ceil((endTime - Date.now()) / 1000);
  } else {
    endTime = Date.now() + pausedTimeRemaining * 1000;
  }

  if (!isStarted) {
    startTimer();
  }
})

resetTime(POMODORO); 
