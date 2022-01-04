import { v4 as uuidv4 } from 'uuid';
import * as Definitions from '../definitions';

class Steps {
  constructor() {
    this.name = '';
    this.id = uuidv4();
    this.notes = new Array(
      Definitions.NUMBER_OF_NOTES,
    ).fill(null).map(() => ({ id: uuidv4(), enabled: false }));
  }

  setNote = (n, value) => {
    if (value) {
      this.notes[n].enabled = true;
    } else {
      this.notes[n].enabled = false;
    }
  };

  clearNotes = () => {
    this.notes.forEach((note, i) => { this.setNote(i, false); });
  }

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
}

export default Steps;
