import React from 'react';

import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import { EditorContainer } from '../../../EditorContainer';
import { selectors } from '../../../../data/redux';
import { ReactStateParser } from '../../data/ReactStateParser';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';


export const EditProblemView = ({
  problemType,
  problemState
}) => {
  const parseSate = (problemState) => () => {
      let reactParser = new ReactStateParser(problemState);
      return reactParser.getMarkdown();
  }
  return (
      <EditorContainer getContent={parseSate(problemState)}>
        <QuestionWidget />
        <AnswerWidget problemType={problemType} />
        <SettingsWidget />
      </EditorContainer>
  );
};

export const mapStateToProps = (state) => ({
  problemType: selectors.problem.problemType(state),
  problemState: selectors.problem.completeState(state),
})

export default injectIntl(connect(mapStateToProps)(EditProblemView));
