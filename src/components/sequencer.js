import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import Step from './step';
import Line from './line';
import Instrument from '../classes/instrument';
import InstrumentLine from './instrument_line';
import Transport from './transport_button';
import AddInstrument from './add_instrument';
import LoadPattern from './load_pattern';

const NUMBER_OF_NOTES = 16;
const MIN_BPM = 1;
const MAX_BPM = 300;
const MIN_NB_STEPS = 1;
const MAX_NB_STEPS = 64;
const MAX_NB_INSTRUMENTS = 16;

const FACTORY_PATTERNS = [
  {
    name: 'Empty',
    steps: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    name: 'Dummy',
    steps: [
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    ],
  },
];

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BPM: 120,
      nbSteps: NUMBER_OF_NOTES,
      playing: 0,
      activeNote: -1,
      instruments: [
        new Instrument(
          '',
          uuidv4(),
          '568581',
          NUMBER_OF_NOTES,
        ),
        new Instrument(
          '',
          uuidv4(),
          '529378',
          NUMBER_OF_NOTES,
        ),
        new Instrument(
          '',
          uuidv4(),
          '332367',
          NUMBER_OF_NOTES,
        ),
      ],
      patterns: FACTORY_PATTERNS,
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
      const { audioContext } = this.props;
      audioContext.suspend();
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
    const { audioContext } = this.props;
    audioContext.suspend();
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
    const { instruments } = this.state;
    instruments.forEach((inst) => inst.setNbSteps(value));
    const { playing, BPM } = this.state;
    if (playing) {
      clearInterval(playing);
      this.setState({ playing: this.play(BPM) });
    }
  };

  addInstrument = (instrument) => {
    const { name, id } = instrument;
    const { nbSteps, instruments } = this.state;
    const inst = new Instrument(name, uuidv4(), id, nbSteps);
    if (instruments.some((i) => i.soloed)) {
      inst.muted = true;
    }
    this.setState((prevState) => ({
      instruments: [
        ...prevState.instruments,
        inst,
      ],
    }));
  };

  removeInstrument = (e) => {
    this.setState((prevState) => ({
      instruments: prevState.instruments.filter((inst) => inst.id !== e),
    }));
  };

  loadPattern = (pattern) => {
    const { instruments } = this.state;
    pattern.forEach((line, i) => {
      instruments[i]?.notes.forEach((note, j) => instruments[i].setNote(j, line[j]));
    });
    this.setState({ instruments });
  }

  savePattern = (name) => {
    const { instruments, patterns } = this.state;
    const pattern = { name };
    pattern.steps = instruments.map((inst) => (
      inst.notes.map((note) => (note.enabled ? 1 : 0))
    ));
    this.setState({ patterns: [...patterns, pattern] });
  }

  render() {
    const {
      BPM, playing, activeNote, instruments, nbSteps, patterns,
    } = this.state;
    const { audioContext } = this.props;

    const stepsNumber = (
      <>
        {[...Array(nbSteps).keys()].map((i) => (<Step className="step-number" key={i}>{(i + 1).toString()}</Step>))}
      </>
    );

    return (
      <div className="container">
        <div className="container-fluid sequencer">
          <Line elements={stepsNumber} />
          {instruments.map((item) => (
            <InstrumentLine
              key={item.id}
              name={item.name}
              item={item}
              activeNote={activeNote}
              nbSteps={nbSteps}
              lineLength={MAX_NB_STEPS}
              audioContext={audioContext}
              removeCallback={(id) => {
                this.removeInstrument(id);
              }}
              toggleNote={(n) => { item.toggleNote(n); this.setState({ instruments }); }}
              clearNotesCallback={() => { item.clearNotes(); this.setState({ instruments }); }}
              muteCallback={() => {
                instruments.forEach((inst) => { inst.setSoloed(false); });
                item.toggleMute(); this.setState({ instruments });
              }}
              soloCallback={() => {
                if (item.soloed) {
                  instruments.forEach((inst) => { inst.unmute(); inst.setSoloed(false); });
                } else {
                  instruments.forEach((inst) => { inst.mute(); inst.setSoloed(false); });
                  item.toggleSolo();
                  item.unmute();
                }
                this.setState({ instruments });
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
          <LoadPattern
            loadPatternCallback={this.loadPattern}
            savePatternCallback={this.savePattern}
            patterns={patterns}
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
