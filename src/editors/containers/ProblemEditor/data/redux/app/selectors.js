// import { createSelector } from 'reselect';

import { keyStore } from '../../../utils';

import { initialState } from './reducer';
// import * as module from './selectors';

const stateKeys = keyStore(initialState);

export const video = (state) => state.video;

export const simpleSelectors = [
  stateKeys.problemType,
  // ...
].reduce((obj, key) => ({ ...obj, [key]: state => state.problemSettings[key] }), {});

export default {
  ...simpleSelectors,
};