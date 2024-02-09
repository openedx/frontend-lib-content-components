import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import EditorPage from './EditorPage';

const props = {
  courseId: 'course-v1:edX+DemoX+Demo_Course',
  blockType: 'html',
  blockId: 'block-v1:edX+DemoX+Demo_Course+type@html+block@030e35c4756a4ddc8d40b95fbbfff4d4',
  lmsEndpointUrl: 'evenfakerurl.com',
  studioEndpointUrl: 'fakeurl.com',
  onClose: jest.fn().mockName('props.onClose'),
};
jest.mock('react-redux', () => ({
  Provider: 'Provider',
  connect: (mapStateToProps, mapDispatchToProps) => (component) => ({
    mapStateToProps,
    mapDispatchToProps,
    component,
  }),
}));
jest.mock('./Editor', () => 'Editor');

describe('Editor Page', () => {
  describe('snapshots', () => {
    test('rendering correctly with expected Input', () => {
      expect(shallow(<EditorPage {...props} />).snapshot).toMatchSnapshot();
    });
    test('props besides blockType default to null', () => {
      expect(shallow(<EditorPage blockType={props.blockType} />).snapshot).toMatchSnapshot();
    });
  });
});
