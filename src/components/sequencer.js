import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import Instrument from './instrument';
import TransportButton from './transport_button';
import kickSound from '../sounds/kick.wav';
import snareSound from '../sounds/snare.wav';

const NUMBER_OF_NOTES = 16;
const BPM = 120;
const INTERVAL_PERIOD = 60000 / BPM / 4;

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: 0,
      activeNote: -1,
      instruments: [
        { id: uuidv4(), name: 'KICK', soundPath: kickSound },
        { id: uuidv4(), name: 'SNARE', soundPath: snareSound },
      ],
    };
  }

  play = () => {
    const { playing } = this.state;
    if (playing) {
      this.setState({ playing: 0, activeNote: -1 });
      clearInterval(playing);
    } else {
      const playTimer = setInterval(() => {
        const { activeNote } = this.state;
        this.setState({
          activeNote: activeNote === NUMBER_OF_NOTES - 1 ? 0 : activeNote + 1,
        });
      }, INTERVAL_PERIOD);

      this.setState({
        playing: playTimer,
      });
    }
  };

  render() {
    const { playing, activeNote, instruments } = this.state;
    return (
      <div className="container">
        <TransportButton enabled={playing} onClick={this.play} />
        {instruments.map((item) => (
          <Instrument
            key={item.id}
            name={item.name}
            activeNote={activeNote}
            lineLength={NUMBER_OF_NOTES}
            sound={item.soundPath}
          />
        ))}
      </div>
    );
  }
}

export default Sequencer;
