import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const TransportButton = function (props) {
  const { enabled, onClick } = props;

  return (
    <button
      type="button"
      onClick={onClick}
      className={enabled ? 'transport-btn-enabled' : 'transport-btn'}
    >
      {enabled ? (
        <FontAwesomeIcon icon={faPause} />
      ) : (
        <FontAwesomeIcon icon={faPlay} />
      )}
    </button>
  );
};

TransportButton.propTypes = {
  enabled: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TransportButton;
