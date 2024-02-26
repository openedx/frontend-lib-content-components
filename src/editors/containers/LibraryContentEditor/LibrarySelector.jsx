import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from '@edx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

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
  const intl = useIntl();
  const {
    onLibrarySelect,
  } = useLibrarySelectorHook({
    selectedLibraryId,
    settings,
  });

  if (libraries.length === 0) {
    return (
      <div className="mb-3">
        <span>
          <FormattedMessage {...messages.noLibraryMessage} />
        </span>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <Dropdown className="w-100">
        <Dropdown.Toggle
          className="w-100"
          id="library-selector"
          variant="outline-primary"
        >
          {selectedLibraryId
            ? getLibraryName(libraries[selectedLibraryId])
            : intl.formatMessage(messages.librarySelectorDropdownDefault)}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item key={-1} onClick={() => onLibrarySelect(null)}>
            <FormattedMessage {...messages.librarySelectorDropdownDefault} />
          </Dropdown.Item>
          {
            Object.entries(libraries)
              .sort((a, b) => {
                const aName = a[1].title || a[1].display_name;
                const bName = b[1].title || b[1].display_name;
                return aName < bName ? -1 : 1;
              })
              .map(([id, library]) => (
                <Dropdown.Item key={id} onClick={() => onLibrarySelect(id)}>
                  {getLibraryName(library)}
                </Dropdown.Item>
              ))
          }
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
  libraries: PropTypes.shape([]),
  selectedLibraryId: PropTypes.string,
  settings: PropTypes.shape({}),
};

export const mapStateToProps = (state) => ({
  libraries: selectors.libraries(state),
  selectedLibraryId: selectors.selectedLibraryId(state),
  settings: selectors.settings(state),
});

export const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LibrarySelector);
