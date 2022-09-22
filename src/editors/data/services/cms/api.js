import { camelizeKeys } from '../../../utils';
import * as urls from './urls';
import { get, post, deleteObject } from './utils';
import * as module from './api';
import * as mockApi from './mockApi';

export const apiMethods = {
  fetchBlockById: ({ blockId, studioEndpointUrl }) => get(
    urls.block({ blockId, studioEndpointUrl }),
  ),
  fetchByUnitId: ({ blockId, studioEndpointUrl }) => get(
    urls.blockAncestor({ studioEndpointUrl, blockId }),
  ),
  fetchStudioView: ({ blockId, studioEndpointUrl }) => get(
    urls.blockStudioView({ studioEndpointUrl, blockId }),
  ),
  fetchImages: ({ learningContextId, studioEndpointUrl }) => get(
    urls.courseImages({ studioEndpointUrl, learningContextId }),
  ),
  uploadImage: ({
    learningContextId,
    studioEndpointUrl,
    image,
  }) => {
    const data = new FormData();
    data.append('file', image);
    return post(
      urls.courseAssets({ studioEndpointUrl, learningContextId }),
      data,
    );
  },
  deleteTranscript: ({
    studioEndpointUrl,
    language,
    blockId,
    videoId,
  }) => {
    const deleteJSON = { data: { lang: language, edx_video_id: videoId } };
    return deleteObject(
      urls.videoTranscripts({ studioEndpointUrl, blockId }),
      deleteJSON,
    );
  },
  uploadTranscript: ({
    blockId,
    studioEndpointUrl,
    transcript,
    videoId,
    language,
  }) => {
    const data = new FormData();
    data.append('file', transcript);
    data.append('edx_video_id', videoId);
    data.append('language_code', language);
    data.append('new_language_code', language);
    return post(
      urls.videoTranscripts({ studioEndpointUrl, blockId }),
      data,
    );
  },
  normalizeContent: ({
    blockId,
    blockType,
    content,
    learningContextId,
    title,
  }) => {
    if (blockType === 'html') {
      return {
        category: blockType,
        courseKey: learningContextId,
        data: content,
        has_changes: true,
        id: blockId,
        metadata: { display_name: title },
      };
    }
    if (blockType === 'video') {
      const {
        html5_sources,
        edx_video_id,
        youtube_id_1_0,
      } = module.processVideoIds({
        videoSource: content.videoSource,
        fallbackVideos: content.fallbackVideos,
      });
      return {
        category: blockType,
        courseKey: learningContextId,
        display_name: title,
        id: blockId,
        metadata: {
          display_name: title,
          download_video: content.allowVideoDownloads,
          edx_video_id,
          html5_sources,
          youtube_id_1_0,
          download_track: content.allowTranscriptDownloads,
          track: "",  // TODO Downloadable Transcript URL. Backend expects a file name, for example: "something.srt"
          show_captions: content.showTranscriptByDefault,
          handout: content.handout,
          start_time: content.duration.startTime,
          end_time: content.duration.stopTime,
        },
      };
    }
    throw new TypeError(`No Block in V2 Editors named /"${blockType}/", Cannot Save Content.`);
  },
  saveBlock: ({
    blockId,
    blockType,
    content,
    learningContextId,
    studioEndpointUrl,
    title,
  }) => post(
    urls.block({ studioEndpointUrl, blockId }),
    module.apiMethods.normalizeContent({
      blockType,
      content,
      blockId,
      learningContextId,
      title,
    }),
  ),
};

export const loadImage = (imageData) => ({
  ...imageData,
  dateAdded: new Date(imageData.dateAdded.replace(' at', '')).getTime(),
});

export const loadImages = (rawImages) => camelizeKeys(rawImages).reduce(
  (obj, image) => ({ ...obj, [image.id]: module.loadImage(image) }),
  {},
);

export const processVideoIds = ({videoSource, fallbackVideos}) => {
  let edx_video_id = "";
  let youtube_id_1_0 = "";
  let html5_sources = [];

  if (isEdxVideo(videoSource)) {
    edx_video_id = videoSource;
  } else if (getYoutubeId(videoSource)) {
    youtube_id_1_0 = getYoutubeId(videoSource);
  } else {
    html5_sources.push(videoSource);
  }

  fallbackVideos.forEach((src) => html5_sources.push(src));

  return {
    html5_sources,
    edx_video_id,
    youtube_id_1_0,
  };
};

export const isEdxVideo = (src) => {
  const uuid4Regex = new RegExp(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/);
  return src.match(uuid4Regex);
};

export const getYoutubeId = (src) => {
  const youtubeRegex = new RegExp(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/);
  if (!src.match(youtubeRegex)) {
    return null;
  } else {
    return src.match(youtubeRegex)[5];
  }
};

export const checkMockApi = (key) => {
  if (process.env.REACT_APP_DEVGALLERY) {
    return mockApi[key];
  }
  return module.apiMethods[key];
};

export default Object.keys(apiMethods).reduce(
  (obj, key) => ({ ...obj, [key]: checkMockApi(key) }),
  {},
);
