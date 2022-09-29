import { actions, selectors } from '..';
import * as requests from './requests';
import * as module from './video';

export const loadVideoData = () => (dispatch) => {
  const {
    videoSource,
    fallbackVideos,
  } = module.determineVideoSource({
    edxVideoId: selectors.app.blockValue.data.metadata.edx_video_id,
    youtubeId: selectors.app.blockValue.data.metadata.youtube_id_1_0,
    html5Sources: selectors.app.blockValue.data.metadata.html5_sources,
  });

  // we don't appear to want to parse license version
  const [licenseType, licenseOptions] = module.parseLicense(selectors.app.blockValue.data.metadata.license);

  dispatch(actions.video.load({
    videoSource,
    fallbackVideos,
    allowVideoDownloads: selectors.app.blockValue.data.metadata.download_video,
    transcripts: selectors.app.blockValue.data.metadata.transcripts,
    allowTranscriptDownloads: selectors.app.blockValue.data.metadata.download_track,
    showTranscriptByDefault: selectors.app.blockValue.data.metadata.show_captions,
    duration: {
      startTime: selectors.app.blockValue.data.metadata.start_time,
      stopTime: selectors.app.blockValue.data.metadata.end_time,
      total: null, // TODO can we get total duration? if not, probably dropping from widget
    },
    handout: selectors.app.blockValue.data.metadata.handout,
    licenseType,
    licenseDetails: {
      attribution: licenseOptions.by,
      noncommercial: licenseOptions.nc,
      noDerivatives: licenseOptions.nd,
      shareAlike: licenseOptions.sa,
    },
  }));
};

export const determineVideoSource = ({
  edxVideoId,
  youtubeId,
  html5Sources,
}) => {
  // videoSource should be the edx_video_id (if present), or the youtube url (if present), or the first fallback url.
  // in that order.
  // if we are falling back to the first fallback url, remove it from the list of fallback urls for display
  const videoSource = edxVideoId || youtubeId || html5Sources[0] || '';
  const fallbackVideos = (!edxVideoId && !youtubeId)
    ? html5Sources.slice(1)
    : html5Sources;
  return {
    videoSource,
    fallbackVideos,
  };
};

// copied from frontend-app-learning/src/courseware/course/course-license/CourseLicense.jsx
// in the long run, should be shared (perhaps one day the learning MFE will depend on this repo)
export const parseLicense = (license) => {
  if (!license) {
    // Default to All Rights Reserved if no license
    // is detected
    return ['all-rights-reserved', {}];
  }

  // Search for a colon character denoting the end
  // of the license type and start of the options
  const colonIndex = license.indexOf(':');
  if (colonIndex === -1) {
    // no options, so the entire thing is the license type
    return [license, {}];
  }

  // Split the license on the colon
  const licenseType = license.slice(0, colonIndex).trim();
  const optionStr = license.slice(colonIndex + 1).trim();

  let options = {};
  let version = '';

  // Set the defaultVersion to 4.0
  const defaultVersion = '4.0';
  optionStr.split(' ').forEach(option => {
    // Split the option into key and value
    // Default the value to `true` if no value
    let key = '';
    let value = '';
    if (option.indexOf('=') !== -1) {
      [key, value] = option.split('=');
    } else {
      key = option;
      value = true;
    }

    // Check for version
    if (key === 'ver') {
      version = value;
    } else {
      // Set the option key to lowercase to make
      // it easier to query
      options[key.toLowerCase()] = value;
    }
  });

  // No options
  if (Object.keys(options).length === 0) {
    // If no other options are set for the
    // license, set version to 1.0
    version = '1.0';

    // Set the `zero` option so the link
    // works correctly
    options = {
      zero: true,
    };
  }

  // Set the version to whatever was included,
  // using `defaultVersion` as a fallback if unset
  version = version || defaultVersion;

  return [licenseType, options, version];
};

export const saveVideoData = () => () => {
  // dispatch(actions.app.setBlockContent)
  // dispatch(requests.saveBlock({ });
};

// Transcript Thunks:

export const uploadTranscript = ({ language, filename, file }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  let lang = language;
  if (!language) {
    [[lang]] = selectors.video.openLanguages(state);
  }
  dispatch(requests.uploadTranscript({
    language: lang,
    videoId,
    transcript: file,
    onSuccess: (response) => {
      dispatch(actions.video.updateField({
        transcripts: {
          ...transcripts,
          [lang]: { filename },
        },
      }));
      if (selectors.video.videoId(state) === '') {
        dispatch(actions.video.updateField({
          videoId: response.edx_video_id,
        }));
      }
    },

  }));
};

export const deleteTranscript = ({ language }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  dispatch(requests.deleteTranscript({
    language,
    videoId,
    onSuccess: () => {
      const updateTranscripts = {};
      Object.keys(transcripts).forEach((key) => {
        if (key !== language) {
          updateTranscripts[key] = transcripts[key];
        }
      });
      dispatch(actions.video.updateField({ transcripts: updateTranscripts }));
    },
  }));
};

export const replaceTranscript = ({ newFile, newFilename, language }) => (dispatch, getState) => {
  const state = getState();
  const { transcripts, videoId } = state.video;
  dispatch(requests.deleteTranscript({
    language,
    videoId,
    onSuccess: () => {
      const updateTranscripts = {};
      Object.keys(transcripts).forEach((key) => {
        if (key !== language) {
          updateTranscripts[key] = transcripts[key];
        }
      });
      dispatch(actions.video.updateField({ transcripts: updateTranscripts }));
      dispatch(uploadTranscript({ language, file: newFile, filename: newFilename }));
    },
  }));
};

export default {
  loadVideoData,
  determineVideoSource,
  parseLicense,
  saveVideoData,
  uploadTranscript,
  deleteTranscript,
  replaceTranscript,
};
