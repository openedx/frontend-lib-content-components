import React from 'react';
import { shallow } from 'enzyme';
import { selectors } from '../../data/redux';
import { formatMessage } from '../../../testUtils';
import { ErrorPage, mapStateToProps } from './ErrorPage';

jest.mock('../../data/redux', () => ({
  selectors: {
    app: {
      unitUrl: jest.fn(state => ({ unitUrl: state })),
    },
  },
}));

describe('Editor Page', () => {
  const emptyProps = {
    courseId: null,
    studioEndpointUrl: null,
    intl: { formatMessage },
  };
  const passedProps = {
    courseId: 'course-v1:edX+DemoX+Demo_Course',
    studioEndpointUrl: 'fakeurl.com',
    intl: { formatMessage },
  };
  const unitData = {
    data: {
      ancestors: [{ id: 'SomeID' }],
    },
  };

  describe('rendered with empty props', () => {
    it('should only have one button (try again)', () => {
      const wrapper = shallow(<ErrorPage {...emptyProps} />);
      const buttonText = wrapper.find('Button').text();
      expect(wrapper).toMatchSnapshot();
      expect(buttonText).toEqual('Try again');
    });
  });

  describe('rendered with courseId and studioEndpointUrl defined', () => {
    it('should only have two buttons (return to studio and try again)', () => {
      const wrapper = shallow(<ErrorPage {...passedProps} />);
      const firstButtonText = wrapper.find('Button').at(0).text();
      const secondButtonText = wrapper.find('Button').at(1).text();
      expect(wrapper).toMatchSnapshot();
      expect(firstButtonText).toBeDefined();
      expect(secondButtonText).toEqual('Try again');
    });
  });
  test('rendered correctly with expected unitData defined', () => {
    expect(shallow(<ErrorPage {...passedProps} unitData={unitData} />)).toMatchSnapshot();
  });
  describe('mapStateToProps() function', () => {
    const testState = { A: 'pple', B: 'anana', C: 'ucumber' };
    test('unitData should equal unitUrl from app.unitUrl', () => {
      expect(
        mapStateToProps(testState).unitData,
      ).toEqual(selectors.app.unitUrl(testState));
    });
  });
});
