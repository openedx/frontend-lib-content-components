import _ from 'lodash-es';

import { ShowAnswerTypes } from '../../../data/constants/problem';

export const popuplateItem = (parentObject, itemName, statekey, metadata) => {
  let parent = parentObject;
  const item = _.get(metadata, itemName, null);
  if (!_.isNil(item)) {
    parent = { ...parentObject, [statekey]: item };
  }
  return parent;
};

export const parseScoringSettings = (metadata) => {
  let scoring = {};

  let attempts = popuplateItem({}, 'max_attempts', 'number', metadata);
  if (!_.isEmpty(attempts)) {
    const unlimited = _.isNaN(attempts.number);
    attempts = { ...attempts, unlimited };
    scoring = { ...scoring, attempts };
  }

  scoring = popuplateItem(scoring, 'weight', 'weight', metadata);

  return scoring;
};

export const parseShowAnswer = (metadata) => {
  let showAnswer = {};

  const showAnswerType = _.get(metadata, 'showanswer', {});
  if (!_.isNil(showAnswerType) && showAnswerType in ShowAnswerTypes) {
    showAnswer = { ...showAnswer, on: showAnswerType };
  }

  showAnswer = popuplateItem(showAnswer, 'attempts_before_showanswer_button', 'afterAttempts', metadata);

  return showAnswer;
};

export const parseSettings = (metadata) => {
  let settings = {};

  if (_.isNil(metadata) || _.isEmpty(metadata)) {
    return settings;
  }

  settings = popuplateItem(settings, 'matlab_api_key', 'matLabApiKey', metadata);

  const scoring = parseScoringSettings(metadata);
  if (!_.isEmpty(scoring)) {
    settings = { ...settings, scoring };
  }

  const showAnswer = parseShowAnswer(metadata);
  if (!_.isEmpty(showAnswer)) {
    settings = { ...settings, showAnswer };
  }
  settings = popuplateItem(settings, 'show_reset_button', 'showResetButton', metadata);
  settings = popuplateItem(settings, 'submission_wait_seconds', 'timeBetween', metadata);

  return settings;
};
