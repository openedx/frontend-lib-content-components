import React from 'react';

import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import { EditorContainer } from '../../../EditorContainer';

export default function EditProblemView() {
  return (
    <div>
      <EditorContainer>
        <div>
          <h1>
            Edit Problem View
          </h1>
        </div>
        <AnswerWidget />
        <SettingsWidget />
        <QuestionWidget />
      </EditorContainer>
    </div>
  );
}
