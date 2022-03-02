import React from 'react';
import { shallow } from 'enzyme';
import { Editor, mapDispatchToProps } from './Editor';
import { thunkActions } from './data/redux';
import * as hooks from './hooks';

const prepareEditorRefSpy = jest.spyOn(hooks, 'prepareEditorRef');

const props = {
  courseId: 'course-v1:edX+DemoX+Demo_Course',
  blockType: 'html',
  blockId: 'block-v1:edX+DemoX+Demo_Course+type@html+block@030e35c4756a4ddc8d40b95fbbfff4d4',
  studioEndpointUrl: 'fakeurl.com',
  initialize: jest.fn(),
};

jest.mock('./data/redux', () => ({
  actions: {
    app: {
      initializeEditor: jest.fn().mockName('actions.app.initializeEditor'),
    },
  },
  thunkActions: {
    app: {
      initialize: jest.fn().mockName('thunkActions.app.initialize'),
    },
  },
  selectors: {
    app: {
      blockValue: jest.fn(state => ({ blockValue: state })),
    },
    requests: {
      isFailed: jest.fn((state, params) => ({ isFailed: { state, params } })),
      isFinished: jest.fn((state, params) => ({ isFailed: { state, params } })),
    },
  },
}));

describe('Editor', () => {
  describe('snapshots', () => {
    test('renders no editor when ref isnt ready', () => {
      prepareEditorRefSpy.mockImplementationOnce(
        () => ({ editorRef: null, refReady: false, setEditorRef: jest.fn() }),
      );
      expect(shallow(<Editor {...props} />)).toMatchSnapshot();
    });
    test('renders editor when ref is ready', () => {
      prepareEditorRefSpy.mockImplementationOnce(
        () => ({ editorRef: { current: 'ref' }, refReady: true, setEditorRef: jest.fn().mockName('setEditorRef') }),
      );
      expect(shallow(<Editor {...props} />)).toMatchSnapshot();
    });
    test('presents error message if no relevant editor found and ref ready', () => {
      prepareEditorRefSpy.mockImplementationOnce(
        () => ({ editorRef: { current: 'ref' }, refReady: true, setEditorRef: jest.fn().mockName('setEditorRef') }),
      );
      expect(shallow(<Editor
        {...props}
        blockType="fAkEBlock"
      />)).toMatchSnapshot();
    });
  });
  describe('mapDispatchToProps', () => {
    test('initialize from thunkActions.app.initialize', () => {
      expect(mapDispatchToProps.initialize).toEqual(thunkActions.app.initialize);
    });
  });
});
