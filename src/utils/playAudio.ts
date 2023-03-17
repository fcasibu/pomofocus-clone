import { ClickSound } from '@assets';

const audioMap = new Map();

export async function playAudio(soundFile = ClickSound, gain = 0.5) {
  let buffer: AudioBuffer;
  const audioContext = new AudioContext();

  try {
    if (audioMap.has(soundFile)) {
      buffer = audioMap.get(soundFile);
    } else {
      const response = await fetch(soundFile);

      if (!response.ok) {
        throw new Error('Unable to fetch sound file');
      }

      const arrayBuffer = await response.arrayBuffer();

      buffer = await audioContext.decodeAudioData(arrayBuffer);
      audioMap.set(soundFile, buffer);
    }

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    source.buffer = buffer;
    gainNode.gain.value = gain;
    gainNode.connect(audioContext.destination);
    source.connect(gainNode);
    source.start();

    source.onended = () => {
      gainNode.disconnect();
      source.disconnect();
      source.buffer = null;
      source.onended = null;
      audioContext.close();
    };
  } catch (e) {
    console.error(e);
  }
}
