import React from 'react';
import PropTypes from 'prop-types';
import problemTypes from '../../../data/constants';

const ProblemTypeSelect = ({
  // redux
  selected,
}) => {
  const [value, setValue] = useState('green');
  const handleChange = e => setValue(e.target.value);
  return (
    <Form.Group>
      <Form.Label>Which Color?</Form.Label>
      <Form.RadioSet
        name="colors"
        onChange={handleChange}
        value={value}
      >

      </Form.RadioSet>
    </Form.Group>
  );
};
