import React from 'react';

import ProblemTypeSelect from './content/ProblemTypeSelect';
import Preview from './content/Preview';
import SelectTypeWrapper from './SelectTypeWrapper';
import * as hooks from './hooks';

export const SelectTypeModal = () => {
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

export default SelectTypeModal;
