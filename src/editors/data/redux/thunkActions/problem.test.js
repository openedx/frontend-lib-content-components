import { actions } from '..';
import { initializeProblem, switchToAdvancedEditor } from './problem';
import { checkboxesOLXWithFeedbackAndHintsOLX, advancedProblemOlX, blankProblemOLX } from '../../../containers/ProblemEditor/data/mockData/olxTestData';
import { ProblemTypeKeys } from '../../constants/problem';

jest.mock('..', () => ({
  actions: {
    problem: {
      load: () => {},
      setEnableTypeSelection: () => {},
      updateField: (args) => args,
    },
  },
}));

describe('problem thunkActions', () => {
  let dispatch;
  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
  });
  test('initializeProblem visual Problem :', () => {
    const blockValue = { data: { data: checkboxesOLXWithFeedbackAndHintsOLX.rawOLX } };
    initializeProblem(blockValue)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(actions.problem.load());
  });
  test('initializeProblem advanced Problem', () => {
    const blockValue = { data: { data: advancedProblemOlX.rawOLX } };
    initializeProblem(blockValue)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(actions.problem.load());
  });
  test('initializeProblem blank Problem', () => {
    const blockValue = { data: { data: blankProblemOLX.rawOLX } };
    initializeProblem(blockValue)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(actions.problem.setEnableTypeSelection());
  });
  test('switchToAdvancedEditor visual Problem', () => {
    switchToAdvancedEditor()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      actions.problem.updateField({ problemType: ProblemTypeKeys.ADVANCED }),
    );
  });
});
