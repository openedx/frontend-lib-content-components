import React from 'react';

import { injectIntl } from '@edx/frontend-platform/i18n';
import { connect } from 'react-redux';
import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import { EditorContainer } from '../../../EditorContainer';
import { selectors } from '../../../../data/redux';
import { ReactStateParser } from '../../data/ReactStateParser';
import { ReactStateOLXParser } from '../../data/ReactStateOLXParser';

export const EditProblemView = ({
  problemType,
  problemState,
}) => {
  const parseSate = (problemState) => () => {
    const reactParser = new ReactStateParser(problemState);
    const reactOLXParser = new ReactStateOLXParser({ problem: problemState });
    return {
      markdown: reactParser.getMarkdown(),
      olx: reactOLXParser.buildOLX(),
    };
  };
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
});

export default injectIntl(connect(mapStateToProps)(EditProblemView));
