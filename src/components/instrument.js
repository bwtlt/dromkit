import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Note from './note';

const axios = require('axios');

class Instrument extends React.Component {
  constructor(props) {
    const { name, lineLength } = props;
    super(props);
    this.state = {
      name,
      notes: new Array(lineLength)
        .fill(null)
        .map(() => ({ id: uuidv4(), enabled: false })),
      sound: null,
      state: 'loading',
    };
  }

  async componentDidMount() {
    await this.load();
  }

  load = async () => {
    const { audioContext, soundUrl } = this.props;
    // Make a request for a user with a given ID
    const url = `${soundUrl}?token=${process.env.REACT_APP_FREESOUND_APIKEY}`;
    await axios.get(url)
      .then(async (response) => axios.get(response.data.previews['preview-hq-mp3'], { responseType: 'arraybuffer' }))
      .then((response) => response.data)
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        this.setState({ sound: audioBuffer, state: 'ready' });
      })
      .catch((error) => {
        // handle error
        console.log(error);
        this.setState({ state: 'error' });
      });
  };

  toggle = (n) => {
    const { notes } = this.state;
    const notesSlice = notes.slice();
    notesSlice[n].enabled = !notesSlice[n].enabled;
    this.setState({ notes: notesSlice });
  };

  playSound = () => {
    const { sound } = this.state;
    const { audioContext } = this.props;
    const source = audioContext.createBufferSource();
    source.buffer = sound;
    source.connect(audioContext.destination);
    source.start(0);
  };

  render() {
    const { name, notes, state } = this.state;
    const {
      activeNote, nbSteps, removeCallback, instrumentId,
    } = this.props;
    if (notes[activeNote]?.enabled) {
      this.playSound();
    }
    const activeSteps = notes.slice(0, nbSteps);
    let elements;
    switch (state) {
      case 'loading':
        elements = <span>Loading...</span>;
        break;
      case 'ready':
        elements = activeSteps.map((note, i) => (
          <Note
            key={note.id}
            active={activeNote === i}
            enabled={note.enabled}
            onClick={() => this.toggle(i)}
          />
        ));
        break;
      case 'error':
      default:
        elements = <span>Failed to load sound</span>;
        break;
    }

    return (
      <div className="row instrument-line">
        <div className="col-1 instrument-name">{name}</div>
        <div className="col instrument-notes">{elements}</div>
        <button type="button" aria-label="Delete" className="delete-instrument" onClick={() => { removeCallback(instrumentId); }}><FontAwesomeIcon icon={faTimes} /></button>
      </div>
    );
  }
}

Instrument.propTypes = {
  name: PropTypes.string.isRequired,
  lineLength: PropTypes.number.isRequired,
  nbSteps: PropTypes.number.isRequired,
  soundUrl: PropTypes.string.isRequired,
  activeNote: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  audioContext: PropTypes.object.isRequired,
  removeCallback: PropTypes.func.isRequired,
  instrumentId: PropTypes.number.isRequired,
};

export default Instrument;
