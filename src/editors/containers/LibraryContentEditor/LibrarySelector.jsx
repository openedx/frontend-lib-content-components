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
  // injected
  intl,
}) => {
  const {
    onLibrarySelect,
  } = useLibrarySelectorHook({
    libraries,
    settings,
  });

  if (Object.keys(libraries).length === 0) {
    return (
      <div className='mb-3'>
        <span>
          <FormattedMessage {...messages.noLibraryMessage} />
        </span>
      </div>
    );
  }

  return (
    <div className='mb-3'>
      <Dropdown className='w-100'>
        <Dropdown.Toggle
          className='w-100'
          id='library-selector'
          variant='outline-primary'
        >
          {selectedLibraryId 
            ? getLibraryName(libraries[selectedLibraryId])
            : intl.formatMessage(messages.librarySelectorDropdownDefault)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item key={-1} onClick={() => onLibrarySelect(null)}>
            <FormattedMessage {...messages.librarySelectorDropdownDefault} />
          </Dropdown.Item>
          {Object.entries(libraries).map(([id, library], index) => (
            <Dropdown.Item key={index} onClick={() => onLibrarySelect(id)}>
              {getLibraryName(library)}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

LibrarySelector.defaultProps = {
  libraries: [],
  selectedLibraryId: null,
  settings: {},
};

LibrarySelector.propTypes = {
  // redux
  libraries: PropTypes.array,
  selectedLibraryId: PropTypes.string,
  settings: PropTypes.object,
  // injected
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  libraries: selectors.libraries(state),
  selectedLibraryId: selectors.selectedLibraryId(state),
  settings: selectors.settings(state),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySelector));


