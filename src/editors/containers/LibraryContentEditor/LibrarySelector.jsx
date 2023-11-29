import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { selectors } from './data';
import { useLibrarySelectorHook } from './hooks';
import { getLibraryName } from './utils';

export const LibrarySelector = ({
  // redux
  libraries,
  selectedLibraryId,
  settings,
}) => {
  const {
    selectionName,
    setSelectedLibraryIndex,
  } = useLibrarySelectorHook({
    libraries,
    selectedLibraryId,
    settings,
  });

  return (
    <div className='mb-3'>
      {libraries
      ? (
        <Dropdown className='w-100'>
          <Dropdown.Toggle
            className='w-100'
            id='library-selector'
            variant='outline-primary'
          >
            {selectionName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item key={-1} onClick={() => setSelectedLibraryIndex(null)}>
              <FormattedMessage {...messages.librarySelectorDropdownDefault} />
            </Dropdown.Item>
            {libraries.map((library, index) => (
              <Dropdown.Item key={index} onClick={() => setSelectedLibraryIndex(index)}>
                {getLibraryName(library)}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )
      : (
        <span>
          <FormattedMessage {...messages.noLibraryMessage} />
        </span>
      )}
    </div>
  );
};

LibrarySelector.defaultProps = {
  libraries: [],
  settings: {},
};

LibrarySelector.propTypes = {
  // redux
  libraries: PropTypes.array,
  settings: PropTypes.object,
};

export const mapStateToProps = (state) => ({
  libraries: selectors.libraries(state),
  selectedLibraryId: selectors.selectedLibraryId(state),
  settings: selectors.settings(state),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySelector));


