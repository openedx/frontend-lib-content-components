import React from 'react';
import PropTypes from 'prop-types';

import {
  Form,
} from '@edx/paragon';
import { connect } from 'react-redux';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { selectors } from '../../../../../../data/redux';
import { videoTranscriptLanguages } from '../../../../../../data/constants/video';

export const LanguageSelect = ({
  onSelect,
  title, // For a unique id for the form control
  language,
  // Redux
  openLanguages, // Only allow those languages not already associated with a transcript to be selected
}) => (
  <Form.Group controlId={`selectLanguage-form-${title}`} className="mt-2 mx-2">
    {/* TODO: int8l floatingLabel */}
    <Form.Control as="select" defaultValue={language} onChange={onSelect} floatingLabel="Language">
      <option value={language}>{videoTranscriptLanguages[language]}</option>
      {Object.entries(videoTranscriptLanguages).map(([lang, text]) => {
        if (language === lang) { return (<></>); }
        if (openLanguages.some(row => row.includes(lang))) {
          return (<option value={lang}>{text}</option>);
        }
        return (<option value={lang} disabled>{text}</option>);
      })}

    </Form.Control>
  </Form.Group>
);

LanguageSelect.defaultProps = {
  openLanguages: [],
};

LanguageSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  openLanguages: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({ openLanguages: selectors.video.openLanguages(state) });

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LanguageSelect));
