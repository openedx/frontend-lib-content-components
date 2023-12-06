import tinyMCEEmbedIframePlugin from './embedIframePlugin';

const editorMock = {
  windowManager: {
    open: jest.fn(),
  },
  insertContent: jest.fn(),
  ui: {
    registry: {
      addButton: jest.fn(),
    },
  },
};

describe('TinyMCE Embed IFrame Plugin', () => {
  const pluginConfig = {
    title: 'Insert iframe',
    body: {
      type: 'tabpanel',
      tabs: [
        {
          title: 'General',
          items: [
            {
              type: 'input',
              name: 'source',
              label: 'Source URL',
              multiline: false,
              autofocus: true,
              required: true,
            },
            {
              type: 'selectbox',
              name: 'sizeType',
              label: 'Size',
              items: [
                { text: 'Inline Value', value: 'inline' },
                { text: 'Big embed', value: 'big' },
                { text: 'Small embed', value: 'small' },
              ],
            },

            {
              type: 'sizeinput',
              name: 'size',
              label: 'Dimensions',
            },
          ],
        },
        {
          title: 'Advanced',
          items: [
            {
              type: 'input',
              name: 'name',
              label: 'Name',
              value: '',
            },
            {
              type: 'input',
              name: 'title',
              label: 'Title',
              value: '',
            },
            {
              type: 'input',
              name: 'longDescriptionURL',
              label: 'Long description URL',
              value: '',
            },
            {
              type: 'checkbox',
              name: 'border',
              label: 'Show iframe border',
              text: 'Border',
              checked: false,
            },
            {
              type: 'checkbox',
              name: 'scrollbar',
              label: 'Enable scrollbar',
              text: 'Scrollbar',
              checked: false,
            },
          ],
        },
      ],
    },
    buttons: [
      {
        type: 'cancel',
        name: 'cancel',
        text: 'Cancel',
      },
      {
        type: 'submit',
        name: 'save',
        text: 'Save',
        primary: true,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens insert iframe modal on button action', () => {
    // Invoke the plugin
    tinyMCEEmbedIframePlugin(editorMock);

    editorMock.ui.registry.addButton.mock.calls[0][1].onAction();
    expect(editorMock.windowManager.open).toHaveBeenCalled();
  });

  it('opens insert iframe modal on button action validate onSubmit and OnChange function', () => {
    tinyMCEEmbedIframePlugin(editorMock);

    editorMock.ui.registry.addButton.mock.calls[0][1].onAction();
    expect(editorMock.windowManager.open).toHaveBeenCalledWith(
      expect.objectContaining({
        onSubmit: expect.any(Function),
        onChange: expect.any(Function),
      }),
    );
  });

  it('opens insert iframe modal on button action validate title', () => {
    tinyMCEEmbedIframePlugin(editorMock);

    editorMock.ui.registry.addButton.mock.calls[0][1].onAction();
    expect(editorMock.windowManager.open).toHaveBeenCalled();
    expect(editorMock.windowManager.open).toHaveBeenCalledWith(
      expect.objectContaining({
        title: pluginConfig.title,
      }),
    );
  });

  it('opens insert iframe modal on button action validate buttons', () => {
    tinyMCEEmbedIframePlugin(editorMock);

    editorMock.ui.registry.addButton.mock.calls[0][1].onAction();
    expect(editorMock.windowManager.open).toHaveBeenCalled();
    expect(editorMock.windowManager.open).toHaveBeenCalledWith(
      expect.objectContaining({
        buttons: pluginConfig.buttons,
      }),
    );
  });

  it('opens insert iframe modal on button action validate tabs', () => {
    tinyMCEEmbedIframePlugin(editorMock);

    editorMock.ui.registry.addButton.mock.calls[0][1].onAction();
    const [generalTab, advancedTab] = pluginConfig.body.tabs;

    expect(editorMock.windowManager.open).toHaveBeenCalled();
    expect(editorMock.windowManager.open).toHaveBeenCalledWith(
      expect.objectContaining({
        body: { type: 'tabpanel', tabs: [generalTab, advancedTab] },
      }),
    );
  });
});
