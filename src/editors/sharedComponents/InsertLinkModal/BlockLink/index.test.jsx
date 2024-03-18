import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import formatBlockPath from '../formatBlockPath';
import BlockLink from './index';

describe('BlockLink Component', () => {
  const defaultProps = {
    path: 'Some Path',
    onCloseLink: jest.fn(),
  };

  const renderComponent = (overrideProps = {}) => render(
    <BlockLink {...defaultProps} {...overrideProps} />,
  );

  test('renders with default props', () => {
    renderComponent();
    expect(screen.getByText('Some Path')).toBeInTheDocument();
  });

  test('snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  test('renders correctly with custom path', () => {
    const customProps = {
      ...defaultProps,
      path: 'Custom Path',
    };
    renderComponent(customProps);
    expect(screen.getByText('Custom Path')).toBeInTheDocument();
  });

  test('calls onCloseLink when the button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('close-link-button'));
    expect(defaultProps.onCloseLink).toHaveBeenCalledTimes(1);
  });

  test('renders with valid title and subtitle', () => {
    const customProps = {
      path: 'Root Section / Child 1',
      onCloseLink: jest.fn(),
    };

    renderComponent(customProps);
    const { title, subTitle } = formatBlockPath(customProps.path);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(subTitle)).toBeInTheDocument();
  });
});
