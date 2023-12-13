import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';
import * as hooks from './hooks';

import supportedEditors from './supportedEditors';

export const Editor = ({
  learningContextId,
  blockType,
  blockId,
  lmsEndpointUrl,
  studioEndpointUrl,
  onClose,
  returnFunction,
}) => {
  const dispatch = useDispatch();
  hooks.initializeApp({
    dispatch,
    data: {
      blockId,
      blockType,
      learningContextId,
      lmsEndpointUrl,
      studioEndpointUrl,
    },
  });

  const EditorComponent = supportedEditors[blockType];
  return (
    <div
      className="d-flex flex-column"
      style={{
        /* Positioned as a proper Paragon FullscreenModal should have been. */
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
      }}
    >
      <div
        className="pgn__modal-fullscreen h-100"
        role="dialog"
        aria-label={blockType}
      >
        {(EditorComponent !== undefined)
          ? <EditorComponent {...{ onClose, returnFunction }} />
          : <FormattedMessage {...messages.couldNotFindEditor} />}
      </div>
    </div>
  );
};
Editor.defaultProps = {
  blockId: null,
  learningContextId: null,
  lmsEndpointUrl: null,
  onClose: null,
  returnFunction: null,
  studioEndpointUrl: null,
};

Editor.propTypes = {
  blockId: PropTypes.string,
  blockType: PropTypes.string.isRequired,
  learningContextId: PropTypes.string,
  lmsEndpointUrl: PropTypes.string,
  onClose: PropTypes.func,
  returnFunction: PropTypes.func,
  studioEndpointUrl: PropTypes.string,
};

export default Editor;
