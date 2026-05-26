const screens = document.querySelectorAll(".screen");
const previousButton = document.querySelector("#previousButton");
const nextButton = document.querySelector("#nextButton");
const counter = document.querySelector("#counter");
const musicPlayer = document.querySelector("#musicPlayer");
const heartLayer = document.querySelector("#heartLayer");
const section2Description = document.querySelector("#section2Description");
const section3Details = document.querySelectorAll(".section3-detail");
const section4Date = document.querySelector(".section4-date");
const section4Details = document.querySelectorAll(".section4-detail, .section4-date");
const section5Details = document.querySelectorAll(".section5-detail");
const section5Counters = document.querySelectorAll(".section5-detail [data-count]");
const section6Stats = document.querySelectorAll(".section6-stat");
const section6Final = document.querySelector(".section6-final");
const section7Details = document.querySelectorAll(".section7-detail");
const photoFloatLayer = document.querySelector("#photoFloatLayer");
const photoFloatLayerFinal = document.querySelector("#photoFloatLayerFinal");

let currentScreen = 0;
let section2Step = 0;
let section3Revealed = false;
let section4DateRevealed = false;
let section5StatsRevealed = false;
let section6Step = 0;
let section7PhotosRevealed = false;
let photoQueueTimer;
let photoQueueIndex = 0;
let activePhotoLayer = photoFloatLayer;
const section2InitialText = section2Description.textContent;
const heartEmojis = ["❤", "💕", "💗", "💖", "💘"];
const photoSources = [
  "assets/Foto1.jpeg",
  "assets/Foto10.jpeg",
  "assets/Foto11.jpeg",
  "assets/Foto12.jpeg",
  "assets/Foto13.jpeg",
  "assets/Foto14.jpeg",
  "assets/Foto15.jpeg",
  "assets/Foto16.jpeg",
  "assets/Foto17.jpeg",
  "assets/Foto18.jpeg",
  "assets/Foto19.jpeg",
  "assets/Foto2.jpeg",
  "assets/Foto20.jpeg",
  "assets/Foto21.jpeg",
  "assets/Foto22.jpeg",
  "assets/Foto23.jpeg",
  "assets/Foto24.jpeg",
  "assets/Foto25.jpeg",
  "assets/Foto26.png",
  "assets/Foto3.jpeg",
  "assets/Foto4.jpeg",
  "assets/Foto5.jpeg",
  "assets/Foto6.jpeg",
  "assets/Foto7.jpeg",
  "assets/Foto8.jpeg",
  "assets/Foto9.jpeg",
  "assets/img.png",
  "assets/img_1.png",
  "assets/img_10.png",
  "assets/img_11.png",
  "assets/img_12.png",
  "assets/img_13.png",
  "assets/img_14.png",
  "assets/img_15.png",
  "assets/img_16.png",
  "assets/img_17.png",
  "assets/img_18.png",
  "assets/img_19.png",
  "assets/img_2.png",
  "assets/img_20.png",
  "assets/img_21.png",
  "assets/img_22.png",
  "assets/img_23.png",
  "assets/img_24.png",
  "assets/img_25.png",
  "assets/img_26.png",
  "assets/img_27.png",
  "assets/img_28.png",
  "assets/img_29.png",
  "assets/img_3.png",
  "assets/img_30.png",
  "assets/img_31.png",
  "assets/img_4.png",
  "assets/img_5.png",
  "assets/img_6.png",
  "assets/img_7.png",
  "assets/img_8.png",
  "assets/img_9.png",
];

function createHearts() {
  const totalHearts = 18;

  for (let index = 0; index < totalHearts; index += 1) {
    const heart = document.createElement("span");
    const emoji = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    heart.className = "heart";
    heart.textContent = emoji;
    heart.style.setProperty("--heart-left", `${Math.random() * 100}%`);
    heart.style.setProperty("--heart-size", `${18 + Math.random() * 18}px`);
    heart.style.setProperty("--heart-duration", `${7 + Math.random() * 7}s`);
    heart.style.setProperty("--heart-delay", `${Math.random() * 8}s`);
    heart.style.setProperty("--heart-drift", `${-40 + Math.random() * 80}px`);
    heartLayer.appendChild(heart);
  }
}

