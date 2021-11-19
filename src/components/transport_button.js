import React from 'react';
import PropTypes from 'prop-types';

const TransportButton = function (props) {
  const { enabled, onClick } = props;
  let className = 'btn-circle btn-sm';
  if (enabled) {
    className += ' btn-primary';
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {enabled ? 'STOP' : 'PLAY'}
    </button>
  );
};

TransportButton.propTypes = {
  enabled: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TransportButton;
