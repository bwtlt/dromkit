const getSoundUrl = (id) => `https://freesound.org/apiv2/sounds/${id}/`;

class SoundSource {
  constructor(soundId) {
    this.soundUrl = getSoundUrl(soundId);
    this.muted = false;
    this.soloed = false;
  }

  toggleSolo = () => {
    this.soloed = !this.soloed;
  }

  toggleMute = () => {
    this.muted = !this.muted;
  }

  mute = () => {
    this.muted = true;
  }

  unmute = () => {
    this.muted = false;
  }

  setSoloed = (value) => {
    this.soloed = value;
  }
}

export default SoundSource;
