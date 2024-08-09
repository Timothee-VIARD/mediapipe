const audioContext = new AudioContext();
const masterGainNode = audioContext.createGain();
masterGainNode.connect(audioContext.destination);

const destination = audioContext.createMediaStreamDestination();
masterGainNode.connect(destination);

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

export { audioContext, destination, addAudioSource };
