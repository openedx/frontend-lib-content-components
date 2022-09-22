import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { FormattedMessage, injectIntl } from '@edx/frontend-platform/i18n';
import {
  Card, Dropdown, Icon, IconButton,
} from '@edx/paragon';

import { MoreVert } from '@edx/paragon/icons';

import LanguageSelect from './LanguageSelect';
import hooks from './hooks';
import { actions } from '../../../../../../data/redux';
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

  return (
    <Card>
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
                <FormattedMessage defaultMessage={messages.replaceTranscript} />

              </Dropdown.Item>
              <Dropdown.Item key={`transcript-actions-${title}-download`} onClick={() => downloadTranscript({ language })}>
                <FormattedMessage defaultMessage={messages.downloadTranscript} />
              </Dropdown.Item>
              <Dropdown.Item key={`transcript-actions-${title}-delete`} onClick={() => deleteTranscript({ language })}>
                <FormattedMessage defaultMessage={messages.deleteTranscript} />
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

const mapStateToProps = () => {

};

export const mapDispatchToProps = {
  downloadTranscript: actions.video.downloadTranscript,
  deleteTranscript: actions.video.deleteTranscript,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TranscriptListItem));
