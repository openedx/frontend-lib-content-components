import React from 'react';
import { connect, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';
import {
  Form,
  Icon,
  IconButtonWithTooltip,
  OverlayTrigger,
  Tooltip,
} from '@edx/paragon';
import { Delete } from '@edx/paragon/icons';

import { actions } from '../../../../../../data/redux';
import hooks from './hooks';
import messages from './messages';
import { LicenseLevel, LicenseNames, LicenseTypes } from '../../../../../../data/constants/licenses';

/**
 * Collapsible Form widget controlling videe license type and details
 */
export const LicenseSelection = ({
  license,
  level,
  // injected
  intl,
  // redux
  updateField,
}) => {
  const { levelDescription } = hooks.determineText({ level });
  const onLicenseChange = hooks.onSelectLicense({ dispatch: useDispatch() });

  return (
    <div className="border-primary-100 border-bottom pb-4">
      <Form.Group className="mt-2 mx-2">
        <Form.Row className="mt-4.5">
          <Form.Control
            as="select"
            defaultValue={license}
            disabled={level !== LicenseLevel.block}
            floatingLabel="License Type"
            onChange={(e) => onLicenseChange(e.target.value)}
          >
            {Object.entries(LicenseNames).map(([key, text]) => {
              if (license === key) { return (<option value={LicenseTypes[key]} selected>{text}</option>); }
              return (<option value={LicenseTypes[key]}>{text}</option>);
            })}
          </Form.Control>
          {level === LicenseLevel.block
            ? (
              <IconButtonWithTooltip
                iconAs={Icon}
                src={Delete}
                onClick={() => updateField({ licenseType: null })}
                tooltipPlacement="top"
                tooltipContent={<FormattedMessage {...messages.deleteLicenseSelection} />}
              />
            ): null
          }
        </Form.Row>
        <Form.Text>{levelDescription}</Form.Text>
      </Form.Group>
    </div>
  );
};

LicenseSelection.propTypes = {
  license: PropTypes.string.isRequired,
  details: PropTypes.shape({}).isRequired,
  // injected
  intl: intlShape.isRequired,
  // redux
  updateField: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
});

export const mapDispatchToProps = (dispatch) => ({
  updateField: (stateUpdate) => dispatch(actions.video.updateField(stateUpdate)),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LicenseSelection));
