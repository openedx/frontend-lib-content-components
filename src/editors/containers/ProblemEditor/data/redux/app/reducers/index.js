import { createSlice } from '@reduxjs/toolkit';
import { StrictDict } from '../../../../../../utils';
import keyStore from '../../../../../../utils/keyStore';

const initialState = {
  rawOLX: '',
  problemType: null,
  question: '',
  answers: [],
  settings: keyStore({
    typeAndScoring: {
      advanced: false,
      type: '',
      scoring: {
        wieght: 0,
        attempts: {
          unlimited: true,
          number: 0,
        },
      },
    },
    hintsAndFeedback: {
      advanced: false,
      hints: [],
      generalFeedback: [],
      groupedOptionFeedback: [],
    },
  }),
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
    load: (state, { payload }) => ({
      ...state,
      rawMarkdown: payload.data.Markdown,
      problemType: payload.data.problemType,
      question:  dataparser.getEditorData(payload.data.markdown),
      answers: dataparser.getAnswers(payload.data.markdown, payload.data.problemType),
      settings: keyStore({
        typeAndScoring:{
          advanced: false,
          type: '',
          scoring: {
            wieght: 0,
            attempts: {
              unlimited: true,
              number: 0,
            },
          },
        },
        hintsAndFeedback:{


        },


      });


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
