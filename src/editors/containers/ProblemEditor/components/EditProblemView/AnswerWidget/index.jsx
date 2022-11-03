import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';
import { ProblemTypes } from '../../../../../data/constants/problem';
import AnswersContainer from './AnswersContainer';

// This widget should be connected, grab all answers from store, update them as needed.
const AnswerWidget = ({
  // Redux
  problemType,
}) => {
  const problemStaticData = ProblemTypes[problemType];
  return (
    <div>
      <div>
        <h1 className="problem-answer-title">
          <FormattedMessage {...messages.answerWidgetTitle} />
        </h1>
        <h3>
          {problemStaticData.description}
        </h3>
      </div>
      <AnswersContainer problemType={problemType} />
    </div>
  );
};

AnswerWidget.propTypes = {
  problemType: PropTypes.string.isRequired,
};
export default AnswerWidget;
