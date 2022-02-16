import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Spinner,
  ActionRow,
  Button,
  ModalDialog,
  Toast,
} from '@edx/paragon';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { RequestKeys } from 'data/constants/requests';
import { selectors, actions } from 'data/redux';
import * as urls from 'data/urls';

import * as module from './EditorFooter';

export const messages = {
  contentSaveFailed: {
    id: 'authoring.editorfooter.save.error',
    defaultMessage: 'Error: Content save failed. Try again later.',
    description: 'Error message displayed when content fails to save.',
  },
  addToCourse: {
    id: 'authoring.editorfooter.savebutton.label',
    defaultMessage: 'Add To Course',
    description: 'Label for Save button',
  },
};

export const navigateTo = (destination) => {
  window.location.assign(destination);
};

export const handleSaveClicked = ({
  blockLoaded,
  unitUrlLoaded,
  editorRef,
  setBlockContent,
}) => () => {
  if (blockLoaded && unitUrlLoaded && editorRef) {
    const content = editorRef.current.getContent();
    setBlockContent(content);
    // setSaveUnderway(ActionStates.IN_PROGRESS);
  }
};
export const handleCancelClicked = ({ unitUrlLoaded, url }) =>
  () => unitUrlLoaded && navigateTo(url);

export const handleSaveFinished = ({
  saveFinished,
  blockFinished,
  unitFinished,
  url,
}) => {
  useEffect(
    () => (saveFinished && blockFinished && unitFinished && navigateTo(url)),
    [saveFinished],
  );
};

export const EditorFooter = ({
  editorRef,
  // redux
  blockFinished,
  saveFinished,
  saveFailed,
  unitFinished,
  setBlockContent,
  unitUrl,
  studioEndpointUrl,
}) => {
  const onSaveClicked = module.handleSaveClicked({
    blockFinished,
    unitFinished,
    editorRef,
    setBlockContent,
  });
  const url = urls.unit({ studioEndpointUrl, unitUrl });
  const onCancelClicked = module.handleCancelClicked({ unitFinished, url });
  handleSaveFinished({
    saveFinished,
    blockFinished,
    unitFinished,
    url,
  });
  return (
    <div className="editor-footer mt-auto">
      { (saveFinished && !saveFailed) && (
        <Toast><FormattedMessage {...messages.contentSaveFailed} /></Toast>
      )}
      <ModalDialog.Footer>
        <ActionRow>
          <ActionRow.Spacer />
          <Button
            aria-label="Discard Changes and Return to Learning Context"
            variant="tertiary"
            onClick={onCancelClicked}
          >
            Cancel
          </Button>
          <Button
            aria-label="Save Changes and Return to Learning Context"
            onClick={onSaveClicked}
          >
            {unitFinished
              ? <Spinner animation="border" className="mr-3" />
              : <FormattedMessage {...messages.addToCourse} />}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </div>
  );
};
EditorFooter.propTypes = {
  editorRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]).isRequired,
  blockFinished: PropTypes.bool.isRequired,
  saveFinished: PropTypes.bool.isRequired,
  saveFailed: PropTypes.bool.isRequired,
  unitFinished: PropTypes.bool.isRequired,
  setBlockContent: PropTypes.func.isRequired,
  studioEndpointUrl: PropTypes.string.isRequired,
  unitUrl: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  saveFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.saveBlock }),
  saveFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.saveBlock }),
  unitFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchUnit }),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
  unitUrl: selectors.app.unitUrl(state),
});

export const mapDispatchToProps = {
  setBlockContent: actions.app.setBlockContent,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditorFooter);
