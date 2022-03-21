import React from 'react';
import { shallow } from 'enzyme';

import { StrictDict } from '../../../utils';

import * as module from './ImageUploadModal';
jest.mock('./ImageSettingsModal', () => 'ImageSettingsModal');
jest.mock('./SelectImageModal', () => 'SelectImageModal');

const { ImageUploadModal } = module;

describe('ImageUploadModal hooks', () => {
  describe('getImgTag', () => {
    const selection = { externalUrl: 'sOmEuRl.cOm' };
    let settings;
    let expected;
    let output;
    test('It returns a html string which matches an image tag', () => {
      settings = {
        altText: 'aLt tExt',
        isDecorative: false,
        dimensions: {
          width: 2022,
          height: 1619,
        },
      };
      expected = {
        src: selection.externalUrl,
        alt: settings.altText,
        width: settings.dimensions.width,
        height: settings.dimensions.height,
      };
      output = module.imgTag({ selection, settings });
      expect(output).toEqual(`<img ${module.propsString(expected)} />`);
    });
    test('If Is decorative is true, alt text is an empty string', () => {
      settings = {
        isDecorative: true,
        altText: 'aLt tExt',
        dimensions: {
          width: 2022,
          height: 1619,
        },
      };
      expected = {
        src: selection.externalUrl,
        alt: '',
        width: settings.dimensions.width,
        height: settings.dimensions.height,
      };
      output = module.imgTag({
        selection: selection,
        settings: settings,
      });
      expect(output).toEqual(`<img ${module.propsString(expected)} />`);
    });
  });

  describe('createSaveCallback', () => {
    const close = jest.fn();
    const execCommandMock = jest.fn();
    const editorRef = { current: { some: 'dATa', execCommand: execCommandMock } };
    const setSelection = jest.fn();
    const selection = jest.fn();
    const settings = {
      altText: 'aLt tExt',
      isDecorative: false,
      dimensions: {
        width: 2022,
        height: 1619,
      },
    };
    let output;
    beforeEach(() => {
      output = module.hooks.createSaveCallback({
        close, editorRef, setSelection, selection,
      });
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('It creates a callback, that when called, inserts to the editor, sets the selection to be null, and calls close', () => {
      jest.spyOn(module, 'imgTag')
        .mockImplementationOnce(({ settings }) => ({ selection, settings }));
      expect(execCommandMock).not.toBeCalled();
      expect(setSelection).not.toBeCalled();
      expect(close).not.toBeCalled();
      output(settings);
      expect(execCommandMock).toBeCalledWith('mceInsertContent', false, { selection, settings: settings });
      expect(setSelection).toBeCalledWith(null);
      expect(close).toBeCalled();
    });
  });

  describe('component', () => {
    let props;
    const hookKeys = StrictDict(Object.keys(module.hooks).reduce(
      (obj, key) => ({ ...obj, [key]: jest.fn() }),
      {},
    ));
    let hooks;
    beforeAll(() => {
      hooks = module.hooks;
      props = {
        editorRef: { current: null },
        isOpen: false,
        close: jest.fn().mockName('props.close'),
        clearSelection: jest.fn().mockName('props.clearSelection'),
        selection: { some: 'images' },
        setSelection: jest.fn().mockName('props.setSelection'),
      };
      module.hooks = {
        createSaveCallback: jest.fn().mockName('hooks.createSaveCallback'),
        onClose: jest.fn().mockName('hooks.onClose'),
      };
    });
    afterAll(() => {
      module.hooks = hooks;
    });
    test('snapshot: with selection content (ImageSettingsUpload)', () => {
      expect(shallow(<ImageUploadModal {...props} />)).toMatchSnapshot();
    });
    test('snapshot: no selection (Select Image Modal)', () => {
      expect(shallow(<ImageUploadModal {...props} selection={null} />)).toMatchSnapshot();
    });
  });
});
