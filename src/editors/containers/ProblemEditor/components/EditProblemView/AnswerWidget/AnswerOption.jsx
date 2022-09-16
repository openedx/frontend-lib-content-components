import React, { memo, useEffect, useState } from 'react';
import { isUndefined } from 'lodash-es';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Col, Collapsible, Icon, IconButton, Form, Row,
} from '@edx/paragon';
import { AddComment, Delete } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { actions } from '../../../../../data/redux';
import { answerOptionProps } from '../../../../../data/services/cms/types';

export const AnswerOption = ({
  answer,
  hasSingleAnswer,
  // injected
  intl,
  // redux
  deleteAnswer,
  updateAnswer,
}) => {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const removeAnswer = () => deleteAnswer({ id: answer.id });
  const setAnswer = (payload) => updateAnswer({ id: answer.id, hasSingleAnswer, ...payload });

  useEffect(() => {
    // Show feedback fields if feedback is present
    setIsFeedbackVisible(isVisible => (
      !!answer.selectedFeedback || !!answer.unselectedFeedback || !!answer.feedback || isVisible
    ));
  }, [answer]);

  const toggleFeedback = (open) => {
    // Do not allow to hide if feedback is added
    if (!!answer.selectedFeedback || !!answer.unselectedFeedback || !!answer.feedback) {
      setIsFeedbackVisible(true);
      return;
    }
    setIsFeedbackVisible(open);
  };

  const Checker = () => {
    let CheckerType = Form.Checkbox;
    if (hasSingleAnswer) {
      CheckerType = Form.Radio;
    }
    return (
      <CheckerType
        className="pl-4 mt-3"
        value={answer.id}
        onChange={(e) => setAnswer({ correct: e.target.checked })}
        defaultChecked={answer.correct}
      >
        {answer.id}
      </CheckerType>
    );
  };

  const feedbackControl = ({
    feedback, onChange, labelMessage, labelMessageBoldUnderline, key,
  }) => (
    <Form.Group key={key}>
      <Form.Label className="mb-3">
        <FormattedMessage
          {...labelMessage}
          values={{
            answerId: answer.id,
            boldunderline: <b><u><FormattedMessage {...labelMessageBoldUnderline} /></u></b>,
          }}
        />
      </Form.Label>
      <Form.Control
        placeholder={intl.formatMessage(messages.feedbackPlaceholder)}
        value={feedback}
        onChange={onChange}
      />
    </Form.Group>
  );

  const displayFeedbackControl = () => {
    if (!isUndefined(answer.feedback)) {
      return feedbackControl({
        key: `feedback-${answer.id}`,
        feedback: answer.feedback,
        onChange: (e) => setAnswer({ feedback: e.target.value }),
        labelMessage: messages.selectedFeedbackLabel,
        labelMessageBoldUnderline: messages.selectedFeedbackLabelBoldUnderlineText,
      });
    }
    return [
      feedbackControl({
        key: `selectedfeedback-${answer.id}`,
        feedback: answer.selectedFeedback,
        onChange: (e) => setAnswer({ selectedFeedback: e.target.value }),
        labelMessage: messages.selectedFeedbackLabel,
        labelMessageBoldUnderline: messages.selectedFeedbackLabelBoldUnderlineText,
      }),
      feedbackControl({
        key: `unselectedfeedback-${answer.id}`,
        feedback: answer.unselectedFeedback,
        onChange: (e) => setAnswer({ unselectedFeedback: e.target.value }),
        labelMessage: messages.unSelectedFeedbackLabel,
        labelMessageBoldUnderline: messages.unSelectedFeedbackLabelBoldUnderlineText,
      }),
    ];
  };

  return (
    <Collapsible.Advanced
      open={isFeedbackVisible}
      onToggle={toggleFeedback}
      className="collapsible-card"
    >
      <Row className="my-2">

        <Col xs={1}>
          <Checker />
        </Col>

        <Col xs={10}>
          <Form.Control
            as="textarea"
            rows={1}
            value={answer.title}
            onChange={(e) => setAnswer({ title: e.target.value })}
            placeholder={intl.formatMessage(messages.answerTextboxPlaceholder)}
          />

          <Collapsible.Body>
            <div className="bg-dark-100 p-4 mt-3">
              {displayFeedbackControl()}
            </div>
          </Collapsible.Body>
        </Col>

        <Col xs={1} className="d-inline-flex mt-1">
          <Collapsible.Trigger>
            <IconButton
              src={AddComment}
              iconAs={Icon}
              alt={intl.formatMessage(messages.feedbackToggleIconAltText)}
              variant="primary"
            />
          </Collapsible.Trigger>
          <IconButton
            src={Delete}
            iconAs={Icon}
            alt={intl.formatMessage(messages.answerDeleteIconAltText)}
            onClick={removeAnswer}
            variant="primary"
          />
        </Col>

      </Row>
    </Collapsible.Advanced>
  );
};

AnswerOption.propTypes = {
  answer: answerOptionProps.isRequired,
  hasSingleAnswer: PropTypes.bool.isRequired,
  // injected
  intl: intlShape.isRequired,
  // redux
  deleteAnswer: PropTypes.func.isRequired,
  updateAnswer: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({});
export const mapDispatchToProps = {
  deleteAnswer: actions.problem.deleteAnswer,
  updateAnswer: actions.problem.updateAnswer,
};
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(memo(AnswerOption)));
