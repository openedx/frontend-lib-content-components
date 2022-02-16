import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Form, IconButton, Icon, ModalDialog,
} from '@edx/paragon';
import { Edit, Close } from '@edx/paragon/icons';
import EditorPageContext from './EditorPageContext';
import { ActionStates, mapBlockTypeToName } from './data/constants';

/* The Header component renders based on three states:
    loading -> loaded but not editing -> editing. */

const EditorHeader = ({ blockType }) => {
  const {
    titleRef, editorRef, setBlockTitle,
    blockValue, blockLoading,
    unitUrl, unitUrlLoading, studioEndpointUrl,
  } = useContext(EditorPageContext);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(mapBlockTypeToName(blockType));
  useEffect(() => {
    if (blockLoading === ActionStates.FINISHED) {
      setTitle(blockValue ? blockValue.data.display_name : mapBlockTypeToName(blockType));
    }
  }, [blockLoading]);

  const updateTitle = () => {
    /* This is called when the input field loses focus.
       It will update the title we are saving and set editing to false. */
    setBlockTitle(title);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setEditing(false);
    }
    if (e.key === 'Tab' && editorRef) {
      e.preventDefault();
      editorRef.current.focus();
    }
  };

  const onCancelClicked = () => {
    if (unitUrlLoading === ActionStates.FINISHED) {
      const destination = `${studioEndpointUrl}/container/${unitUrl.data.ancestors[0].id}`;
      window.location.assign(destination);
    }
  };

  const editableTitle = (isLoading, isEditing) => {
    if (isLoading) {
      return (
        <FormattedMessage
          defaultMessage="Loading..."
          description="Message Dispayed While Loading Contents"
          id="authoring.texteditor.title.loading"
        />
      );
    }
    if (!isEditing) {
      return (
        <div className="d-flex">
          <div style={{ lineHeight: '1.5', paddingRight: '.25em' }}>
            {title}
          </div>
          <IconButton
            alt="Edit"
            aria-label="Edit Title"
            className="mr-2"
            iconAs={Icon}
            onClick={() => { setEditing(true); }}
            size="sm"
            src={Edit}
          />
        </div>
      );
    }
    return (
      <Form.Group>
        <Form.Control
          autoFocus
          onBlur={updateTitle}
          onChange={(e) => { setTitle(e.target.value); }}
          onKeyDown={(e) => { handleKeyDown(e); }}
          placeholder="Title"
          ref={(input) => { titleRef.current = input; }}
          trailingElement={<Icon src={Edit} />}
          value={title}
        />
      </Form.Group>
    );
  };

  return (
    <div className="editor-header">
      <ModalDialog.Header>
        <ActionRow>
          <ModalDialog.Title>
            {editableTitle(blockLoading !== ActionStates.FINISHED, editing)}
          </ModalDialog.Title>
          <ActionRow.Spacer />
          <IconButton
            alt="Close"
            aria-label="Cancel Changes and Return to Learning Context"
            className="mr-2"
            iconAs={Icon}
            src={Close}
            onClick={onCancelClicked}
            variant="light"
          />
        </ActionRow>
      </ModalDialog.Header>
    </div>
  );
};

EditorHeader.propTypes = {
  blockType: PropTypes.string.isRequired,
};

export default EditorHeader;
