import React from 'react';
import { hooks } from './index';

jest.mock('react', () => {
  const updateState = jest.fn();
  return {
    ...jest.requireActual('react'),
    updateState,
    useState: jest.fn(val => ([{ state: val }, (newVal) => updateState({ val, newVal })])),
    createRef: jest.fn(val => ({ ref: val })),
  };
});

describe('Image Settings Page', () => {
  describe('Image Settings hooks', () => {
    describe('dimensions', () => {
      const height = 1;
      const width = 5;
      let output;
      beforeEach(() => {
        output = hooks.dimensions();
      });
      afterEach(() => {
        jest.clearAllMocks();
      });
      test('It by default returns default values of null', () => {
        expect(output.value).toMatchObject({ state: null });
      });
      test('Calling intialize sets dimentsions and base state', () => {
        expect(output.value).toMatchObject({ state: null });
        output.initialize({ height, width });
        expect(React.updateState.mock.calls).toEqual([
          [{ newVal: { height, width }, val: null }],
          [{ newVal: { height, width }, val: null }],
        ]);
      });
      test('Calling setHeight just updates the height', () => {
        const newHeight = 6;
        output.setHeight(newHeight);
        expect(React.updateState.mock.calls).toEqual([
          [{
            newVal: { height: newHeight, state: null },
            val: null,
          }],
        ]);
      });
      test('Calling setWidth just updates the height', () => {
        const newWidth = 6;
        output.setWidth(newWidth);
        expect(React.updateState.mock.calls).toEqual([[{ newVal: { width: newWidth, state: null }, val: null }]]);
      });
      test('Calling reset resets dimensions', () => {
        const newDimensions = { height: 4, width: 3 };
        output.initialize({ height, width });
        expect(React.updateState.mock.calls).toEqual([
          [{ newVal: { height, width }, val: null }],
          [{ newVal: { height, width }, val: null }],
        ]);
        output.setHeight(newDimensions.height);
        output.setWidth(newDimensions.width);
        expect(React.updateState.mock.calls).toEqual([
          [{ newVal: { height, width }, val: null }],
          [{ newVal: { height, width }, val: null }],
          [{ newVal: { height: newDimensions.height, state: null }, val: null }],
          [{ newVal: { width: newDimensions.width, state: null }, val: null }],
        ]);
        jest.clearAllMocks();
        output.reset();
        expect(React.updateState.mock.calls).toEqual([[{ newVal: { state: null }, val: null }]]);
      });
    });
    describe('altText', () => {
      const inputAltText = 'some text';
      let output;
      test('by default returns default values with no input text', () => {
        output = hooks.altText();
        expect(output.value).toMatchObject({ state: '' });
        expect(output.isDecorative).toMatchObject({ state: false });
      });
      test('by default returns default values with input text', () => {
        output = hooks.altText(inputAltText);
        expect(output.value).toMatchObject({ state: inputAltText });
        expect(output.isDecorative).toMatchObject({ state: false });
      });
      test('Calling set updates the altText', () => {
        output = hooks.altText(inputAltText);
        const newAltText = 'nEwAltTeXt';
        jest.clearAllMocks();
        output.set(newAltText);
        expect(React.updateState.mock.calls).toEqual([[{ newVal: newAltText, val: inputAltText }]]);
      });
      test('Calling setDecorative updates the isDecorative state', () => {
        output = hooks.altText(inputAltText);
        jest.clearAllMocks();
        output.setIsDecorative(true);
        expect(React.updateState.mock.calls).toEqual([[{ newVal: true, val: false }]]);
      });
    });
    describe('onImgLoad', () => {
      const fileSelection = {
        some: 'data',
      };
      const htmlSelection = {
        height: 5,
        width: 6,
      };
      const loadedImg = {
        naturalWidth: 0,
        naturalHeight: 1,
      };
      let output;
      const initializeDimensions = jest.fn(val => ({ dimensions: val }));
      afterEach(() => {
        jest.clearAllMocks();
      });
      test('it creates a callback which calls initializeDimensions with natural dimensions if file selection', () => {
        output = hooks.onImgLoad(initializeDimensions, fileSelection);
        output({ target: loadedImg });
        expect(initializeDimensions).toBeCalledWith({ height: loadedImg.naturalHeight, width: loadedImg.naturalWidth });
      });
      test('it creates a callback which calls initializeDimensions with supplied dimensions if html selection', () => {
        output = hooks.onImgLoad(initializeDimensions, htmlSelection);
        output({ target: loadedImg });
        expect(initializeDimensions).toBeCalledWith({ height: htmlSelection.height, width: htmlSelection.width });
      });
    });
    describe('onInputChange', () => {
      let output;
      const handleValue = jest.fn(val => ({ value: val }));
      const value = 'sOme ValuE';
      const event = {
        target: {
          value,
        },
      };
      test('it creates a callback which calls input fn with event target', () => {
        output = hooks.onInputChange(handleValue);
        output(event);
        expect(handleValue).toHaveBeenCalledWith(value);
      });
    });
    describe('onCheckboxChange', () => {
      let output;
      const handleValue = jest.fn(val => ({ value: val }));
      const checked = 'sOme ValuE';
      const event = {
        target: {
          checked,
        },
      };
      test('it creates a callback which calls input fn with event target', () => {
        output = hooks.onCheckboxChange(handleValue);
        output(event);
        expect(handleValue).toHaveBeenCalledWith(checked);
      });
    });
    describe('onSave', () => {
      const mockSave = jest.fn(val => ({ save: val }));
      const dimensions = { height: 'pEpEroni', width: 'ChEEze' };
      const altText = 'SOmE sTRinG';
      const isDecorative = 'sOmE BoOLeAn';
      test('it creates a function which calls save fn with args', () => {
        hooks.onSave({
          saveToEditor: mockSave, dimensions, altText, isDecorative,
        });
        expect(mockSave).toHaveBeenCalledWith({ dimensions, altText, isDecorative });
      });
    });
  });
});
