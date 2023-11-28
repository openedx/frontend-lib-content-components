import React, { useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner } from '@edx/paragon';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { useLibraryHook } from './hooks';
import { selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';
import { getCandidates, getSelectedRows } from './utils';

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
  blocksInSelectedLibrary,
  candidates,
  libraryPayload,
  // inject
  intl,
}) => {
  const {
    getContent,
  } = useLibraryHook({
    blockFailed,
    blockFinished,
    blockValue,
    libraryPayload,
  });

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

  const initialRows = useMemo(() => getSelectedRows({
    blocks: blocksInSelectedLibrary,
    candidates,
  }), [blocksInSelectedLibrary]);

  const loaded = () => (
    <div>
      <LibrarySelector />
      <LibrarySettings />
      <BlocksSelector
        initialRows={initialRows}
        // candidates={settings[selectedLibraryId]?.candidates}
        // mode={settings[selectedLibraryId]?.mode}
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
  studioEndpointUrl: PropTypes.string,
  // inject
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  blocksInSelectedLibrary: selectors.library.blocksInSelectedLibrary(state),
  candidates: selectors.library.candidates(state),
  libraryPayload: selectors.library.libraryPayload(state),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibraryContentEditor));
