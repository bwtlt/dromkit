import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import Line from './line';
import Note from './note';

const axios = require('axios');

const Properties = React.forwardRef((props, ref) => {
  const { properties } = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Popover ref={ref} {...props}>
      <Popover.Header as="h3">{properties.name}</Popover.Header>
      <Popover.Body>
        <dl>
          <dt>Description</dt>
          <dd dangerouslySetInnerHTML={{ __html: properties.description }} />
          <dt>URL</dt>
          <dd><a href={properties.url}>{properties.url}</a></dd>
          <dt>User</dt>
          <dd>{properties.username}</dd>
          <dt>License</dt>
          <dd><a href={properties.license}>{properties.license}</a></dd>
        </dl>
      </Popover.Body>
    </Popover>
  );
});

Properties.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  properties: PropTypes.object,
};

Properties.defaultProps = {
  properties: null,
};

class Instrument extends React.Component {
  constructor(props) {
    const { lineLength } = props;
    super(props);
    this.state = {
      properties: null,
      notes: new Array(lineLength)
        .fill(null)
        .map(() => ({ id: uuidv4(), enabled: false })),
      soundBuffer: null,
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
      .then(async (response) => {
        this.setState({ properties: response.data });
        return axios.get(response.data.previews['preview-hq-mp3'], { responseType: 'arraybuffer' });
      })
      .then((response) => response.data)
      .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        this.setState({ soundBuffer: audioBuffer, state: 'ready' });
      })
      .catch((error) => {
        // handle error
        // eslint-disable-next-line no-console
        console.error(error);
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
    const { soundBuffer } = this.state;
    const { audioContext } = this.props;
    const source = audioContext.createBufferSource();
    source.buffer = soundBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  };

  render() {
    const { properties, notes, state } = this.state;
    const {
      activeNote, nbSteps, removeCallback, instrumentId,
    } = this.props;
    if (notes[activeNote]?.enabled) {
      this.playSound();
    }
    let elements;
    switch (state) {
      case 'loading':
        elements = <span>Loading...</span>;
        break;
      case 'ready':
        elements = (
          <>
            {notes.slice(0, nbSteps).map((note, i) => (
              <Note
                key={note.id}
                active={activeNote === i}
                enabled={note.enabled}
                onClick={() => this.toggle(i)}
              />
            ))}
          </>
        );
        break;
      case 'error':
      default:
        elements = <span>Failed to load sound</span>;
        break;
    }

    const ref = React.createRef();

    const label = (
      <OverlayTrigger placement="left" trigger="click" overlay={properties && <Properties ref={ref} properties={properties} />}>
        <span className="instrument-overlay">{state === 'ready' ? properties.name : ''}</span>
      </OverlayTrigger>
    );

    const actionButton = (
      <button type="button" aria-label="Delete" className="delete-instrument" onClick={() => { removeCallback(instrumentId); }}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    );

    return (
      <Line label={label} elements={elements} actionButton={actionButton} className="instrument-line" />
    );
  }
}

Instrument.propTypes = {
  lineLength: PropTypes.number.isRequired,
  nbSteps: PropTypes.number.isRequired,
  soundUrl: PropTypes.string.isRequired,
  activeNote: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  audioContext: PropTypes.object.isRequired,
  removeCallback: PropTypes.func.isRequired,
  instrumentId: PropTypes.string.isRequired,
};

export default Instrument;
