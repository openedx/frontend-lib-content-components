import React, { useContext, useEffect } from 'react';
import {
  Spinner, ActionRow, Button, ModalDialog, Toast,
} from '@edx/paragon';
import EditorPageContext from './EditorPageContext';
import { ActionStates } from './data/constants';

export default function EditorFooter() {
  const {
    blockLoading,
    setBlockContent,
    unitUrlLoading,
    unitUrl,
    setSaveUnderway,
    saveUnderway,
    saveResponse,
    studioEndpointUrl,
    editorRef,
  } = useContext(EditorPageContext);
  const onSaveClicked = () => {
    if (blockLoading === ActionStates.FINISHED && unitUrlLoading === ActionStates.FINISHED && editorRef) {
      const content = editorRef.current.getContent();
      setBlockContent(content);
      setSaveUnderway(ActionStates.IN_PROGRESS);
    }
  };
  const onCancelClicked = () => {
    if (unitUrlLoading === ActionStates.FINISHED) {
      const destination = `${studioEndpointUrl}/container/${unitUrl.data.ancestors[0].id}`;
      window.location.href = destination;
    } else {
      // TODO: add an else here
    }
  };
  useEffect(() => {
    if (saveUnderway === ActionStates.FINISHED
      && blockLoading === ActionStates.FINISHED
      && unitUrlLoading === ActionStates.FINISHED) {
      const destination = `${studioEndpointUrl}/container/${unitUrl.data.ancestors[0].id}`;
      window.location.href = destination;
    }
  }, [saveUnderway]);
  return (
    <div className="editor-footer">
      { saveUnderway === 'complete' && saveResponse.error != null
      && <Toast>TODO: MAKE ERROR MESSAGE</Toast>}
      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />
          <Button variant="tertiary" onClick={onCancelClicked}>Cancel</Button>
          <Button onClick={onSaveClicked}>
            {blockLoading === true
              ? <Spinner animation="border" className="mr-3" screenReaderText="loading" />
              : 'Add To Course'}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </div>
  );
}
