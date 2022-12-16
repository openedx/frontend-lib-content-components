import React from 'react';
import { mount } from 'enzyme';
import { MockUseState } from '../../../../../testUtils';
import * as hooks from './hooks';
import { SelectTypeModal } from '.';
import { ProblemTypeKeys } from '../../../../data/constants/problem';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: (val) => ({ useState: val }),
}));

const state = new MockUseState(hooks);
const mockSetProblemType = jest.fn().mockName('setProblemType');
const mockSelected = 'vAl';
const mockSetSelected = jest.fn().mockName('setSelected');

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
    test('setProblemType is called with selected', () => {
      hooks.onSelect(mockSetProblemType, mockSelected)();
      expect(mockSetProblemType).toHaveBeenCalledWith({ selected: mockSelected });
    });
  });
});
