import { actions } from '..';
import * as module from './problem';
import { checkboxesOLXWithFeedbackAndHintsOLX, advancedProblemOlX, blankProblemOLX } from '../../../containers/ProblemEditor/data/mockData/olxTestData';
import { ProblemTypeKeys } from '../../constants/problem';
import { keyStore } from '../../../utils';

const mockOlx = 'SOmEVALue';
const mockBuildOlx = jest.fn(() => mockOlx);
jest.mock('../../../containers/ProblemEditor/data/ReactStateOLXParser', () => jest.fn().mockImplementation(() => ({ buildOLX: mockBuildOlx })));

jest.mock('..', () => ({
  actions: {
    problem: {
      load: () => {},
      setEnableTypeSelection: () => {},
      updateField: (args) => args,
    },
  },
}));

jest.mock('./requests', () => ({
  fetchAdvanceSettings: (args) => ({ fetchAdvanceSettings: args }),
}));

const moduleKeys = keyStore(module);

const blockValue = {
  data: {
    data: checkboxesOLXWithFeedbackAndHintsOLX.rawOLX,
    metadata: {},
  },
};

let rawOLX = blockValue.data.data;
const rawSettings = {};
const defaultSettings = { max_attempts: 1 };

describe('problem thunkActions', () => {
  let dispatch;
  let getState;
  let dispatchedAction;
  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
    getState = jest.fn(() => ({
      problem: {
      },
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('initializeProblem visual Problem :', () => {
    jest.spyOn(module, moduleKeys.fetchAdvanceSettings)
      .mockImplementation(jest.fn());
    module.initializeProblem(blockValue)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(module.fetchAdvanceSettings({
      rawOLX,
      rawSettings,
    }));
  });
  test('switchToAdvancedEditor visual Problem', () => {
    module.switchToAdvancedEditor()(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(
      actions.problem.updateField({ problemType: ProblemTypeKeys.ADVANCED, rawOlx: mockOlx }),
    );
  });
  describe('fetchAdvanceSettings', () => {
    it('dispatches fetchAdvanceSettings action', () => {
      module.fetchAdvanceSettings({ rawOLX, rawSettings })(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
      expect(dispatchedAction.fetchAdvanceSettings).not.toEqual(undefined);
    });
    it('dispatches actions.problem.updateField and loadProblem on success', () => {
      dispatch.mockClear();
      const loadProblem = jest.spyOn(module, moduleKeys.loadProblem);
      module.fetchAdvanceSettings({ rawOLX, rawSettings })(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
      dispatchedAction.fetchAdvanceSettings.onSuccess({ data: { key: 'test', max_attempts: 1 } });
      expect(loadProblem).toHaveBeenCalled();
    });
    it('calls loadProblem on failure', () => {
      const loadProblem = jest.spyOn(module, moduleKeys.loadProblem);
      module.fetchAdvanceSettings({ rawOLX, rawSettings })(dispatch);
      dispatchedAction.fetchAdvanceSettings.onFailure();
      expect(loadProblem).toHaveBeenCalled();
    });
  });
  describe('loadProblem', () => {
    test('initializeProblem advanced Problem', () => {
      rawOLX = advancedProblemOlX.rawOLX;
      module.loadProblem({ rawOLX, rawSettings, defaultSettings })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.problem.load());
    });
    test('initializeProblem blank Problem', () => {
      rawOLX = blankProblemOLX.rawOLX;
      module.loadProblem({ rawOLX, rawSettings, defaultSettings })(dispatch);
      expect(dispatch).toHaveBeenCalledWith(actions.problem.setEnableTypeSelection());
    });
  });
});
