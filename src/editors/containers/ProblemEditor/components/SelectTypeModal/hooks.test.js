import { MockUseState } from '../../../../../testUtils';
import * as hooks from './hooks';
import { ProblemTypeKeys } from '../../../../data/constants/problem';

jest.mock('react', () => ({
  useState: (val) => ({ useState: val }),
}));

const state = new MockUseState(hooks);

describe('SelectTypeModal hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    state.mock();
  });
  afterEach(() => {
    state.restore();
  });

  describe('selectHooks', () => {
    test('selected defaults to SINGLESELECT', () => {
      expect(hooks.selectHooks().selected).toEqual(ProblemTypeKeys.SINGLESELECT);
    });
    test('setSelected sets state as expected', () => {
      const expectedArg = 'neWvAl'
      state.mockVal(state.keys.selected, 'mOcKvAl');
      hooks.selectHooks().setSelected(expectedArg);
      expect(state.setState.selected).toHaveBeenCalledWith(expectedArg);
    });
  });

  describe('onSelect', () => {
    const mockSetType = jest.fn().mockName('setProblemType');
    const mockSelected = 'vAl';
    test('setProblemType is called with selected', () => {
      hooks.onSelect(mockSetType, mockSelected)();
      expect(mockSetType).toHaveBeenCalledWith({ selected: mockSelected });
    });
  });
});
