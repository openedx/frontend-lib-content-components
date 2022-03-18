import React from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Icon,
  IconButton,
} from '@edx/paragon';
import {
  Locked,
  Unlocked,
} from '@edx/paragon/icons';

import hooks from './hooks';

/**
 * Wrapper for image dimension inputs and the lock checkbox.
 * @param {bool} isLocked - are dimensions locked
 * @param {func} lock - lock dimensions
 * @param {func} setHeight - updates dimensions based on new height
 * @param {func} setWidth - updates dimensions based on new width
 * @param {func} unlock - unlock dimensions
 * @param {func} updateDimensions - update dimensions callback
 * @param {obj} value - local dimension values { height, width }
 */
export const DimensionControls = ({
  isLocked,
  lock,
  setHeight,
  setWidth,
  unlock,
  updateDimensions,
  value,
}) => ((value !== null) && (
  <Form.Group>
    <Form.Label as="h4">Image Dimensions</Form.Label>
    <div className="mt-4.5">
      <Form.Control
        className="dimension-input"
        type="number"
        value={value.width}
        min={1}
        onChange={hooks.onInputChange(setWidth)}
        onBlur={updateDimensions}
        floatingLabel="Width"
      />
      <Form.Control
        className="dimension-input"
        type="number"
        value={value.height}
        min={1}
        onChange={hooks.onInputChange(setHeight)}
        onBlur={updateDimensions}
        floatingLabel="Height"
      />
      <IconButton
        className="d-inline-block"
        alt={isLocked ? 'unlock dimensions' : 'lock dimensions'}
        iconAs={Icon}
        src={isLocked ? Locked : Unlocked}
        onClick={isLocked ? unlock : lock}
      />
    </div>
  </Form.Group>
));
DimensionControls.defaultProps = {
  value: {
    height: 100,
    width: 100,
  },
};
DimensionControls.propTypes = ({
  value: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  setHeight: PropTypes.func.isRequired,
  setWidth: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
  lock: PropTypes.func.isRequired,
  unlock: PropTypes.func.isRequired,
  updateDimensions: PropTypes.func.isRequired,
});

export default DimensionControls;
