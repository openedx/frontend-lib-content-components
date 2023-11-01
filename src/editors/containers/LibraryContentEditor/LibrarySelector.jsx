import React from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Dropdown, DropdownButton } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { actions, selectors } from './data';

export const LibrarySelector = ({
  // redux
  libraries,
  selectedLibrary,
  onSelectLibrary,
}) => {
  const title = () => {
    if (selectedLibrary === null) return 'Select a library';
    return libraries[selectedLibrary]?.display_name;
  };

  return (
    <div className='mb-3'>
      {libraries
      ? (
        <Dropdown className='w-100'>
          <Dropdown.Toggle
            className='w-100'
            id='library-selector'
            title={title()}
            variant='outline-primary'
          >
            {title()}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => onSelectLibrary({ selectedLibrary: null })}>
              Select a library
            </Dropdown.Item>
            {libraries.map((library, index) => (
              <Dropdown.Item onClick={() => onSelectLibrary({ selectedLibrary: index })}>
                {library.display_name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )
      : (
        <span>There is no library!</span>
      )}
    </div>
  );
};

export const mapStateToProps = (state) => ({
  libraries: selectors.libraries(state),
  selectedLibrary: selectors.selectedLibrary(state),
});

export const mapDispatchToProps = {
  onSelectLibrary: actions.onSelectLibrary,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySelector));


