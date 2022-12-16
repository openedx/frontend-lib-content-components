import React from 'react';
import { shallow } from 'enzyme';

import { Button } from '@edx/paragon';
import * as module from './SelectTypeFooter';
import hooks from '../hooks';
import { actions } from '../../../../../data/redux';

jest.mock('../hooks', () => ({
  onSelect: jest.fn().mockName('onSelect'),
}));

describe('SelectTypeFooter', () => {
  const props = {
    onCancel: jest.fn(),
    selected: null,
    setProblemType: jest.fn(),
  };

  test('snapshot', () => {
    expect(shallow(<module.SelectTypeFooter {...props} />)).toMatchSnapshot();
  });

  describe('behavior', () => {
    let el;
    beforeEach(() => {
      el = shallow(<module.SelectTypeFooter {...props} />);
    });
    test('close behavior is linked to modal onCancel', () => {
      const expected = props.onCancel;
      expect(el.find(Button).first().props().onClick)
        .toEqual(expected);
    });
    test('select behavior is linked to modal onSelect', () => {
      const expected = hooks.onSelect(props.setProblemType, props.selected);
      expect(el.find(Button).last().props().onClick)
        .toEqual(expected);
    });
  });

  describe('mapStateToProps', () => {
    test('is empty', () => {
      expect(module.mapStateToProps()).toEqual({});
    })
  });
  describe('mapDispatchToProps', () => {
    test('loads setProblemType from problem.setProblemType actions', () => {
      expect(module.mapDispatchToProps.setProblemType).toEqual(actions.problem.setProblemType);
    });
  });
});
