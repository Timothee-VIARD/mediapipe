import PitchShift from 'soundbank-pitch-shift';

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let pitchShiftNode = null;
let sourceNode = null;
let isPlaying = false;

const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');
const pitchSlider = document.getElementById('pitchSlider');
const speedSlider = document.getElementById('speedSlider');
const pitchValue = document.getElementById('pitchValue');
const speedValue = document.getElementById('speedValue');
const exitButton = document.getElementById('exitButton');

playButton.addEventListener('click', async () => {
    if (isPlaying) return;

    try {
        console.log('Fetching audio file...');
        const response = await fetch('/SoundsExemple/Coconut.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;

        console.log('Creating pitch shift node...');
        pitchShiftNode = PitchShift(audioContext);
        pitchShiftNode.transpose = parseInt(pitchSlider.value, 10);
        pitchShiftNode.connect(audioContext.destination);

        sourceNode.connect(pitchShiftNode);

        console.log('Starting audio playback...');
        sourceNode.playbackRate.value = parseFloat(speedSlider.value);
        sourceNode.start();
        isPlaying = true;
    } catch (error) {
        console.error('Error during audio playback:', error);
    }
});

stopButton.addEventListener('click', () => {
    if (!isPlaying) return;

    sourceNode.stop();
    sourceNode.disconnect();
    pitchShiftNode.disconnect();
    isPlaying = false;
});

pitchSlider.addEventListener('input', () => {
    if (pitchShiftNode) {
        pitchShiftNode.transpose = parseInt(pitchSlider.value, 10);
    }
    let value = pitchSlider.value > 0 ? `+${pitchSlider.value}` : pitchSlider.value;
    pitchValue.textContent = value.padStart(4, ' ');
});

speedSlider.addEventListener('input', () => {
    if (sourceNode) {
        sourceNode.playbackRate.value = parseFloat(speedSlider.value);
    }
    speedValue.textContent = `${Math.round(speedSlider.value * 100)}%`;
});

exitButton.addEventListener("click", () => {
    location.href = "/";
});