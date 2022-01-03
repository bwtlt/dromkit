/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {
      label, elements, actions, className,
    } = this.props;

    const classNames = `row sequencer-line ${className}`;

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div className={classNames}>
        <div className="col instrument-name">{label}</div>
        <div className="col-md-auto instrument-notes">{elements}</div>
        <div className="col instrument-actions">{actions}</div>
      </div>
    );
  }
}

Line.propTypes = {
  label: PropTypes.object,
  elements: PropTypes.object,
  actions: PropTypes.object,
  className: PropTypes.string,
};

Line.defaultProps = {
  label: null,
  elements: null,
  actions: null,
  className: '',
};

export default Line;
