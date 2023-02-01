import React from 'react';
import { shallow } from 'enzyme';

import { thunkActions, selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';
import { ProblemEditor, mapStateToProps, mapDispatchToProps } from '.';

jest.mock('./components/EditProblemView', () => 'EditProblemView');
jest.mock('./components/SelectTypeModal', () => 'SelectTypeModal');

jest.mock('react', () => {
  const updateState = jest.fn();
  return {
    ...jest.requireActual('react'),
    updateState,
    useState: jest.fn(val => ([{ state: val }, jest.fn().mockName('setState')])),
  };
});

jest.mock('../../data/redux', () => ({
  thunkActions: {
    problem: {
      initializeProblemEditor: jest.fn().mockName('thunkActions.problem.initializeProblem'),
    },
  },
  selectors: {
    app: {
      blockValue: jest.fn(state => ({ blockValue: state })),
    },
    problem: {
      problemType: jest.fn(state => ({ problemType: state })),
    },
    requests: {
      isFinished: jest.fn((state, params) => ({ isFailed: { state, params } })),
    },
  },
}));

describe('ProblemEditor', () => {
  const props = {
    onClose: jest.fn().mockName('props.onClose'),
    // redux
    problemType: null,
    blockValue: { data: { data: 'eDiTablE Text' } },
    blockFinished: false,
    studioViewFinished: false,
    initializeProblemEditor: jest.fn().mockName('args.intializeProblemEditor'),
  };
  describe('snapshots', () => {
    test('renders as expected with default behavior', () => {
      expect(shallow(<ProblemEditor {...props} />)).toMatchSnapshot();
    });
    test('block not yet loaded, Spinner appears', () => {
      expect(shallow(<ProblemEditor {...props} blockFinished />)).toMatchSnapshot();
    });
    test('studio view not yet loaded, Spinner appears', () => {
      expect(shallow(<ProblemEditor {...props} studioViewFinished />)).toMatchSnapshot();
    });
    test('renders SelectTypeModal', () => {
      expect(shallow(<ProblemEditor {...props} blockFinished studioViewFinished />)).toMatchSnapshot();
    });
    test('renders EditProblemView', () => {
      expect(shallow(<ProblemEditor {...props} problemType="multiplechoiceresponse" blockFinished studioViewFinished />)).toMatchSnapshot();
    });
  });

  describe('mapStateToProps', () => {
    const testState = { A: 'pple', B: 'anana', C: 'ucumber' };
    test('blockValue from app.blockValue', () => {
      expect(
        mapStateToProps(testState).blockValue,
      ).toEqual(selectors.app.blockValue(testState));
    });
    test('problemType from problem.problemType', () => {
      expect(
        mapStateToProps(testState).problemType,
      ).toEqual(selectors.problem.problemType(testState));
    });
    test('blockFinished from requests.isFinished', () => {
      expect(
        mapStateToProps(testState).blockFinished,
      ).toEqual(selectors.requests.isFinished(testState, { requestKey: RequestKeys.fetchBlock }));
    });
    test('studioViewFinished from requests.isFinished', () => {
      expect(
        mapStateToProps(testState).studioViewFinished,
      ).toEqual(selectors.requests.isFinished(testState, { requestKey: RequestKeys.fetchStudioView }));
    });
  });
  describe('mapDispatchToProps', () => {
    test('initializeProblemEditor from thunkActions.problem.initializeProblem', () => {
      expect(mapDispatchToProps.initializeProblemEditor).toEqual(thunkActions.problem.initializeProblem);
    });
  });
});
