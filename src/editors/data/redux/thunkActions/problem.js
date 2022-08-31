import { useSelector } from "react-redux";
import { actions, selectors } from '..';
import { demoProblemData } from "../../services/cms/mockVideoData";

export const initialize = () => (dispatch) => {

    //const blockValue = useSelector(selectors.app.blockValue);
    //NOTE: These are to-do methods.
    //  getSettingsFromMetaData(blockValue.metadata)
    //const data = {...MarkdownParser.getProblem(blockValue.metadata.markdown)}
    //dispatch(actions.problem.initialize(data));
    dispatch(actions.problem.load(demoProblemData));
  };

export default { initialize };
