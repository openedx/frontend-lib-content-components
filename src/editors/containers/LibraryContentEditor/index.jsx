import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Spinner } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import EditorContainer from '../EditorContainer';
import { useLibraryHook } from './hooks';
import { actions, selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';
import LibrarySelector from './LibrarySelector';
import LibrarySettings from './LibrarySettings';
import BlocksSelector from './BlocksSelector';

export const thumbEditor = ({
  onClose,
  // redux app layer
  blockValue,
  blockFailed,
  blockFinished,
  initialize,
  studioEndpointUrl,
  // inject
  intl,
}) => {
  const {
    getContent,
  } = useLibraryHook({
    blockFailed,
    blockFinished,
    blockValue,
    initialize,
    studioEndpointUrl,
  });

  const loading = () => {
    return (
      <div className="text-center p-6">
        <Spinner
          animation="border"
          className="m-3"
          // Use a messages.js file for intl messages.
          // screenreadertext={intl.formatMessage('Loading Spinner')}
        />
      </div>
    );
  };

  const loaded = () => {
    return (
      <div>
        <LibrarySelector />
        <LibrarySettings />
        <BlocksSelector studioEndpointUrl={studioEndpointUrl} />
      </div>
    );
  };

  return (
    <EditorContainer
      getContent={getContent}
      onClose={onClose}
      returnFunction
      validateEntry
    >
      <div className="library-content-editor">
        {!blockFinished
          ? loading()
          : loaded()
        }
      </div>
    </EditorContainer>
  );
};

thumbEditor.defaultProps = {
  blockValue: null,
};

thumbEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  // redux
  blockValue: PropTypes.shape({
    data: PropTypes.shape({ data: PropTypes.string }),
  }),
  blockFailed: PropTypes.bool.isRequired,
  blockFinished: PropTypes.bool.isRequired,
  initializeEditor: PropTypes.func.isRequired,
  // inject
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
});

export const mapDispatchToProps = {
  initialize: actions.library.initialize,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(thumbEditor));
