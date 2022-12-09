import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@edx/paragon';
import { ProblemTypes, ProblemTypeKeys} from '../../../../../data/constants/problem';

// TODO: problemtype
const ProblemTypeSelect = ({
  // redux
  setSelected,
}) => {
  const handleChange = e => setSelected(e.target.value);
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
        <Form.Radio value={ProblemTypes.TEXTINPUT}>{ProblemTypes[ProblemTypeKeys.TEXTINPUT].title}</Form.Radio>
      </Form.RadioSet>
    </Form.Group>
  );
};
ProblemTypeSelect.propTypes = {
  setSelected: PropTypes.func.isRequired,
};

export default ProblemTypeSelect;