function addFloatingPhoto() {
  if (!activePhotoLayer) {
    return;
  }

  const source = photoSources[photoQueueIndex % photoSources.length];
  const photo = document.createElement("img");
  const column = photoQueueIndex % 3;
  const baseLeft = [3, 35, 67][column];

  photoQueueIndex += 1;
  photo.className = "floating-photo";
  photo.src = source;
  photo.alt = "";
  photo.loading = "lazy";
  photo.style.setProperty("--photo-left", `${baseLeft + Math.random() * 6}%`);
  photo.style.setProperty("--photo-size", `${112 + Math.random() * 38}px`);
  photo.style.setProperty("--photo-duration", `${30 + Math.random() * 8}s`);
  photo.style.setProperty("--photo-drift", `${-45 + Math.random() * 90}px`);
  photo.style.setProperty("--photo-rotate", `${-12 + Math.random() * 24}deg`);
  photo.addEventListener("animationend", () => photo.remove(), { once: true });
  activePhotoLayer.appendChild(photo);
}

function startFloatingPhotos(layer = photoFloatLayer) {
  clearInterval(photoQueueTimer);
  activePhotoLayer = layer;
  activePhotoLayer.innerHTML = "";
  photoQueueIndex = 0;
  addFloatingPhoto();
  photoQueueTimer = setInterval(addFloatingPhoto, 2400);
}

function stopFloatingPhotos() {
  clearInterval(photoQueueTimer);
  photoQueueTimer = undefined;

  if (activePhotoLayer) {
    activePhotoLayer.innerHTML = "";
  }
}

function updateControls() {
  previousButton.disabled = currentScreen === 0;
  nextButton.disabled = currentScreen === screens.length - 1;
  nextButton.textContent = "Próxima";
  counter.textContent = `${currentScreen + 1} / ${screens.length}`;
}

function startNextCooldown() {
  updateControls();
}

function loadCurrentSong() {
  const activeScreen = screens[currentScreen];
  const nextSong = activeScreen.dataset.audio;

  if (!nextSong || musicPlayer.getAttribute("src") === nextSong) {
    return;
  }

  musicPlayer.src = nextSong;
  musicPlayer.currentTime = 0;
}

async function playCurrentSong() {
  loadCurrentSong();

  try {
    await musicPlayer.play();
  } catch {
    // Mobile browsers may wait for the first tap before allowing audio.
  }
}

function updateSection2Description(text) {
  section2Description.textContent = text;
  section2Description.classList.remove("text-changing");
  section2Description.offsetHeight;
  section2Description.classList.add("text-changing");
  startNextCooldown();

  window.setTimeout(() => {
    section2Description.classList.remove("text-changing");
  }, 560);
}

function revealNextSection2Description() {
  const section2Texts = [
    "Tudo começou dentro do ônibus da Verde Vale. Lá, os olhos castanhos do papai e os olhos verdes da mamãe se esbarraram.",
    "Desde então, o papai só teve olhos para uma mulher neste mundo: você, mamãe.",
    "Foi assim que a história do papai e da mamãe começou.",
  ];

  updateSection2Description(section2Texts[section2Step]);
  section2Step += 1;
}

function revealSection3Details() {
  section3Revealed = true;

  section3Details.forEach((detail) => {
    detail.classList.remove("hidden-detail");
    detail.classList.remove("revealed-detail");
    detail.offsetHeight;
    detail.classList.add("revealed-detail");
  });
}

function revealSection4Date() {
  section4DateRevealed = true;

  section4Details.forEach((detail) => {
    detail.classList.remove("hidden-detail");
    detail.classList.remove("revealed-detail");
    detail.offsetHeight;
    detail.classList.add("revealed-detail");
  });
}

function formatNumber(value) {
  return Math.round(value).toLocaleString("pt-BR");
}

function animateCounter(counter) {
  const finalValue = Number(counter.dataset.count);
  const duration = 3200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    counter.textContent = formatNumber(finalValue * easedProgress);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = formatNumber(finalValue);
    }
  }

  requestAnimationFrame(tick);
}

function revealSection5Stats() {
  section5StatsRevealed = true;

  section5Details.forEach((detail) => {
    detail.classList.remove("hidden-detail");
    detail.classList.remove("revealed-detail");
    detail.offsetHeight;
    detail.classList.add("revealed-detail");
  });

  section5Counters.forEach((counter) => {
    counter.textContent = "0";
    animateCounter(counter);
  });
}

function revealNextSection6Stat() {
  if (section6Step === section6Stats.length) {
    section6Final.classList.remove("hidden-detail");
    section6Final.classList.remove("revealed-detail");
    section6Final.offsetHeight;
    section6Final.classList.add("revealed-detail");
    section6Step += 1;
    return;
  }

  const stat = section6Stats[section6Step];
  const counter = stat.querySelector("[data-count]");

  stat.classList.remove("hidden-detail");
  stat.classList.remove("revealed-detail");
  stat.offsetHeight;
  stat.classList.add("revealed-detail");
  counter.textContent = "0";
  animateCounter(counter);
  section6Step += 1;
}

