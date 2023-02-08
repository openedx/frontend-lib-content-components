import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Form, Icon, IconButton, Row,
} from '@edx/paragon';
import { DeleteOutline } from '@edx/paragon/icons';
import PropTypes from 'prop-types';
import messages from '../../messages';

export const GroupFeedbackRow = ({
  value,
  handleAnswersSelectedChange,
  handleFeedbackChange,
  handleEmptyFeedback,
  handleDelete,
  answers,
  // injected
  intl,
}) => (

  <div className="mb-3">
    <ActionRow className="mb-1">
      <Form.Control
        value={value.feedback}
        onChange={handleFeedbackChange}
        onBlur={handleEmptyFeedback}
      />
      <ActionRow.Spacer />
      <IconButton
        src={DeleteOutline}
        iconAs={Icon}
        alt={intl.formatMessage(messages.settingsDeleteIconAltText)}
        onClick={handleDelete}
      />
    </ActionRow>
    <Form.CheckboxSet
      onChange={handleAnswersSelectedChange}
      value={value.answers}
    >
      <Row className="mx-0">
        {answers.map((letter) => (
          <Form.Checkbox
            className="mr-3"
            value={letter.id}
            checked={value.answers.indexOf(letter.id)}
          >{letter.id}
          </Form.Checkbox>
        ))}
      </Row>
    </Form.CheckboxSet>
  </div>

);

GroupFeedbackRow.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.shape({
    correct: PropTypes.bool,
    id: PropTypes.string,
    selectedFeedback: PropTypes.string,
    title: PropTypes.string,
    unselectedFeedback: PropTypes.string,
  })).isRequired,
  handleAnswersSelectedChange: PropTypes.func.isRequired,
  handleFeedbackChange: PropTypes.func.isRequired,
  handleEmptyFeedback: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  value: PropTypes.shape({
    id: PropTypes.number.isRequired,
    answers: PropTypes.arrayOf(PropTypes.string),
    feedback: PropTypes.string,
  }).isRequired,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(GroupFeedbackRow);
