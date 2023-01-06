import _ from 'lodash-es';
import * as requests from './requests';
import { actions } from '..';
import { OLXParser } from '../../../containers/ProblemEditor/data/OLXParser';
import { parseSettings } from '../../../containers/ProblemEditor/data/SettingsParser';
import { ProblemTypeKeys } from '../../constants/problem';
import ReactStateOLXParser from '../../../containers/ProblemEditor/data/ReactStateOLXParser';

export const switchToAdvancedEditor = () => (dispatch, getState) => {
  const state = getState();
  const reactOLXParser = new ReactStateOLXParser({ problem: state.problem });
  const rawOlx = reactOLXParser.buildOLX();
  dispatch(actions.problem.updateField({ problemType: ProblemTypeKeys.ADVANCED, rawOlx }));
};

export const initializeProblem = (blockValue) => (dispatch) => {
  const rawOLX = _.get(blockValue, 'data.data', {});
  const olxParser = new OLXParser(rawOLX);

  const parsedProblem = olxParser.getParsedOLXData();

  // if problem is blank, enable selection and return.
  if (_.isEmpty(parsedProblem)) {
    dispatch(actions.problem.setEnableTypeSelection());
    return;
  }
  // if advanced problem, we don't need to load settings.
  if (parsedProblem?.problemType === ProblemTypeKeys.ADVANCED) {
    dispatch(actions.problem.load({ ...parsedProblem, rawOLX }));
    return;
  }
  const { settings, ...data } = parsedProblem;
  const parsedSettings = { ...settings, ...parseSettings(_.get(blockValue, 'data.metadata', {})) };
  if (!_.isEmpty(rawOLX) && !_.isEmpty(data)) {
    dispatch(actions.problem.load({ ...data, rawOLX, settings: parsedSettings }));
  }
  dispatch(requests.fetchAdvanceSettings({
    onSuccess: (response) => {
      if (response.data.allow_unsupported_xblocks.value) {
        console.log(response.allow_unsupported_xblocks.value);
      }
    },
  }));
};

export default { initializeProblem, switchToAdvancedEditor };
