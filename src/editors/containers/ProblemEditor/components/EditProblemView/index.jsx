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

export const EditProblemView = ({editorValue}) => {
  const problemType = useSelector(selectors.problem.problemType);
  const blockValue = useSelector(selectors.app.blockValue)
  const markdown = blockValue.data.metadata.markdown ? blockValue.data.metadata.markdown : "No Markdown";
  const olx = blockValue.data.data ? blockValue.data.data : "No OLX";
  return (
      <EditorContainer getContent={() => ({})}>
        <div>
          <h1>
            Edit Problem View:
          </h1>
          <pre>
          <h3>OLX</h3>
          <br/>
          { olx }
          </pre>
          <pre>
          <h3>Markdown</h3>
          <br/>
          { markdown }
          </pre>
        </div>
        <AnswerWidget problemType={problemType} />
        <SettingsWidget />
        <QuestionWidget />
      </EditorContainer>
  );
};

export default EditProblemView;
