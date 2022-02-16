import { createSlice } from '@reduxjs/toolkit';

import { StrictDict } from 'utils';

import { RequestStates, RequestKeys } from 'data/constants/requests';

const initialState = {
  [RequestKeys.initialize]: { status: RequestStates.inactive },
  [RequestKeys.downloadFiles]: { status: RequestStates.inactive },
  [RequestKeys.fetchSubmission]: { status: RequestStates.inactive },
  [RequestKeys.fetchSubmissionStatus]: { status: RequestStates.inactive },
  [RequestKeys.setLock]: { status: RequestStates.inactive },
  [RequestKeys.prefetchNext]: { status: RequestStates.inactive },
  [RequestKeys.prefetchPrev]: { status: RequestStates.inactive },
  [RequestKeys.submitGrade]: { status: RequestStates.inactive },
};

// eslint-disable-next-line no-unused-vars
const requests = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    startRequest: (state, { payload }) => ({
      ...state,
      [payload]: {
        status: RequestStates.pending,
      },
    }),
    completeRequest: (state, { payload }) => ({
      ...state,
      [payload.requestKey]: {
        status: RequestStates.completed,
        response: payload.response,
      },
    }),
    failRequest: (state, { payload }) => ({
      ...state,
      [payload.requestKey]: {
        status: RequestStates.failed,
        error: payload.error,
      },
    }),
    clearRequest: (state, { payload }) => ({
      ...state,
      [payload.requestKey]: {},
    }),
  },
});

const actions = StrictDict(requests.actions);
const { reducer } = requests;

export {
  actions,
  reducer,
  initialState,
};
