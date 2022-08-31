import PropTypes from 'prop-types';

export const videoDataProps = {
  videoSource: PropTypes.string,
  fallbackVideos: PropTypes.arrayOf(PropTypes.string),
  allowVideoDownloads: PropTypes.bool,
  thumbnail: PropTypes.string,
  transcripts: PropTypes.objectOf(PropTypes.string),
  allowTranscriptDownloads: PropTypes.bool,
  duration: PropTypes.shape({
    startTime: PropTypes.number,
    stopTime: PropTypes.number,
    total: PropTypes.number,
  }),
  showTranscriptByDefult: PropTypes.bool,
  handout: PropTypes.string,
  licenseType: PropTypes.string,
  licenseDetails: PropTypes.shape({
    attribution: PropTypes.bool,
    noncommercial: PropTypes.bool,
    noDerivatives: PropTypes.bool,
    shareAlike: PropTypes.bool,
  }),
};


export const problemDataProps = {
  rawOLX: PropTypes.string,
  problemType: null,
  question: PropTypes.string,
  answers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
      correct: PropTypes.bool,
      selectedFeedback: PropTypes.string,
      unselectedFeedback: PropTypes.string,
      answer: PropTypes.string,
   }),
  ),
  settings: PropTypes.shape({
    scoring: PropTypes.shape({
      advanced: PropTypes.bool,
      scoring: PropTypes.shape({
        wieght: PropTypes.number,
        attempts: PropTypes.shape({
          unlimited: PropTypes.bool,
          number: PropTypes.number,
        }),
      }),
    }),
    hints: PropTypes.arrayOf(PropTypes.string),
    randomization: '',
    timeBetween: PropTypes.number,
    MatLabApiKey: PropTypes.string,
    showAnswer: PropTypes.shape({
      on: PropTypes.string, // one of [OnAnswered, OnDueDate, AfterDueDate]
      afterAtempts: PropTypes.number,
    }),
    showResetButton: PropTypes.bool,
  }),
};


export default {
  videoDataProps,
  problemDataProps
};
