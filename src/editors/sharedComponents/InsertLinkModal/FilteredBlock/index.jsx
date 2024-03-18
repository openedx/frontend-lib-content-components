import { Button } from '@openedx/paragon';
import PropTypes from 'prop-types';

import formatBlockPath from '../formatBlockPath';

const FilteredBlock = ({
  block,
  onBlockFilterClick,
  blockDisabled,
}) => {
  const { title, subTitle } = formatBlockPath(block.path);

  const handleBlockClick = () => {
    onBlockFilterClick(block);
  };

  return (
    <Button
      key={`filtered_block_${block.id}`}
      variant="tertiary"
      className="d-flex flex-column w-100 align-items-start p-3"
      onClick={handleBlockClick}
      data-testid="filtered-block-item"
      disabled={blockDisabled}
    >
      <span className="h5 text-left">{subTitle}</span>
      <span className="h3">{title}</span>
    </Button>
  );
};

const blockShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  blockId: PropTypes.string.isRequired,
  lmsWebUrl: PropTypes.string.isRequired,
  legacyWebUrl: PropTypes.string.isRequired,
  studentViewUrl: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.string),
});

FilteredBlock.defaultProps = {
  blockDisabled: false,
};

FilteredBlock.propTypes = {
  block: PropTypes.objectOf(blockShape).isRequired,
  onBlockFilterClick: PropTypes.func.isRequired,
  blockDisabled: PropTypes.bool,
};

export default FilteredBlock;
