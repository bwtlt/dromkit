import React from 'react';
import PropTypes from 'prop-types';

const Note = function (props) {
  let className = 'btn-circle btn-sm';
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
  return <button type="button" aria-label="Note" onClick={onClick} className={className} />;
};

Note.propTypes = {
  active: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Note;
