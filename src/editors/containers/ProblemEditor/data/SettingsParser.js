import { isEmpty, get, isNil } from 'lodash-es';

import { ShowAnswerTypes, RandomizationType } from "../../../data/constants/problem";

export const popuplateItem = (parentObject, itemName, statekey, metadata) => {
    let item = get(metadata, itemName, null);
    if (!isNil(item)) {
        parentObject = { ...parentObject, [statekey]: item };
    }
    return parentObject;
}

export const parseScoringSettings = (metadata) => {
    let scoring = {};

    let attempts = popuplateItem({}, 'max_attempts', 'number', metadata);
    if (!isEmpty(attempts)){
        let unlimited = true;
        if (attempts.number > 0) {
            unlimited = false;
        }
        attempts = { ...attempts, unlimited: unlimited, };
        scoring = { ...scoring, attempts };
    }

    scoring = popuplateItem(scoring, 'weight', 'weight', metadata);

    return scoring;
}

export const parseShowAnswer = (metadata) => {
    let showAnswer = {};

    let showAnswerType = get(metadata, 'showanswer', {});
    if (!isNil(showAnswerType) && showAnswerType in ShowAnswerTypes){
        showAnswer = { ...showAnswer, ['on']: showAnswerType };
    }

    showAnswer = popuplateItem(showAnswer, 'attempts_before_showanswer_button', 'afterAttempts', metadata)

    return showAnswer;
}

export const parseSettings = (metadata) => {
    let settings = {};
    
    if (isNil(metadata) || isEmpty(metadata)){
        return settings;
    }

    settings = popuplateItem(settings, 'matlab_api_key', 'matLabApiKey', metadata);

    let scoring = parseScoringSettings(metadata);
    if (!isEmpty(scoring)){
        settings = { ...settings, scoring };
    }

    let randomization = get(metadata, 'rerandomize', null)
    if (!isNil(randomization) && randomization in RandomizationType){
        settings = { ...settings, randomization };
    }

    let showAnswer = parseShowAnswer(metadata);
    if (!isEmpty(showAnswer)){
        settings = { ...settings, showAnswer }
    }

    settings = popuplateItem(settings, 'show_reset_button', 'showResetButton', metadata);
    settings = popuplateItem(settings, 'submission_wait_seconds', 'timeBetween', metadata);

    return settings;
}
  