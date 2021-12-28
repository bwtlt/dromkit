import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Instrument from './instrument';
import Transport from './transport_button';
import kickSound from '../sounds/kick.wav';
import snareSound from '../sounds/snare.wav';

const NUMBER_OF_NOTES = 16;
const MIN_BPM = 1;
const MAX_BPM = 300;

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BPM: 120,
      BPMUserInput: 120,
      playing: 0,
      activeNote: -1,
      instruments: [
        { id: uuidv4(), name: 'KICK', soundPath: kickSound },
        { id: uuidv4(), name: 'SNARE', soundPath: snareSound },
      ],
    };
  }

  play = (BPM) => {
    const INTERVAL_PERIOD = 60000 / BPM / 4;
    return setInterval(() => {
      const { activeNote } = this.state;
      this.setState({
        activeNote: activeNote === NUMBER_OF_NOTES - 1 ? 0 : activeNote + 1,
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
  }

  handleBPMChange = (input) => {
    let value = parseInt(input, 10);
    if (isNaN(value)) {
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
  }

  render() {
    const { BPM, playing, activeNote, instruments } = this.state;
    return (
      <div className="container">
        <div className="container-fluid sequencer">
          {instruments.map((item) => (
            <Instrument
              key={item.id}
              name={item.name}
              activeNote={activeNote}
              lineLength={NUMBER_OF_NOTES}
              sound={item.soundPath}
            />
          ))}
          <Transport playing={playing} play={this.toggle} stop={this.stop} BPM={BPM} handleBPMChange={this.handleBPMChange} />
        </div>
      </div>
    );
  }
}

export default Sequencer;
