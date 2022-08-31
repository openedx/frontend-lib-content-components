import React from 'react';

import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import { EditorContainer } from '../../../EditorContainer';
import { selectors } from '../../../../data/redux';
import { useSelector } from 'react-redux';

export const hooks = {
  captureMarkdownAndSettings: () => {
    const problemType = useSelector(selectors.problem.problemType);
    return {
      problemType
    }
  }
}

export default function EditProblemView() {
  const problemType = useSelector(selectors.problem.problemType)
  return (
    <div>
      <EditorContainer getContent={() => ({})}>
        <div>
          <h1>
            Edit Problem View
          </h1>
        </div>
        <AnswerWidget problemType={problemType} />
        <SettingsWidget />
        <QuestionWidget />
      </EditorContainer>
    </div>
  );
}
