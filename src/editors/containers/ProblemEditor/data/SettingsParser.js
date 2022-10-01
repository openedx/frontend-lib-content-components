import { isEmpty, get, isNil } from 'lodash-es';

import { ShowAnswerTypes, RandomizationType } from "../../../data/constants/problem";


const validateRandomizationType = (value) => {
    for (const key in RandomizationType){
        if (value === RandomizationType[key].value){
            return true;
        }
    }
    return false;
}

const validateShowAnswerTypes = (value) => {
    for (const key in ShowAnswerTypes){
        if (value === ShowAnswerTypes[key].value){
            return true;
        }
    }
    return false;
}

const popuplateItem = (parentObject, itemName, statekey, metadata) => {
    item = get(metadata, itemName, null);
    if (!isNil(item)) {
        parentObject = { ...parentObject, [statekey]: item };
    }
    return parentObject;
}

const parseScoringSettings = (metadata) => {
    let scoring = {};

    let attempts = popuplateItem({}, 'max_attempts', 'number', metadata);
    if (!isEmpty(attempts)){
        attempts = { ...attempts, unlimited: false, };
        scoring = { ...scoring, attempts };
    }

    scoring = popuplateItem(scoring, 'weight', 'weight', metadata);

    return scoring;
}

const parseShowAnswer = (metadata) => {
    let showAnswer = {};

    let showAnswerType = get(metadata, 'showanswer', {});
    if (!isNil(showAnswerType) && validateShowAnswerTypes(showAnswerType)){
        showAnswer = { ...showAnswer, ['on']: showAnswerType };
    }

    showAnswer = popuplateItem(showAnswer, 'attempts_before_showanswer_button', 'afterAttempts', metadata)

    return showAnswer;
}

const parseSettings = (metadata) => {
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
    if (!isNil(randomization) && validateRandomizationType(randomization)){
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

export {
    parseSettings,
};
  