import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

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

export { firestore };