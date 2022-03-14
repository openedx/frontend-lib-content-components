import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Video,
} from '@edx/paragon';

import BaseModal from '../BaseModal';
import * as module from '.';

export const hooks = {
  onInputChange: (handleValue) => (e) => handleValue(e.target.value),
  onCheckboxChange: (handleValue) => (e) => handleValue(e.target.checked),
  onSave: ({ saveToEditor }) => saveToEditor({}),
};

export const VideoSettingsModal = ({
  isOpen,
  close,
  selection,
  saveToEditor,
  returnToSelection,
}) => {
  const onSaveClick = module.hooks.onSave({
    saveToEditor,
  });
  return (
    <BaseModal
      title="Video Settings"
      close={close}
      isOpen={isOpen}
      confirmAction={(
        <Button variant="primary" onClick={onSaveClick}>
          Save
        </Button>
      )}
    >
      <Button onClick={returnToSelection} variant="link" size="inline">
        Select another video
      </Button>
      <br />

      <div>
        Form goes here
      </div>
    </BaseModal>
  );
};

VideoSettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  selection: PropTypes.shape({
    url: PropTypes.string,
    externalUrl: PropTypes.string,
  }).isRequired,
  saveToEditor: PropTypes.func.isRequired,
  returnToSelection: PropTypes.func.isRequired,
};
export default VideoSettingsModal;
