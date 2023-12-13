import _ from 'lodash-es';
/* eslint-disable import/no-cycle */
import { actions } from '..';
import * as requests from './requests';
import { OLXParser } from '../../../containers/ProblemEditor/data/OLXParser';
import { parseSettings } from '../../../containers/ProblemEditor/data/SettingsParser';
import { ProblemTypeKeys } from '../../constants/problem';
import ReactStateOLXParser from '../../../containers/ProblemEditor/data/ReactStateOLXParser';
import { blankProblemOLX } from '../../../containers/ProblemEditor/data/mockData/olxTestData';
import { camelizeKeys } from '../../../utils';
import { fetchEditorContent } from '../../../containers/ProblemEditor/components/EditProblemView/hooks';

export const switchToAdvancedEditor = () => (dispatch, getState) => {
  const state = getState();
  const editorObject = fetchEditorContent({ format: '' });
  const reactOLXParser = new ReactStateOLXParser({ problem: state.problem, editorObject });
  const rawOLX = reactOLXParser.buildOLX();
  dispatch(actions.problem.updateField({ problemType: ProblemTypeKeys.ADVANCED, rawOLX }));
};

export const isBlankProblem = ({ rawOLX }) => {
  if (rawOLX.replace(/\s/g, '') === blankProblemOLX.rawOLX) {
    return true;
  }
  return false;
};

export const getDataFromOlx = ({ rawOLX, rawSettings, defaultSettings }) => {
  let olxParser;
  let parsedProblem;
  try {
    olxParser = new OLXParser(rawOLX);
    parsedProblem = olxParser.getParsedOLXData();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('The Problem Could Not Be Parsed from OLX. redirecting to Advanced editor.', error);
    return { problemType: ProblemTypeKeys.ADVANCED, rawOLX, settings: parseSettings(rawSettings, defaultSettings) };
  }
  if (parsedProblem?.problemType === ProblemTypeKeys.ADVANCED) {
    return { problemType: ProblemTypeKeys.ADVANCED, rawOLX, settings: parseSettings(rawSettings, defaultSettings) };
  }
  const { settings, ...data } = parsedProblem;
  const parsedSettings = { ...settings, ...parseSettings(rawSettings, defaultSettings) };
  if (!_.isEmpty(rawOLX) && !_.isEmpty(data)) {
    return { ...data, rawOLX, settings: parsedSettings };
  }
  return { settings: parsedSettings };
};

export const loadProblem = ({ rawOLX, rawSettings, defaultSettings }) => (dispatch) => {
  if (isBlankProblem({ rawOLX })) {
    dispatch(actions.problem.setEnableTypeSelection(camelizeKeys(defaultSettings)));
  } else {
    dispatch(actions.problem.load(getDataFromOlx({ rawOLX, rawSettings, defaultSettings })));
  }
};

export const fetchAdvancedSettings = ({ rawOLX, rawSettings }) => (dispatch) => {
  const advancedProblemSettingKeys = ['max_attempts', 'showanswer', 'show_reset_button', 'rerandomize'];
  dispatch(requests.fetchAdvancedSettings({
    onSuccess: (response) => {
      const defaultSettings = {};
      Object.entries(response.data).forEach(([key, value]) => {
        if (advancedProblemSettingKeys.includes(key)) {
          defaultSettings[key] = value.value;
        }
      });
      dispatch(actions.problem.updateField({ defaultSettings: camelizeKeys(defaultSettings) }));
      loadProblem({ rawOLX, rawSettings, defaultSettings })(dispatch);
    },
    onFailure: () => { loadProblem({ rawOLX, rawSettings, defaultSettings: {} })(dispatch); },
  }));
};

export const initializeProblem = (blockValue) => (dispatch) => {
  const rawOLX = _.get(blockValue, 'data.data', {});
  const rawSettings = _.get(blockValue, 'data.metadata', {});
  dispatch(fetchAdvancedSettings({ rawOLX, rawSettings }));
};

export default { initializeProblem, switchToAdvancedEditor, fetchAdvancedSettings };
