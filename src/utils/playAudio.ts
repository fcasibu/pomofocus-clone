import ClickSound from '@assets/rclick.mp3';

export function playSound(sound = ClickSound) {
  const audio = new Audio(sound);

  audio.currentTime = 0;
  audio.play();

  audio.onended = () => {
    audio.pause();
    audio.remove();
  };
}
