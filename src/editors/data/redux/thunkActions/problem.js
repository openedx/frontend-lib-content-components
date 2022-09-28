import { isEmpty, get } from 'lodash-es';
import { actions } from '..';
import { OLXParser } from '../../../containers/ProblemEditor/data/OLXParser';

export const initializeProblem = (blockValue) => (dispatch) => {
  const rawOLX = get(blockValue, 'data.data', {});
  const olxParser = new OLXParser(rawOLX);
  const data = olxParser.getParsedOLXData();
  if (!isEmpty(rawOLX) && !isEmpty(data)) {
    dispatch(actions.problem.load({ ...data, rawOLX }));
  }
};

export default { initializeProblem };
