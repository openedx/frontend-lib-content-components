import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { useLibraryHook } from './hooks';
import { actions, selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';
import EditorContainer from '../EditorContainer';
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
  librarySettings,
  selectedLibraryId,
  settings,
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
    librarySettings,
    studioEndpointUrl,
  });

  const loading = () => {
    return (
      <div className="text-center p-6">
        <Spinner
          animation="border"
          className="m-3"
          screenreadertext={intl.formatMessage(messages.spinnerScreenReader)}
        />
      </div>
    );
  };

  const loaded = () => {
    return (
      <div>
        <LibrarySelector studioEndpointUrl={studioEndpointUrl} />
        <LibrarySettings />
        <BlocksSelector
          candidates={settings[selectedLibraryId]?.candidates}
          mode={settings[selectedLibraryId]?.mode}
          studioEndpointUrl={studioEndpointUrl}
        />
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
      <div className="library-content-editor h-100">
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
  librarySettings: selectors.library.librarySettings(state),
  selectedLibraryId: selectors.library.selectedLibraryId(state),
  settings: selectors.library.settings(state),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
});

export const mapDispatchToProps = {
  initialize: actions.library.initialize,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(thumbEditor));
