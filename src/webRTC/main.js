import { pc } from "./webrtcConfig.js";
import { destination } from "./audioContext.js";
import {
  callButton,
  answerButton,
  hangupButton,
} from "./uiElements.js";
import {
  callHandler,
  answerHandler,
  hangupHandler,
} from "./callHandlers.js";
import { setupPeerConnectionHandlers } from "./peerConnectionHandlers.js";
import { setupAudioPlayback } from "./audioPlayback.js";

// Setup WebRTC
destination.stream.getTracks().forEach((track) => {
  pc.addTrack(track, destination.stream);
});

// Setup event listeners
callButton.onclick = callHandler;
answerButton.onclick = answerHandler;
hangupButton.onclick = hangupHandler;

// Setup peer connection handlers
setupPeerConnectionHandlers();

// Setup audio playback
setupAudioPlayback();