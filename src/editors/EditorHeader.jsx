import {
  ActionRow, IconButton, Icon, ModalDialog, Form,
} from '@edx/paragon';
import React, { useContext, useState, useEffect } from 'react';
import { Edit, Close } from '@edx/paragon/icons';
import EditorPageContext from './EditorPageContext';
import { ActionStates } from './data/constants';

/* The Header component renders based on three states:
    loading -> loaded but not editing -> editing. */

const EditorHeader = () => {
  const {
    titleRef, editorRef, setBlockTitle,
    blockValue, blockLoading,
    unitUrl, unitUrlLoading, studioEndpointUrl,
  } = useContext(EditorPageContext);

  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState('');
  useEffect(() => {
    if (blockLoading === ActionStates.FINISHED) {
      setTitle(blockValue ? blockValue.data.display_name : '');
    }
  }, [blockLoading]);

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { setEditing(false); }
    if (e.key === 'Tab' && editorRef) {
      e.preventDefault();
      editorRef.current.focus();
    }
  };

  const handleOnBlur = () => {
    setBlockTitle(title);
    setEditing(false);
  };

  const onCancelClicked = () => {
    if (unitUrlLoading === ActionStates.FINISHED) {
      const destination = `${studioEndpointUrl}/container/${unitUrl.data.ancestors[0].id}`;
      window.location.assign(destination);
    }
  };

  let titleDisplay = 'Loading...';
  if (blockLoading === ActionStates.FINISHED) {
    if (!editing) {
      titleDisplay = (
        <div lassName="d-flex">
          <div style={{ lineHeight: '1.5', paddingRight: '.25em' }}>
            {title || 'Title'}
          </div>
          <IconButton
            src={Edit}
            iconAs={Icon}
            aria-label="Edit Title"
            alt="Edit"
            onClick={() => setEditing(true)}
            className="mr-2"
            size="sm"
            autoFocus
          />
        </div>
      );
    } else {
      titleDisplay = (
        <Form.Group>
          <Form.Control
            ref={(input) => { titleRef.current = input; }}
            value={title || ''}
            placeholder="Title"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleOnBlur}
            autoFocus
            trailingElement={<Icon src={Edit} />}
          />
        </Form.Group>
      );
    }
  }

  return (
    <div className="editor-header">
      <ModalDialog.Header>
        <ActionRow>
          <ModalDialog.Title>
            {titleDisplay}
          </ModalDialog.Title>
          <ActionRow.Spacer />
          <IconButton
            src={Close}
            iconAs={Icon}
            aria-label="Cancel Changes and Return to Learning Context"
            alt="Close"
            onClick={onCancelClicked}
            className="mr-2"
            variant="light"
          />
        </ActionRow>
      </ModalDialog.Header>
    </div>
  );
};
export default EditorHeader;
