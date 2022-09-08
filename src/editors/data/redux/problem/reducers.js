import { createSlice } from '@reduxjs/toolkit';
import { StrictDict } from '../../../utils';

const initialState = {
  rawOLX: '',
  problemType: 'SINGLESELECT',
  question: '',
  answers: [],
  groupFeedbackList: [],
  settings:{
    scoring: {
      advanced: false,
      scoring: {
        wieght: 0,
        attempts: {
          unlimited: true,
          number: 0,
        },
      },
    },
    hints: [],
    randomization: '',
    timeBetween: 0,
    MatLabApiKey: '',
    showAnswer: {
      on: '', // one of [OnAnswered, OnDueDate, AfterDueDate]
      afterAtempts: 1,
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
      question: payload
    }),
    load: (state, { payload }) => ({
      ...state,
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
