import React from 'react';
import PropTypes from 'prop-types';
import EditorFooter from '../../../EditorContainer/components/EditorFooter';

const SelectTypeModal = ({
  // Redux
  problemType,
}) => {

  const [selected, setSelected] = React.useState(problemType);

  return
  (
    <div>
      <ProblemTypeSelect />
      <Preview
        problemType={problemType}
      />
      <SelectTypeFooter />
    </div>
  );
};

(

  <div>
    <ProblemTypeSelect />
    <Preview
      problemType={problemType}
    />
    <SelectTypeFooter />
  </div>
);

SelectTypeModal.defaultProps = {
  problemType: null,
};
SelectTypeModal.propTypes = {
  problemType: PropTypes.string,
};

export default SelectTypeModal;
