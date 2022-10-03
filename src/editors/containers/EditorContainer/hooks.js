import { useSelector } from 'react-redux';

import { RequestKeys } from '../../data/constants/requests';
import { selectors } from '../../data/redux';
import * as appHooks from '../../hooks';
import analyticsEvt from '../../data/constants/analyticsEvt';

export const {
  navigateCallback,
  nullMethod,
  saveBlock,
} = appHooks;

export const setAssetToStaticUrl = (images, getContent) => {
  /* For assets to remain usable across course instances, we convert their url to be course-agnostic.
   * For example, /assets/course/<asset hash>/filename gets converted to /static/filename. This is
   * important for rerunning courses and importing/exporting course as the /static/ part of the url
   * allows the asset to be mapped to the new course run.
  */
  let content = getContent();
  const imageUrls = [];
  const imgsArray = Object.values(images);
  imgsArray.forEach(image => {
    imageUrls.push({ portableUrl: image.portableUrl, displayName: image.displayName });
  });
  const imageSrcs = typeof content === 'string' ? content.split('src="') : [];
  imageSrcs.forEach(src => {
    if (src.startsWith('/asset') && imageUrls.length > 0) {
      const nameFromEditorSrc = src.substring(src.lastIndexOf('@') + 1, src.indexOf('"'));
      const nameFromStudioSrc = nameFromEditorSrc.substring(nameFromEditorSrc.indexOf('/') + 1);
      let portableUrl;
      imageUrls.forEach((url) => {
        if (url.displayName === nameFromEditorSrc || url.displayName === nameFromStudioSrc) {
          portableUrl = url.portableUrl;
        }
      });
      if (portableUrl) {
        const currentSrc = src.substring(0, src.indexOf('"'));
        const updatedContent = content.replace(currentSrc, portableUrl);
        content = updatedContent;
      }
    }
  });
  return content;
};

export const handleSaveClicked = ({ dispatch, getContent, validateEntry }) => {
  const destination = useSelector(selectors.app.returnUrl);
  const analytics = useSelector(selectors.app.analytics);
  const blockType = useSelector(selectors.app.blockType);
  let content = getContent();
  console.log(content);
  if (blockType === 'html') {
    const images = useSelector(selectors.app.images);
    content = setAssetToStaticUrl(images, getContent);
  }
  return () => saveBlock({
    analytics,
    content,
    destination,
    dispatch,
    validateEntry,
  });
};
export const handleCancelClicked = ({ onClose }) => {
  if (onClose) {
    return onClose;
  }
  return navigateCallback({
    destination: useSelector(selectors.app.returnUrl),
    analyticsEvent: analyticsEvt.editorCancelClick,
    analytics: useSelector(selectors.app.analytics),
  });
};
export const isInitialized = () => useSelector(selectors.app.isInitialized);
export const saveFailed = () => useSelector((state) => (
  selectors.requests.isFailed(state, { requestKey: RequestKeys.saveBlock })
));
