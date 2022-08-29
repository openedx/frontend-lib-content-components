import React, { useState } from 'react';

import { StrictDict } from '../../utils';
import * as module from './hooks';

export const state = StrictDict({
  durationError: (val) => useState(val),
  handoutError: (val) => useState(val),
  licenseError: (val) => useState(val),
  thumbnailError: (val) => useState(val),
  transcriptsError: (val) => useState(val),
  videoSourceError: (val) => useState(val),
});

export const errors = () => {
  const [durationError, setDurationError] = module.state.durationError(null);
  const [handoutError, setHandoutError] = module.state.handoutError(null);
  const [licenseError, setLicenseError] = module.state.licenseError(null);
  const [thumbnailError, setThumbnailError] = module.state.thumbnailError(null);
  const [transcriptsError, setTranscriptsError] = module.state.transcriptsError(null);
  const [videoSourceError, setVideoSourceError] = module.state.videoSourceError(null);

  return {
    error: {
      duration: durationError,
      handout: handoutError,
      license: licenseError,
      thumbnail: thumbnailError,
      transcripts: transcriptsError,
      videoSource: videoSourceError,
    },
    validateEntry: () => {
      let validated = true;
      if (!module.validateDuration({setDurationError})) validated = false;
      if (!module.validateHandout({setHandoutError})) validated = false;
      if (!module.validateLicense({setLicenseError})) validated = false;
      if (!module.validateThumbnail({setThumbnailError})) validated = false;
      if (!module.validateTranscripts({setTranscriptsError})) validated = false;
      if (!module.validateVideoSource({setVideoSourceError})) validated = false;
      return validated;
    },
  };
};

export const validateDuration = ({setDurationError}) => {
  console.log('validate duration')
};
export const validateHandout = ({setHandoutError}) => {
  console.log('validate handout');
};
export const validateLicense = ({setLicenseError}) => {
  console.log('validate license');
};
export const validateThumbnail = ({setThumbnailError}) => {
  console.log('alidate thumbnail');
};
export const validateTranscripts = ({setTranscriptsError}) => {
  setTranscriptsError('testing transcript error')
  console.log('test setTranscript')
  return false;
};
export const validateVideoSource = ({setVideoSourceError}) => {
  console.log('validate video source');
};

export default {
  errors,
  validateDuration,
  validateHandout,
  validateLicense,
  validateThumbnail,
  validateTranscripts,
  validateVideoSource,
};
