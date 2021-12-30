import React from 'react';
import PropTypes from 'prop-types';

const Step = function (props) {
  const { className, children } = props;
  const classNames = `btn-circle btn-sm ${className}`;
  return <div className={classNames}>{children}</div>;
};

Step.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string,
};

Step.defaultProps = {
  className: '',
  children: '',
};

export default Step;
