import React, { useEffect } from 'react';
import { shallow } from 'enzyme';

import {
  fireEvent, render, screen, waitFor,
} from '@testing-library/react';
import { formatMessage } from '../../../../testUtils';
import { DimensionControls } from './DimensionControls';
import hooks from './hooks';

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
    const props = {
      lockDims: { width: 12, height: 15 },
      locked: { 'props.locked': 'lockedValue' },
      isLocked: true,
      value: { width: 20, height: 40 },
      // inject
      intl: { formatMessage },
    };
    beforeEach(() => {
      jest.spyOn(hooks, 'onInputChange').mockImplementation((handler) => ({ 'hooks.onInputChange': handler }));
      props.setWidth = jest.fn().mockName('props.setWidth');
      props.setHeight = jest.fn().mockName('props.setHeight');
      props.lock = jest.fn().mockName('props.lock');
      props.unlock = jest.fn().mockName('props.unlock');
      props.updateDimensions = jest.fn().mockName('props.updateDimensions');
    });
    afterEach(() => {
      jest.spyOn(hooks, 'onInputChange').mockRestore();
    });
    test('snapshot', () => {
      expect(shallow(<DimensionControls {...props} />)).toMatchSnapshot();
    });
    test('null value: empty snapshot', () => {
      const el = shallow(<DimensionControls {...props} value={null} />);
      expect(el).toMatchSnapshot();
      expect(el.isEmptyRender()).toEqual(true);
    });
    test('unlocked dimensions', () => {
      const el = shallow(<DimensionControls {...props} isLocked={false} />);
      expect(el).toMatchSnapshot();
    });
  });
  describe('component tests for dimensions', () => {
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
});
