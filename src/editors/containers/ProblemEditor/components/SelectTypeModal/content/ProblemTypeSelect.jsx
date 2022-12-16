import React from 'react';
import PropTypes from 'prop-types';
import { SelectableBox } from '@edx/paragon';
import { ProblemTypes, ProblemTypeOrder, ProblemTypeKeys } from '../../../../../data/constants/problem';

export const ProblemTypeSelect = ({
  selected,
  setSelected,
}) => {
  const handleChange = e => setSelected(e.target.value);
  const settings = {'aria-label': 'checkbox', type: 'radio'};

  return (
    <SelectableBox.Set
      columns={1}
      onChange={handleChange}
      type={settings.type}
      value={selected}
    >
      {ProblemTypeOrder.map((key) => (
        <SelectableBox value={key} {...settings}>
          {ProblemTypes[key].title}
        </SelectableBox>
      ))}
    </SelectableBox.Set>
  );
};
ProblemTypeSelect.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default ProblemTypeSelect;
