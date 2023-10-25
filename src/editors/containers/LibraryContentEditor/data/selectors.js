import { createSelector } from 'reselect';
// import { blockTypes } from '../../constants/app';
// import * as urls from '../../services/cms/urls';
import * as module from './selectors';

export const libraryState = (state) => state.library;

const mkSimpleSelector = (cb) => createSelector([module.libraryState], cb);

export const simpleSelectors = {
  libraries: mkSimpleSelector(library => library.libraries),
  selectedLibrary: mkSimpleSelector(library => library.selectedLibrary),
  selectionMode: mkSimpleSelector(library => library.selectionMode),
  selectionSettings: mkSimpleSelector(library => library.selectionSettings),
  blocksInSelectedLibrary: mkSimpleSelector(library => library.blocksInSelectedLibrary),
};

export default {
  ...simpleSelectors,
};