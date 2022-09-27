import { actions } from '../../../../../../data/redux';

// export const state = {
//   onFocusVideoId: (args) => React.useState(args),
//   onFocus
// };
export const deleteFallbackVideo = ({ fallbackVideos, dispatch }) => (videoUrl) => {
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
};

export default { deleteFallbackVideo };
