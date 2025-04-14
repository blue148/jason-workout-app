// Boxing bell sound from a reliable source
const BELL_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2562/2562.wav';

class AudioPlayer {
  private bellSound: HTMLAudioElement;
  private isLoaded: boolean = false;

  constructor() {
    this.bellSound = new Audio(BELL_SOUND_URL);
    this.bellSound.addEventListener('canplaythrough', () => {
      this.isLoaded = true;
    });
  }

  async playBellSequence(count: number) {
    if (!this.isLoaded) {
      await new Promise(resolve => {
        this.bellSound.addEventListener('canplaythrough', resolve, { once: true });
      });
    }

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        // Clone the audio element for overlapping sounds
        const bell = this.bellSound.cloneNode() as HTMLAudioElement;
        bell.play();
      }, i * 500); // Play each bell with a 500ms delay
    }
  }

  playStartRound() {
    this.playBellSequence(5);
  }

  playEndRound() {
    this.playBellSequence(3);
  }
}

export const audioPlayer = new AudioPlayer();