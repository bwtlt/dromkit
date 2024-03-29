import React from 'react';
import PropTypes from 'prop-types';
import * as Realm from 'realm-web';
import { v4 as uuidv4 } from 'uuid';
import Step from './step';
import SoundSource from '../classes/sound_source';
import Line from './line';
import Steps from './steps';
import Track from './track';
import Transport from './transport';
import AddInstrument from './add_instrument';
import LoadPattern from './load_pattern';
import * as Definitions from '../definitions';

class Sequencer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      BPM: Definitions.DEFAULT_BPM,
      nbSteps: Definitions.NUMBER_OF_NOTES,
      playing: 0,
      activeNote: -1,
      instruments: [
        {
          id: uuidv4(),
          source: new SoundSource('568581'),
          steps: new Steps(),
        },
        {
          id: uuidv4(),
          source: new SoundSource('528870'),
          steps: new Steps(),
        },
        {
          id: uuidv4(),
          source: new SoundSource('332367'),
          steps: new Steps(),
        },
      ],
      patterns: [],
      app: new Realm.App({ id: 'application-0-aayfa' }),
    };
  }

  async componentDidMount() {
    const { app } = this.state;
    await app.logIn(Realm.Credentials.anonymous());
    const client = app.currentUser.mongoClient('mongodb-atlas');
    const documents = client.db('patterns').collection('patterns');
    this.setState({ patterns: (await documents.find()).slice(0, 10) });
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

  handleBPMChange = (value) => {
    this.setState({ BPM: value });
    const { playing } = this.state;
    if (playing) {
      clearInterval(playing);
      this.setState({ playing: this.play(value) });
    }
  };

  handleStepsChange = (value) => {
    this.setState({ nbSteps: value });
    const { instruments } = this.state;
    instruments.forEach((inst) => inst.steps.setNbSteps(value));
    const { playing, BPM } = this.state;
    if (playing) {
      clearInterval(playing);
      this.setState({ playing: this.play(BPM) });
    }
  };

  addInstrument = (instrument) => {
    const { id } = instrument;
    const { nbSteps, instruments } = this.state;
    const inst = {
      source: new SoundSource(id),
      steps: new Steps(),
    };
    inst.steps.setNbSteps(nbSteps);
    if (instruments.some((i) => i.source.soloed)) {
      inst.source.muted = true;
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
      instruments: prevState.instruments.filter((inst) => inst.steps.id !== e),
    }));
  };

  loadPattern = (pattern) => {
    const { instruments } = this.state;
    pattern.forEach((line, i) => {
      instruments[i]?.steps.notes.forEach((note, j) => instruments[i].steps.setNote(j, line[j]));
    });
    this.setState({ instruments });
  }

  savePattern = (name) => {
    const { instruments, patterns } = this.state;
    const pattern = { name };
    pattern.steps = instruments.map((inst) => (
      inst.steps.notes.map((note) => (note.enabled))
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
            <Track
              key={item.id}
              name={item.name}
              item={item}
              activeNote={activeNote}
              nbSteps={nbSteps}
              lineLength={Definitions.MAX_NB_STEPS}
              audioContext={audioContext}
              removeCallback={(id) => {
                this.removeInstrument(id);
              }}
              toggleNote={(n) => { item.steps.toggleNote(n); this.setState({ instruments }); }}
              clearNotesCallback={() => {
                item.steps.clearNotes(); this.setState({ instruments });
              }}
              muteCallback={() => {
                instruments.forEach((inst) => { inst.source.setSoloed(false); });
                item.source.toggleMute(); this.setState({ instruments });
              }}
              soloCallback={() => {
                if (item.source.soloed) {
                  instruments.forEach((inst) => {
                    inst.source.unmute(); inst.source.setSoloed(false);
                  });
                } else {
                  instruments.forEach((inst) => {
                    inst.source.mute(); inst.source.setSoloed(false);
                  });
                  item.source.toggleSolo();
                  item.source.unmute();
                }
                this.setState({ instruments });
              }}
            />
          ))}
        </div>
        <div className="container-fluid sequencer-controls">
          <Transport
            playing={playing}
            play={this.toggle}
            stop={this.stop}
            steps={nbSteps}
            BPM={BPM}
            handleBPMCallback={this.handleBPMChange}
            handleStepsCallback={this.handleStepsChange}
            clearCallback={() => {
              instruments.forEach((inst) => {
                inst.steps.clearNotes();
              });
              this.setState({ instruments });
            }}
          />
          <AddInstrument
            addInstrument={this.addInstrument}
            maxReached={instruments.length >= Definitions.MAX_NB_INSTRUMENTS}
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
