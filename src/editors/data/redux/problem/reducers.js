import { has, isUndefined } from "lodash";
import { createSlice } from '@reduxjs/toolkit';
import { indexToLetterMap } from '../../../containers/ProblemEditor/data/MarkDownParser';
import { StrictDict } from '../../../utils';
import { ShowAnswerTypes, RandomizationType } from "../../../data/constants/problem";

const nextAlphaId = (lastId) => String.fromCharCode(lastId.charCodeAt(0) + 1);
const initialState = {
  rawOLX: '',
  problemType: 'SINGLESELECT',
  question: '',
  answers: [],
  groupFeedbackList: [],
  settings: {
    scoring: {
      weight: 0,
      attempts: {
        unlimited: true,
        number: 0,
      },
    },
    hints: [],
    randomization: RandomizationType.NEVER.value,
    timeBetween: 0,
    matLabApiKey: '',
    showAnswer: {
      on: ShowAnswerTypes.FINISHED.value, // one of [OnAnswered, OnDueDate, AfterDueDate]
      afterAttempts: 0,
    },
    showResetButton: false,
  },
};

// eslint-disable-next-line no-unused-vars
const problem = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    updateField: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    updateQuestion: (state, { payload }) => ({
      ...state,
      question: payload,
    }),
    updateAnswer: (state, { payload }) => {
      // you can mutuate state only inside creating
      // https://redux-toolkit.js.org/usage/immer-reducers#immutable-updates-with-immer
      const { id, hasSingleAnswer, ...answer } = payload;
      state.answers = state.answers.map(obj => {
        if (obj.id === id) {
          return { ...obj, ...answer };
        }
        // set other answers as incorrect if problem only has one answer correct
        // and changes object include correct key change
        if (hasSingleAnswer && has(answer, 'correct') && obj.correct) {
          return { ...obj, correct: false };
        }
        return obj;
      });
    },
    deleteAnswer: (state, { payload }) => {
      const { id } = payload;
      if (state.answers.length <= 1) {
        return state;
      }
      state.answers = state.answers.filter(obj => obj.id !== id).map((answer, index) => {
        const newId = indexToLetterMap[index];
        if (answer.id === newId) {
          return answer;
        }
        return { ...answer, id: newId };
      });
    },
    addAnswer: (state) => {
      const currAnswers = state.answers;
      if (currAnswers.length >= indexToLetterMap.length) {
        return state;
      }
      const [firstAnswer] = currAnswers;
      const newOption = {
        id: currAnswers.length ? nextAlphaId(currAnswers[currAnswers.length - 1].id) : 'A',
        title: '',
        selectedFeedback: undefined,
        unselectedFeedback: undefined,
        feedback: undefined,
        correct: false,
      };
      if (isUndefined(firstAnswer.feedback)) {
        newOption.selectedFeedback = '';
        newOption.unselectedFeedback = '';
      } else {
        newOption.feedback = '';
      }
      state.answers = [
        ...currAnswers,
        newOption,
      ];
    },
    updateSettings: (state, {payload}) => ({
      ...state,
      settings: {
        ...state.settings,
        ...payload
      }
    }),
    load: (state, { payload: { settings: {scoring, showAnswer, ...settings}, ...payload } }) => ({
      ...state,
      settings: {
        ...state.settings,
        scoring: { ...state.settings.scoring, ...scoring },
        showAnswer: { ...state.settings.showAnswer, ...showAnswer },
        ...settings
      },
      ...payload,
    }),
    onSelect: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
});

const actions = StrictDict(problem.actions);

const { reducer } = problem;

export {
  actions,
  initialState,
  reducer,
};
