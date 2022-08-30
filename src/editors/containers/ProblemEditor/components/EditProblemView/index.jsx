import React from 'react';

import AnswerWidget from './AnswerWidget';
import SettingsWidget from './SettingsWidget';
import QuestionWidget from './QuestionWidget';
import { EditorContainer } from '../../../EditorContainer';
import { selectors } from '../../../../data/redux';
import { useSelector } from 'react-redux';
import { Editor } from '@tinymce/tinymce-react';
import { ToggleButton, ToggleButtonGroup } from '@edx/paragon';

export const EditProblemView = () => {
  const problemType = useSelector(selectors.problem.problemType);
  const question = useSelector(selectors.problem.question);
  return (
      <EditorContainer getContent={() => ({})}>
        <Editor initialValue={question}/>
        <AnswerWidget problemType={problemType} />
        <SettingsWidget />
        <QuestionWidget />
      </EditorContainer>
  );
};

export default EditProblemView;
