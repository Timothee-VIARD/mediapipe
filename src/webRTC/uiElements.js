const callButton = document.getElementById("callButton");
const callInput = document.getElementById("callInput");
const answerButton = document.getElementById("answerButton");
const hangupButton = document.getElementById("hangupButton");
const remoteAudio = document.getElementById("audio");
const exitButton = document.getElementById("exitButton");
const hangupDiv = document.getElementById("hangup");
const playSoundDiv = document.getElementById("playSound");

const playSoundHithat = document.getElementById("playSoundHithat");
const playSoundBasshit = document.getElementById("playSoundBasshit");
const playSoundCymbal = document.getElementById("playSoundCymbal");
const playSoundKick = document.getElementById("playSoundKick");
const playSoundShortbasshit = document.getElementById("playSoundShortbasshit");
const playSoundSnare = document.getElementById("playSoundSnare");

exitButton.addEventListener("click", () => {
  location.href = "/";
});

export {
  callButton,
  callInput,
  answerButton,
  hangupButton,
  remoteAudio,
  exitButton,
  hangupDiv,
  playSoundDiv,
  playSoundHithat,
  playSoundBasshit,
  playSoundCymbal,
  playSoundKick,
  playSoundShortbasshit,
  playSoundSnare,
};