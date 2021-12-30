import { v4 as uuidv4 } from 'uuid';

const getSoundUrl = (id) => `https://freesound.org/apiv2/sounds/${id}/`;

class Instrument {
  constructor(name, id, soundId, nbSteps) {
    this.name = name;
    this.id = id;
    this.soundUrl = getSoundUrl(soundId);
    this.notes = new Array(nbSteps).fill(null).map(() => ({ id: uuidv4(), enabled: false }));
  }

  toggleNote = (n) => {
    const notesSlice = this.notes.slice();
    notesSlice[n].enabled = !notesSlice[n].enabled;
    this.notes = notesSlice;
  };

  setNbSteps = (n) => {
    this.notes = [
      ...this.notes,
      ...Array(Math.max(n - this.notes.length, 0))
        .fill(null)
        .map(() => ({ id: uuidv4(), enabled: false }))];
  };
}

export default Instrument;
