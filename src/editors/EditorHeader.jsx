import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ActionRow, IconButton, Icon, ModalDialog,
} from '@edx/paragon';
import { Close } from '@edx/paragon/icons';

import { blockTypes } from 'data/constants/app';
import { RequestKeys } from 'data/constants/requests';
import { selectors } from 'data/redux';

export const returnIfCompleted = ({
  isCompleted,
  studioEndpointUrl,
  unitUrl,
}) => {
  if (isCompleted) {
    const destination = `${studioEndpointUrl}/container/${unitUrl.data.ancestors[0].id}`;
    window.location.assign(destination);
  }
};

export const typeHeader = ({ blockType }) => (
  (blockType === blockTypes.html)
    ? 'Text'
    : blockType[0].toUpperCase() + blockType.substring(1)
);

const EditorHeader = ({
  isCompleted,
  blockType,
  studioEndpointUrl,
  unitUrl,
}) => {
  const onCancelClick = module.returnIfCompleted({
    isCompleted,
    unitUrl,
    studioEndpointUrl,
  });
  const title = module.typeHeader({ blockType });
  return (
    <div className="editor-header">
      <ModalDialog.Header>
        <ActionRow>
          <ModalDialog.Title>{title}</ModalDialog.Title>
          <ActionRow.Spacer />
          <IconButton
            aria-label="Cancel Changes and Return to Learning Context"
            src={Close}
            iconAs={Icon}
            alt="Close"
            onClick={onCancelClick}
            variant="light"
            className="mr-2"
          />
        </ActionRow>
      </ModalDialog.Header>
    </div>
  );
};
EditorHeader.propTypes = {
  blockType: PropTypes.string.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  studioEndpointUrl: PropTypes.string.isRequired,
  unitUrl: PropTypes.string.isRequired,
};
export const mapStateToProps = (state) => ({
  isCompleted: selectors.requests.isCompleted({ requestKey: RequestKeys.fetchUnit }),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
  blockType: selectors.app.blockType(state),
  unitUrl: selectors.app.unitUrl(state),
});

export default connect(mapStateToProps)(EditorHeader);
