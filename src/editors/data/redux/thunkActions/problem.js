import _ from 'lodash-es';
import { actions } from '..';
import { OLXParser } from '../../../containers/ProblemEditor/data/OLXParser';
import { parseSettings } from '../../../containers/ProblemEditor/data/SettingsParser';

export const initializeProblem = (blockValue) => (dispatch) => {
  const rawOLX = _.get(blockValue, 'data.data', {});
  const olxParser = new OLXParser(rawOLX);
  let { settings, ...data } = olxParser.getParsedOLXData();
  settings = { ...settings, ...parseSettings(_.get(blockValue, 'data.metadata', {})) }
  if (!_.isEmpty(rawOLX) && !_.isEmpty(data)) {
    dispatch(actions.problem.load({ ...data, rawOLX, settings }));
  }
};

export default { initializeProblem };
