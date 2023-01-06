import { actions } from '../../../../../../data/redux';

export const sourceHooks = ({ dispatch }) => ({
  updateVideoURL: ({ e }) => dispatch(actions.video.updateField({ videoSource: e.target.value })),
  updateVideoId: ({ e }) => dispatch(actions.video.updateField({ videoId: e.target.value })),
});

export const fallbackHooks = ({ fallbackVideos, dispatch }) => ({
  addFallbackVideo: () => dispatch(actions.video.updateField({ fallbackVideos: [...fallbackVideos, ''] })),
  deleteFallbackVideo: (videoUrl) => {
    const updatedFallbackVideos = [];
    let firstOccurence = true;
    fallbackVideos.forEach(item => {
      if (item === videoUrl && firstOccurence) {
        firstOccurence = false;
      } else {
        updatedFallbackVideos.push(item);
      }
    });
    dispatch(actions.video.updateField({ fallbackVideos: updatedFallbackVideos }));
  },
});

export default {
  sourceHooks,
  fallbackHooks,
};
