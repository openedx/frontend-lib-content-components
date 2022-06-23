import React from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Spinner } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import SelectTypeModal from './components/SelectTypeModal';
import EditProblemView from './components/EditProblemView';
import { selectors } from '../../data/redux/app';
import { RequestKeys } from '../../data/constants/requests';

// eslint-disable-next-line react/prop-types

export const ProblemEditor = ({
  onClose,
  // Redux
  problemType,
  blockFinished,
}) => {
  // TODO: INTL MSG, Add LOAD FAILED ERROR using BLOCKFAILED
  if (!blockFinished ) {

    return (
      <div className="text-center p-6">
        <Spinner
          animation="border"
          className="m-3"
          screenreadertext="Loading Problem Editor"
        />
      </div>
    );
  }
  if (problemType === null) {
    return (<SelectTypeModal onClose={onClose} />);
  }
  return (<EditProblemView onClose={onClose} />);
};

ProblemEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  // redux
  blockFinished: PropTypes.bool.isRequired,
  problemType: PropTypes.string.isRequired,
};

export const mapStateToProps = (state) => ({
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  problemType: selectors.problem.problemType(state),
});

export const mapDispatchToProps = {
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProblemEditor));
