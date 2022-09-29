import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import {
  Image,
  Stack,
  Button,
  OverlayTrigger,
  Icon,
  IconButton,
  Tooltip,
  Alert,
} from '@edx/paragon';
import { Delete, FileUpload } from '@edx/paragon/icons';

import { actions, selectors } from '../../../../../../data/redux';
import { acceptedImgKeys } from './utils';
import * as hooks from './hooks';
import messages from './messages';

import CollapsibleFormWidget from '../CollapsibleFormWidget';
import FileInput from '../../../../../../sharedComponents/FileInput';

/**
 * Collapsible Form widget controlling video thumbnail
 */
export const ThumbnailWidget = ({
  // injected
  intl,
  // redux
  thumbnail,
  updateField,
}) => {
  const [thumbnailSrc, setThumbnailSrc] = React.useState(thumbnail);
  const fileInput = hooks.fileInput({ setThumbnailSrc });

  return (
    <CollapsibleFormWidget title={intl.formatMessage(messages.title)}>
      {thumbnail ? (
        <Stack direction="horizontal" gap={3}>
          <Image src={thumbnailSrc} alt={intl.formatMessage(messages.thumbnailAltText)} />
          <OverlayTrigger
            key="top"
            placement="top"
            overlay={(
              <Tooltip>
                <FormattedMessage {...messages.deleteThumbnail} />
              </Tooltip>
            )}
          >
            <IconButton
              className="d-inline-block"
              iconAs={Icon}
              src={Delete}
              onClick={() => updateField({ thumbnail: null })}
            />
          </OverlayTrigger>
        </Stack>
      ) : (
        <Stack gap={3}>
          <FormattedMessage {...messages.addThumbnail} />
          <Alert variant="info">
            <FormattedMessage {...messages.aspectRequirements} />
          </Alert>
          <FileInput fileInput={fileInput} acceptedFiles={Object.values(acceptedImgKeys).join()} />
          <Button iconBefore={FileUpload} onClick={fileInput.click} variant="link">
            <FormattedMessage {...messages.uploadButtonLabel} />
          </Button>
        </Stack>
      )}
    </CollapsibleFormWidget>
  );
};

ThumbnailWidget.propTypes = {
  // injected
  intl: intlShape.isRequired,
  // redux
  thumbnail: PropTypes.string.isRequired,
  updateField: PropTypes.func.isRequired,
};
export const mapStateToProps = (state) => ({
  thumbnail: selectors.video.thumbnail(state),
});

export const mapDispatchToProps = (dispatch) => ({
  updateField: (stateUpdate) => dispatch(actions.video.updateField(stateUpdate)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ThumbnailWidget));
