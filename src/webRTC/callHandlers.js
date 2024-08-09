import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { firestore } from "./firebaseConfig.js";
import { pc } from "./webrtcConfig.js";
import {
  callButton,
  callInput,
  answerButton,
  hangupButton,
  hangupDiv,
  playSoundDiv,
} from "./uiElements.js";

const callHandler = async () => {
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
  } catch (error) {
    console.error("Error when creating an offer.", error);
  }
};

const answerHandler = async () => {
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
    playSoundDiv.style.display = "flex";
  } catch (error) {
    console.error("Error answering the call.", error);
  }
};

const hangupHandler = () => {
  pc.close();
  callButton.disabled = false;
  answerButton.disabled = false;
  hangupDiv.style.display = "none";
  playSoundDiv.style.display = "none";
  callInput.value = "";
};

export { callHandler, answerHandler, hangupHandler };
