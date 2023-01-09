import _ from 'lodash-es';
import * as requests from './requests';
import { actions } from '..';
import { OLXParser } from '../../../containers/ProblemEditor/data/OLXParser';
import { parseSettings } from '../../../containers/ProblemEditor/data/SettingsParser';
import { ProblemTypeKeys } from '../../constants/problem';
import ReactStateOLXParser from '../../../containers/ProblemEditor/data/ReactStateOLXParser';
import { blankProblemOLX } from '../../../containers/ProblemEditor/data/mockData/olxTestData';

export const switchToAdvancedEditor = () => (dispatch, getState) => {
  const state = getState();
  const reactOLXParser = new ReactStateOLXParser({ problem: state.problem });
  const rawOlx = reactOLXParser.buildOLX();
  dispatch(actions.problem.updateField({ problemType: ProblemTypeKeys.ADVANCED, rawOlx }));
};

export const isBlankProblem = ({ rawOLX }) => {
  if (rawOLX === blankProblemOLX.rawOLX) {
    return true;
  }
  return false;
};

export const getDataFromOlx = ({ rawOLX, rawSettings }) => {
  let olxParser;
  let parsedProblem;
  try {
    olxParser = new OLXParser(rawOLX);
    parsedProblem = olxParser.getParsedOLXData();
  } catch {
    console.error('The Problem Could Not Be Parsed from OLX. redirecting to Advanced editor.');
    return { problemType: ProblemTypeKeys.ADVANCED, rawOLX, settings: parseSettings(rawSettings) };
  }
  if (parsedProblem?.problemType === ProblemTypeKeys.ADVANCED) {
    console.log(parsedProblem?.problemType);
    return { problemType: ProblemTypeKeys.ADVANCED, rawOLX, settings: parseSettings(rawSettings) };
  }
  const { settings, ...data } = parsedProblem;
  const parsedSettings = { ...settings, ...parseSettings(rawSettings) };
  if (!_.isEmpty(rawOLX) && !_.isEmpty(data)) {
    return { ...data, rawOLX, settings: parsedSettings };
  }
};

export const initializeProblem = (blockValue) => (dispatch) => {
  console.log('Start Here');
  const rawOLX = _.get(blockValue, 'data.data', {});
  const rawSettings = _.get(blockValue, 'data.metadata', {});
  console.log({ rawOLX, rawSettings });

  if (isBlankProblem({ rawOLX })) {
    dispatch(actions.problem.setEnableTypeSelection());
  } else {
    dispatch(actions.problem.load(getDataFromOlx({ rawOLX, rawSettings })));
  }
};

export default { initializeProblem, switchToAdvancedEditor };
