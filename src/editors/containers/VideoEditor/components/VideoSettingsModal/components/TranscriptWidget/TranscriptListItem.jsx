import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from '@edx/frontend-platform/i18n';
import {
  Card, Dropdown, Icon, IconButton, Button,
} from '@edx/paragon';

import { MoreVert } from '@edx/paragon/icons';

import LanguageSelect from './LanguageSelect';
import hooks from './hooks';
import { thunkActions } from '../../../../../../data/redux';
import FileInput from '../../../../../../sharedComponents/FileInput';
import messages from './messages';

export const TranscriptListItem = ({
  title,
  language,
  // redux
  downloadTranscript,
  deleteTranscript,
}) => {
  const fileInput = hooks.fileInput({ onAddFile: hooks.replaceFileCallback({ language, dispatch: useDispatch() }) });
  const { inDeleteConfirmation, launchDeleteConfirmation, cancelDelete } = hooks.setUpDeleteConfirmation();

  return (
    <Card>
      { inDeleteConfirmation ? (
        <>
          <Card.Header> <FormattedMessage {...messages.deleteConfirmationHeader} />
          </Card.Header>
          <Card.Body>
            <FormattedMessage {...messages.deleteConfirmationMessage} />
            <Button variant="tertiary" className="mb-2 mb-sm-0" onClick={cancelDelete}>
              <FormattedMessage {...messages.cancelDeleteLabel} />
            </Button>
            <Button variant="danger" className="mb-2 mb-sm-0" onClick={deleteTranscript({ language })}>
              <FormattedMessage {...messages.confirmDeleteLabel} />
            </Button>
          </Card.Body>
        </>
      ) : (
        <>
          <Card.Header
            subtitle={title}
            actions={(
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-toggle-with-iconbutton-video-transcript-widget"
                  as={IconButton}
                  src={MoreVert}
                  iconAs={Icon}
                  variant="primary"
                  alt="Actions dropdown"
                />
                <Dropdown.Menu className="video_transcript Action Menu">
                  <Dropdown.Item
                    key={`transcript-actions-${title}-replace`}
                    onClick={fileInput.click}
                  >
                    <FormattedMessage {...messages.replaceTranscript} />
                  </Dropdown.Item>
                  <Dropdown.Item key={`transcript-actions-${title}-download`} onClick={() => downloadTranscript({ language })}>
                    <FormattedMessage {...messages.downloadTranscript} />
                  </Dropdown.Item>
                  <Dropdown.Item key={`transcript-actions-${title}-delete`} onClick={launchDeleteConfirmation}>
                    <FormattedMessage {...messages.deleteTranscript} />
                  </Dropdown.Item>
                </Dropdown.Menu>
                <FileInput fileInput={fileInput} acceptedFiles=".srt" />
              </Dropdown>
              )}
          />
          <LanguageSelect
            title={title}
            language={language}
          />
        </>

      )}

    </Card>
  );
};

TranscriptListItem.propTypes = {
  title: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  // redux
  downloadTranscript: PropTypes.func.isRequired,
  deleteTranscript: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({});

export const mapDispatchToProps = {
  downloadTranscript: thunkActions.video.downloadTranscript,
  deleteTranscript: thunkActions.video.deleteTranscript,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TranscriptListItem));
