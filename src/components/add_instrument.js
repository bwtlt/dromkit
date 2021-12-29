import { React, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Form, InputGroup, FormControl, Button, Overlay, Tooltip, ListGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const axios = require('axios');

const AddInstrument = function (props) {
  const { addInstrument, maxReached } = props;
  const [instruments, setInstruments] = useState([]);
  const target = useRef(null);

  const querySounds = async (e) => {
    e.preventDefault();
    const query = e.target[0].value.replace(/[^a-z0-9áéíóúñü .,_-]/gim, '').trim();
    if (query.length === 0) {
      return;
    }
    const url = `https://freesound.org/apiv2/search/text/?query=${query}&fields=id,name&token=${process.env.REACT_APP_FREESOUND_APIKEY}`;
    await axios.get(url)
      .then((response) => {
        setInstruments(response.data.results);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  const handleClick = (instrument) => {
    addInstrument(instrument);
    setInstruments([]);
  };

  return (
    <Form onSubmit={querySounds} className="add-instrument-form">
      <div>Add an instrument:</div>
      <InputGroup>
        <FormControl
          placeholder="Search instruments..."
          aria-label="Instrument name"
          aria-describedby="basic-addon2"
        />
        {instruments.length > 0 && (
          <Button variant="outline-secondary" id="button-addon2" ref={target} onClick={() => setInstruments([])}>
            Clear
          </Button>
        )}
        <Button
          variant="outline-secondary"
          id="button-addon2"
          type="submit"
          ref={target}
          disabled={maxReached}
        >
          Search
        </Button>
        <Overlay target={target.current} show={maxReached} placement="right">
          <Tooltip id="overlay-example">
            Max number of instruments reached!
          </Tooltip>
        </Overlay>
      </InputGroup>
      {instruments && (
        <ListGroup className="found-sound-list">
          {instruments.slice(0, 10).map(
            (i) => i && (
              <ListGroup.Item key={i.id} className="found-sound-list-item">
                <button
                  type="button"
                  onClick={() => handleClick(i)}
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
      )}
    </Form>
  );
};

AddInstrument.propTypes = {
  addInstrument: PropTypes.func.isRequired,
  maxReached: PropTypes.bool.isRequired,
};

export default AddInstrument;
