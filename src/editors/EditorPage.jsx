import React from "react";
import PropTypes from 'prop-types';
import TextEditor from "./TextEditor/TextEditor";
import VideoEditor from "./VideoEditor/VideoEditor";
import ProblemEditor from "./ProblemEditor/ProblemEditor";
import EditorFooter from "./EditorFooter";
import EditorHeader from "./EditorHeader";
import { ModalDialog} from "@edx/paragon";
import EditorPageProvider from "./EditorPageProvider";

export default function EditorPage({
  courseId,
  blockType,
  blockId,
  studioEndpointUrl
}) {

  const selectEditor = (blockType) => {
    switch (blockType) {
      case "html":
        return <TextEditor/>;
      case "video":
        return <VideoEditor/>;
      case "problem":
        return <ProblemEditor/>;
      default:
        return <p>Error- Invalid Editor</p>;
    }
  };

  return(
    <EditorPageProvider courseId={courseId} blockId={blockId} studioEndpointUrl={studioEndpointUrl}>
    <ModalDialog
          title={blockType} //TODO: INTERNALTIONALIZE STRINGS and add "Text":
          isOpen={true}
          size ='fullscreen'
          onClose={() => {}}
          hasCloseButton={false}
          variant={'dark'}
    >
      <EditorHeader title={blockType}/>
      {selectEditor(blockType)}
      <EditorFooter/>
    </ModalDialog>
    </EditorPageProvider>
  );
}
EditorPage.propTypes = {
  courseId: PropTypes.string,
  blockType: PropTypes.string.isRequired,
  blockId: PropTypes.string,
  studioEndpointUrl: PropTypes.string
}
EditorPage.defaultProps = {
  courseId: null,
  blockId: null,
  studioEndpointUrl: null,
}
