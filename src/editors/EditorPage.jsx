import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import store from './data/store';
import Editor from './Editor';
import ErrorBoundary from './sharedComponents/ErrorBoundary';

export const EditorPage = ({
  courseId,
  blockType,
  blockId,
  lmsEndpointUrl,
  studioEndpointUrl,
  onClose,
  returnUrl,
}) => (
  <Provider store={store}>
    <ErrorBoundary
      {...{
        learningContextId: courseId,
        studioEndpointUrl,
      }}
    >
      <Editor
        {...{
          onClose,
          learningContextId: courseId,
          blockType,
          blockId,
          lmsEndpointUrl,
          studioEndpointUrl,
          returnUrl,
        }}
      />
    </ErrorBoundary>
  </Provider>
);
EditorPage.defaultProps = {
  blockId: null,
  courseId: null,
  lmsEndpointUrl: null,
  onClose: null,
  returnUrl: null,
  studioEndpointUrl: null,
};

EditorPage.propTypes = {
  blockId: PropTypes.string,
  blockType: PropTypes.string.isRequired,
  courseId: PropTypes.string,
  lmsEndpointUrl: PropTypes.string,
  onClose: PropTypes.func,
  returnUrl: PropTypes.string,
  studioEndpointUrl: PropTypes.string,
};

export default EditorPage;
