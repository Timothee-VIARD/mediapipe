import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBaKsTm3d3g0LbKsHPeUygNOeIXb_cOuUc",
  authDomain: "media-c6adc.firebaseapp.com",
  projectId: "media-c6adc",
  storageBucket: "media-c6adc.appspot.com",
  messagingSenderId: "286241903533",
  appId: "1:286241903533:web:8f5d0ff68dc0de51438724",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const servers = {
  iceServers: [
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ],
  iceCandidatePoolSize: 10,
};

const pc = new RTCPeerConnection(servers);
let remoteStream = new MediaStream();

const callButton = document.getElementById("callButton");
const callInput = document.getElementById("callInput");
const answerButton = document.getElementById("answerButton");
const hangupButton = document.getElementById("hangupButton");
const playSoundButton = document.getElementById("playSoundButton");
const remoteAudio = document.getElementById("audio");
const exitButton = document.getElementById("exitButton");

exitButton.addEventListener("click", () => {
  location.href = "/";
});

const audioContext = new AudioContext();
const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);

const destination = audioContext.createMediaStreamDestination();
masterGainNode.connect(destination);

destination.stream.getTracks().forEach((track) => {
  pc.addTrack(track, destination.stream);
});

async function addAudioSource(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Audio file download failed");
  }
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const individualGainNode = audioContext.createGain();
  source.connect(individualGainNode);
  individualGainNode.connect(masterGainNode);

  source.start();
  return source;
}

callButton.onclick = async () => {
  try {
    const callDoc = doc(collection(firestore, "calls"));
    const offerCandidates = collection(callDoc, "offerCandidates");
    const answerCandidates = collection(callDoc, "answerCandidates");

    callInput.value = callDoc.id;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        setDoc(doc(offerCandidates), event.candidate.toJSON(), { merge: true });
      }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (data && data.answer && !pc.currentRemoteDescription) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    hangupButton.disabled = false;
    playSoundButton.disabled = false;
  } catch (error) {
    console.error("Error when creating an offer.", error);
  }
};

answerButton.onclick = async () => {
  try {
    const callId = callInput.value;
    const callDoc = doc(firestore, "calls", callId);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        setDoc(doc(answerCandidates), event.candidate.toJSON(), {
          merge: true,
        });
      }
    };

    const callData = (await getDoc(callDoc)).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    hangupButton.disabled = false;
    playSoundButton.disabled = false;
  } catch (error) {
    console.error("Error answering the call.", error);
  }
};

hangupButton.onclick = () => {
  pc.close();
  callButton.disabled = false;
  answerButton.disabled = false;
  hangupButton.disabled = true;
  playSoundButton.disabled = true;
  callInput.value = "";
};

playSoundButton.onclick = async () => {
  try {
    const audioUrl = "/SoundsWav/snare.wav";

    await addAudioSource(audioUrl);

    console.log(
      "Audio played."
    );
  } catch (error) {
    console.error("Audio playback error", error);
  }
};

pc.oniceconnectionstatechange = () => {
  console.log("ICE connection state changed: ", pc.iceConnectionState);
  if (pc.iceConnectionState === "failed") {
    console.error("ICE connection failed");
  }
};

pc.onconnectionstatechange = () => {
  console.log("Connection state changed: ", pc.connectionState);
  if (pc.connectionState === "connected") {
    console.log("Peers connected!");
  }
};

pc.ontrack = (event) => {
  event.streams[0].getTracks().forEach((track) => {
    remoteStream.addTrack(track);
  });
  remoteAudio.srcObject = remoteStream;
};
