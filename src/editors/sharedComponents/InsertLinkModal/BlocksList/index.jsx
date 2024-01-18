import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TransitionReplace, ActionRow } from '@edx/paragon';
import { ArrowForwardIos, ArrowBack } from '@edx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import {
  blockTypes,
  getSectionsList,
  getChildrenFromList,
} from '../utils';

import messages from './messages';
import './index.scss';

const BlocksList = ({ blocks, onBlockSelected }) => {
  const intl = useIntl();
  const messagesTest = {
    [blockTypes.section]: intl.formatMessage(
      messages.blocksListSubsectionTitle,
    ),
    [blockTypes.subsection]: intl.formatMessage(messages.blocksListUnitTitle),
    [blockTypes.unit]: intl.formatMessage(messages.blocksListUnitTitle),
  };

  const [blockState, setBlockState] = useState({
    blockSelected: {},
    type: blockTypes.subsection,
    hasNavigated: false,
    blocksNavigated: [],
  });

  const sections = getSectionsList(blocks);
  const subSections = getChildrenFromList(
    blockState.blockSelected,
    blocks,
  );
  const listItems = blockState.hasNavigated ? subSections : sections;

  const isBlockSelectedUnit = blockState.type === blockTypes.unit;
  const blockNameButtonClass = isBlockSelectedUnit ? 'col-12' : 'col-11';

  const handleSelectBlock = (block, navigate = false) => {
    if (navigate) {
      setBlockState({
        ...blockState,
        blocksNavigated: [...blockState.blocksNavigated, block.id],
        blockSelected: block,
        type: block.type,
        hasNavigated: true,
      });
    } else {
      onBlockSelected(block);
    }
  };

  const handleGoBack = () => {
    const newValue = blockState.blocksNavigated.filter(
      (id) => id !== blockState.blockSelected.id,
    );
    if (newValue.length) {
      const lastBlockIndex = newValue.length - 1;
      const blockId = newValue[lastBlockIndex];
      const newBlock = blocks[blockId];
      setBlockState({
        ...blockState,
        type: newBlock.type,
        hasNavigated: true,
        blockSelected: newBlock,
        blocksNavigated: newValue,
      });
    } else {
      setBlockState({
        ...blockState,
        type: blockState.section,
        hasNavigated: false,
        blockSelected: {},
      });
    }
  };

  return (
    <>
      {blockState.hasNavigated && (
        <ActionRow className="w-100 d-flex justify-content-space-between p-3">
          <Button
            variant="tertiary"
            className="col-1"
            onClick={handleGoBack}
            iconBefore={ArrowBack}
          >
          &nbsp;
          </Button>

          <p className="col-11 text-center">{messagesTest[blockState.type]}</p>
        </ActionRow>
      )}
      <div className="block-list-container">
        {listItems.map((block) => (
          <TransitionReplace key={`transition_${block.id}`}>
            <ActionRow
              key={block.id}
              className="w-100 d-flex justify-content-space-between p-3"
            >
              <Button
                variant="tertiary"
                className={`${blockNameButtonClass} py-4`}
                onClick={() => handleSelectBlock(block)}
              >
                <span className="w-100 text-left">{block.displayName}</span>
              </Button>
              {!isBlockSelectedUnit && (
              <Button
                variant="tertiary"
                className="col-1 py-4"
                onClick={() => handleSelectBlock(block, true)}
                iconAfter={ArrowForwardIos}
              >
                &nbsp;
              </Button>
              )}
            </ActionRow>
          </TransitionReplace>
        ))}
      </div>
    </>
  );
};

BlocksList.defaultProps = {
  onBlockSelected: () => {},
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

BlocksList.propTypes = {
  blocks: PropTypes.objectOf(blockShape).isRequired,
  onBlockSelected: PropTypes.func,
};

export default BlocksList;