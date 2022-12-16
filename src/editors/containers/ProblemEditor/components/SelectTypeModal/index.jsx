import React from 'react';
import PropTypes from 'prop-types';

import ProblemTypeSelect from './content/ProblemTypeSelect';
import Preview from './content/Preview';
import AdvanceTypeSelect from './content/AdvanceTypeSelect';
import SelectTypeWrapper from './SelectTypeWrapper';
import hooks from './hooks';

export const SelectTypeModal = ({
  onClose,
}) => {
  const [selected, setSelected ] = hooks.state.selected(null);
console.log(selected !== 'blankadvanced');
  return (
    <SelectTypeWrapper selected={selected} onClose={onClose}>
      <div className="row">
        {(selected !== 'blankadvanced') ? (
          <>
            <ProblemTypeSelect setSelected={setSelected} />
            <Preview
              problemType={selected}
            />
          </>
        ) : <AdvanceTypeSelect setSelected={setSelected} />}
      </div>
    </SelectTypeWrapper>
  );
};

SelectTypeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SelectTypeModal;
