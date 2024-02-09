import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { IconButton } from '@edx/paragon';
import * as module from '.';
import { handleCancel } from '../../../../EditorContainer/hooks';

jest.mock('../../../../EditorContainer/hooks', () => ({
  handleCancel: jest.fn().mockName('handleCancel'),
}));

describe('SelectTypeWrapper', () => {
  const props = {
    children: (<h1>test child</h1>),
    onClose: jest.fn(),
    selected: 'iMAsElecTedValUE',
  };

  test('snapshot', () => {
    expect(shallow(<module.SelectTypeWrapper {...props} />).snapshot).toMatchSnapshot();
  });

  describe('behavior', () => {
    let el;
    beforeEach(() => {
      el = shallow(<module.SelectTypeWrapper {...props} />);
    });
    test('close behavior is linked to modal onClose', () => {
      const expected = handleCancel({ onClose: props.onClose });
      expect(el.instance.findByType(IconButton)[0].props.onClick)
        .toEqual(expected);
    });
  });
});
