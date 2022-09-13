import React from 'react';
import { useDispatch, connect } from 'react-redux';
import PropTypes from 'prop-types';

import { actions, selectors } from '../../../../../../data/redux';

import { widgetValues, objectWidget, genericWidget, selectorKeys } from '../hooks';
import * as hooks from './hooks'
import {
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Button,
  Stack,
  Icon,
  IconButton,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';
import { FileUpload, HelpOutline } from '@edx/paragon/icons';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import messages from './messages';
import CollapsibleFormWidget from '../CollapsibleFormWidget';

/**
 * Collapsible Form widget controlling video transcripts
 */
export const TranscriptWidget = ({
  error,
  // injected
  intl,
  //redux
  transcripts,
  allowTranscriptDownloads,
  showTranscriptByDefault,
  updateField
}) => {
  // const dispatch = useDispatch();
  // const values = widgetValues({
  //   dispatch,
  //   fields: {
  //     [selectorKeys.transcripts]: objectWidget,
  //     [selectorKeys.allowTranscriptDownloads]: genericWidget,
  //     [selectorKeys.showTranscriptByDefault]: genericWidget,
  //   },
  // });
  // const {
  //   transcripts,
  //   allowTranscriptDownloads: allowDownload,
  //   showTranscriptByDefault: showByDefault,
  // } = values;
  const languagesArr = hooks.transcriptLanguages(transcripts)
  console.log(actions.video);

  return (
    <CollapsibleFormWidget
      isError={Object.keys(error).length !== 0}
      subtitle={languagesArr}
      title="Transcript"
    >
      <Stack gap={3}>
        {transcripts ?
          <Form.Group className="mt-4.5">
              <b>Transcript widget:</b>
              <div className="mb-1">
              {/* TODO: onChange={hooks.onCheckboxChange(setAllowDownload)} */}
                <Form.Checkbox
                  checked={allowTranscriptDownloads}
                  className="mt-4.5 decorative-control-label"
                  onChange={(event) => updateField({'allowTranscriptDownloads': event.target.value})}
                >
                  <Form.Label>
                    <FormattedMessage {...messages.allowDownloadCheckboxLabel} />
                  </Form.Label>
                </Form.Checkbox>
                <OverlayTrigger
                  key='right'
                  placement='right'
                  overlay={
                    <Tooltip>
                      <FormattedMessage {...messages.tooltipMessage} />
                    </Tooltip>
                  }
                >
                  <Icon className="d-inline-block mx-3" src={HelpOutline} />
                </OverlayTrigger>
              </div>
              {/* TODO: onChange={hooks.onCheckboxChange(showByDefault)} */}
              <Form.Checkbox
                checked={showTranscriptByDefault}
                className="mt-4.5 decorative-control-label"
                onChange={(event) => updateField({'showTranscriptByDefault': event.target.value})}
              >
                <Form.Label size="sm">
                  <FormattedMessage {...messages.showByDefaultCheckboxLabel} />
                </Form.Label>
              </Form.Checkbox>
            </Form.Group> : <FormattedMessage {...messages.addFirstTranscript} />
        }
        <Button iconBefore={FileUpload} onClick={()=>{console.log('adding file');}} variant="link">
          <FormattedMessage {...messages.uploadButtonLabel} />
        </Button>
      </Stack>
    </CollapsibleFormWidget>
  );
};

TranscriptWidget.defaultProps = {
  error: {},
  transcript: null,
  allowTranscriptDownloads: false,
  showTranscriptByDefault: false,
};
TranscriptWidget.propTypes = {
  error: PropTypes.node,
  // injected
  intl: intlShape.isRequired,
  //redux
  transcripts: PropTypes.shape({}),
  allowTranscriptDownloads: PropTypes.bool,
  showTranscriptByDefault: PropTypes.bool,
};
export const mapStateToProps = (state) => ({
  transcripts: selectors.video.transcripts(state),
  allowTranscriptDownloads: selectors.video.allowTranscriptDownloads(state),
  showTranscriptByDefault: selectors.video.showTranscriptByDefault(state),
});

export const mapDispatchToProps = { };

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(TranscriptWidget));
