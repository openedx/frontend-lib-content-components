import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Button, Form } from '@edx/paragon';
import { modes } from './constants';
import { actions, selectors } from './data';
import { thunkActions } from '../../data/redux';

export const LibrarySettings = ({
  // redux
  onShowResetSettingsChange,
  onCountSettingsChange,
  selectedLibrary,
  selectionSettings,
}) => {
  if (selectedLibrary === null) return <></>;

  return (
    <div className='row mb-4'>
      <div className='row col mb-3'>
        <Form.Control
          className='col col-3'
          // floatingLabel="Number of Blocks"
          onChange= {(e) => onCountSettingsChange({
            count: e.target.value,
          })}
          value={selectionSettings.count}
          type="number"
        />
        <label className='col'>How many blocks do you want to show?</label>
      </div>
      <div className='col'>
        <Form.Switch
          checked={selectionSettings.showReset}
          onChange={(e) => onShowResetSettingsChange({
            showReset: e.target.checked,
          })}
        >
          Show Reset Button
        </Form.Switch>
        <div className="x-small mt-2">
          Determines whether a 'Reset Problems' button is shown, so users may reset their answers and reshuffle selected items.
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = (state) => ({
  selectedLibrary: selectors.selectedLibrary(state),
  selectionSettings: selectors.selectionSettings(state),
})

export const mapDispatchToProps = {
  onShowResetSettingsChange: actions.onShowResetSettingsChange,
  onCountSettingsChange: actions.onCountSettingsChange,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySettings));
