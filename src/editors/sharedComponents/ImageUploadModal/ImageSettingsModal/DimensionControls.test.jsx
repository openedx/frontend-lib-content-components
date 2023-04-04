import React, { useEffect } from 'react';

import { render, screen } from '@testing-library/react';
import { formatMessage } from '../../../../testUtils';
import { DimensionControls } from './DimensionControls';
import hooks from './hooks';

/*
import {
  Form,
  Icon,
  IconButton,
} from '@edx/paragon';
import {
  Locked,
  Unlocked,
} from '@edx/paragon/icons';
*/

jest.mock('@edx/paragon', () => ({
  __esmodule: true,
  Form: {
    Group: jest.fn(({ children }) => (
      <div>{children}</div>
    )),
    Label: jest.fn(({ children }) => (
      <div>{children}</div>
    )),
    Control: jest.fn(({ value }) => (
      <div>{value}</div>
    )),
  },
  Icon: jest.fn(({ children }) => (
    <div>{children}</div>
  )),
  IconButton: jest.fn(({ children }) => (
    <div>{children}</div>
  )),
}));

jest.mock('@edx/paragon/icons', () => ({
  __esmodule: true,
  Locked: jest.fn(),
  Unlocked: jest.fn(),
}));

const WrappedDimensionControls = () => {
  const dimensions = hooks.dimensions('altText');

  useEffect(() => {
    dimensions.onImgLoad({ width: '1517', height: '803' })({ target: {} });
  }, []);

  return <DimensionControls {...dimensions} intl={{ formatMessage }} />;
};

describe('DimensionControls', () => {
  describe('render', () => {
    test('snapshot', () => {
    });
    test('null value: empty snapshot', () => {
    });
    test('unlocked dimensions', () => {
    });
  });
  it('renders with initial dimensions', () => {
    render(<WrappedDimensionControls />);
    expect(screen.getByText('1517')).toBeDefined();
    expect(screen.getByText('803')).toBeDefined();
  });
});
