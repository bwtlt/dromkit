import { React, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Form, ListGroup, InputGroup, Button, FormControl,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const LoadPattern = function (props) {
  const { loadPatternCallback, savePatternCallback, patterns } = props;
  const target = useRef(null);

  const handleClick = (pattern) => {
    loadPatternCallback(pattern);
  };

  const savePattern = (e) => {
    e.preventDefault();
    const patternName = e.target[0].value.replace(/[^a-z0-9áéíóúñü .,_-]/gim, '').trim();
    savePatternCallback(patternName);
  };

  return (
    <div className="add-instrument-form">
      <h5>Load a pattern:</h5>
      <ListGroup className="found-sound-list">
        {patterns.map(
          (i) => (
            <ListGroup.Item key={i._id} className="found-sound-list-item">
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
      <Form onSubmit={savePattern} className="add-instrument-form">
        <InputGroup>
          <FormControl
            placeholder="Enter pattern name"
            aria-label="Pattern name"
            aria-describedby="basic-addon2"
          />
          <Button
            variant="outline-secondary"
            id="button-addon2"
            type="submit"
            ref={target}
          >
            Save pattern
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

LoadPattern.propTypes = {
  loadPatternCallback: PropTypes.func.isRequired,
  savePatternCallback: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  patterns: PropTypes.array.isRequired,
};

export default LoadPattern;
