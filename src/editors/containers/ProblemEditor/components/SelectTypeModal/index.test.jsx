import React from 'react';
import { shallow } from 'enzyme';
import * as module from '.';
import hooks from './hooks';

jest.mock('./hooks', () => ({
  selectHooks: jest.fn(() => ({
    selected: 'mOcKsELEcted',
    setSelected: jest.fn().mockName('setSelected'),
  })),
}));

describe('SelectTypeModal', () => {
  const props = {
    onClose: jest.fn(),
  };

  test('snapshot', () => {
    expect(shallow(<module.SelectTypeModal {...props} />)).toMatchSnapshot();
  });

  // describe('behavior', () => {
  //   let el;
  //   beforeEach(() => {
  //     el = shallow(<module.SelectTypeModal {...props} />)
  //   });
  //   test('close behavior is linked to modal onClose', () => {
  //     const expected = props.onClose;
  //     expect(el.find(SelectTypeWrapper).props().onClose)
  //       .toEqual(expected);
  //   });
  // });
});
