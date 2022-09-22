import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, connect } from 'react-redux';

import { injectIntl } from '@edx/frontend-platform/i18n';
import {
  Card, Dropdown, Icon, IconButton,
} from '@edx/paragon';

import { MoreVert } from '@edx/paragon/icons';

import LanguageSelect from './LanguageSelect';
import hooks from './hooks';
import FileInput from '../../../../../../sharedComponents/FileInput';

export const TranscriptListItem = ({
  title,
  language,
  downloadLink,
}) => {
  const fileInput = hooks.fileInput({ onAddFile: hooks.replaceFileCallback({ language, dispatch: useDispatch() }) });
  const deleteTranscript = hooks.deleteTranscript({ language, dispatch: useDispatch() });

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
              <Dropdown.Item key={`transcript-actions-${title}-download`} href={downloadLink}>
                Download
              </Dropdown.Item>
              <Dropdown.Item key={`transcript-actions-${title}-delete`} onClick={() => deleteTranscript}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
            <FileInput fileInput={fileInput} acceptedFiles=".srt" />
          </Dropdown>
    )}
      />

      <LanguageSelect
        onSelect={hooks.onSelectLanguage}
        title={title}
        language={language}
      />
    </Card>
  );
};

TranscriptListItem.propTypes = {
  language: PropTypes.string.isRequired,
  downloadLink: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TranscriptListItem));
