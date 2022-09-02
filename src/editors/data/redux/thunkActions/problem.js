import { actions } from '..';
import { parseMarkdown } from '../../../containers/ProblemEditor/data/MarkDownParser';
import { demoProblemData } from "../../services/cms/mockVideoData";

export const initializeProblem = (blockValue) => (dispatch) => {

    if (blockValue === null){
      return;
    }
    const problemData = blockValue.data;
    const rawOLX = problemData.data;
    const markdown = problemData.metadata.markdown;
    const parsedData = parseMarkdown(markdown);
    dispatch(actions.problem.load({...parsedData, rawOLX}));
  };

export default { initializeProblem };
