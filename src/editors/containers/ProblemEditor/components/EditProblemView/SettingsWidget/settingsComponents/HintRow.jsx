import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Icon, IconButton,
} from '@edx/paragon';
import { DeleteOutline } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import messages from '../messages';
import ExpandableTextArea from '../../../../../../sharedComponents/ExpandableTextArea';

export const HintRow = ({
  value,
  handleChange,
  handleDelete,
  id,
  // injected
  intl,
}) => (
  <ActionRow className="mb-4">
    <ExpandableTextArea
      value={value}
      setContent={handleChange}
      placeholder={intl.formatMessage(messages.hintInputLabel)}
      id={`hint-${id}`}
    />
    <IconButton
      src={DeleteOutline}
      iconAs={Icon}
      alt={intl.formatMessage(messages.settingsDeleteIconAltText)}
      onClick={handleDelete}
    />
  </ActionRow>
);

HintRow.propTypes = {
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(HintRow);
