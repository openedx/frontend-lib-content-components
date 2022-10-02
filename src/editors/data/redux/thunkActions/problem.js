import { isEmpty, get } from 'lodash-es';
import { actions } from '..';
import { parseMarkdown } from '../../../containers/ProblemEditor/data/MarkDownParser';
import { parseSettings } from '../../../containers/ProblemEditor/data/SettingsParser';

export const initializeProblem = (blockValue) => (dispatch) => {

  const rawOLX = get(blockValue, 'data.data', {})
  const parsedData = get(blockValue, 'data.metadata.markdown', {})
  if (!isEmpty(parsedData) && !isEmpty(rawOLX)) {
    let { settings, ...mkdownPayload } = parseMarkdown(parsedData)
    settings = { ...settings, ...parseSettings(get(blockValue, 'data.metadata', {})) }
    dispatch(actions.problem.load({ ...mkdownPayload, rawOLX, settings }));
  }
};

export default { initializeProblem };
