import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage, intlShape } from '@edx/frontend-platform/i18n';
import * as hooks from '../../../hooks';
import { selectors, actions } from '../../../../../data/redux';
import { messages } from './messages';
import './index.scss';

import TinyMceWidget from '../../../../../sharedComponents/TinyMceWidget';

// This widget should be connected, grab all questions from store, update them as needed.
export const QuestionWidget = ({
  question,
  updateQuestion,
  assets,
  lmsEndpointUrl,
  studioEndpointUrl,
  // injected
  intl,
}) => {
  const { editorRef, refReady, setEditorRef } = hooks.prepareEditorRef();
  if (!refReady) { return null; }
  return (
    <div className="question-widget">
      <div className="h4 mb-3">
        <FormattedMessage {...messages.questionWidgetTitle} />
      </div>
      <TinyMceWidget
        editorType="problem"
        editorRef={editorRef}
        textValue={question}
        updateQuestion={updateQuestion}
        setEditorRef={setEditorRef}
        minHeight={150}
        placeholder={intl.formatMessage(messages.placeholder)}
        assets={assets}
        lmsEndpointUrl={lmsEndpointUrl}
        studioEndpointUrl={studioEndpointUrl}
      />
    </div>
  );
};

QuestionWidget.propTypes = {
  lmsEndpointUrl: PropTypes.string.isRequired,
  studioEndpointUrl: PropTypes.string.isRequired,
  assets: PropTypes.shape({}).isRequired,
  question: PropTypes.string.isRequired,
  updateQuestion: PropTypes.func.isRequired,
  // injected
  intl: intlShape.isRequired,
};
export const mapStateToProps = (state) => ({
  question: selectors.problem.question(state),
  lmsEndpointUrl: selectors.app.lmsEndpointUrl(state),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
});

export const mapDispatchToProps = {
  updateQuestion: actions.problem.updateQuestion,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(QuestionWidget));
