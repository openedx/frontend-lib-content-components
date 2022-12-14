import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Hyperlink, Image } from '@edx/paragon';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import messages from './messages';
import { selectors } from '../../../../../data/redux';
import { ProblemTypes } from '../../../../../data/constants/problem';

export const Preview = ({
  // redux
  problemType,
  // injected
  intl,
}) => {
  const tempProblemType = 'choiceresponse';

  if (problemType === null) {
    return null;
  }
  const data = ProblemTypes[tempProblemType];
  return (
    <div className="col col-6 bg-light-300 rounded p-4">
      <div className="small">
        {intl.formatMessage(messages.previewTitle, { previewTitle: data.title })}
      </div>
      <Image
        fluid
        className="my-3"
        src={data.preview}
        alt={intl.formatMessage(messages.previewAltText, { problemType })}
      />
      <div className="mb-3">
        {intl.formatMessage(messages.previewDescription, { previewDescription: data.description })}
      </div>
      <Hyperlink
        destination={data.helpLink}
        target="_blank"
      >
        <FormattedMessage {...messages.learnMoreButtonLabel} />
      </Hyperlink>
    </div>
  );
};

Preview.propTypes = {
  // redux
  problemType: PropTypes.string.isRequired,
  // injected
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  problemType: selectors.problem.problemType(state),
});

export const mapDispatchToProps = {};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Preview));
