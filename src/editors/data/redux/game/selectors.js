import { createSelector } from 'reselect';
import * as module from './selectors';

export const gameState = (state) => state.game;
const mkSimpleSelector = (cb) => createSelector([module.gameState], cb);
export const simpleSelectors = {
  completeState: mkSimpleSelector(gameData => gameData),

  // Settings selector
  settings: mkSimpleSelector(gameData => gameData.settings),
  // type selector will be removed after it is added to settings
  type: mkSimpleSelector(gameData => gameData.type),

  // List selector
  list: mkSimpleSelector(gameData => gameData.list),

};

export default {
  ...simpleSelectors,
};
