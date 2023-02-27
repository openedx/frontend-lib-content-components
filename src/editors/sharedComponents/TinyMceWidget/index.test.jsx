import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../testUtils';
import { imgModalToggle, sourceCodeModalToggle } from './hooks';
import TinyMceEditor from '.';

// Per https://github.com/tinymce/tinymce-react/issues/91 React unit testing in JSDOM is not supported by tinymce.
// Consequently, mock the Editor out.
jest.mock('@tinymce/tinymce-react', () => {
  const originalModule = jest.requireActual('@tinymce/tinymce-react');
  return {
    __esModule: true,
    ...originalModule,
    Editor: () => 'TiNYmCE EDitOR',
  };
});

jest.mock('../../containers/TextEditor/components/ImageUploadModal', () => 'ImageUploadModal');
jest.mock('../../containers/TextEditor/components/SourceCodeModal', () => 'SourceCodeModal');

jest.mock('./hooks', () => ({
  editorConfig: jest.fn(args => ({ editorConfig: args })),
  imgModalToggle: jest.fn(() => ({
    isImgOpen: true,
    openImgModal: jest.fn().mockName('openModal'),
    closeImgModal: jest.fn().mockName('closeModal'),
  })),
  sourceCodeModalToggle: jest.fn(() => ({
    isSourceCodeOpen: true,
    openSourceCodeModal: jest.fn().mockName('openModal'),
    closeSourceCodeModal: jest.fn().mockName('closeModal'),
  })),
  selectedImage: jest.fn(() => ({
    selection: 'hooks.selectedImage.selection',
    setSelection: jest.fn().mockName('hooks.selectedImage.setSelection'),
    clearSelection: jest.fn().mockName('hooks.selectedImage.clearSelection'),
  })),
  filterAssets: jest.fn(() => [{ staTICUrl: '/assets/sOmEaSsET' }]),
}));

jest.mock('react', () => {
  const updateState = jest.fn();
  return {
    ...jest.requireActual('react'),
    updateState,
    useState: jest.fn(val => ([{ state: val }, jest.fn().mockName('setState')])),
  };
});

describe('TinyMceEditor', () => {
  const props = {
    editorType: 'text',
    editorRef: { current: { value: 'something' } },
    isLibrary: false,
    assets: { sOmEaSsET: { staTICUrl: '/assets/sOmEaSsET' } },
    lmsEndpointUrl: 'sOmEvaLue.cOm',
    studioEndpointUrl: 'sOmEoThERvaLue.cOm',
  };
  describe('snapshots', () => {
    imgModalToggle.mockReturnValue({
      isImgOpen: false,
      openImgModal: jest.fn().mockName('modal.openModal'),
      closeImgModal: jest.fn().mockName('modal.closeModal'),
    });
    sourceCodeModalToggle.mockReturnValue({
      isSourceCodeOpen: false,
      openSourceCodeModal: jest.fn().mockName('modal.openModal'),
      closeSourceCodeModal: jest.fn().mockName('modal.closeModal'),
    });
    test('renders as expected with default behavior', () => {
      expect(shallow(<TinyMceEditor {...props} />)).toMatchSnapshot();
    });
    test('SourcecodeModal is not rendered', () => {
      expect(shallow(<TinyMceEditor {...props} editorType="problem" />)).toMatchSnapshot();
    });
    test('ImageUploadModal is not rendered', () => {
      expect(shallow(<TinyMceEditor {...props} isLibrary />)).toMatchSnapshot();
    });
  });

});
