import _ from 'lodash-es';
import { actions } from '..';
import { OLXParser } from '../../../containers/ProblemEditor/data/OLXParser';
import { parseSettings } from '../../../containers/ProblemEditor/data/SettingsParser';

export const initializeProblem = (blockValue) => (dispatch) => {
  const rawOLX = _.get(blockValue, 'data.data', {});
  const olxParser = new OLXParser(rawOLX);

  const parsedProblem = olxParser.getParsedOLXData();
  if (_.isEmpty(parsedProblem)) {
    console.log('ACtion');
    // if problem is blank, enable selection.
    dispatch(actions.problem.setEnableTypeSelection());
  }
  const { settings, ...data } = parsedProblem;
  const parsedSettings = { ...settings, ...parseSettings(_.get(blockValue, 'data.metadata', {})) };
  if (!_.isEmpty(rawOLX) && !_.isEmpty(data)) {
    dispatch(actions.problem.load({ ...data, rawOLX, parsedSettings }));
  }
};

export default { initializeProblem };
