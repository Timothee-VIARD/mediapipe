import {addAudioSource} from "../webRTC/audioManagement/audioContext.js";

export const playSound = (audioUrl) => {
    try {
        addAudioSource(audioUrl);
    } catch (error) {
        console.error("Audio playback error", error);
    }
};