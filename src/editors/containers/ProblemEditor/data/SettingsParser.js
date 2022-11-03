import _ from 'lodash-es';

import { ShowAnswerTypes } from "../../../data/constants/problem";

export const popuplateItem = (parentObject, itemName, statekey, metadata) => {
    let item = _.get(metadata, itemName, null);
    if (!_.isNil(item)) {
        parentObject = { ...parentObject, [statekey]: item };
    }
    return parentObject;
}

export const parseScoringSettings = (metadata) => {
    let scoring = {};

    let attempts = popuplateItem({}, 'max_attempts', 'number', metadata);
    if (!_.isEmpty(attempts)){
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

    let showAnswerType = _.get(metadata, 'showanswer', {});
    if (!_.isNil(showAnswerType) && showAnswerType in ShowAnswerTypes){
        showAnswer = { ...showAnswer, ['on']: showAnswerType };
    }

    showAnswer = popuplateItem(showAnswer, 'attempts_before_showanswer_button', 'afterAttempts', metadata)

    return showAnswer;
}

export const parseSettings = (metadata) => {
    let settings = {};
    
    if (_.isNil(metadata) || _.isEmpty(metadata)){
        return settings;
    }

    settings = popuplateItem(settings, 'matlab_api_key', 'matLabApiKey', metadata);

    let scoring = parseScoringSettings(metadata);
    if (!_.isEmpty(scoring)){
        settings = { ...settings, scoring };
    }

    let showAnswer = parseShowAnswer(metadata);
    if (!_.isEmpty(showAnswer)){
        settings = { ...settings, showAnswer }
    }
    settings = popuplateItem(settings, 'show_reset_button', 'showResetButton', metadata);
    settings = popuplateItem(settings, 'submission_wait_seconds', 'timeBetween', metadata);

    return settings;
}
