import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { actions, selectors } from './data';
import { useLibrarySelectorHook } from './hooks';

export const LibrarySelector = ({
  studioEndpointUrl,
  // redux
  libraries,
  loadLibrary,
  selectedLibraryId,
  settings,
  unloadLibrary,
}) => {
  const {
    initializeLibrary,
    onSelectedLibraryChange,
    setSelectedLibrary,
    title,
  } = useLibrarySelectorHook({
    libraries,
    loadLibrary,
    selectedLibraryId,
    settings,
    studioEndpointUrl,
    unloadLibrary,
  });

  if (!!selectedLibraryId) {
    initializeLibrary(selectedLibraryId);
  }

  onSelectedLibraryChange(selectedLibraryId);

  return (
    <div className='mb-3'>
      {libraries
      ? (
        <Dropdown className='w-100'>
          <Dropdown.Toggle
            className='w-100'
            id='library-selector'
            title={title}
            variant='outline-primary'
          >
            {title}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSelectedLibrary(null)}>
              <FormattedMessage {...messages.librarySelectorDropdownDefault} />
            </Dropdown.Item>
            {libraries.map((library, index) => (
              <Dropdown.Item onClick={() => setSelectedLibrary(index)}>
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
  studioEndpointUrl: PropTypes.string.isRequired,
  // redux
  libraries: PropTypes.array,
  loadLibrary: PropTypes.func.isRequired,
  settings: PropTypes.object,
  unloadLibrary: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  libraries: selectors.libraries(state),
  selectedLibraryId: selectors.selectedLibraryId(state),
  settings: selectors.settings(state),
});

export const mapDispatchToProps = {
  loadLibrary: actions.loadLibrary,
  unloadLibrary: actions.unloadLibrary,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySelector));


