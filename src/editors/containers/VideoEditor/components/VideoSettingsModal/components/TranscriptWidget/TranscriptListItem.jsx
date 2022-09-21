import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Card, Dropdown, Icon, IconButton,
} from '@edx/paragon';

import { MoreVert } from '@edx/paragon/icons';

import LanguageSelect from './LanguageSelect';
import hooks from './hooks';
import { actions } from '../../../../../../data/redux';
import FileInput from '../../../../../../sharedComponents/FileInput';

export const TranscriptListItem = ({
  title,
  language,
  // redux
  downloadTranscript,
  deleteTranscript,
  // intl
  intl,
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
                Replace
              </Dropdown.Item>
              <Dropdown.Item key={`transcript-actions-${title}-download`} onClick={() => downloadTranscript({ language })}>
                Download
              </Dropdown.Item>
              <Dropdown.Item key={`transcript-actions-${title}-delete`} onClick={() => deleteTranscript({ language })}>
                Delete
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

const mapStateToProps = () => {

};

const mapDispatchToProps = {
  downloadTranscript: actions.video.downloadTranscript,
  deleteTranscript: actions.video.deleteTranscript,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TranscriptListItem));