function revealSection7Photos() {
  section7PhotosRevealed = true;
  startFloatingPhotos();

  section7Details.forEach((detail) => {
    detail.classList.remove("hidden-detail");
    detail.classList.remove("revealed-detail");
    detail.offsetHeight;
    detail.classList.add("revealed-detail");
  });
}

function resetSectionState(screenIndex) {
  if (screenIndex === 1) {
    section2Step = 0;
    section2Description.textContent = section2InitialText;
    section2Description.classList.remove("text-changing");
  }

  if (screenIndex === 2) {
    section3Revealed = false;

    section3Details.forEach((detail) => {
      detail.classList.add("hidden-detail");
      detail.classList.remove("revealed-detail");
      detail.classList.remove("text-changing");
    });
  }

  if (screenIndex === 3) {
    section4DateRevealed = false;

    section4Details.forEach((detail) => {
      detail.classList.add("hidden-detail");
      detail.classList.remove("revealed-detail");
    });
  }

  if (screenIndex === 4) {
    section5StatsRevealed = false;

    section5Details.forEach((detail) => {
      detail.classList.add("hidden-detail");
      detail.classList.remove("revealed-detail");
    });

    section5Counters.forEach((counter) => {
      counter.textContent = "0";
    });
  }

  if (screenIndex === 5) {
    section6Step = 0;

    section6Stats.forEach((stat) => {
      stat.classList.add("hidden-detail");
      stat.classList.remove("revealed-detail");
      stat.querySelector("[data-count]").textContent = "0";
    });

    section6Final.classList.add("hidden-detail");
    section6Final.classList.remove("revealed-detail");
  }

  if (screenIndex === 6) {
    section7PhotosRevealed = false;
    stopFloatingPhotos();

    section7Details.forEach((detail) => {
      detail.classList.add("hidden-detail");
      detail.classList.remove("revealed-detail");
    });
  }

  if (screenIndex === 9) {
    startFloatingPhotos(photoFloatLayerFinal);
  }
}

function showScreen(nextScreen) {
  if (nextScreen < 0 || nextScreen >= screens.length || nextScreen === currentScreen) {
    return;
  }

  if (currentScreen === 1 && nextScreen === 2 && section2Step < 3) {
    revealNextSection2Description();
    return;
  }

  if (currentScreen === 2 && nextScreen === 3 && !section3Revealed) {
    revealSection3Details();
    return;
  }

  if (currentScreen === 3 && nextScreen === 4 && !section4DateRevealed) {
    revealSection4Date();
    return;
  }

  if (currentScreen === 4 && nextScreen === 5 && !section5StatsRevealed) {
    revealSection5Stats();
    return;
  }

  if (currentScreen === 5 && nextScreen === 6 && section6Step < section6Stats.length + 1) {
    revealNextSection6Stat();
    return;
  }

  if (currentScreen === 6 && nextScreen === 7 && !section7PhotosRevealed) {
    revealSection7Photos();
    return;
  }

  const currentElement = screens[currentScreen];
  const nextElement = screens[nextScreen];

  if (currentScreen === 6 || currentScreen === 9) {
    stopFloatingPhotos();
  }

  currentElement.classList.remove("entering");
  currentElement.classList.add("leaving");
  currentElement.classList.add("exit-left");
  currentElement.classList.remove("active");

  nextElement.classList.remove("leaving");
  nextElement.classList.remove("exit-left");
  resetSectionState(nextScreen);
  nextElement.classList.add("entering");
  nextElement.classList.add("active");

  currentScreen = nextScreen;
  startNextCooldown();
  playCurrentSong();

  window.setTimeout(() => {
    currentElement.classList.remove("leaving");
    nextElement.classList.remove("entering");
  }, 560);
}

previousButton.addEventListener("click", () => {
  showScreen(currentScreen - 1);
});

nextButton.addEventListener("click", () => {
  showScreen(currentScreen + 1);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showScreen(currentScreen - 1);
  }

  if (event.key === "ArrowRight") {
    showScreen(currentScreen + 1);
  }
});

document.addEventListener("pointerdown", () => {
  playCurrentSong();
}, { once: true });

loadCurrentSong();
playCurrentSong();
createHearts();
startNextCooldown();
