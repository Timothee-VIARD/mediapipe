import { pc, remoteStream } from "./webrtcConfig.js";
import { remoteAudio, hangupDiv, playSoundDiv } from "./uiElements.js";

const setupPeerConnectionHandlers = () => {
  pc.oniceconnectionstatechange = () => {
    console.log("ICE connection state changed: ", pc.iceConnectionState);
    if (pc.iceConnectionState === "failed") {
      console.error("ICE connection failed");
    }
  };

  pc.onconnectionstatechange = () => {
    console.log("Connection state changed: ", pc.connectionState);
    if (pc.connectionState === "connected") {
      hangupDiv.style.display = 'flex';
      playSoundDiv.style.display = 'flex';
      console.log("Peers connected!");
    } else if (pc.connectionState === "disconnected") {
      hangupDiv.style.display = 'none';
      playSoundDiv.style.display = 'none';
      console.log("Peers disconnected!");
    }
  };

  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    remoteAudio.srcObject = remoteStream;
  };
};

export { setupPeerConnectionHandlers };