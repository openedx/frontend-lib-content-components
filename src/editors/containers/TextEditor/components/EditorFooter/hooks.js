import { useSelector } from 'react-redux';

import { RequestKeys } from '../../../../data/constants/requests';
import { selectors, thunkActions } from '../../../../data/redux';
import * as textEditorHooks from '../../hooks';

export const {
  navigateCallback,
  nullMethod,
  saveBlock,
} = textEditorHooks;

export const handleSaveClicked = ({ dispatch, editorRef }) => () => saveBlock({
  editorRef,
  saveBlockContent: (...args) => dispatch(thunkActions.app.saveBlock(...args)),
  returnUrl: useSelector(selectors.app.returnUrl),
});

export const handleCancelClicked = () => navigateCallback(useSelector(selectors.app.returnUrl));

export const isInitialized = () => useSelector(selectors.app.isInitialized);

export const saveFailed = () => useSelector((state) => (
  selectors.requests.isFailed(state, { requestKey: RequestKeys.saveBlock })
));

export const studioEndpointUrl = () => useSelector(selectors.app.studioEndpointUrl);
