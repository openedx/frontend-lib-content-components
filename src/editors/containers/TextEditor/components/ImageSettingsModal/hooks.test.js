import React from 'react';
import { StrictDict } from '../../../../utils';
import { MockUseState } from '../../../../../testUtils';
import * as hooks from './hooks';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: jest.fn(),
  useState: (val) => ({ useState: val }),
}));

const simpleDims = { width: 3, height: 4 };
const reducedDims = { width: 7, height: 13 };
const gcd = 7;
const multiDims = {
  width: reducedDims.width * gcd,
  height: reducedDims.height * gcd,
};

const state = new MockUseState(hooks);

const hookKeys = StrictDict(Object.keys(hooks).reduce(
  (obj, key) => ({ ...obj, [key]: key }),
  {},
));

let hook;

const testVal = 'MY test VALUE';

describe('state values', () => {
  const testStateMethod = (key) => {
    expect(hooks.state[key](testVal)).toEqual(React.useState(testVal));
  };
  test('provides altText state value', () => testStateMethod(state.keys.altText));
  test('provides dimensions state value', () => testStateMethod(state.keys.dimensions));
  test('provides showDismissibleError state value', () => testStateMethod(state.keys.showDismissibleError));
  test('provides showSubmissionError state value', () => testStateMethod(state.keys.showSubmissionError));
  test('provides isDecorative state value', () => testStateMethod(state.keys.isDecorative));
  test('provides isLocked state value', () => testStateMethod(state.keys.isLocked));
  test('provides local state value', () => testStateMethod(state.keys.local));
  test('provides lockDims state value', () => testStateMethod(state.keys.lockDims));
  test('provides lockInitialized state value', () => testStateMethod(state.keys.lockInitialized));
});

