import React from 'react';
import { shallow } from 'enzyme';
import { selectors, thunkActions } from '../../data/redux';

import { EditableHeader } from './EditableHeader';

import { HeaderTitle } from './HeaderTitle';
import { thunkActions } from '../../data/redux';

jest.mock('./EditableHeader', () => 'EditableHeader');

describe('HeaderTitle', () => {
  let props = {
    editorRef: jest.fn().mockName('args.editorRef'),
    isInitialized: false,
    setBlockTitle: jest.fn().mockName('args.setBlockTitle'),
    typeHeader: 'html',
  };
  let el;
  beforeEach(() => {
    el = shallow(<HeaderTitle {...props} />);
  });
  describe('snapshots', () => {
    test('not initialized', () => {
      expect(shallow(<HeaderTitle {...props} />)).toMatchSnapshot();
    });
    test('initialized', () => {
      expect(shallow(<HeaderTitle {...props} isInitialized />)).toMatchSnapshot();
    });
  });

  describe('mapStateToProps');

  describe('mapDispatchToProps')
  
  
  // test('snapshot: initialized and not editing', () => {
  //   expect(shallow(<HeaderTitle {...props} isInitialized />)).toMatchSnapshot();
  // });
});