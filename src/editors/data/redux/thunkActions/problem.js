import { isEmpty, get } from 'lodash-es';
import { actions } from '..';
import { parseMarkdown } from '../../../containers/ProblemEditor/data/MarkDownParser';

export const initializeProblem = (blockValue) => (dispatch) => {
  const rawOLX = get(blockValue, 'data.data', {});
  const parsedData = get(blockValue, 'data.metadata.markdown', {});
  if (!isEmpty(parsedData) && !isEmpty(rawOLX)) {
    dispatch(actions.problem.load({ ...parseMarkdown(parsedData), rawOLX }));
  }
};

export default { initializeProblem };
