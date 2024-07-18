const videoElement = document.createElement("video"); // Hidden video element
const canvasElement = document.getElementById("canvas");
const canvasCtx = canvasElement.getContext("2d");
const startButton = document.getElementById("startButton");
const saveButton = document.getElementById("saveButton");
const loadButton = document.getElementById("loadButton");
const statusMessage = document.getElementById("statusMessage");
const exitButton = document.querySelector("#exitButton");
const cancelButton = document.querySelector("#cancelButton");

exitButton.addEventListener("click", () => {
  location.href = "/";
});

cancelButton.addEventListener("click", () => {
  location.reload();
});

let isConfigMode = false;

// Fixed box positions
let BOXES = [
  {
    x: 100,
    y: 100,
    width: 150,
    height: 150,
    color: "yellow",
    sound: "/SoundsWav/hihat.wav",
    lastTrigger: 0,
    img: "/Images/hihat.svg",
  },
  {
    x: 300,
    y: 200,
    width: 150,
    height: 150,
    color: "green",
    sound: "/SoundsWav/cymbal.wav",
    lastTrigger: 0,
    img: "/Images/cymbals.svg",
  },
  {
    x: 100,
    y: 300,
    width: 150,
    height: 150,
    color: "blue",
    sound: "/SoundsWav/snare.wav",
    lastTrigger: 0,
    img: "/Images/snare.svg",
  },
  {
    x: 300,
    y: 400,
    width: 150,
    height: 150,
    color: "purple",
    sound: "/SoundsWav/kick.wav",
    lastTrigger: 0,
    img: "/Images/kick.svg",
  },
];

BOXES.forEach((box) => {
  const img = new Image();
  img.onload = function () {
    box.ready = true;
  };
  img.src = box.img;
  box.img = img;
});

const COOLDOWN = 1000; // 1 second cooldown

// Initialize Mediapipe Holistic
const holistic = new Holistic({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  },
});

holistic.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  refineFaceLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

holistic.onResults(onResults);

startButton.addEventListener("click", () => {
  startButton.disabled = true;
  loadButton.disabled = true;
  saveButton.disabled = true;
  statusMessage.style.display = "none";
  camera.start();
  isConfigMode = false;
});

loadButton.addEventListener("click", () => {
  statusMessage.style.display = "block";
  statusMessage.textContent =
    "Configuration mode: Use hand gestures to move the boxes.";
  isConfigMode = true;
  startButton.disabled = true;
  saveButton.disabled = false;
  camera.start();
});

saveButton.addEventListener("click", () => {
  localStorage.setItem("boxConfig", JSON.stringify(BOXES));
  statusMessage.textContent =
    'Configuration saved! Click "Start Playing" to begin.';
  startButton.disabled = false;
  loadButton.disabled = false;
  saveButton.disabled = true;
  isConfigMode = false;
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});

function onResults(results) {
  // Flip the image horizontally
  canvasCtx.save();
  canvasCtx.scale(-1, 1);
  canvasCtx.translate(-canvasElement.width, 0);
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
    results.image,
    0,
    0,
    canvasElement.width,
    canvasElement.height
  );
  canvasCtx.restore();

  drawBoxes();
  if (results.poseLandmarks) {
    const xscale = canvasElement.width;
    const yscale = canvasElement.height;

    // Flip the x coordinates for landmarks
    const rightIndexFinger = {
      x: (1 - results.poseLandmarks[POSE_LANDMARKS.RIGHT_INDEX].x) * xscale,
      y: results.poseLandmarks[POSE_LANDMARKS.RIGHT_INDEX].y * yscale,
    };
    const leftIndexFinger = {
      x: (1 - results.poseLandmarks[POSE_LANDMARKS.LEFT_INDEX].x) * xscale,
      y: results.poseLandmarks[POSE_LANDMARKS.LEFT_INDEX].y * yscale,
    };

    if (isConfigMode) {
      moveBoxes(leftIndexFinger, rightIndexFinger);
    } else {
      checkAndPlaySound(leftIndexFinger, rightIndexFinger);
    }
  }

  drawLandmarks(results);
}

