import { addAudioSource } from "./audioContext.js";
import {
  playSoundHithat,
  playSoundBasshit,
  playSoundCymbal,
  playSoundKick,
  playSoundShortbasshit,
  playSoundSnare,
} from "./uiElements.js";

const setupAudioPlayback = () => {
  playSoundShortbasshit.onclick = async () => {
    try {
      const audioUrl = "/SoundsWav/shortbasshit.wav";
      await addAudioSource(audioUrl);
    } catch (error) {
      console.error("Audio playback error", error);
    }
  };

  playSoundCymbal.onclick = async () => {
    try {
      const audioUrl = "/SoundsWav/cymbal.wav";
      await addAudioSource(audioUrl);
    } catch (error) {
      console.error("Audio playback error", error);
    }
  };

  playSoundBasshit.onclick = async () => {
    try {
      const audioUrl = "/SoundsWav/shortbasshit2.wav";
      await addAudioSource(audioUrl);
    } catch (error) {
      console.error("Audio playback error", error);
    }
  };

  playSoundHithat.onclick = async () => {
    try {
      const audioUrl = "/SoundsWav/hihat.wav";
      await addAudioSource(audioUrl);
    } catch (error) {
      console.error("Audio playback error", error);
    }
  };

  playSoundKick.onclick = async () => {
    try {
      const audioUrl = "/SoundsWav/kick.wav";
      await addAudioSource(audioUrl);
    } catch (error) {
      console.error("Audio playback error", error);
    }
  };

  playSoundSnare.onclick = async () => {
    try {
      const audioUrl = "/SoundsWav/snare.wav";
      await addAudioSource(audioUrl);
    } catch (error) {
      console.error("Audio playback error", error);
    }
  };
};

export { setupAudioPlayback };