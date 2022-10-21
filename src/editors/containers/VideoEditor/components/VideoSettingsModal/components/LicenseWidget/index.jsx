import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import {
  Button,
  Card,
  Form,
  Hyperlink,
  Stack,
} from '@edx/paragon';
import { Add } from '@edx/paragon/icons';

import { actions, selectors } from '../../../../../../data/redux';
import hooks from './hooks';

import CollapsibleFormWidget from '../CollapsibleFormWidget';
import LicenseBlurb from './LicenseBlurb';
import LicenseSelection from './LicenseSelection';
import LicenseDetails from './LicenseDetails';
import { LicenseTypes } from '../../../../../../data/constants/licenses';

/**
 * Collapsible Form widget controlling videe licence type and details
 */
export const LicenseWidget = ({
  // injected
  intl,
  // redux
  isLibrary,
  licenseType,
  licenseDetails,
  courseLicenseType,
  courseLicenseDetails,
  updateField,
}) => {
  const { license, details, level } = hooks.determineLicense({ 
    isLibrary,
    licenseType,
    licenseDetails,
    courseLicenseType,
    courseLicenseDetails,
  });
  const { licenseDescription, levelDescription } = hooks.determineText({ level });

  return (
    <CollapsibleFormWidget
      subtitle={
        <div>
          <LicenseBlurb license={license} details={details} />
          <Form.Text>{levelDescription}</Form.Text>
        </div>
      }
      title="License"
    >
      <Stack gap={3}>
        <LicenseSelection license={license} level={level} />

        <LicenseDetails license={license} details={details} level={level} />

        <Form.Group>
          <Form.Label className="mt-3">License Display</Form.Label>
          <Card>
            <Card.Header title={<LicenseBlurb license={license} details={details} />} />
            <Card.Section>{licenseDescription}</Card.Section>
          </Card>
          {licenseType === LicenseTypes.creativeCommons
            ? <Hyperlink destination="https://creativecommons.org/about" target="_blank">
                View License Details
              </Hyperlink>
            : null}
        </Form.Group>

        {!licenseType
          ? <div className="border-primary-100 border-top pb-4">
              <Button
                iconBefore={Add}
                variant="link"
                onClick={() => updateField({ licenseType: LicenseTypes.allRightsReserved })}
              >
                Add a license for this video
              </Button>
            </div>
          : null}
      </Stack>
    </CollapsibleFormWidget>
  );
};

LicenseWidget.defaultProps = {
  isLibrary: null,
};
LicenseWidget.propTypes = {
  // injected
  intl: intlShape.isRequired,
  // redux
  updateField: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  isLibrary: selectors.app.isLibrary(state),
  licenseType: selectors.video.licenseType(state),
  licenseDetails: selectors.video.licenseDetails(state),
});

export const mapDispatchToProps = (dispatch) => ({
  updateField: (stateUpdate) => dispatch(actions.video.updateField(stateUpdate)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LicenseWidget));
