import React from 'react';
import PropTypes from 'prop-types';
import Step from './step';

const Note = function (props) {
  let className = '';
  const { active, enabled, onClick } = props;
  if (active && enabled) {
    className += ' note-active-enabled';
  } else if (active) {
    className += ' note-active';
  } else if (enabled) {
    className += ' note-enabled';
  } else {
    className += ' note-idle';
  }
  return <button type="button" aria-label="Note" onClick={onClick} className="note-button"><Step className={className} /></button>;
};

Note.propTypes = {
  active: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Note;
