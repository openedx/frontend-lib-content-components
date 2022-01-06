import React, {useContext, useEffect} from "react";
import { Spinner, ActionRow, Button, Toast, ModalDialog } from "@edx/paragon";
import {EditorPageContext} from "./EditorPageProvider";

export default function EditorFooter() {
  const {editorRef,blockloading,unitUrlLoading,setBlockContent,saveUnderway } = useContext(EditorPageContext);

  function cleanUpintoJSON(content){
    console.log("cleaning into json", content);
    return "COntent BBBBB";
  }

  const onSaveClicked =()=>{
    if(!blockloading && !unitUrlLoading && editorRef.current){
      const json = cleanUpintoJSON(editorRef.current.getContent());
      setBlockContent(json);
      setSaveUnderway("loading");
    }
  }
  const onCancelClicked = ()=>{
    if(!unitUrlLoading){
      const destination = unitUrl;
      //TODO: navigate to unit window
    }
    return;
  }
  useEffect(() => {
    if(!blockloading && !unitUrlLoading && editorRef.current && saveUnderway=="complete"){
      const destination = unitUrl
      //navigate to unit window
    }
  });
  return (
    <div className="editor-footer">
      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />
          <Button variant="tertiary" onClick={onCancelClicked()}>Cancel</Button>
          <Button onClick={onSaveClicked()}>
            {unitUrlLoading === true ?
              <Spinner animation="border" className="mr-3" screenReaderText="loading" />
              : "Add To Course"
            }
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </div>
  );
}