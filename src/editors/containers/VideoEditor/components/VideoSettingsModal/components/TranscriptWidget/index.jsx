import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Form,
  Button,
  Stack,
  Icon,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';
import { FileUpload, HelpOutline } from '@edx/paragon/icons';
import {
  FormattedMessage,
  injectIntl,
} from '@edx/frontend-platform/i18n';

import { actions, selectors } from '../../../../../../data/redux';
import * as hooks from './hooks';
import messages from './messages';

import CollapsibleFormWidget from '../CollapsibleFormWidget';

/**
 * Collapsible Form widget controlling video transcripts
 */
export const TranscriptWidget = ({
  error,
  // redux
  transcripts,
  allowTranscriptDownloads,
  showTranscriptByDefault,
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
  const languagesArr = hooks.transcriptLanguages(transcripts);
  console.log(actions.video);

  return (
    <CollapsibleFormWidget
      isError={Object.keys(error).length !== 0}
      subtitle={languagesArr}
      title="Transcript"
    >
      <Stack gap={3}>
        {transcripts ? (
          <Form.Group className="mt-4.5">
            <b>Transcript widget:</b>
            <div className="mb-1">
              {/* TODO: onChange={hooks.onCheckboxChange(setAllowDownload)} */}
              <Form.Checkbox
                checked={allowTranscriptDownloads}
                className="mt-4.5 decorative-control-label"
              >
                <Form.Label>
                  <FormattedMessage {...messages.allowDownloadCheckboxLabel} />
                </Form.Label>
              </Form.Checkbox>
              <OverlayTrigger
                key="right"
                placement="right"
                overlay={(
                  <Tooltip>
                    <FormattedMessage {...messages.tooltipMessage} />
                  </Tooltip>
                )}
              >
                <Icon className="d-inline-block mx-3" src={HelpOutline} />
              </OverlayTrigger>
            </div>
            {/* TODO: onChange={hooks.onCheckboxChange(showByDefault)} */}
            <Form.Checkbox
              checked={showTranscriptByDefault}
              className="mt-4.5 decorative-control-label"
            >
              <Form.Label size="sm">
                <FormattedMessage {...messages.showByDefaultCheckboxLabel} />
              </Form.Label>
            </Form.Checkbox>
          </Form.Group>
        ) : <FormattedMessage {...messages.addFirstTranscript} />}
        <Button iconBefore={FileUpload} onClick={() => { console.log('adding file'); }} variant="link">
          <FormattedMessage {...messages.uploadButtonLabel} />
        </Button>
      </Stack>
    </CollapsibleFormWidget>
  );
};

TranscriptWidget.defaultProps = {
  error: {},
  transcripts: null,
  allowTranscriptDownloads: false,
  showTranscriptByDefault: false,
};
TranscriptWidget.propTypes = {
  error: PropTypes.node,
  // redux
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
