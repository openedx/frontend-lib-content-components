import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { SearchField } from '@openedx/paragon';
import FilteredBlock from '../FilteredBlock';
import { filterBlocksByText } from './utils';

import messages from './messages';
import './index.scss';

export const SearchBlocks = ({
  blocks,
  onSearchFilter,
  searchInputValue = '',
  onBlockSelected,
  disabledBlocks,
}) => {
  const intl = useIntl();
  const [searchField, setSearchField] = useState(searchInputValue);
  const [blocksFilteredItems, setBlocksFilteredItems] = useState(null);

  const blocksFilteredItemsFormat = blocksFilteredItems
    ? Object.keys(blocksFilteredItems)
    : [];

  const handleSearchBlock = (value) => {
    setSearchField(value);
  };

  const handleSelectedBlock = (block) => {
    onBlockSelected(block);
  };

  useEffect(() => {
    if (searchField.trim()) {
      const blockFilter = filterBlocksByText(searchField, blocks);
      setBlocksFilteredItems(blockFilter);
      onSearchFilter(true);
    } else {
      setBlocksFilteredItems(null);
      onSearchFilter(false);
    }
  }, [searchField]);

  return (
    <div>
      <SearchField
        placeholder="Search course pages"
        className="my-4"
        onChange={handleSearchBlock}
        value={searchField}
        data-testid="search-field"
        onSubmit={() => null}
      />

      {searchField.trim() && (
        <p className="h5 ml-1 text-gray-500" data-testid="filtered-block-text">
          {intl.formatMessage(messages.searchBlocksResultMessages, {
            searchField: `"${searchField}"`,
          })}
        </p>
      )}

      {blocksFilteredItemsFormat.length > 0 && (
        <div className="blocks-filter-container">
          {blocksFilteredItemsFormat.map((key) => (
            <FilteredBlock
              key={key}
              block={blocks[key]}
              onBlockFilterClick={handleSelectedBlock}
              blockDisabled={disabledBlocks}
            />
          ))}
        </div>
      )}
    </div>
  );
};

SearchBlocks.defaultProps = {
  searchInputValue: '',
  disabledBlocks: false,
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

SearchBlocks.propTypes = {
  blocks: PropTypes.objectOf(blockShape).isRequired,
  onSearchFilter: PropTypes.func.isRequired,
  searchInputValue: PropTypes.string,
  onBlockSelected: PropTypes.func.isRequired,
  disabledBlocks: PropTypes.bool,
};

export default SearchBlocks;
