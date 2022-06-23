import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { actions, selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';

import EditProblemView from './components/EditProblemView';

import SelectTypeModal from './components/SelectTypeModal';


export const hooks = {

}

export const  ProblemEditor = ({
  onClose,
  // Redux
  blockValue,
  lmsEndpointUrl,
  studioEndpointUrl,
  blockFailed,
  blockFinished,
  initializeEditor,
  hasEntry,
  // inject
  intl,
}) => {
  // TODO: This layer will hold onto the navigation between steps
  const [selected, setSelected] = React.useState(problemType);

  return (
    <div>
      <div>
        <h1>
          Problem
        </h1>
      </div>
      <div>
        {hasEntry ? (
          <EditProblemView setSelected={setSelected} />
        )
          : (
            <SelectTypeModal />
          )}
      </div>
    </div>
  );

  // selectors.problem.hasEntry
}
ProblemEditor.defaultProps = {
  blockValue: null,
  lmsEndpointUrl: null,
  studioEndpointUrl: null,
  hasEntry: false,
};
ProblemEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  // redux
  hasEntry: PropTypes.bool,
  blockValue: PropTypes.shape({
    data: PropTypes.shape({ data: PropTypes.string }),
  }),
  lmsEndpointUrl: PropTypes.string,
  studioEndpointUrl: PropTypes.string,
  blockFailed: PropTypes.bool.isRequired,
  blockFinished: PropTypes.bool.isRequired,
  initializeEditor: PropTypes.func.isRequired,
  // inject
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  lmsEndpointUrl: selectors.app.lmsEndpointUrl(state),
  studioEndpointUrl: selectors.app.studioEndpointUrl(state),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
});

export const mapDispatchToProps = {
  initializeEditor: actions.app.initializeEditor,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProblemEditor));
