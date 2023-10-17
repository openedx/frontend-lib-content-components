import { createSelector } from 'reselect';
import { blockTypes } from '../../constants/app';
import * as urls from '../../services/cms/urls';
import * as module from './selectors';

export const appSelector = (state) => state.app;

const mkSimpleSelector = (cb) => createSelector([module.appSelector], cb);

export const simpleSelectors = {
    libraries: mkSimpleSelector(app => app.libraries),
    selectedLibrary: mkSimpleSelector(app => app.selectedLibrary),
    selectionMode: mkSimpleSelector(app => app.selectionMode),
    selectionSettings: mkSimpleSelector(app => app.selectionSettings),
    blocksInSelectedLibrary: mkSimpleSelector(app => app.blocksInSelectedLibrary),
}

export default {
    ...simpleSelectors,
}