import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Button, FullscreenModal } from '@edx/paragon';

import { thunkActions } from '../../../../data/redux';
// import VideoPreview from './components/VideoPreview';
import DurationWidget from './components/DurationWidget';
import HandoutWidget from './components/HandoutWidget';
import LicenseWidget from './components/LicenseWidget';
import ThumbnailWidget from './components/ThumbnailWidget';
import TranscriptsWidget from './components/TranscriptsWidget';
import VideoSourceWidget from './components/VideoSourceWidget';
import './index.scss';
import * as module from '.';

export const hooks = {
  onInputChange: (handleValue) => (e) => handleValue(e.target.value),
  onCheckboxChange: (handleValue) => (e) => handleValue(e.target.checked),
  onSave: (dispatch) => () => {
    dispatch(thunkActions.video.saveVideoData());
  },
};

export const VideoSettingsModal = ({
  isOpen,
  close,
  // returnToSelection,
}) => {
  const dispatch = useDispatch();
  return (
    <FullscreenModal
      title="Video Settings"
      className="video-settings-modal"
      onClose={close}
      isOpen={isOpen}
      confirmAction={(
        <Button variant="primary" onClick={module.hooks.onSave(dispatch)}>
          Save
        </Button>
      )}
    >
      <div className="video-settings-modal row">
        <div className="video-preview col col-4">
          Video Preview goes here
          {/* <VideoPreview /> */}
        </div>
        <div className="video-controls col col-8">
          <VideoSourceWidget />
          <ThumbnailWidget />
          <TranscriptsWidget />
          <DurationWidget />
          <HandoutWidget />
          <LicenseWidget />
        </div>
      </div>
    </FullscreenModal>
  );
};

VideoSettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  // returnToSelection: PropTypes.func.isRequired,
};

export default VideoSettingsModal;
