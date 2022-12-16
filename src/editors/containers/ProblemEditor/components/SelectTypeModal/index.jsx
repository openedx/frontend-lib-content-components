import React from 'react';
import PropTypes from 'prop-types';

import ProblemTypeSelect from './content/ProblemTypeSelect';
import Preview from './content/Preview';
import SelectTypeWrapper from './SelectTypeWrapper';
import hooks from './hooks';

export const SelectTypeModal = ({
  onClose,
}) => {
  const { selected, setSelected } = hooks.state.selected(null);

  return (
    <SelectTypeWrapper selected={selected} onClose={onClose}>
      <div className="row">
        <ProblemTypeSelect setSelected={setSelected} />
        <Preview
          problemType={selected}
        />
      </div>
    </SelectTypeWrapper>
  );
};

SelectTypeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SelectTypeModal;
