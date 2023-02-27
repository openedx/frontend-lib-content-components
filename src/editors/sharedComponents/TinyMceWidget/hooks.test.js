import { MockUseState } from '../../../testUtils';

import tinyMCE from '../../data/constants/tinyMCE';
import { keyStore } from '../../utils';
import * as appHooks from '../../hooks';
import pluginConfig from './pluginConfig';
import * as module from './hooks';

const state = new MockUseState(module);
const moduleKeys = keyStore(module);

let hook;
let output;

const mockNode = {
  src: 'sOmEuRl.cOm',
  alt: 'aLt tExt',
  width: 2022,
  height: 1619,
};

describe('TextEditor hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('state hooks', () => {
    state.testGetter(state.keys.isImageModalOpen);
    state.testGetter(state.keys.isSourceCodeModalOpen);
    state.testGetter(state.keys.imageSelection);
  });

  describe('appHooks', () => {
    it('forwards navigateCallback from appHooks', () => {
      expect(module.navigateCallback).toEqual(appHooks.navigateCallback);
    });
    it('forwards navigateTo from appHooks', () => {
      expect(module.navigateTo).toEqual(appHooks.navigateTo);
    });
    it('forwards nullMethod from appHooks', () => {
      expect(module.nullMethod).toEqual(appHooks.nullMethod);
    });
  });

  describe('non-state hooks', () => {
    beforeEach(() => { state.mock(); });
    afterEach(() => { state.restore(); });

    describe('setupCustomBehavior', () => {
      test('It calls addButton and addToggleButton in the editor, but openModal is not called', () => {
        const addButton = jest.fn();
        const addIcon = jest.fn();
        const addToggleButton = jest.fn();
        const openImgModal = jest.fn();
        const openSourceCodeModal = jest.fn();
        const setImage = jest.fn();
        const updateQuestion = jest.fn();
        const editorType = 'SOmeEDitor';
        const editor = {
          ui: { registry: { addButton, addToggleButton, addIcon } },
          on: jest.fn(),
        };
        const mockOpenModalWithImage = args => ({ openModalWithSelectedImage: args });
        const expectedSettingsAction = mockOpenModalWithImage({ editor, setImage, openImgModal });
        const toggleCodeFormatting = expect.any(Function);
        const toggleLabelFormatting = expect.any(Function);
        const setupCodeFormatting = expect.any(Function);
        jest.spyOn(module, moduleKeys.openModalWithSelectedImage)
          .mockImplementationOnce(mockOpenModalWithImage);
        output = module.setupCustomBehavior({
          editorType,
          updateQuestion,
          openImgModal,
          openSourceCodeModal,
          setImage,
        })(editor);
        expect(addIcon.mock.calls).toEqual([['textToSpeech',
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 22C3.08333 22 2.72917 21.8542 2.4375 21.5625C2.14583 21.2708 2 20.9167 2 20.5V3.5C2 3.08333 2.14583 2.72917 2.4375 2.4375C2.72917 2.14583 3.08333 2 3.5 2H13L11.5 3.5H3.5V20.5H15.5V17H17V20.5C17 20.9167 16.8542 21.2708 16.5625 21.5625C16.2708 21.8542 15.9167 22 15.5 22H3.5ZM6 17.75V16.25H13V17.75H6ZM6 14.75V13.25H11V14.75H6ZM15.5 15L11.5 11H8V6H11.5L15.5 2V15ZM17 12.7V4.05C17.9333 4.4 18.6667 5.01667 19.2 5.9C19.7333 6.78333 20 7.65 20 8.5C20 9.35 19.7083 10.1917 19.125 11.025C18.5417 11.8583 17.8333 12.4167 17 12.7ZM17 16.25V14.7C18.1667 14.2833 19.2083 13.5333 20.125 12.45C21.0417 11.3667 21.5 10.05 21.5 8.5C21.5 6.95 21.0417 5.63333 20.125 4.55C19.2083 3.46667 18.1667 2.71667 17 2.3V0.75C18.7 1.2 20.125 2.1375 21.275 3.5625C22.425 4.9875 23 6.63333 23 8.5C23 10.3667 22.425 12.0125 21.275 13.4375C20.125 14.8625 18.7 15.8 17 16.25Z" fill="black"/></svg>',
        ]]);
        expect(addButton.mock.calls).toEqual([
          [tinyMCE.buttons.imageUploadButton, { icon: 'image', tooltip: 'Add Image', onAction: openImgModal }],
          [tinyMCE.buttons.editImageSettings, { icon: 'image', tooltip: 'Edit Image Settings', onAction: expectedSettingsAction }],
          [tinyMCE.buttons.code, { text: 'HTML', tooltip: 'Source code', onAction: openSourceCodeModal }],
          ['customLabelButton', {
            icon: 'textToSpeech',
            text: 'Label',
            tooltip: 'Apply a "Question" label to specific text, recognized by screen readers. Recommended to improve accessibility.',
            onAction: toggleLabelFormatting,
          }],
        ]);
        expect(addToggleButton.mock.calls).toEqual([
          [tinyMCE.buttons.codeBlock, {
            icon: 'sourcecode', tooltip: 'Code Block', onAction: toggleCodeFormatting, onSetup: setupCodeFormatting,
          }],
        ]);
        expect(openImgModal).not.toHaveBeenCalled();
      });
    });

    describe('parseContentForLabels', () => {
      test('it calls getContent and updateQuestion for some content', () => {
        const editor = { getContent: jest.fn(() => '<p><label>Some question label</label></p><p>some content <label>around a label</label> followed by more text</p><img src="/static/soMEImagEURl1.jpeg"/>') };
        const updateQuestion = jest.fn();
        const content = '<p><label>Some question label</label></p><p>some content </p><p><label>around a label</label></p><p> followed by more text</p><img src="/static/soMEImagEURl1.jpeg"/>';
        module.parseContentForLabels({ editor, updateQuestion });
        expect(editor.getContent).toHaveBeenCalled();
        expect(updateQuestion).toHaveBeenCalledWith(content);
      });
      test('it calls getContent and updateQuestion for empty content', () => {
        const editor = { getContent: jest.fn(() => '') };
        const updateQuestion = jest.fn();
        const content = '';
        module.parseContentForLabels({ editor, updateQuestion });
        expect(editor.getContent).toHaveBeenCalled();
        expect(updateQuestion).toHaveBeenCalledWith(content);
      });
    });

    describe('replaceStaticwithAsset', () => {
      test('it calls getContent and setContent', () => {
        const editor = { getContent: jest.fn(() => '<img src="/static/soMEImagEURl1.jpeg"/>'), setContent: jest.fn() };
        const imageUrls = [{ staticFullUrl: '/assets/soMEImagEURl1.jpeg', displayName: 'soMEImagEURl1.jpeg' }];
        module.replaceStaticwithAsset(editor, imageUrls);
        expect(editor.getContent).toHaveBeenCalled();
        expect(editor.setContent).toHaveBeenCalled();
      });
    });
    describe('setAssetToStaticUrl', () => {
      it('returns content with updated img links', () => {
        const editorValue = '<img src="/asset@asset-block/soME_ImagE_URl1"/> <a href="/asset@soMEImagEURl">testing link</a>';
        const assets = [
          { portableUrl: '/static/soMEImagEURl', displayName: 'soMEImagEURl' },
          { portableUrl: '/static/soME_ImagE_URl1', displayName: 'soME ImagE URl1' },
        ];
        const content = module.setAssetToStaticUrl({ editorValue, assets });
        expect(content).toEqual('<img src="/static/soME_ImagE_URl1"/> <a href="/static/soMEImagEURl">testing link</a>');
      });
    });
    describe('checkRelativeUrl', () => {
      test('it calls editor.on', () => {
        const editor = { on: jest.fn() };
        const imageUrls = ['soMEImagEURl1'];
        module.checkRelativeUrl(imageUrls)(editor);
        expect(editor.on).toHaveBeenCalled();
      });
    });

    describe('editorConfig', () => {
      const props = {
        textValue: null,
        editorType: 'text',
        lmsEndpointUrl: 'sOmEuRl.cOm',
        studioEndpointUrl: 'sOmEoThEruRl.cOm',
        images: [{ staTICUrl: '/assets/sOmEuiMAge' }],
        isLibrary: false,
      };
      const evt = 'fakeEvent';
      const editor = 'myEditor';
      const setupCustomBehavior = args => ({ setupCustomBehavior: args });
      beforeEach(() => {
        props.setEditorRef = jest.fn();
        props.openImgModal = jest.fn();
        props.openSourceCodeModal = jest.fn();
        props.initializeEditor = jest.fn();
        props.updateQuestion = jest.fn();
        jest.spyOn(module, moduleKeys.setupCustomBehavior)
          .mockImplementationOnce(setupCustomBehavior);
        output = module.editorConfig(props);
      });
      describe('text editor plugins and toolbar', () => {
        test('It configures plugins and toolbars correctly', () => {
          expect(output.init.plugins).toEqual(pluginConfig({ isLibrary: props.isLibrary }).plugins);
          expect(output.init.imagetools_toolbar).toEqual(pluginConfig({ isLibrary: props.isLibrary }).imageToolbar);
          expect(output.init.toolbar).toEqual(pluginConfig({ isLibrary: props.isLibrary }).toolbar);
          Object.keys(pluginConfig({ isLibrary: props.isLibrary }).config).forEach(key => {
            expect(output.init[key]).toEqual(pluginConfig({ isLibrary: props.isLibrary }).config[key]);
          });
          // Commented out as we investigate whether this is only needed for image proxy
          // expect(output.init.imagetools_cors_hosts).toMatchObject([props.lmsEndpointUrl]);
        });
      });
      describe('text editor plugins and toolbar for content library', () => {
        test('It configures plugins and toolbars correctly', () => {
          const pluginProps = {
            isLibrary: true,
          };
          output = module.editorConfig({...props, isLibrary: true});
          expect(output.init.plugins).toEqual(pluginConfig(pluginProps).plugins);
          expect(output.init.imagetools_toolbar).toEqual(pluginConfig(pluginProps).imageToolbar);
          expect(output.init.toolbar).toEqual(pluginConfig(pluginProps).toolbar);
          Object.keys(pluginConfig(pluginProps).config).forEach(key => {
            expect(output.init[key]).toEqual(pluginConfig(pluginProps).config[key]);
          });
        });
      });
      describe('problem editor plugins and toolbar', () => {
        test('It configures plugins and toolbars correctly', () => {
          const pluginProps = {
            isLibrary: props.isLibrary,
            editorType: 'problem',
            placeholder: 'soMEtExT',
          };
          output = module.editorConfig({
            ...props,
            editorType: 'problem',
            placeholder: 'soMEtExT',
          });
          expect(output.init.plugins).toEqual(pluginConfig(pluginProps).plugins);
          expect(output.init.imagetools_toolbar).toEqual(pluginConfig(pluginProps).imageToolbar);
          expect(output.init.toolbar).toEqual(pluginConfig(pluginProps).toolbar);
          Object.keys(pluginConfig(pluginProps).config).forEach(key => {
            expect(output.init[key]).toEqual(pluginConfig(pluginProps).config[key]);
          });
        });
      });
      test('It creates an onInit which calls initializeEditor and setEditorRef', () => {
        output.onInit(evt, editor);
        expect(props.setEditorRef).toHaveBeenCalledWith(editor);
        expect(props.initializeEditor).toHaveBeenCalled();
      });
      test('It sets the blockvalue to be empty string by default', () => {
        expect(output.initialValue).toBe('');
      });
      test('It sets the blockvalue to be the blockvalue if nonempty', () => {
        const textValue = 'SomE hTML content';
        output = module.editorConfig({ ...props, textValue });
        expect(output.initialValue).toBe(textValue);
      });

      // test('It configures plugins and toolbars correctly', () => {
      //   expect(output.init.plugins).toEqual('autoresize');
      //   expect(output.init.toolbar).toEqual(`${pluginConfig().toolbar} | customLabelButton`);
      // });
      it('calls setupCustomBehavior on setup', () => {
        expect(output.init.setup).toEqual(
          setupCustomBehavior({
            editorType: props.editorType,
            updateQuestion: props.updateQuestion,
            openImgModal: props.openImgModal,
            openSourceCodeModal: props.openSourceCodeModal,
            setImage: props.setSelection,
          }),
        );
      });
    });

    describe('imgModalToggle', () => {
      const hookKey = state.keys.isImageModalOpen;
      beforeEach(() => {
        hook = module.imgModalToggle();
      });
      test('isOpen: state value', () => {
        expect(hook.isImgOpen).toEqual(state.stateVals[hookKey]);
      });
      test('openModal: calls setter with true', () => {
        hook.openImgModal();
        expect(state.setState[hookKey]).toHaveBeenCalledWith(true);
      });
      test('closeModal: calls setter with false', () => {
        hook.closeImgModal();
        expect(state.setState[hookKey]).toHaveBeenCalledWith(false);
      });
    });

    describe('sourceCodeModalToggle', () => {
      const editorRef = { current: { focus: jest.fn() } };
      const hookKey = state.keys.isSourceCodeModalOpen;
      beforeEach(() => {
        hook = module.sourceCodeModalToggle(editorRef);
      });
      test('isOpen: state value', () => {
        expect(hook.isSourceCodeOpen).toEqual(state.stateVals[hookKey]);
      });
      test('openModal: calls setter with true', () => {
        hook.openSourceCodeModal();
        expect(state.setState[hookKey]).toHaveBeenCalledWith(true);
      });
      test('closeModal: calls setter with false', () => {
        hook.closeSourceCodeModal();
        expect(state.setState[hookKey]).toHaveBeenCalledWith(false);
      });
    });

    describe('openModalWithSelectedImage', () => {
      test('image is set to be value stored in editor, modal is opened', () => {
        const setImage = jest.fn();
        const openImgModal = jest.fn();
        const editor = { selection: { getNode: () => mockNode } };
        module.openModalWithSelectedImage({ editor, openImgModal, setImage })();
        expect(setImage).toHaveBeenCalledWith({
          externalUrl: mockNode.src,
          altText: mockNode.alt,
          width: mockNode.width,
          height: mockNode.height,
        });
        expect(openImgModal).toHaveBeenCalled();
      });
    });
    describe('selectedImage hooks', () => {
      const val = { a: 'VaLUe' };
      beforeEach(() => {
        hook = module.selectedImage(val);
      });
      test('selection: state value', () => {
        expect(hook.selection).toEqual(state.stateVals[state.keys.imageSelection]);
      });
      test('setSelection: setter for value', () => {
        expect(hook.setSelection).toEqual(state.setState[state.keys.imageSelection]);
      });
      test('clearSelection: calls setter with null', () => {
        expect(hook.setSelection).not.toHaveBeenCalled();
        hook.clearSelection();
        expect(hook.setSelection).toHaveBeenCalledWith(null);
      });
    });
  });
});
