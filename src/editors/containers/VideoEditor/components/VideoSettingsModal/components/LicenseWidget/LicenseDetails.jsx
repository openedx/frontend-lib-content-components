import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import {
  Card,
  Form,
  Icon,
  Stack,
} from '@edx/paragon';
import { Attribution } from '@edx/paragon/icons';

import { actions } from '../../../../../../data/redux';
import { LicenseLevel, LicenseTypes } from '../../../../../../data/constants/licenses';

/**
 * Collapsible Form widget controlling videe licence type and details
 */
// TODO change placeholder icons for NC, ND, SA
export const LicenseDetails = ({
  license,
  details,
  level,
  // injected
  intl,
  // redux
  updateField,
}) => {
  return (
    level === LicenseLevel.block && details
      ? (
        <div className="border-primary-100 border-bottom pb-4">
          <Form.Group>
            <Form.Label className="mt-3">LicenseDetails</Form.Label>
            {license === LicenseTypes.allRightsReserved
              ? <Form.Text>You reserve all rights for your work.</Form.Text>
              : <Stack gap={3}>
                  <Card>
                    <Card.Header
                      title={
                        <div className="d-flex flex-row flex-nowrap">
                          <Icon src={Attribution} />
                          Attribution
                        </div>
                      }
                      actions={<Form.Checkbox checked disabled />}
                    />
                    <Card.Section>
                      Allow others to copy, distribute, display and perform your copyrighted work but only if they give credit the way you request. Currently, this option is required.
                    </Card.Section>
                  </Card>

                  <Card isClickable
                    onClick={() => updateField({
                      licenseDetails: {
                        ...details,
                        noncommercial: !details.noncommercial,
                      }})}>
                    <Card.Header
                      title={
                        <div className="d-flex flex-row flex-row">
                          <Icon src={Attribution} />
                          Noncommercial
                        </div>
                      }
                      actions={
                        <Form.Checkbox 
                          checked={details.noncommercial}
                          disabled={level !== LicenseLevel.block}
                          onChange={(e) => updateField({ 
                            licenseDetails: {
                              ...details,
                              noncommercial: e.target.checked,
                            }})}
                        />
                      }
                    />
                    <Card.Section>
                      Allow others to copy, distribute, display and perform your work - and derivative works based upon it - but for noncommercial purposes only.
                    </Card.Section>
                  </Card>

                  <Card isClickable
                    onClick={() => updateField({
                      licenseDetails: {
                        ...details,
                        noDerivatives: !details.noDerivatives,
                        shareAlike: !details.noDerivatives ? false : details.shareAlike,
                      }})}>
                    <Card.Header
                      title={
                        <div className="d-flex flex-row flex-row">
                          <Icon src={Attribution} />
                          No Derivatives
                        </div>
                      }
                      actions={
                        <Form.Checkbox 
                          checked={details.noDerivatives}
                          disabled={level !== LicenseLevel.block}
                          onChange={(e) => updateField({ 
                            licenseDetails: {
                              ...details,
                              noDerivatives: e.target.checked,
                              shareAlike: e.target.checked ? false : details.shareAlike,
                            }})}
                        />
                      }
                    />
                    <Card.Section>
                      Allow others to copy, distribute, display and perform only verbatim copies of your work, not derivative works based upon it. This option is incompatible with "Share Alike".
                    </Card.Section>
                  </Card>

                  <Card isClickable
                    onClick={() => updateField({
                      licenseDetails: {
                        ...details,
                        shareAlike: !details.shareAlike,
                        noDerivatives: !details.shareAlike ? false : details.noDerivatives,
                      }})}>
                    <Card.Header
                      title={
                        <div className="d-flex flex-row flex-row">
                          <Icon src={Attribution} />
                          Share Alike
                        </div>
                      }
                      actions={
                        <Form.Checkbox 
                          checked={details.shareAlike}
                          disabled={level !== LicenseLevel.block}
                          onChange={(e) => updateField({ 
                            licenseDetails: {
                              ...details,
                              shareAlike: e.target.checked,
                              noDerivatives: e.target.checked ? false : details.noDerivatives,
                            }})}
                        />
                      }
                    />
                    <Card.Section>
                      Allow others to distribute derivative works only under a license identical to the license that governs your work. This option is incompatible with "No Derivatives".
                    </Card.Section>
                  </Card>
                </Stack>}
          </Form.Group>
        </div>
      )
      : null
  );
};

// LicenseDetails.defaultProps = {
//   details: {
//     // attribution: false,
//     // noncommercial: false,
//     // noDerivatives: false,
//     // shareAlike: false,
//   },
// };
LicenseDetails.propTypes = {
  license: PropTypes.string.isRequired,
  details: PropTypes.shape({}).isRequired,
  level: PropTypes.string.isRequired,
  // injected
  intl: intlShape.isRequired,
  // redux
  updateField: PropTypes.func.isRequired,
};

export const mapStateToProps = () => ({
});

export const mapDispatchToProps = (dispatch) => ({
  updateField: (stateUpdate) => dispatch(actions.video.updateField(stateUpdate)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LicenseDetails));
