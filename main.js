const mediapipeButton = document.querySelector("#mediapipeButton");
const webRTCButton = document.querySelector("#webRTCButton");

mediapipeButton.addEventListener("click", () => {
  location.href = "/src/Mediapipe.html";
});

webRTCButton.addEventListener("click", () => {
  location.href = "/src/webRTC/webRTC.html";
});
