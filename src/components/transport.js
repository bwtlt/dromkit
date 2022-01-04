import { React, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';
import * as Definitions from '../definitions';

const Transport = function (props) {
  const {
    playing, play, stop, BPM, steps, handleBPMCallback, handleStepsCallback,
  } = props;

  const handleBPMChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (Number.isNaN(value)) {
      value = 0;
    }
    if (value > Definitions.MAX_BPM) {
      value = Definitions.MAX_BPM;
    } else if (value < Definitions.MIN_BPM) {
      value = Definitions.MIN_BPM;
    }
    handleBPMCallback(value);
  };

  const handleStepsChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (Number.isNaN(value)) {
      value = Definitions.MIN_NB_STEPS;
    }
    if (value > Definitions.MAX_NB_STEPS) {
      value = Definitions.MAX_NB_STEPS;
    } else if (value < Definitions.MIN_NB_STEPS) {
      value = Definitions.MIN_NB_STEPS;
    }
    handleStepsCallback(value);
  };

  return (
    <div className="transport">
      <TransportButton btnType={playing ? 'pause' : 'play'} enabled={playing} onClick={play} />
      <TransportButton btnType="stop" enabled={0} onClick={stop} />
      <TapTempo setBPMCallback={(value) => { handleBPMCallback(value); }} />
      <InputGroup
        className="param-input"
      >
        <Form.Control
          required
          name="BPM"
          type="number"
          maxLength="3"
          value={BPM}
          onChange={handleBPMChange}
        />
        <InputGroup.Text>BPM</InputGroup.Text>
      </InputGroup>
      <InputGroup
        className="param-input"
      >
        <Form.Control
          required
          name="Steps"
          type="number"
          maxLength="3"
          value={steps}
          onChange={handleStepsChange}
        />
        <InputGroup.Text>steps</InputGroup.Text>
      </InputGroup>
    </div>
  );
};

Transport.propTypes = {
  playing: PropTypes.number.isRequired,
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  BPM: PropTypes.number.isRequired,
  steps: PropTypes.number.isRequired,
  handleBPMCallback: PropTypes.func.isRequired,
  handleStepsCallback: PropTypes.func.isRequired,
};

const getIcon = (btnType) => {
  switch (btnType) {
    case 'play':
      return faPlay;
    case 'pause':
      return faPause;
    case 'stop':
      return faStop;
    default:
      return null;
  }
};

const TransportButton = function (props) {
  const { enabled, btnType, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={enabled ? 'transport-btn-enabled' : 'transport-btn'}
    >
      <FontAwesomeIcon icon={getIcon(btnType)} />
    </button>
  );
};

TransportButton.propTypes = {
  enabled: PropTypes.number.isRequired,
  btnType: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const TapTempo = function (props) {
  const [timeStamps, setTimeStamps] = useState([]);
  const { setBPMCallback } = props;

  const onClick = () => {
    const averageDelta = ([x, ...xs]) => {
      if (x === undefined) {
        return NaN;
      }
      return (
        xs.reduce(([acc, last], a) => [acc + (a - last), a], [0, x])[0] / xs.length
      );
    };
    const now = Date.now();
    const delta = now - timeStamps.at(-1);
    if (!timeStamps || delta > 2000) {
      // start over
      setTimeStamps([now]);
    } else {
      if (timeStamps.length >= 2) {
        const average = averageDelta(timeStamps);
        const BPM = Math.round(60000 / average);
        setBPMCallback(BPM);
      }
      setTimeStamps([...timeStamps, now]);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="transport-btn"
    >
      TAP
    </button>
  );
};

TapTempo.propTypes = {
  setBPMCallback: PropTypes.func.isRequired,
};

export default Transport;
