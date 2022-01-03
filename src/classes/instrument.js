import { v4 as uuidv4 } from 'uuid';

const getSoundUrl = (id) => `https://freesound.org/apiv2/sounds/${id}/`;

class Instrument {
  constructor(name, id, soundId, nbSteps) {
    this.name = name;
    this.id = id;
    this.soundUrl = getSoundUrl(soundId);
    this.notes = new Array(nbSteps).fill(null).map(() => ({ id: uuidv4(), enabled: false }));
    this.muted = false;
    this.soloed = false;
  }

  setNote = (n, value) => {
    if (value) {
      this.notes[n].enabled = true;
    } else {
      this.notes[n].enabled = false;
    }
  };

  toggleNote = (n) => {
    this.setNote(n, !this.notes[n].enabled);
  };

  setNbSteps = (n) => {
    this.notes = [
      ...this.notes,
      ...Array(Math.max(n - this.notes.length, 0))
        .fill(null)
        .map(() => ({ id: uuidv4(), enabled: false }))];
  };

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

export default Instrument;
