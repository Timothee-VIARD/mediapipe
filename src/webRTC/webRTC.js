import {pc} from "./config/webrtcConfig.js";
import {destination} from "./audioManagement/audioContext.js";
import {answerButton, callButton, hangupButton,} from "./uiElements.js";
import {answerHandler, callHandler, hangupHandler,} from "./webRTCConnection/callHandlers.js";
import {setupPeerConnectionHandlers} from "./webRTCConnection/peerConnectionHandlers.js";
import {setupAudioPlayback} from "./audioManagement/audioPlayback.js";

// Setup WebRTC
destination.stream.getTracks().forEach((track) => {
    pc.addTrack(track, destination.stream);
});

// Setup event listeners
callButton.onclick = callHandler;
answerButton.onclick = answerHandler;
hangupButton.onclick = hangupHandler;

setupPeerConnectionHandlers();

setupAudioPlayback();