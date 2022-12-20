import React from 'react';
import { MockUseState } from '../../../../../testUtils';
import * as module from './hooks';
import { AdvanceProblemKeys, AdvanceProblems, ProblemTypeKeys } from '../../../../data/constants/problem';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: (val) => ({ useState: val }),
  useEffect: jest.fn(),
}));

const state = new MockUseState(module);
const mockSetProblemType = jest.fn().mockName('setProblemType');
const mockUpdateField = jest.fn().mockName('updateField');
const mockSelected = 'vAl';
const mockAdvancedSelected = 'blankadvanced';
const mockSetSelected = jest.fn().mockName('setSelected');

let hook;

describe('SelectTypeModal hooks', () => {
  beforeEach(() => {
    state.mock();
  });
  afterEach(() => {
    state.restore();
    jest.clearAllMocks();
  });

  describe('selectHooks', () => {
    beforeEach(() => {
      hook = module.selectHooks();
    })
    test('selected defaults to SINGLESELECT', () => {
      expect(hook.selected).toEqual(ProblemTypeKeys.SINGLESELECT);
    });
    test('setSelected sets state as expected', () => {
      const expectedArg = 'neWvAl'
      state.mockVal(state.keys.selected, 'mOcKvAl');
      hook.setSelected(expectedArg);
      expect(state.setState.selected).toHaveBeenCalledWith(expectedArg);
    });
  });

  describe('onSelect', () => {
    test('updateField is called with selected templated if selected is an Advanced Problem', () => {
      module.onSelect(mockSetProblemType, mockAdvancedSelected, mockUpdateField)();
      expect(mockUpdateField).toHaveBeenCalledWith({
        rawOLX: AdvanceProblems[mockAdvancedSelected].template,
      });
    });
    test('setProblemType is called with selected', () => {
      module.onSelect(mockSetProblemType, mockSelected, mockUpdateField)();
      expect(mockSetProblemType).toHaveBeenCalledWith({ selected: mockSelected });
    });
  });

  describe('useArrowNav', () => {
    document.body.innerHTML = `
      <div id="multiplechoiceresponse" />
      <div id="choiceresponse" />
      <div id="optionresponse" />
      <div id="numericalresponse" />
      <div id="stringresponse" />
      <div id="blankadvanced" />
      <div id="circuitschematic" />
      <div id="jsinputresponse" />
      <div id="customgrader" />
      <div id="draganddrop" />
      <div id="imageresponse" />
      <div id="formularesponse" />
      <div id="problemwithhint" />
    `;
    const mockKeyUp = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const mockKeyDown = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    let cb;
    let prereqs;

    describe('BLANK', () => {
      beforeEach(() => {
        module.useArrowNav(AdvanceProblemKeys.BLANK, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow does not set anything', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.BLANK, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).not.toHaveBeenCalled();
      });
      test('pressing down arrow sets CIRCUITSCHEMATIC', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.BLANK, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.CIRCUITSCHEMATIC);
      });
    });
    describe('SINGLESELECT', () => {
      beforeEach(() => {
        module.useArrowNav(ProblemTypeKeys.SINGLESELECT, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow does not set anything', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.SINGLESELECT, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).not.toHaveBeenCalled();
      });
      test('pressing down arrow sets MULTISELECT', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.SINGLESELECT, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(ProblemTypeKeys.MULTISELECT);
      });
    });
    describe('MULTISELECT', () => {
      beforeEach(() => {
        module.useArrowNav(ProblemTypeKeys.MULTISELECT, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets SINGLESELECT', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.MULTISELECT, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(ProblemTypeKeys.SINGLESELECT);
      });
      test('pressing down arrow sets DROPDOWN', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.MULTISELECT, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(ProblemTypeKeys.DROPDOWN);
      });
    });
    describe('DROPDOWN', () => {
      beforeEach(() => {
        module.useArrowNav(ProblemTypeKeys.DROPDOWN, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets MULTISELECT', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.DROPDOWN, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(ProblemTypeKeys.MULTISELECT);
      });
      test('pressing down arrow sets NUMERIC', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.DROPDOWN, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(ProblemTypeKeys.NUMERIC);
      });
    });
    describe('NUMERIC', () => {
      beforeEach(() => {
        module.useArrowNav(ProblemTypeKeys.NUMERIC, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets DROPDOWN', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.NUMERIC, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(ProblemTypeKeys.DROPDOWN);
      });
      test('pressing down arrow sets TEXTINPUT', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.NUMERIC, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(ProblemTypeKeys.TEXTINPUT);
      });
    });
    describe('TEXTINPUT', () => {
      beforeEach(() => {
        module.useArrowNav(ProblemTypeKeys.TEXTINPUT, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets NUMERIC', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([ProblemTypeKeys.TEXTINPUT, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(ProblemTypeKeys.NUMERIC);
      });
      // test('pressing down arrow does not set anything', () => {
      //   expect(React.useEffect.mock.calls.length).toEqual(1);
      //   expect(prereqs).toStrictEqual([ProblemTypeKeys.TEXTINPUT, mockSetSelected]);
      //   document.dispatchEvent(mockKeyDown);
      //   expect(mockSetSelected).not.toHaveBeenCalled();
      // });
    });
    describe('CIRCUITSCHEMATIC', () => {
      beforeEach(() => {
        module.useArrowNav(AdvanceProblemKeys.CIRCUITSCHEMATIC, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets BLANK', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.CIRCUITSCHEMATIC, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.BLANK);
      });
      test('pressing up arrow sets JSINPUT', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.CIRCUITSCHEMATIC, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.JSINPUT);
      });
    });
    describe('JSINPUT', () => {
      beforeEach(() => {
        module.useArrowNav(AdvanceProblemKeys.JSINPUT, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets CIRCUITSCHEMATIC', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.JSINPUT, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.CIRCUITSCHEMATIC);
      });
      test('pressing up arrow sets CUSTOMGRADER', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.JSINPUT, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.CUSTOMGRADER);
      });
    });
    describe('CUSTOMGRADER', () => {
      beforeEach(() => {
        module.useArrowNav(AdvanceProblemKeys.CUSTOMGRADER, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets JSINPUT', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.CUSTOMGRADER, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.JSINPUT);
      });
      test('pressing up arrow sets CUSTOMGRADER', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.CUSTOMGRADER, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.DRAGANDDROP);
      });
    });
    describe('DRAGANDDROP', () => {
      beforeEach(() => {
        module.useArrowNav(AdvanceProblemKeys.DRAGANDDROP, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets CUSTOMGRADER', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.DRAGANDDROP, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.CUSTOMGRADER);
      });
      test('pressing up arrow sets IMAGE', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.DRAGANDDROP, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.IMAGE);
      });
    });
    describe('IMAGE', () => {
      beforeEach(() => {
        module.useArrowNav(AdvanceProblemKeys.IMAGE, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets DRAGANDDROP', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.IMAGE, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.DRAGANDDROP);
      });
      test('pressing up arrow sets CUSTOMGRADER', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.IMAGE, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.FORMULA);
      });
    });
    describe('FORMULA', () => {
      beforeEach(() => {
        module.useArrowNav(AdvanceProblemKeys.FORMULA, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets IMAGE', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.FORMULA, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.IMAGE);
      });
      test('pressing up arrow sets PROBLEMWITHHINT', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.FORMULA, mockSetSelected]);
        document.dispatchEvent(mockKeyDown);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.PROBLEMWITHHINT);
      });
    });
    describe('PROBLEMWITHHINT', () => {
      beforeEach(() => {
        module.useArrowNav(AdvanceProblemKeys.PROBLEMWITHHINT, mockSetSelected);
        [cb, prereqs] = React.useEffect.mock.calls[0];
        cb();
      });
      test('pressing up arrow sets FORMULA', () => {
        expect(React.useEffect.mock.calls.length).toEqual(1);
        expect(prereqs).toStrictEqual([AdvanceProblemKeys.PROBLEMWITHHINT, mockSetSelected]);
        document.dispatchEvent(mockKeyUp);
        expect(mockSetSelected).toHaveBeenCalledWith(AdvanceProblemKeys.FORMULA);
      });
    });
  });
});