describe('ImageSettingsModal hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('dimensions-related hooks', () => {
    describe('getValidDimensions', () => {
      it('returns local dimensions if not locked', () => {
        expect(hooks.getValidDimensions({
          dimensions: simpleDims,
          local: reducedDims,
          isLocked: false,
          lockDims: simpleDims,
        })).toEqual(reducedDims);
      });
      it('returns local dimensions if the same as stored', () => {
        expect(hooks.getValidDimensions({
          dimensions: simpleDims,
          local: simpleDims,
          isLocked: true,
          lockDims: reducedDims,
        })).toEqual(simpleDims);
      });
      describe('decreasing change when at minimum valid increment', () => {
        it('returns current dimensions', () => {
          const dimensions = { ...reducedDims };
          const lockDims = { ...dimensions };
          let local = { ...dimensions, width: dimensions.width - 1 };
          expect(
            hooks.getValidDimensions({
              dimensions,
              isLocked: true,
              local,
              lockDims,
            }),
          ).toEqual(dimensions);
          local = { ...dimensions, height: dimensions.height - 1 };
          expect(
            hooks.getValidDimensions({
              dimensions,
              isLocked: true,
              local,
              lockDims,
            }),
          ).toEqual(dimensions);
        });
      });
      describe('valid change', () => {
        it(
          'returns the nearest valid pair of dimensions in the change direction',
          () => {
            const [w, h] = [7, 13];
            const values = [
              // bumps up if direction is up but nearest is current
              [[w + 1, h], [w * 2, h * 2]],
              [[w + 1, h], [w * 2, h * 2]],
              // bumps up if just below next
              [[w, 2 * h - 1], [w * 2, h * 2]],
              [[w, 2 * h - 1], [w * 2, h * 2]],
              // rounds down to next if that is closest
              [[w, 2 * h + 1], [w * 2, h * 2]],
              [[w, 2 * h + 1], [w * 2, h * 2]],
              // ensure is not locked to second iteration, by getting close to 3rd
              [[w, 3 * h - 1], [w * 3, h * 3]],
              [[w, 3 * h - 1], [w * 3, h * 3]],
            ];
            values.forEach(([local, expected]) => {
              const dimensions = { width: w, height: h };
              expect(hooks.getValidDimensions({
                dimensions,
                local: { width: local[0], height: local[1] },
                lockDims: { ...dimensions },
                isLocked: true,
              })).toEqual({ width: expected[0], height: expected[1] });
            });
          },
        );
      });
    });
    describe('dimensionLockHooks', () => {
      beforeEach(() => {
        state.mock();
        hook = hooks.dimensionLockHooks({ dimensions: simpleDims });
      });
      afterEach(() => {
        state.restore();
      });
      test('lockDims defaults to null', () => {
        expect(hook.lockDims).toEqual(null);
      });
      test('isLocked defaults to true', () => {
        expect(hook.isLocked).toEqual(true);
      });
      describe('initializeLock', () => {
        it('calls setLockDims with the passed dimensions divided by their gcd', () => {
          hook.initializeLock(multiDims);
          expect(state.setState.lockDims).toHaveBeenCalledWith(reducedDims);
        });
        it('returns the values themselves if they have no gcd', () => {
          jest.spyOn(hooks, hookKeys.findGcd).mockReturnValueOnce(2);
          hook.initializeLock(simpleDims);
          expect(state.setState.lockDims).toHaveBeenCalledWith(simpleDims);
        });
      });
      test('lock sets isLocked to true', () => {
        hook = hooks.dimensionLockHooks({ dimensions: simpleDims });
        hook.lock();
        expect(state.setState.isLocked).toHaveBeenCalledWith(true);
      });
      test('unlock sets locked to null', () => {
        hook = hooks.dimensionLockHooks({ dimensions: simpleDims });
        hook.unlock();
        expect(state.setState.isLocked).toHaveBeenCalledWith(false);
      });
    });
    describe('dimensionHooks', () => {
      let lockHooks;
      beforeEach(() => {
        state.mock();
        lockHooks = {
          initializeLock: jest.fn(),
          lock: jest.fn(),
          unlock: jest.fn(),
          locked: { ...reducedDims },
        };
        jest.spyOn(hooks, hookKeys.dimensionLockHooks).mockReturnValueOnce(lockHooks);
        hook = hooks.dimensionHooks();
      });
      afterEach(() => {
        state.restore();
      });
      it('initializes dimension lock hooks with incoming dimension value', () => {
        state.mockVal(state.keys.dimensions, reducedDims, state.setState.local);
        hook = hooks.dimensionHooks();
        expect(hooks.dimensionLockHooks).toHaveBeenCalledWith({ dimensions: reducedDims });
      });
      test('value is tied to local state', () => {
        state.mockVal(state.keys.local, simpleDims, state.setState.local);
        hook = hooks.dimensionHooks();
        expect(hook.value).toEqual(simpleDims);
      });
      describe('onImgLoad', () => {
        const img = { naturalHeight: 200, naturalWidth: 345 };
        const evt = { target: img };
        it('calls initializeDimensions with selection dimensions if passed', () => {
          hook.onImgLoad(simpleDims)(evt);
          expect(state.setState.dimensions).toHaveBeenCalledWith(simpleDims);
          expect(state.setState.local).toHaveBeenCalledWith(simpleDims);
        });
        it('calls initializeDimensions with target image dimensions if no selection', () => {
          hook.onImgLoad({})(evt);
          const expected = { width: img.naturalWidth, height: img.naturalHeight };
          expect(state.setState.dimensions).toHaveBeenCalledWith(expected);
          expect(state.setState.local).toHaveBeenCalledWith(expected);
        });
        it('calls initializeLock', () => {
          const initializeDimensions = jest.fn();
          hook.onImgLoad(initializeDimensions, simpleDims)(evt);
          expect(lockHooks.initializeLock).toHaveBeenCalled();
        });
      });
      describe('setHeight', () => {
        it('sets local height to int value of argument', () => {
          state.mockVal(state.keys.local, simpleDims, state.setState.local);
          hooks.dimensionHooks().setHeight('23.4');
          expect(state.setState.local).toHaveBeenCalledWith({ ...simpleDims, height: 23 });
        });
      });
      describe('setWidth', () => {
        it('sets local width to int value of argument', () => {
          state.mockVal(state.keys.local, simpleDims, state.setState.local);
          hooks.dimensionHooks().setWidth('34.5');
          expect(state.setState.local).toHaveBeenCalledWith({ ...simpleDims, width: 34 });
        });
      });
      describe('updateDimensions', () => {
        it('sets local and stored dimensions to newDimensions output', () => {
          // store values we care about under height or width, and add junk data to be stripped out.
          const testDims = (args) => ({ ...simpleDims, height: args });
          const getValidDimensions = (args) => ({ ...testDims(args), junk: 'data' });
          state.mockVal(state.keys.isLocked, true);
          state.mockVal(state.keys.dimensions, simpleDims);
          state.mockVal(state.keys.lockDims, reducedDims);
          state.mockVal(state.keys.local, multiDims);
          jest.spyOn(hooks, hookKeys.getValidDimensions).mockImplementationOnce(getValidDimensions);
          hook = hooks.dimensionHooks();
          hook.updateDimensions();
          const expected = testDims({
            dimensions: simpleDims,
            lockDims: reducedDims,
            local: multiDims,
            isLocked: true,
          });
          expect(state.setState.local).toHaveBeenCalledWith(expected);
          expect(state.setState.dimensions).toHaveBeenCalledWith(expected);
        });
      });
    });
  });
  describe('altTextHooks', () => {
    const value = 'myVAL';
    const isDecorative = 'IS WE Decorating?';
    const showDismissibleError = false;
    const showSubmissionError = true;
    it('returns value, isDecorative and error props, along with associated setters', () => {
      state.mock();
      state.mockVal(state.keys.altText, value, state.setState.altText);
      state.mockVal(state.keys.isDecorative, isDecorative, state.setState.isDecorative);
      state.mockVal(state.keys.showDismissibleError, showDismissibleError, state.setState.showDismissibleError);
      state.mockVal(state.keys.showSubmissionError, showSubmissionError, state.setState.showSubmissionError);
      hook = hooks.altTextHooks();
      expect(hook.value).toEqual(value);
      expect(hook.isDecorative).toEqual(isDecorative);
      expect(hook.errorProps.isError).toEqual(showDismissibleError);
      expect(hook.errorProps.showSubmissionError).toEqual(showSubmissionError);
      expect(hook.errorProps.setShowSubmissionError).toEqual(state.setState.showSubmissionError);
    });
    test('setValue sets value', () => {
      hook.setValue(value);
      expect(state.setState.altText).toHaveBeenCalledWith(value);
    });
    test('setIsDecorative sets isDecorative', () => {
      hook.setIsDecorative(isDecorative);
      expect(state.setState.isDecorative).toHaveBeenCalledWith(isDecorative);
    });
    test('showError sets showDismissibleError to true', () => {
      hook.errorProps.showError();
      expect(state.setState.showDismissibleError).toHaveBeenCalledWith(true);
    });
    test('dismissError sets showDismissibleError to false', () => {
      hook.errorProps.dismissError();
      expect(state.setState.showDismissibleError).toHaveBeenCalledWith(false);
    });
  });
  describe('onInputChange', () => {
    it('calls handleValue with event value prop', () => {
      const value = 'TEST value';
      const onChange = jest.fn();
      hooks.onInputChange(onChange)({ target: { value } });
      expect(onChange).toHaveBeenCalledWith(value);
    });
  });
  describe('onCheckboxChange', () => {
    it('calls handleValue with event checked prop', () => {
      const checked = 'TEST value';
      const onChange = jest.fn();
      hooks.onCheckboxChange(onChange)({ target: { checked } });
      expect(onChange).toHaveBeenCalledWith(checked);
    });
  });
  describe('checkFormValidation', () => {
    const props = {
      onAltTextFail: jest.fn().mockName('onAltTextFail'),
    };
    beforeEach(() => {
      props.altText = '';
      props.isDecorative = false;
    });
    it('calls onAltTextFail when isDecorative is false and altText is an empty string', () => {
      hooks.checkFormValidation({ ...props });
      expect(props.onAltTextFail).toHaveBeenCalled();
    });
    it('returns false when isDeocrative is false and altText is an empty string', () => {
      expect(hooks.checkFormValidation({ ...props })).toEqual(false);
    });
    it('returns true when isDecorative is true', () => {
      props.isDecorative = true;
      expect(hooks.checkFormValidation({ ...props })).toEqual(true);
    });
  });
  describe('onSaveClick', () => {
    const props = {
      altTextError: {
        showError: jest.fn().mockName('showError'),
        dismissError: jest.fn().mockName('dismissError'),
        setShowSubmissionError: jest.fn().mockName('setShowSubmissionError'),
      },
      dimensions: simpleDims,
      saveToEditor: jest.fn().mockName('saveToEditor'),
    };
    beforeEach(() => {
      props.altText = 'What is this?';
      props.isDecorative = false;
    });
    it('calls checkFormValidation', () => {
      jest.spyOn(hooks, hookKeys.checkFormValidation);
      hooks.onSaveClick({ ...props })();
      expect(hooks.checkFormValidation).toHaveBeenCalled();
    });
    it('calls saveToEditor with dimensions, altText and isDecorative when checkFormValidation is true', () => {
      jest.spyOn(hooks, hookKeys.checkFormValidation).mockReturnValueOnce(true);
      hooks.onSaveClick({ ...props })();
      expect(props.saveToEditor).toHaveBeenCalledWith({
        altText: props.altText,
        dimensions: props.dimensions,
        isDecorative: props.isDecorative,
      });
    });
    it('calls dismissError and sets showSubmissionError to false when checkFormValidation is true', () => {
      jest.spyOn(hooks, hookKeys.checkFormValidation).mockReturnValueOnce(true);
      hooks.onSaveClick({ ...props })();
      expect(props.altTextError.dismissError).toHaveBeenCalled();
      expect(props.altTextError.setShowSubmissionError).toHaveBeenCalledWith(false);
    });
    it('does not call saveEditor when checkFormValidation is false', () => {
      jest.spyOn(hooks, hookKeys.checkFormValidation).mockReturnValueOnce(false);
      hooks.onSaveClick({ ...props })();
      expect(props.saveToEditor).not.toHaveBeenCalled();
    });
  });
});
