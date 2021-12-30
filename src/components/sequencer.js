import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Instrument from './instrument';
import Transport from './transport_button';
import AddInstrument from './add_instrument';

const NUMBER_OF_NOTES = 16;
const MIN_BPM = 1;
const MAX_BPM = 300;
const MIN_NB_STEPS = 1;
const MAX_NB_STEPS = 64;
const MAX_NB_INSTRUMENTS = 16;

const getSoundUrl = (id) => `https://freesound.org/apiv2/sounds/${id}/`;

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BPM: 120,
      nbSteps: NUMBER_OF_NOTES,
      playing: 0,
      activeNote: -1,
      instruments: [
        {
          id: uuidv4(),
          name: '',
          soundUrl: getSoundUrl('568581'),
        },
        {
          id: uuidv4(),
          name: '',
          soundUrl: getSoundUrl('131363'),
        },
      ],
    };
  }

  play = (BPM) => {
    const { audioContext } = this.props;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const INTERVAL_PERIOD = 60000 / BPM / 4;
    return setInterval(() => {
      const { activeNote, nbSteps } = this.state;
      this.setState({
        activeNote: activeNote >= nbSteps - 1 ? 0 : activeNote + 1,
      });
    }, INTERVAL_PERIOD);
  };

  toggle = () => {
    const { BPM, playing } = this.state;
    if (playing) {
      clearInterval(playing);
      this.setState({ playing: 0 });
    } else {
      clearInterval(playing);
      this.setState({
        playing: this.play(BPM),
      });
    }
  };

  stop = () => {
    const { playing } = this.state;
    clearInterval(playing);
    this.setState({ playing: 0, activeNote: -1 });
  };

  handleBPMChange = (input) => {
    let value = parseInt(input, 10);
    if (Number.isNaN(value)) {
      value = 0;
    }
    if (value > MAX_BPM) {
      value = MAX_BPM;
    } else if (value < MIN_BPM) {
      value = MIN_BPM;
    }
    this.setState({ BPM: value });
    const { playing } = this.state;
    if (playing) {
      clearInterval(playing);
      this.setState({ playing: this.play(value) });
    }
  };

  handleStepsChange = (input) => {
    let value = parseInt(input, 10);
    if (Number.isNaN(value)) {
      value = MIN_NB_STEPS;
    }
    if (value > MAX_NB_STEPS) {
      value = MAX_NB_STEPS;
    } else if (value < MIN_NB_STEPS) {
      value = MIN_NB_STEPS;
    }
    this.setState({ nbSteps: value });
    const { playing, BPM } = this.state;
    if (playing) {
      clearInterval(playing);
      this.setState({ playing: this.play(BPM) });
    }
  };

  addInstrument = (instrument) => {
    const { name, id } = instrument;
    this.setState((prevState) => ({
      instruments: [
        ...prevState.instruments,
        { id: uuidv4(), name, soundUrl: getSoundUrl(id) },
      ],
    }));
  };

  removeInstrument = (e) => {
    this.setState((prevState) => ({
      instruments: prevState.instruments.filter((inst) => inst.id !== e),
    }));
  };

  render() {
    const {
      BPM, playing, activeNote, instruments, nbSteps,
    } = this.state;
    const { audioContext } = this.props;
    return (
      <div className="container">
        <div className="container-fluid sequencer">
          {instruments.map((item) => (
            <Instrument
              key={item.id}
              instrumentId={item.id}
              name={item.name}
              activeNote={activeNote}
              nbSteps={nbSteps}
              lineLength={MAX_NB_STEPS}
              audioContext={audioContext}
              soundUrl={item.soundUrl}
              removeCallback={(id) => {
                this.removeInstrument(id);
              }}
            />
          ))}
          <Transport
            playing={playing}
            play={this.toggle}
            stop={this.stop}
            steps={nbSteps}
            BPM={BPM}
            handleBPMCallback={this.handleBPMChange}
            handleStepsCallback={this.handleStepsChange}
          />
          <AddInstrument
            addInstrument={this.addInstrument}
            maxReached={instruments.length >= MAX_NB_INSTRUMENTS}
          />
        </div>
      </div>
    );
  }
}

Sequencer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  audioContext: PropTypes.object.isRequired,
};

export default Sequencer;
