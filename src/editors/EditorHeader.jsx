import { ActionRow, IconButton,Icon, ModalDialog, Toast} from "@edx/paragon";
import PropTypes from 'prop-types';
import React, {useContext} from "react";
import {EditorPageContext} from "./EditorPageProvider";
import {Close} from "@edx/paragon/icons"

const EditorHeader = ({title}) => {
  const {unitUrl,unitUrlError,unitUrlLoading} = useContext(EditorPageContext);
  const onCancelClicked = ()=>{
    if(!unitUrlLoading){
      const destination = unitUrl;
      //TODO: navigate to unit window
    }
    return;
  }
  return (
    <div className="editor-header">
      {unitUrlError !== null
        ? <Toast>Error: This block is not connected to a unit or library</Toast>
        : null
      }
      <ModalDialog.Header>
        <ActionRow>
            <ModalDialog.Title>
                {title}
            </ModalDialog.Title>
            <ActionRow.Spacer />
            <IconButton
                src={Close}
                iconAs={Icon}
                alt="Close"
                onClick={onCancelClicked()}
                variant='light'
                className="mr-2" />
        </ActionRow>
      </ModalDialog.Header>
    </div>
  )
}
EditorHeader.propTypes ={
  title: PropTypes.string.isRequired,
}
export default EditorHeader;