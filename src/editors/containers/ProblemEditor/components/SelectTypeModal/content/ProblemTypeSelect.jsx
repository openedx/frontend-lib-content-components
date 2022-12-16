import React from 'react';
import PropTypes from 'prop-types';
import { SelectableBox } from '@edx/paragon';
import { ProblemTypes, ProblemTypeKeys} from '../../../../../data/constants/problem';

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
      <SelectableBox value={ProblemTypeKeys.SINGLESELECT} {...settings}>
        {ProblemTypes[ProblemTypeKeys.SINGLESELECT].title}
      </SelectableBox>
      <SelectableBox value={ProblemTypeKeys.MULTISELECT} {...settings}>
        {ProblemTypes[ProblemTypeKeys.MULTISELECT].title}
      </SelectableBox>
      <SelectableBox value={ProblemTypeKeys.DROPDOWN} {...settings}>
        {ProblemTypes[ProblemTypeKeys.DROPDOWN].title}
      </SelectableBox>
      <SelectableBox value={ProblemTypeKeys.NUMERIC} {...settings}>
        {ProblemTypes[ProblemTypeKeys.NUMERIC].title}
      </SelectableBox>
      <SelectableBox value={ProblemTypeKeys.TEXTINPUT} {...settings}>
        {ProblemTypes[ProblemTypeKeys.TEXTINPUT].title}
      </SelectableBox>
    </SelectableBox.Set>
  );
};
ProblemTypeSelect.propTypes = {
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};

export default ProblemTypeSelect;
