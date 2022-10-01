import { isEmpty, get } from 'lodash-es';
import { actions } from '..';
import { parseMarkdown } from '../../../containers/ProblemEditor/data/MarkDownParser';
import { parseSettings } from '../../../containers/ProblemEditor/data/SettingsParser';

export const initializeProblem = (blockValue) => (dispatch) => {

  const rawOLX = get(blockValue, 'data.data', {})
  const parsedData = get(blockValue, 'data.metadata.markdown', {})
  if (!isEmpty(parsedData) && !isEmpty(rawOLX)) {
    const settings = parseSettings(get(blockValue, 'data.metadata', {}))
    dispatch(actions.problem.load({ ...parseMarkdown(parsedData), rawOLX, settings }));
  }
};

export default { initializeProblem };
