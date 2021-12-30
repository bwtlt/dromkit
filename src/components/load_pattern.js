import { React } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {
  Form, ListGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const patterns = [
  {
    name: 'Dummy',
    steps: [
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    ],
  },
  {
    name: 'Empty',
    steps: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
];

const LoadPattern = function (props) {
  const { loadPattern } = props;

  const handleClick = (pattern) => {
    loadPattern(pattern);
  };

  return (
    <Form className="add-instrument-form">
      <div>Load a pattern:</div>
      <ListGroup className="found-sound-list">
        {patterns.map(
          (i) => (
            <ListGroup.Item key={uuidv4()} className="found-sound-list-item">
              <button
                type="button"
                onClick={() => handleClick(i.steps)}
                className="found-sound"
              >
                <span className="add-instrument-name">{i.name}</span>
                <span className="add-instrument">
                  <FontAwesomeIcon icon={faPlus} />
                </span>
              </button>
            </ListGroup.Item>
          ),
        )}
      </ListGroup>
    </Form>
  );
};

LoadPattern.propTypes = {
  loadPattern: PropTypes.func.isRequired,
};

export default LoadPattern;
