import tinyMCEStyles from '../../data/constants/tinyMCEStyles';
import pluginConfig from './pluginConfig';
import tinyMCE from '../../data/constants/tinyMCE';
import { updateImageDimensions, matchImageStringsByIdentifiers } from '../../utils/imageDimensions';

export const stringToFragment = (htmlString) => document.createRange().createContextualFragment(htmlString);

export const getImageFromHtmlString = (htmlString, imageSrc) => {
  const images = stringToFragment(htmlString)?.querySelectorAll('img') || [];

  return Array.from(images).find((img) => matchImageStringsByIdentifiers(img.src || '', imageSrc));
};

export const filterAssets = ({ assets }) => {
  let images = [];
  const assetsList = Object.values(assets);
  if (assetsList.length > 0) {
    images = assetsList.filter(asset => asset?.contentType?.startsWith('image/'));
  }
  return images;
};

export const addImagesAndDimensionsToRef = ({ imagesRef, assets, editorContentHtml }) => {
  const imagesWithDimensions = filterAssets({ assets }).map((image) => {
    const imageFragment = getImageFromHtmlString(editorContentHtml, image.url);
    return { ...image, width: imageFragment?.width, height: imageFragment?.height };
  });

  imagesRef.current = imagesWithDimensions;
};

export const detectImageMatchingError = ({ matchingImages, tinyMceHTML }) => {
  if (!matchingImages.length) { return true; }
  if (matchingImages.length > 1) { return true; }

  if (!matchImageStringsByIdentifiers(matchingImages[0].id, tinyMceHTML.src)) { return true; }
  if (!matchingImages[0].width || !matchingImages[0].height) { return true; }
  if (matchingImages[0].width !== tinyMceHTML.width) { return true; }
  if (matchingImages[0].height !== tinyMceHTML.height) { return true; }

  return false;
};

export const openModalWithSelectedImage = ({
  editor, images, setImage, openImgModal,
}) => () => {
  const tinyMceHTML = editor.selection.getNode();
  const { src: mceSrc } = tinyMceHTML;

  const matchingImages = images.current.filter(image => matchImageStringsByIdentifiers(image.id, mceSrc));

  const imageMatchingErrorDetected = detectImageMatchingError({ tinyMceHTML, matchingImages });

  const width = imageMatchingErrorDetected ? null : matchingImages[0]?.width;
  const height = imageMatchingErrorDetected ? null : matchingImages[0]?.height;

  setImage({
    externalUrl: tinyMceHTML.src,
    altText: tinyMceHTML.alt,
    width,
    height,
  });

  openImgModal();
};

