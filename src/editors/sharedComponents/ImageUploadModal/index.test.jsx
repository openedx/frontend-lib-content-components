import React from 'react';
import { shallow } from 'enzyme';

import { keyStore } from '../../utils';
import tinyMCEKeys from '../../data/constants/tinyMCE';

import * as module from '.';

jest.mock('./ImageSettingsModal', () => 'ImageSettingsModal');
jest.mock('./SelectImageModal', () => 'SelectImageModal');

const { ImageUploadModal } = module;
const hookKeys = keyStore(module.hooks);

const settings = {
  altText: 'aLt tExt',
  isDecorative: false,
  dimensions: {
    width: 2022,
    height: 1619,
  },
};

const mockImage = {
  displayName: 'DALL·E 2023-03-10.png',
  contentType: 'image/png',
  dateAdded: 1682009100000,
  url: '/asset-v1:TestX+Test01+Test0101+type@asset+block@DALL_E_2023-03-10.png',
  externalUrl: 'http://localhost:18000/asset-v1:TestX+Test01+Test0101+type@asset+block@DALL_E_2023-03-10.png',
  portableUrl: '/static/DALL_E_2023-03-10.png',
  thumbnail: '/asset-v1:TestX+Test01+Test0101+type@thumbnail+block@DALL_E_2023-03-10.jpg',
  locked: false,
  staticFullUrl: '/assets/courseware/v1/af2bf9ac70804e54c534107160a8e51e/asset-v1:TestX+Test01+Test0101+type@asset+block@DALL_E_2023-03-10.png',
  id: 'asset-v1:TestX+Test01+Test0101+type@asset+block@DALL_E_2023-03-10.png',
  width: 100,
  height: 150,
};

const mockImagesRef = { current: [mockImage] };

describe('ImageUploadModal', () => {
  describe('hooks', () => {
    describe('imgTag', () => {
      const selection = { externalUrl: 'sOmEuRl.cOm' };
      const url = 'uRl.cOm';
      const expected = {
        src: url,
        alt: settings.altText,
        width: settings.dimensions.width,
        height: settings.dimensions.height,
      };
      const testImgTag = (args) => {
        const output = module.hooks.imgTag({
          settings: args.settings,
          selection,
          lmsEndpointUrl: 'sOmE',
        });
        expect(output).toEqual(`<img ${module.propsString(args.expected)} />`);
      };
      test('It returns a html string which matches an image tag', () => {
        testImgTag({ settings, expected });
      });
      test('If isDecorative is true, alt text is an empty string', () => {
        testImgTag({
          settings: { ...settings, isDecorative: true },
          expected: { ...expected, alt: '' },
        });
      });
    });
    describe('createSaveCallback', () => {
      const close = jest.fn();
      const execCommandMock = jest.fn();
      const editorRef = { current: { some: 'dATa', execCommand: execCommandMock } };
      const setSelection = jest.fn();
      const selection = { externalUrl: 'sOmEuRl.cOm' };
      const lmsEndpointUrl = 'sOmE';
      const images = mockImagesRef;
      let output;
      beforeEach(() => {
        output = module.hooks.createSaveCallback({
          close, settings, images, editorRef, setSelection, selection, lmsEndpointUrl,
        });
      });
      afterEach(() => {
        jest.clearAllMocks();
      });
      test('It creates a callback, that when called, inserts to the editor, sets the selection to be null, and calls close', () => {
        jest.spyOn(module.hooks, hookKeys.imgTag)
          .mockImplementationOnce((props) => ({ selection, settings: props.settings, lmsEndpointUrl }));
        expect(execCommandMock).not.toBeCalled();
        expect(setSelection).not.toBeCalled();
        expect(close).not.toBeCalled();
        output(settings);
        expect(execCommandMock).toBeCalledWith(
          tinyMCEKeys.commands.insertContent,
          false,
          { selection, settings, lmsEndpointUrl },
        );
        expect(setSelection).toBeCalledWith({
          altText: settings.altText,
          externalUrl: selection.externalUrl,
          width: settings.dimensions.width,
          height: settings.dimensions.height,
        });
        expect(close).toBeCalled();
      });
    });
    describe('onClose', () => {
      it('takes and calls clearSelection and close callbacks', () => {
        const clearSelection = jest.fn();
        const close = jest.fn();
        module.hooks.onClose({ clearSelection, close })();
        expect(clearSelection).toHaveBeenCalled();
        expect(close).toHaveBeenCalled();
      });
    });
  });

  describe('component', () => {
    let props;
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
        lmsEndpointUrl: 'sOmE',
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
