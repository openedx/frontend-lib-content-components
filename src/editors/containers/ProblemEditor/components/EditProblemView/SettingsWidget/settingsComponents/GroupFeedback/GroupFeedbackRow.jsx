import React from 'react';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  ActionRow, Form, Icon, IconButton, Col, Row,
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
  <ActionRow className="mb-3">
    <Col className="px-0">
      <Row>
        <Form.Control
          value={value.feedback}
          onChange={handleFeedbackChange}
          onBlur={handleEmptyFeedback}
        />
      </Row>
      <Form.CheckboxSet
        onChange={handleAnswersSelectedChange}
        value={value.answers}
      >
        <Row>
          {answers.map((letter) => (
            <Form.Checkbox
              className="mr-1"
              value={letter.id}
              checked={value.answers.indexOf(letter.id)}
            >{letter.id}
            </Form.Checkbox>
          ))}
        </Row>
      </Form.CheckboxSet>
    </Col>
    <ActionRow.Spacer />
    <IconButton
      src={DeleteOutline}
      iconAs={Icon}
      alt={intl.formatMessage(messages.settingsDeleteIconAltText)}
      onClick={handleDelete}
    />
  </ActionRow>
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