function drawLandmarks(results) {
  if (results.poseLandmarks) {
    // Flip the x coordinates for landmarks before drawing
    const flippedPoseLandmarks = results.poseLandmarks.map((landmark) => ({
      ...landmark,
      x: 1 - landmark.x,
    }));

    drawConnectors(canvasCtx, flippedPoseLandmarks, POSE_CONNECTIONS, {
      color: "#00FF00",
      lineWidth: 4,
    });
    drawLandmarks(canvasCtx, flippedPoseLandmarks, {
      color: "#FF0000",
      lineWidth: 2,
    });
  }

  if (results.faceLandmarks) {
    const flippedFaceLandmarks = results.faceLandmarks.map((landmark) => ({
      ...landmark,
      x: 1 - landmark.x,
    }));

    drawConnectors(canvasCtx, flippedFaceLandmarks, FACEMESH_TESSELATION, {
      color: "#C0C0C070",
      lineWidth: 1,
    });
  }

  if (results.leftHandLandmarks) {
    // Flip the x coordinates for landmarks before drawing
    const flippedLeftHandLandmarks = results.leftHandLandmarks.map(
      (landmark) => ({
        ...landmark,
        x: 1 - landmark.x,
      })
    );

    drawConnectors(canvasCtx, flippedLeftHandLandmarks, HAND_CONNECTIONS, {
      color: "#CC0000",
      lineWidth: 5,
    });
    drawLandmarks(canvasCtx, flippedLeftHandLandmarks, {
      color: "#00FF00",
      lineWidth: 2,
    });
  }

  if (results.rightHandLandmarks) {
    // Flip the x coordinates for landmarks before drawing
    const flippedRightHandLandmarks = results.rightHandLandmarks.map(
      (landmark) => ({
        ...landmark,
        x: 1 - landmark.x,
      })
    );

    drawConnectors(canvasCtx, flippedRightHandLandmarks, HAND_CONNECTIONS, {
      color: "#00CC00",
      lineWidth: 5,
    });
    drawLandmarks(canvasCtx, flippedRightHandLandmarks, {
      color: "#FF0000",
      lineWidth: 2,
    });
  }
}

function drawBoxes() {
  BOXES.forEach((box) => {
    if (box.ready) {
      canvasCtx.drawImage(box.img, box.x, box.y, box.width, box.height);
    } else {
      canvasCtx.fillStyle = box.color;
      canvasCtx.fillRect(box.x, box.y, box.width, box.height);
    }
  });
}

function checkAndPlaySound(leftIndexFinger, rightIndexFinger) {
  const currentTime = Date.now();

  BOXES.forEach((box) => {
    if (
      (isPointInBox(leftIndexFinger, box) ||
        isPointInBox(rightIndexFinger, box)) &&
      currentTime - box.lastTrigger > COOLDOWN
    ) {
      playSound(box.sound);
      box.lastTrigger = currentTime;
    }
  });
}

function moveBoxes(leftIndexFinger, rightIndexFinger) {
  const pointer = leftIndexFinger; // You can choose either left or right finger for controlling

  BOXES.forEach((box) => {
    if (isPointInBox(pointer, box)) {
      // Calculate new position ensuring the box stays within canvas boundaries
      const newX = Math.max(
        0,
        Math.min(pointer.x - box.width / 2, canvasElement.width - box.width)
      );
      const newY = Math.max(
        0,
        Math.min(pointer.y - box.height / 2, canvasElement.height - box.height)
      );
      box.x = newX;
      box.y = newY;
    }
  });
}

function isPointInBox(point, box) {
  return (
    point.x >= box.x &&
    point.x <= box.x + box.width &&
    point.y >= box.y &&
    point.y <= box.y + box.height
  );
}

function playSound(sound) {
  const audio = new Audio(sound);
  audio.play();
}
