import { actions } from '../../../../../../data/redux';

// export const state = {
//   onFocusVideoId: (args) => React.useState(args),
//   onFocus
// };
export const deleteFallbackVideo = ({ fallbackVideos, dispatch }) => (videoUrl) => {
  const updatedFallbackVideos = [];
  fallbackVideos.forEach(item => {
    if (item !== videoUrl) {
      updatedFallbackVideos.push(item);
    }
  });
  dispatch(actions.video.updateField({ fallbackVideos: updatedFallbackVideos }));
};

export default { deleteFallbackVideo };