// imagetools_cors_hosts needs a protocol-sanatized url
export const removeProtocolFromUrl = (url) => url.replace(/^https?:\/\//, '');

export const fetchImageUrls = (images) => {
  const imageUrls = [];
  images.current.forEach(image => {
    imageUrls.push({ staticFullUrl: image.staticFullUrl, displayName: image.displayName });
  });
  return imageUrls;
};

export const parseContentForLabels = ({ editor, updateContent }) => {
  let content = editor.getContent();
  if (content && content?.length > 0) {
    const parsedLabels = content.split(/<label>|<\/label>/gm);
    let updatedContent;
    parsedLabels.forEach((label, i) => {
      if (!label.startsWith('<') && !label.endsWith('>')) {
        let previousLabel = parsedLabels[i - 1];
        let nextLabel = parsedLabels[i + 1];
        if (!previousLabel.endsWith('<p>')) {
          previousLabel = `${previousLabel}</p><p>`;
          updatedContent = content.replace(parsedLabels[i - 1], previousLabel);
          content = updatedContent;
          updateContent(content);
        }
        if (!nextLabel.startsWith('</p>')) {
          nextLabel = `</p><p>${nextLabel}`;
          updatedContent = content.replace(parsedLabels[i + 1], nextLabel);
          content = updatedContent;
          updateContent(content);
        }
      }
    });
  } else {
    updateContent(content);
  }
};

export const replaceStaticwithAsset = ({
  editor,
  imageUrls,
  editorType,
  lmsEndpointUrl,
  updateContent,
}) => {
  let content = editor.getContent();
  const imageSrcs = content.split('src="');
  imageSrcs.forEach(src => {
    const currentContent = content;
    let staticFullUrl;
    const isStatic = src.startsWith('/static/');
    const isExpandableAsset = src.startsWith('/assets/') && editorType === 'expandable';
    if ((isStatic || isExpandableAsset) && imageUrls.length > 0) {
      const assetSrc = src.substring(0, src.indexOf('"'));
      const assetName = assetSrc.replace(/\/assets\/.+[^/]\//g, '');
      const staticName = assetSrc.substring(8);
      imageUrls.forEach((url) => {
        if (isExpandableAsset && assetName === url.displayName) {
          staticFullUrl = `${lmsEndpointUrl}${url.staticFullUrl}`;
        } else if (staticName === url.displayName) {
          staticFullUrl = url.staticFullUrl;
          if (isExpandableAsset) {
            staticFullUrl = `${lmsEndpointUrl}${url.staticFullUrl}`;
          }
        }
      });
      if (staticFullUrl) {
        const currentSrc = src.substring(0, src.indexOf('"'));
        content = currentContent.replace(currentSrc, staticFullUrl);
        if (editorType === 'expandable') {
          updateContent(content);
        } else {
          editor.setContent(content);
        }
      }
    }
  });
};

export const getImageResizeHandler = ({ editor, imagesRef, setImage }) => () => {
  const {
    src, alt, width, height,
  } = editor.selection.getNode();

  imagesRef.current = updateImageDimensions({
    images: imagesRef.current, url: src, width, height,
  }).result;

  setImage({
    externalUrl: src,
    altText: alt,
    width,
    height,
  });
};

export const setupCustomBehavior = ({
  updateContent,
  openImgModal,
  openSourceCodeModal,
  editorType,
  imageUrls,
  images,
  setImage,
  lmsEndpointUrl,
}) => (editor) => {
  // image upload button
  editor.ui.registry.addButton(tinyMCE.buttons.imageUploadButton, {
    icon: 'image',
    tooltip: 'Add Image',
    onAction: openImgModal,
  });
  // editing an existing image
  editor.ui.registry.addButton(tinyMCE.buttons.editImageSettings, {
    icon: 'image',
    tooltip: 'Edit Image Settings',
    onAction: openModalWithSelectedImage({
      editor, images, setImage, openImgModal,
    }),
  });
  // overriding the code plugin's icon with 'HTML' text
  editor.ui.registry.addButton(tinyMCE.buttons.code, {
    text: 'HTML',
    tooltip: 'Source code',
    onAction: openSourceCodeModal,
  });
  // add a custom simple inline code block formatter.
  const setupCodeFormatting = (api) => {
    editor.formatter.formatChanged(
      'code',
      (active) => api.setActive(active),
    );
  };
  const toggleCodeFormatting = () => {
    editor.formatter.toggle('code');
    editor.undoManager.add();
    editor.focus();
  };
  editor.ui.registry.addToggleButton(tinyMCE.buttons.codeBlock, {
    icon: 'sourcecode',
    tooltip: 'Code Block',
    onAction: toggleCodeFormatting,
    onSetup: setupCodeFormatting,
  });
  // add a custom simple inline label formatter.
  const toggleLabelFormatting = () => {
    editor.execCommand('mceToggleFormat', false, 'label');
  };
  editor.ui.registry.addIcon('textToSpeech', tinyMCE.textToSpeechIcon);
  editor.ui.registry.addButton('customLabelButton', {
    icon: 'textToSpeech',
    text: 'Label',
    tooltip: 'Apply a "Question" label to specific text, recognized by screen readers. Recommended to improve accessibility.',
    onAction: toggleLabelFormatting,
  });
  if (editorType === 'expandable') {
    editor.on('init', () => {
      replaceStaticwithAsset({
        editor,
        imageUrls,
        editorType,
        lmsEndpointUrl,
        updateContent,
      });
    });
  }
  editor.on('ExecCommand', (e) => {
    if (editorType === 'text' && e.command === 'mceFocus') {
      replaceStaticwithAsset({ editor, imageUrls });
    }
    if (e.command === 'RemoveFormat') {
      editor.formatter.remove('blockquote');
      editor.formatter.remove('label');
    }
  });
  // after resizing an image in the editor, synchronize React state and ref
  editor.on('ObjectResized', getImageResizeHandler({ editor, imagesRef: images, setImage }));
};

export const editorConfig = ({
  editorType,
  setEditorRef,
  editorContentHtml,
  images,
  lmsEndpointUrl,
  studioEndpointUrl,
  isLibrary,
  placeholder,
  initializeEditor,
  openImgModal,
  openSourceCodeModal,
  setSelection,
  updateContent,
  content,
  minHeight,
}) => {
  const {
    toolbar,
    config,
    plugins,
    imageToolbar,
    quickbarsInsertToolbar,
    quickbarsSelectionToolbar,
  } = pluginConfig({ isLibrary, placeholder, editorType });

  return {
    onInit: (evt, editor) => {
      setEditorRef(editor);
      if (editorType === 'text') {
        initializeEditor();
      }
    },
    initialValue: editorContentHtml || '',
    init: {
      ...config,
      skin: false,
      content_css: false,
      content_style: tinyMCEStyles,
      min_height: minHeight,
      contextmenu: 'link table',
      document_base_url: lmsEndpointUrl,
      imagetools_cors_hosts: [removeProtocolFromUrl(lmsEndpointUrl), removeProtocolFromUrl(studioEndpointUrl)],
      imagetools_toolbar: imageToolbar,
      formats: { label: { inline: 'label' } },
      setup: setupCustomBehavior({
        editorType,
        updateContent,
        openImgModal,
        openSourceCodeModal,
        lmsEndpointUrl,
        setImage: setSelection,
        content,
        images,
        imageUrls: fetchImageUrls(images),
      }),
      quickbars_insert_toolbar: quickbarsInsertToolbar,
      quickbars_selection_toolbar: quickbarsSelectionToolbar,
      quickbars_image_toolbar: false,
      toolbar,
      plugins,
      valid_children: '+body[style]',
      valid_elements: '*[*]',
      entity_encoding: 'utf-8',
    },
  };
};
