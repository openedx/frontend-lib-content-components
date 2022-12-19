import React from 'react';
import PropTypes from 'prop-types';
import { Button, SelectableBox, Form } from '@edx/paragon';
import { ProblemTypes, ProblemTypeKeys, AdvanceProblemKeys } from '../../../../../data/constants/problem';

export const ProblemTypeSelect = ({
  selected,
  setSelected,
}) => {
  const handleChange = e => setSelected(e.target.value);
  const handleClick = () => setSelected('blankadvanced');
  const settings = {'aria-label': 'checkbox', type: 'radio'};

  return (
    <SelectableBox.Set
      columns={1}
      onChange={handleChange}
      type={settings.type}
      value={selected}
    >
      {Object.values(ProblemTypeKeys).map((key) => (
        key !== 'advanced'
          ?  <SelectableBox id={key} value={key} {...settings}>
            {ProblemTypes[key].title}
          </SelectableBox>
          : null
      ))}
    </SelectableBox.Set>
  );
};
ProblemTypeSelect.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default ProblemTypeSelect;
