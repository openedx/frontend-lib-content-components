import { useDispatch } from 'react-redux';
import { actions } from '../../../../../../data/redux';

console.log(actions);

export const transcriptLanguages = (transcripts) => {
  const languages = []
  if (transcripts) {
    Object.keys(transcripts).forEach(transcript => {
      languages.push(transcript)
    });
    return languages.join(', ');
  } else return "None";
}

/**
 * onCheckboxChange(handleValue)
 * Simple event handler forwarding the event target checked prop to a given callback
 * @param {func} handleValue - event value handler
 * @return {func} - evt callback that will call handleValue with the event target checked prop.
 */
export const onCheckboxChange = (handleValue) => (e) => {
  const dispatch = useDispatch();
  dispatch(actions.video.updateField({allowTranscriptDownloads:e.target.checked}))
  // handleValue(e.target.checked)
};
