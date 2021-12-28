import React from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStop } from '@fortawesome/free-solid-svg-icons';

const Transport = function (props) {
  const { playing, play, stop, BPM, handleBPMChange } = props;

  const handleChange = (e) => {
    handleBPMChange(e.target.value);
  }

  return (
    <div className="transport">
      <TransportButton btnType={playing ? "pause" : "play"} enabled={playing} onClick={play} />
      <TransportButton btnType="stop" enabled={0} onClick={stop} />
      <InputGroup
        className="bpm-input"
      > 
        <Form.Control
            required
            name="BPM"
            type="number"
            maxLength="3"
            defaultValue={BPM}
            onChange={handleChange}
        />
        <InputGroup.Text>BPM</InputGroup.Text>
      </InputGroup>
    </div>
  );
}

Transport.propTypes = {
  play: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  BPM: PropTypes.number.isRequired,
  handleBPMChange: PropTypes.func.isRequired,
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
  };
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

export default Transport;
