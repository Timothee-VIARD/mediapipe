const mediapipeButton = document.querySelector("#mediapipeButton");
const webRTCButton = document.querySelector("#webRTCButton");
const pitchShiftButton = document.querySelector("#pitchShiftButton");

mediapipeButton.addEventListener("click", () => {
  location.href = "/src/Mediapipe.html";
});

webRTCButton.addEventListener("click", () => {
  location.href = "/src/webRTC/webRTC.html";
});

pitchShiftButton.addEventListener("click", () => {
  location.href = "/src/pitchShift/pitchShift.html";
});
