import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from '@edx/react-unit-test-utils';
import { Editor } from './Editor';
import supportedEditors from './supportedEditors';
import * as hooks from './hooks';
import { blockTypes } from './data/constants/app';

jest.mock('./hooks', () => ({
  initializeApp: jest.fn(),
}));

const initData = {
  blockId: 'block-v1:edX+DemoX+Demo_Course+type@html+block@030e35c4756a4ddc8d40b95fbbfff4d4',
  blockType: blockTypes.html,
  learningContextId: 'course-v1:edX+DemoX+Demo_Course',
  lmsEndpointUrl: 'evenfakerurl.com',
  studioEndpointUrl: 'fakeurl.com',
};
const props = {
  initialize: jest.fn(),
  onClose: jest.fn().mockName('props.onClose'),
  courseId: 'course-v1:edX+DemoX+Demo_Course',
  ...initData,
};

let el;
describe('Editor', () => {
  describe('render', () => {
    test('snapshot: renders correct editor given blockType (html -> TextEditor)', () => {
      expect(shallow(<Editor {...props} />).snapshot).toMatchSnapshot();
    });
    test('presents error message if no relevant editor found and ref ready', () => {
      expect(shallow(<Editor {...props} blockType="fAkEBlock" />).snapshot).toMatchSnapshot();
    });
    test.each(Object.values(blockTypes))('renders %p editor when ref is ready', (blockType) => {
      el = shallow(<Editor {...props} blockType={blockType} />);
      expect(el.children().children().at(0).name()).toBe(supportedEditors[blockType].displayName);
    });
  });
  describe('behavior', () => {
    it('calls initializeApp hook with dispatch, and passed data', () => {
      el = shallow(<Editor {...props} blockType={blockTypes.html} />);
      expect(hooks.initializeApp).toHaveBeenCalledWith({
        dispatch: useDispatch(),
        data: initData,
      });
    });
  });
});
