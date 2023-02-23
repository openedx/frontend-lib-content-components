import React from 'react';
import PropTypes from 'prop-types';

import {
  ActionRow,
  Dropdown,
  Button,
  Icon,
} from '@edx/paragon';

import { Check } from '@edx/paragon/icons';
import { connect, useDispatch } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { thunkActions, selectors } from '../../../../../../data/redux';
import { videoTranscriptLanguages } from '../../../../../../data/constants/video';
import { FileInput, fileInput } from '../../../../../../sharedComponents/FileInput';
import messages from './messages';
import * as module from './LanguageSelector';

export const hooks = {
  onSelectLanguage: ({
    dispatch, languageBeforeChange, triggerupload, setLocalLang,
  }) => ({ newLang }) => {
    // IF Language is unset, set language and begin upload prompt.
    setLocalLang(newLang);
    if (languageBeforeChange === '') {
      triggerupload();
      return;
    }
    // Else: update language
    dispatch(
      thunkActions.video.updateTranscriptLanguage({
        newLanguageCode: newLang, languageBeforeChange,
      }),
    );
  },

  addFileCallback: ({ dispatch, localLang }) => (file) => {
    dispatch(thunkActions.video.uploadTranscript({
      file,
      filename: file.name,
      language: localLang,
    }));
  },

};

export const LanguageSelector = ({
  index, // For a unique id for the form control
  language,
  // Redux
  openLanguages, // Only allow those languages not already associated with a transcript to be selected
  // intl
  intl,

}) => {
  const [localLang, setLocalLang] = React.useState(language);
  const input = fileInput({ onAddFile: hooks.addFileCallback({ dispatch: useDispatch(), localLang }) });
  const onLanguageChange = module.hooks.onSelectLanguage({
    dispatch: useDispatch(), languageBeforeChange: localLang, setLocalLang, triggerupload: input.click,
  });
  console.log({ localLang, language, openLanguages });

  const getTitle = () => {
    if (Object.prototype.hasOwnProperty.call(videoTranscriptLanguages, language)) {
      return (
        <ActionRow>
          {videoTranscriptLanguages[language]}
          <ActionRow.Spacer />
          <Icon className="text-primary-500" src={Check} />
        </ActionRow>

      );
    }
    return (
      <ActionRow>
        {intl.formatMessage(messages.languageSelectPlaceholder)}
        <ActionRow.Spacer />
      </ActionRow>
    );
  };

  return (
    <>

      <Dropdown
        className="w-100 mb-2"
      >
        <Dropdown.Toggle
          iconAs={Button}
          aria-label={intl.formatMessage(messages.languageSelectLabel)}
          block
          id={`selectLanguage-form-${index}`}
          className="w-100"
          variant="outline-primary"
        >
          {getTitle()}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Object.entries(videoTranscriptLanguages).map(([lang, text]) => {
            if (language === lang) {
              return (<Dropdown.Item>{text}<Icon className="text-primary-500" src={Check} /></Dropdown.Item>);
            }
            if (openLanguages.some(row => row.includes(lang))) {
              return (<Dropdown.Item onClick={() => onLanguageChange({ newLang: lang })}>{text}</Dropdown.Item>);
            }
            return (<Dropdown.Item className="disabled">{text}</Dropdown.Item>);
          })}
        </Dropdown.Menu>
      </Dropdown>
      <FileInput fileInput={input} acceptedFiles=".srt" />
    </>
  );
};

/* <div className="col col-11 p-0">

      <div class="pgn__form-control-decorator-group has-prepended-node has-leading-element has-floating-label"><select id="form-field37" class="form-control"><option value="">Select a cat</option><option>Persian cat</option><option>British Shorthair</option><option>Maine Coon</option><option>Siamese cat</option></select><div class="pgn__form-control-decorator pgn__form-control-decorator-leading"><span class="pgn__icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" focusable="false" aria-hidden="true"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill="currentColor"></path></svg></span></div><div class="pgn__form-control-floating-label"><div class="pgn__form-control-floating-label-content"><label class="pgn__form-control-floating-label-text" for="form-field37">What kind of cats?</label></div></div></div>

      <Form.Group controlId={`selectLanguage-form-${index}`} className="mw-100  m-0">
        <Form.Control
          as="select"
          aria-label={intl.formatMessage(messages.languageSelectLabel)}
          defaultValue={language}
          onChange={(e) => {
            onLanguageChange(e);
            console.log(e);
            input.click();
          }}
        >
          {Object.entries(videoTranscriptLanguages).map(([lang, text]) => {
            if (language === lang) { return (<option value={lang} selected>{text}</option>); }
            if (lang === 'placeholder') { return (<option hidden>{intl.formatMessage(messages.languageSelectPlaceholder)}</option>); }
            if (openLanguages.some(row => row.includes(lang))) {
              return (<option value={lang} onClick={() => { console.log('Connor Wins'); }}>{text}</option>);
            }
            return (<option value={lang} disabled>{text}</option>);
          })}
        </Form.Control>
      </Form.Group>
      <FileInput fileInput={input} acceptedFiles=".srt" />
    </div>

*/

LanguageSelector.defaultProps = {
  openLanguages: [],
};

LanguageSelector.propTypes = {
  openLanguages: PropTypes.arrayOf(PropTypes.string),
  index: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  openLanguages: selectors.video.openLanguages(state),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LanguageSelector));
