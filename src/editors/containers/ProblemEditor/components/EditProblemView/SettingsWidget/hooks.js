import { useState, useEffect } from 'react';

import * as module from './hooks';
import messages from './messages';
import { actions } from '../../../../../data/redux';
import { isEmpty } from 'lodash-es';

export const state = {
    showAdvanced: (val) => useState(val),
    cardCollapsed: (val) => useState(val),
    summary: (val) => useState(val),
};

export const showAdvancedSettingsCards = () => {
    const [isAdvancedCardsVisible, setIsAdvancedCardsVisible] = module.state.showAdvanced(false);
    return {
        isAdvancedCardsVisible,
        showAdvancedCards: () => setIsAdvancedCardsVisible(true),
    };
}

export const showFullCard = () => {
    const [isCardCollapsed, setIsCardCollapsed] = module.state.cardCollapsed(false);
    return {
        isCardCollapsed,
        toggleCardCollapse: () => setIsCardCollapsed(!isCardCollapsed),
    };
}

export const hintsCardHooks = (hints, dispatch) => {
    const [summary, setSummary] = module.state.summary({ message: "", values: {} })

    useEffect(() => {
        const hintsNumber = hints.length;
        if (hintsNumber == 0) {
            setSummary({ message: messages.noHintSummary, values: {} });
        } else {
            setSummary({ message: messages.hintSummary, values: { hint: hints[0].value, count: (hintsNumber - 1) } });
        }
    }, [hints]);

    const handleAdd = () => {
        let newId = Math.max(...hints.map(hint => hint.id)) + 1
        const hint = { id: newId, value: "" }
        hints = [...hints, hint]
        dispatch(actions.problem.updateSettings({ hints }));
    }


    return {
        summary,
        handleAdd,
    }
}

export const hintsRowHooks = (id, hints, dispatch) => {

    const handleChange = (event) => {
        const value = event.target.value
        hints = hints.map(hint => {
            if (hint.id === id) {
                return { ...hint, value };
            }
            return hint;
        });
        dispatch(actions.problem.updateSettings({ hints }));
    }

    const handleDelete = () => {
        hints = hints.filter((hint) => (hint.id != id));
        dispatch(actions.problem.updateSettings({ hints }));
    }

    return {
        handleChange,
        handleDelete,
    }
}

export const matlabCardHooks = (matLabApiKey, dispatch) => {
    const [summary, setSummary] = module.state.summary({ message: "", values: {}, intl: false })

    useEffect(() => {
        if (isEmpty(matLabApiKey)) {
            setSummary({ message: messages.matlabNoKeySummary, values: {}, intl: true });
        } else {
            setSummary({ message: matLabApiKey, values: {}, intl: false });
        }
    }, [matLabApiKey])

    const handleChange = (event) => {
        dispatch(actions.problem.updateSettings({ matLabApiKey: event.target.value }));
    }

    return {
        summary,
        handleChange,
    }
}

export const randomizationCardHooks = (dispatch) => ({
    handleChange: (event) => {
        dispatch(actions.problem.updateSettings({ randomization: event.target.value }));
    }
})

export const resetCardHooks = (dispatch) => {

    const setReset = (value) => {
        dispatch(actions.problem.updateSettings({ showResetButton: value }));
    }

    return {
        setResetTrue: () => setReset(true),
        setResetFalse: () => setReset(false),
    }
}

export const scoringCardHooks = (scoring, dispatch) => {

    const handleMaxAttemptChange = (event) => {
        let unlimitedAttempts = true;
        const attemptNumber = parseInt(event.target.value);
        if (attemptNumber > 0) {
            unlimitedAttempts = false;
        }
        dispatch(actions.problem.updateSettings({ scoring: { ...scoring, attempts: { number: attemptNumber, unlimited: unlimitedAttempts } } }));
    }

    const handleWeightChange = (event) => {
        dispatch(actions.problem.updateSettings({ scoring: { ...scoring, weight: parseFloat(event.target.value) } }));
    }

    return {
        handleMaxAttemptChange,
        handleWeightChange,
    }
}

export const showAnswerCardHooks = (showAnswer, dispatch) => {

    const handleShowAnswerChange = (event) => {
        dispatch(actions.problem.updateSettings({ showAnswer: { ...showAnswer, on: event.target.value } }));
    }

    const handleAttemptsChange = (event) => {
        dispatch(actions.problem.updateSettings({ showAnswer: { ...showAnswer, afterAttempts: parseInt(event.target.value) } }));
    }

    return {
        handleShowAnswerChange,
        handleAttemptsChange,
    }
}

export const timerCardHooks = (dispatch) => ({

    handleChange: (event) => {
        dispatch(actions.problem.updateSettings({ timeBetween: event.target.value }));
    }
})

export const typeRowHooks = (typeKey, dispatch) => {

    const onClick = () => {
        dispatch(actions.problem.updateField({ problemType: typeKey }));
    }

    return {
        onClick,
    }

}