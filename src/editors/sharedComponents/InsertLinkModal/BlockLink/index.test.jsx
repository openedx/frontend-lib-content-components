import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { formatBlockPath } from '../utils';
import BlockLink from './index';

Enzyme.configure({ adapter: new Adapter() });

describe('BlockLink Component', () => {
  const defaultProps = {
    path: 'Some Path',
    onCloseLink: jest.fn(),
  };

  test('renders with default props', () => {
    const wrapper = shallow(<BlockLink {...defaultProps} />);
    expect(wrapper.text()).toContain('Some Path');
  });

  test('renders correctly with custom path', () => {
    const customProps = {
      ...defaultProps,
      path: 'Custom Path',
    };
    const wrapper = shallow(<BlockLink {...customProps} />);
    expect(wrapper.text()).toContain('Custom Path');
  });

  test('calls onCloseLink when the button is clicked', () => {
    const wrapper = shallow(<BlockLink {...defaultProps} />);
    wrapper.find({ 'data-testid': 'close-link-button' }).simulate('click');
    expect(defaultProps.onCloseLink).toHaveBeenCalledTimes(1);
  });

  test('renders with valid title and subtitle', () => {
    const customProps = {
      path: 'Root Section / Child 1',
      onCloseLink: jest.fn(),
    };
    const wrapper = shallow(<BlockLink {...customProps} />);
    const { title, subTitle } = formatBlockPath(customProps.path);

    expect(wrapper.text()).toContain(title);
    expect(wrapper.text()).toContain(subTitle);
  });
});
