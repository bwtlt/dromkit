import { React, useRef } from 'react';
import { Form, InputGroup, FormControl, Button, Overlay, Tooltip } from 'react-bootstrap';

const AddInstrument = function (props) {
    const { addInstrument, maxReached } = props;
    const target = useRef(null);

    return (
        <Form onSubmit={addInstrument}>
        <InputGroup>
            <FormControl
            placeholder="Instrument name"
            aria-label="Instrument name"
            aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2" type="submit" ref={target} disabled={maxReached}>
                Add
            </Button>
            <Overlay target={target.current} show={maxReached} placement="right">
                <Tooltip id="overlay-example">
                    Max number of instruments reached!
                </Tooltip>
            </Overlay>
        </InputGroup>
        </Form>
    );
};

export default AddInstrument;
