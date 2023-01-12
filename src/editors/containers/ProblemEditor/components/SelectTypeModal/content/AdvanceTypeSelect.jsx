import React from 'react';
import PropTypes from 'prop-types';

import {
  Form,
  ActionRow,
  IconButton,
  Icon,
  OverlayTrigger,
  Tooltip,
  Hyperlink,
  Col,
} from '@edx/paragon';
import { ArrowBack } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AdvanceProblems, ProblemTypeKeys } from '../../../../../data/constants/problem';
import messages from './messages';

export const AdvanceTypeSelect = ({
  selected,
  setSelected,
  // injected
  intl,
}) => {
  const handleChange = e => { setSelected(e.target.value); };
  return (
    <Col xs={12} md={8} className="justify-content-center">
      <Form.Group className="border rounded text-primary-500 p-0">
        <ActionRow className="border-primary-100 border-bottom py-3 pl-2.5 pr-4">
          <IconButton src={ArrowBack} iconAs={Icon} onClick={() => setSelected(ProblemTypeKeys.SINGLESELECT)} />
          <ActionRow.Spacer />
          <Form.Label className="h4">
            <FormattedMessage {...messages.advanceMenuTitle} />
          </Form.Label>
          <ActionRow.Spacer />
        </ActionRow>
        <Form.RadioSet
          name="advanceTypes"
          onChange={handleChange}
          value={selected}
          className="px-4"
        >
          {Object.entries(AdvanceProblems).map(([type, data]) => {
            if (data.status !== '') {
              return (
                <ActionRow className="border-primary-100 border-bottom m-0 py-3 w-100">
                  <Form.Radio id={type} value={type}>
                    {intl.formatMessage(messages.advanceProblemTypeLabel, { problemType: data.title })}
                  </Form.Radio>
                  <ActionRow.Spacer />
                  <OverlayTrigger
                    placement="right"
                    overlay={(
                      <Tooltip>
                        <div className="text-gray-300 text-left">
                          {intl.formatMessage(messages.supportStatusTooltipMessage, { supportStatus: data.status.replace(' ', '_') })}
                        </div>
                      </Tooltip>
                    )}
                  >
                    <div className="text-gray-500">
                      {intl.formatMessage(messages.problemSupportStatus, { supportStatus: data.status })}
                    </div>
                  </OverlayTrigger>
                </ActionRow>
              );
            }
            return (
              <ActionRow className="border-primary-100 border-bottom m-0 py-3 w-100">
                <Form.Radio id={type} value={type}>
                  {intl.formatMessage(messages.advanceProblemTypeLabel, { problemType: data.title })}
                </Form.Radio>
                <ActionRow.Spacer />
              </ActionRow>
            );
          })}
        </Form.RadioSet>
      </Form.Group>
      <Hyperlink
        destination="https://edx.readthedocs.io/projects/edx-partner-course-staff/en/latest/exercises_tools/create_exercises_and_tools.html#advanced"
        target="_blank"
      >
        <FormattedMessage {...messages.learnMoreAdvancedButtonLabel} />
      </Hyperlink>
    </Col>
  );
};

AdvanceTypeSelect.defaultProps = {
  selected: null,
};

AdvanceTypeSelect.propTypes = {
  selected: PropTypes.string,
  setSelected: PropTypes.func.isRequired,
  // injected
  intl: intlShape.isRequired,
};

export default injectIntl(AdvanceTypeSelect);
