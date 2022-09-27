import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intl,
} from '@edx/frontend-platform/i18n';
import {
  Image,
  Stack,
  Button,
  OverlayTrigger,
  Icon,
  IconButton,
  Tooltip,
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
  error,
  // inject
  intl,
  // redux
  thumbnail,
  updateField,
}) => {
  const imgRef = React.useRef()
  const fileInput = hooks.fileInput(imgRef);
  // const deleteThumbnail = hooks.deleteThumbnail(imgRef);
  return (
    <CollapsibleFormWidget title="Thumbnail">
      {thumbnail ?
        <>
          <Image src={thumbnail} ref={imgRef} fluid altText='thumbnail for video'/>
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
        </> :
        <Stack>
          <FormattedMessage {...messages.addThumbnail} />
          <FormattedMessage {...messages.aspectRequirements} />
          <FileInput fileInput={fileInput} acceptedFiles={Object.values(acceptedImgKeys).join()} />
          <Button iconBefore={FileUpload} onClick={fileInput.click} variant="link">
            <FormattedMessage {...messages.uploadButtonLabel} />
          </Button>
        </Stack>
      }
    </CollapsibleFormWidget>
  );
};

ThumbnailWidget.propTypes = {
  error: PropTypes.node,
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
