import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Note from './note';

class Instrument extends React.Component {
  constructor(props) {
    const { name, lineLength, sound } = props;
    super(props);
    this.state = {
      name,
      notes: new Array(lineLength)
        .fill(null)
        .map(() => ({ id: uuidv4(), enabled: false })),
      sound: new Audio(sound),
    };
  }

  toggle = (n) => {
    const { notes } = this.state;
    const notesSlice = notes.slice();
    notesSlice[n].enabled = !notesSlice[n].enabled;
    this.setState({ notes: notesSlice });
  };

  play = () => {
    const { sound } = this.state;
    sound.currentTime = 0;
    sound.play();
  };

  render() {
    const { name, notes } = this.state;
    const { activeNote, nbSteps, removeCallback, instrumentId } = this.props;
    if (notes[activeNote]?.enabled) {
      this.play();
    }
    const activeSteps = notes.slice(0, nbSteps);
    const elements = activeSteps.map((note, i) => (
      <Note
        key={note.id}
        active={activeNote === i}
        enabled={note.enabled}
        onClick={() => this.toggle(i)}
      />
    ));
    return (
      <div className="row instrument-line">
        <div className="col-1 instrument-name">{name}</div>
        <div className="col instrument-notes">{elements}</div>
        <button className="delete-instrument" onClick={() => {removeCallback(instrumentId)}}><FontAwesomeIcon icon={faTimes}/></button>
      </div>
    );
  }
}

Instrument.propTypes = {
  name: PropTypes.string.isRequired,
  lineLength: PropTypes.number.isRequired,
  nbSteps: PropTypes.number.isRequired,
  sound: PropTypes.string.isRequired,
  activeNote: PropTypes.number.isRequired,
};

export default Instrument;
