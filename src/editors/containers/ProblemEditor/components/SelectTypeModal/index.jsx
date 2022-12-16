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
console.log(selected);
  return (
    <SelectTypeWrapper selected={selected} onClose={onClose}>
      {/*{selected !== 'advanced' ? (
        <div className="row">
          <ProblemTypeSelect setSelected={setSelected} />
          <Preview
            problemType={selected}
          />
        </div>
      ) : (
        <AdvanceTypeSelect selected = {selected} setSelected={setSelected} />
      )}*/}
              <AdvanceTypeSelect setSelected={setSelected} />

    </SelectTypeWrapper>
  );
};

SelectTypeModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SelectTypeModal;
