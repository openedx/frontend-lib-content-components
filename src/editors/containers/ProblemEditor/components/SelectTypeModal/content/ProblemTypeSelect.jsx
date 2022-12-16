import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from '@edx/paragon';
import { ProblemTypes, ProblemTypeKeys, AdvanceProblemKeys} from '../../../../../data/constants/problem';

// TODO: problemtype
const ProblemTypeSelect = ({
  // redux
  setSelected,
}) => {
  const handleChange = e => setSelected(e.target.value);
  const handleClick = () => setSelected('advanced');
  return (
    <Form.Group>
      <Form.RadioSet
        name="problemtype"
        onChange={handleChange}
      >
        <Form.Radio value={ProblemTypes.SINGLESELECT}>{ProblemTypes[ProblemTypeKeys.SINGLESELECT].title}</Form.Radio>
        <Form.Radio value={ProblemTypes.MULTISELECT}>{ProblemTypes[ProblemTypeKeys.MULTISELECT].title}</Form.Radio>
        <Form.Radio value={ProblemTypes.DROPDOWN}>{ProblemTypes[ProblemTypeKeys.DROPDOWN].title}</Form.Radio>
        <Form.Radio value={ProblemTypes.NUMERIC}>{ProblemTypes[ProblemTypeKeys.NUMERIC].title}</Form.Radio>
      </Form.RadioSet>
      <Button variant="link" onClick={handleClick}>Add Advanced Problem</Button>
    </Form.Group>
  );
};
ProblemTypeSelect.propTypes = {
  setSelected: PropTypes.func.isRequired,
};

export default ProblemTypeSelect;
