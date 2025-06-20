export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;

  constructor() {
    this.audio = new Audio();
    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
    });
  }

  async play(url: string): Promise<void> {
    if (this.audio) {
      this.audio.src = url;
      this.isPlaying = true;
      try {
        await this.audio.play();
      } catch (error) {
        console.error('Error playing audio:', error);
        this.isPlaying = false;
        throw error;
      }
    }
  }

  pause(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  setPlaybackRate(rate: number): void {
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  getPlaybackRate(): number {
    return this.audio?.playbackRate || 1;
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

export const audioManager = new AudioManager();
