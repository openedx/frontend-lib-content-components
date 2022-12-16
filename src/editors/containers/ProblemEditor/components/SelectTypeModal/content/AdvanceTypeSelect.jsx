import React from 'react';
import PropTypes from 'prop-types';

import { Form, ActionRow, IconButton, Icon, OverlayTrigger, Tooltip } from '@edx/paragon';
import { ArrowBack } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { camelizeKeys } from '../../../../../utils';
import { AdvanceProblemKeys, AdvanceProblems } from '../../../../../data/constants/problem';
import messages from './messages';

export const AdvanceTypeSelect = ({
  setSelected,
  // injected
  intl,
}) => {
  const [value, setValue] = React.useState('blankadvanced')
  const handleChange = e => {setSelected(e.target.value); setValue(e.target.value)}
  console.log(camelizeKeys(AdvanceProblems['imageresponse'].status));
  return (
    <div className="col col-8 border rounded p-0">
      <Form.Group className='p-0'>
        <ActionRow className="border-primary-100 border-bottom py-3">
          <IconButton src={ArrowBack} iconAs={Icon} onClick={setSelected(null)} />
          <ActionRow.Spacer/>
          <Form.Label className="h4">
            <FormattedMessage {...messages.advanceMenuTitle} />
          </Form.Label>
          <ActionRow.Spacer />
        </ActionRow>
        <Form.RadioSet
          name="advanceTypes"
          onChange={handleChange}
          value={value}
          className="px-2.5"
        >
          {Object.entries(AdvanceProblems).map(([type, data]) => {
            if (data.status !== '') {
              return (
                <ActionRow className="border-primary-100 py-3 border-bottom">
                  <Form.Radio value={type}>
                    {intl.formatMessage(messages.advanceProblemTypeLabel, { problemType: data.title })}
                  </Form.Radio>
                  <ActionRow.Spacer />
                  <OverlayTrigger
                    placement='right'
                    overlay={(
                      <Tooltip>
                        <div className='text-gray-300 text-left'>
                          {intl.formatMessage(messages.supportStatusTooltipMessage, { supportStatus: data.status.replace(' ', '_') })}
                        </div>
                      </Tooltip>
                    )}
                  >
                    <div>
                      {intl.formatMessage(messages.problemSupportStatus, { supportStatus: data.status })}
                    </div>
                  </OverlayTrigger>
                </ActionRow>
              );
            }
            return (
              <ActionRow className="border-primary-100 py-3 border-bottom">
                <Form.Radio value={type}>
                  {intl.formatMessage(messages.advanceProblemTypeLabel, { problemType: data.title })}
                </Form.Radio>
                <ActionRow.Spacer />
              </ActionRow>
            );
          })}
        </Form.RadioSet>
      </Form.Group>   
    </div> 
  );
};

export default injectIntl(AdvanceTypeSelect);