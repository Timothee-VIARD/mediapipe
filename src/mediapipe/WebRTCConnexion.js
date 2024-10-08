import {pc} from "../webRTC/config/webrtcConfig.js";
import {destination} from "../webRTC/audioManagement/audioContext.js";
import {answerButton, callButton} from "../webRTC/uiElements.js";
import {answerHandler, callHandler, hangupHandler,} from "../webRTC/webRTCConnection/callHandlers.js";
import {setupPeerConnectionHandlers} from "../webRTC/webRTCConnection/peerConnectionHandlers.js";

// Setup WebRTC
destination.stream.getTracks().forEach((track) => {
    pc.addTrack(track, destination.stream);
});

// Setup event listeners
callButton.onclick = callHandler;
answerButton.onclick = answerHandler;

setupPeerConnectionHandlers();
