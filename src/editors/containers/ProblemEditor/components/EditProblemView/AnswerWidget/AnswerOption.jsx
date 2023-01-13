import React, { memo } from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Collapsible, Icon, IconButton, Form,
} from '@edx/paragon';
import { Feedback, Delete } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { selectors } from '../../../../../data/redux';
import { answerOptionProps } from '../../../../../data/services/cms/types';
import { ProblemTypeKeys } from '../../../../../data/constants/problem';
import * as hooks from './hooks';

const Checker = ({
  hasSingleAnswer, answer, setAnswer,
}) => {
  let CheckerType = Form.Checkbox;
  if (hasSingleAnswer) {
    CheckerType = Form.Radio;
  }
  return (
    <CheckerType
      className="pl-4 mt-3"
      value={answer.id}
      onChange={(e) => setAnswer({ correct: e.target.checked })}
      checked={answer.correct}
    >
      {answer.id}
    </CheckerType>
  );
};

const FeedbackControl = ({
  feedback, onChange, labelMessage, labelMessageBoldUnderline, key, answer, intl,
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

const FeedbackBox = injectIntl(({
  answer, problemType, setAnswer, intl,
}) => {
  const props = {
    onChange: (e) => setAnswer({ selectedFeedback: e.target.value }),
    answer,
    intl,
  };

  if (problemType !== ProblemTypeKeys.MULTISELECT) {
    return (
      <FeedbackControl
        key={`feedback-${answer.id}`}
        feedback={answer.selectedFeedback}
        labelMessage={messages.selectedFeedbackLabel}
        labelMessageBoldUnderline={messages.selectedFeedbackLabelBoldUnderlineText}
        {...props}
      />
    );
  }

  return (
    <>
      <FeedbackControl
        key={`selectedfeedback-${answer.id}`}
        feedback={answer.selectedFeedback}
        labelMessage={messages.selectedFeedbackLabel}
        labelMessageBoldUnderline={messages.selectedFeedbackLabelBoldUnderlineText}
        {...props}
      />
      <FeedbackControl
        key={`unselectedfeedback-${answer.id}`}
        feedback={answer.unselectedFeedback}
        labelMessage={messages.unSelectedFeedbackLabel}
        labelMessageBoldUnderline={messages.unSelectedFeedbackLabelBoldUnderlineText}
        {...props}
      />
    </>
  );
});
FeedbackBox.propTypes = {
  answer: answerOptionProps.isRequired,
  // injected
  intl: intlShape.isRequired,
  // redux
  problemType: PropTypes.string.isRequired,
};

export const AnswerOption = ({
  answer,
  hasSingleAnswer,
  // injected
  intl,
  // redux
  problemType,
}) => {
  const dispatch = useDispatch();
  const removeAnswer = hooks.removeAnswer({ answer, dispatch });
  const setAnswer = hooks.setAnswer({ answer, hasSingleAnswer, dispatch });
  const { isFeedbackVisible, toggleFeedback } = hooks.prepareFeedback(answer);

  return (
    <Collapsible.Advanced
      open={isFeedbackVisible}
      onToggle={toggleFeedback}
      className="answer-option collapsible-card d-flex flex-row justify-content-between flex-nowrap pb-2 pt-2"
    >
      <div className="answer-option-flex-item-1 mr-1">
        <Checker
          hasSingleAnswer={hasSingleAnswer}
          answer={answer}
          setAnswer={setAnswer}
        />
      </div>
      <div className="answer-option-flex-item-2 ml-1">
        <Form.Control
          as="textarea"
          className="answer-option-textarea"
          autoResize
          rows={1}
          value={answer.title}
          onChange={(e) => { setAnswer({ title: e.target.value }); }}
          placeholder={intl.formatMessage(messages.answerTextboxPlaceholder)}
        />
        <Collapsible.Body>
          <div className="bg-dark-100 p-4 mt-3">
            <FeedbackBox problemType={problemType} answer={answer} setAnswer={setAnswer} intl={intl} />
          </div>
        </Collapsible.Body>
      </div>
      <div className="answer-option-flex-item-3 d-flex flex-row flex-nowrap">
        <Collapsible.Trigger>
          <IconButton
            src={Feedback}
            className="feedback-icon-button"
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
      </div>
    </Collapsible.Advanced>
  );
};

AnswerOption.propTypes = {
  answer: answerOptionProps.isRequired,
  hasSingleAnswer: PropTypes.bool.isRequired,
  // injected
  intl: intlShape.isRequired,
  // redux
  problemType: PropTypes.string.isRequired,
};

FeedbackControl.propTypes = {
  feedback: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  labelMessage: PropTypes.string.isRequired,
  labelMessageBoldUnderline: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  answer: answerOptionProps.isRequired,
  intl: intlShape.isRequired,
};

Checker.propTypes = {
  hasSingleAnswer: PropTypes.bool.isRequired,
  answer: answerOptionProps.isRequired,
  setAnswer: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  problemType: selectors.problem.problemType(state),
});

export const mapDispatchToProps = {};
export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(memo(AnswerOption)));
