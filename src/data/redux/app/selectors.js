import { createSelector } from 'reselect';

import { feedbackRequirement, oraTypes } from 'data/services/lms/constants';

import { StrictDict } from 'utils';

import * as module from './selectors';

export const appSelector = (state) => state.app;

const mkSimpleSelector = (cb) => createSelector([module.appSelector], cb);

// top-level app data selectors
export const simpleSelectors = {
  blockValue: mkSimpleSelector(app => app.blockValue),
  unitUrl: mkSimpleSelector(app => app.unitUrl),
  blockContent: mkSimpleSelector(app => app.blockContent),
  saveResponse: mkSimpleSelector(app => app.saveResponse),
};

export default {
  ...simpleSelectors,
};
