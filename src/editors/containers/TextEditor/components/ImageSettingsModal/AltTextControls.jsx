import React from 'react';
import PropTypes from 'prop-types';

import { Form } from '@edx/paragon';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import * as hooks from './hooks';
import messages from './messages';

/**
 * Wrapper for alt-text input and isDecorative checkbox control
 * @param {obj} errorProps - props for error handling
 *   {bool} isValid - are alt-text fields valid for saving?
 * @param {bool} isDecorative - is the image decorative?
 * @param {func} setIsDecorative - handle isDecorative change event
 * @param {func} setValue - update alt-text value
 * @param {string} value - current alt-text value
 */
export const AltTextControls = ({
  errorProps,
  isDecorative,
  setIsDecorative,
  setValue,
  value,
  // inject
  intl,
}) => (
  <Form.Group className="mt-4.5">
    <Form.Label as="h4">
      <FormattedMessage {...messages.accessibilityLabel} />
    </Form.Label>
    <Form.Control
      className="mt-4.5"
      disabled={isDecorative}
      floatingLabel={intl.formatMessage(messages.altTextFloatingLabel)}
      isInvalid={errorProps.showSubmissionError}
      onChange={hooks.onInputChange(setValue)}
      type="input"
      value={value}
    />
    {errorProps.showSubmissionError
      ? (
        <Form.Control.Feedback type="invalid">
          <FormattedMessage {...messages.altTextLocalFeedback} />
        </Form.Control.Feedback>
      )
      : null}
    <Form.Checkbox
      checked={isDecorative}
      className="mt-4.5 decorative-control-label"
      onChange={hooks.onCheckboxChange(setIsDecorative)}
    >
      <Form.Label>
        <FormattedMessage {...messages.decorativeCheckboxLabel} />
      </Form.Label>
    </Form.Checkbox>
  </Form.Group>
);
AltTextControls.propTypes = {
  errorProps: PropTypes.shape({
    showSubmissionError: PropTypes.bool,
  }).isRequired,
  isDecorative: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  setIsDecorative: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  // inject
  intl: intlShape.isRequired,
};

export default injectIntl(AltTextControls);