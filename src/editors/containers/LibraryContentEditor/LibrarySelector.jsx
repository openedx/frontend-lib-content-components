import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { actions, selectors } from './data';
import { useLibrarySelectorHook } from './hooks';

export const LibrarySelector = ({
  // redux
  libraries,
  selectedLibraryId,
  settings,
}) => {
  const {
    initializeLibrary,
    onSelectedLibraryChange,
    selectionName,
    setSelectedLibrary,
  } = useLibrarySelectorHook({
    libraries,
    selectedLibraryId,
    settings,
  });

  initializeLibrary(selectedLibraryId);
  onSelectedLibraryChange(selectedLibraryId);

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
            <Dropdown.Item key={-1} onClick={() => setSelectedLibrary(null)}>
              <FormattedMessage {...messages.librarySelectorDropdownDefault} />
            </Dropdown.Item>
            {libraries.map((library, index) => (
              <Dropdown.Item key={index} onClick={() => setSelectedLibrary(index)}>
                {library.display_name}
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

export const mapDispatchToProps = { };

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySelector));


