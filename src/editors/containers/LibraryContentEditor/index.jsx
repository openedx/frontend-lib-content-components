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

export const LibraryContentEditor = ({
  onClose,
  returnFunction,
  // redux app layer
  blockValue,
  blockFailed,
  blockFinished,
  libraryPayload,
  selectedLibraryId,
  settings,
  studioEndpointUrl,
  // inject
  intl,
}) => {
  console.log("WE GOT THIS FAR");
  const {
    initializeEditor,
    getContent,
  } = useLibraryHook({
    libraryPayload,
  });
  console.log("WE GOT THIS Hook FAR");

  if (blockFinished && !blockFailed) {
    initializeEditor(blockValue);
  }

  const loading = () => (
    <div className="text-center p-6">
      <Spinner
        data-testid="librarycontenteditor-loadingspinner"
        animation="border"
        className="m-3"
        screenreadertext={intl.formatMessage(messages.spinnerScreenReader)}
      />
    </div>
  );

  const loaded = () => (
    <div>
      <LibrarySelector />
      <LibrarySettings />
      <BlocksSelector
        candidates={settings[selectedLibraryId]?.candidates}
        mode={settings[selectedLibraryId]?.mode}
        studioEndpointUrl={studioEndpointUrl}
      />
    </div>
  );

  return (
    <EditorContainer
      getContent={getContent}
      onClose={onClose}
      returnFunction={returnFunction}
    >
      <div className="library-content-editor h-100">
        {!blockFinished
          ? loading()
          : loaded()}
      </div>
    </EditorContainer>
  );
};

LibraryContentEditor.defaultProps = {
  blockValue: null,
  libraryPayload: {},
  selectedLibraryId: null,
  settings: {},
  studioEndpointUrl: '',
};

LibraryContentEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  // redux
  blockValue: PropTypes.shape({
    data: PropTypes.shape({ data: PropTypes.string }),
  }),
  blockFailed: PropTypes.bool.isRequired,
  blockFinished: PropTypes.bool.isRequired,
  libraryPayload: PropTypes.shape({}),
  selectedLibraryId: PropTypes.string,
  settings: PropTypes.shape({}),
  studioEndpointUrl: PropTypes.string,
  // inject
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  libraryPayload: selectors.library.libraryPayload(state),
  selectedLibraryId: selectors.library.selectedLibraryId(state),
  settings: selectors.library.settings(state),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
});

export const mapDispatchToProps = {
  initialize: actions.library.initialize,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibraryContentEditor));
