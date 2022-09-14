import { StrictDict } from '../../utils';

export const videoTranscriptLanguages = StrictDict({
  eng: 'English',
  esp: 'Spanish',
  kling: 'Klingon',
  monk: 'Monkish',
  flunk: 'Flonkish',
  list: 'Please',
});

export const timeKeys = StrictDict({
  startTime: 'startTime',
  stopTime: 'stopTime',
});

export default {
  timeKeys,
  videoTranscriptLanguages,
};
