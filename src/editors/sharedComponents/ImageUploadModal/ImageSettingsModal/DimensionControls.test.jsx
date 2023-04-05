import React, { useEffect } from 'react';

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { formatMessage } from '../../../../testUtils';
import { DimensionControls } from './DimensionControls';
import hooks from './hooks';

/*
onImgLoad: (selection) => ({ target: img }) => {
  const imageDims = { height: img.naturalHeight, width: img.naturalWidth };
  setAll(selection.height ? selection : imageDims);
  initializeLock(imageDims);
},
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
    Control: jest.fn(({ value, onChange, onBlur }) => (
      <><h5>{value}</h5><input className="formControl" onChange={onChange} onBlur={onBlur} value={value} /></>
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
    dimensions.onImgLoad({ })({ target: { naturalWidth: 1517, naturalHeight: 803 } });
  }, []);

  return <DimensionControls {...dimensions} intl={{ formatMessage }} />;
};

const UnlockedDimensionControls = () => {
  const dimensions = hooks.dimensions('altText');

  useEffect(() => {
    dimensions.onImgLoad({ })({ target: { naturalWidth: 1517, naturalHeight: 803 } });
    dimensions.unlock();
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
    const { container } = render(<WrappedDimensionControls />);
    const widthInput = container.querySelector('.formControl');
    expect(widthInput.value).toBe('1517');
  });

  it('resizes dimensions proportionally', async () => {
    const { container } = render(<WrappedDimensionControls />);
    const widthInput = container.querySelector('.formControl');
    expect(widthInput.value).toBe('1517');
    fireEvent.change(widthInput, { target: { value: 758 } });
    await waitFor(() => {
      expect(container.querySelectorAll('.formControl')[0].value).toBe('758');
    });
    fireEvent.blur(widthInput);
    await waitFor(() => {
      expect(container.querySelectorAll('.formControl')[0].value).toBe('758');
      expect(container.querySelectorAll('.formControl')[1].value).toBe('401');
    });
    screen.debug();
  });

  it('resizes only changed dimension when unlocked', async () => {
    const { container } = render(<UnlockedDimensionControls />);
    const widthInput = container.querySelector('.formControl');
    expect(widthInput.value).toBe('1517');
    fireEvent.change(widthInput, { target: { value: 758 } });
    await waitFor(() => {
      expect(container.querySelectorAll('.formControl')[0].value).toBe('758');
    });
    fireEvent.blur(widthInput);
    await waitFor(() => {
      expect(container.querySelectorAll('.formControl')[0].value).toBe('758');
      expect(container.querySelectorAll('.formControl')[1].value).toBe('803');
    });
    screen.debug();
  });

});
