import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner } from '@edx/paragon';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { useLibraryHook } from './hooks';
import { selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';

import EditorContainer from '../EditorContainer';
import LibrarySelector from './LibrarySelector';
import LibrarySettings from './LibrarySettings';
import BlocksSelector from './BlocksSelector';

export const LibraryContentEditor = ({
  onClose,
  returnFunction,
  // redux app layer
  blockFailed,
  blockFinished,
  blockValue,
  libraryPayload,
}) => {
  const intl = useIntl();
  useLibraryHook({
    blockFailed,
    blockFinished,
    blockValue,
  });

  if (blockFailed) {
    return (
      <div className="text-center p-6" data-testid="librarycontenteditor-blockfailedmessage">
        <FormattedMessage {...messages.blockFailed} />
      </div>
    );
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
      <BlocksSelector />
    </div>
  );

  return (
    <EditorContainer
      getContent={() => libraryPayload}
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
};

LibraryContentEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  returnFunction: PropTypes.func.isRequired,
  // redux
  blockValue: PropTypes.shape({
    data: PropTypes.shape({ data: PropTypes.string }),
  }),
  blockFailed: PropTypes.bool.isRequired,
  blockFinished: PropTypes.bool.isRequired,
  libraryPayload: PropTypes.shape({}),
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  libraryPayload: selectors.library.libraryPayload(state),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
});

export const mapDispatchToProps = {};

const LibraryContentEditorConnector = connect(mapStateToProps, mapDispatchToProps)(LibraryContentEditor);
LibraryContentEditorConnector.displayName = 'LibraryContentEditorConnector';
export default LibraryContentEditorConnector;
// export default connect(mapStateToProps, mapDispatchToProps)(LibraryContentEditor);
