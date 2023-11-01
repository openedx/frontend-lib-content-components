import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Form } from '@edx/paragon';

import messages from './messages';
import { modes } from './constants';
import { actions, selectors } from './data';
import { thunkActions } from '../../data/redux';

export const LibrarySettings = ({
  // redux
  onCountSettingsChange,
  onSelectionModeChange,
  onShowResetSettingsChange,
  selectedLibrary,
  selectionMode,
  selectionSettings,
}) => {
  if (selectedLibrary === null) return <></>;

  return (
    <div className='col'>
      <div className='row mb-2 p-3 border-top'>
        <Form.RadioSet
          onChange={e => onSelectionModeChange({ selectionMode: e.target.value })}
          value={selectionMode}
        >
          <Form.Radio value={modes.random.value}>
            <FormattedMessage {...modes.random.description} />
          </Form.Radio>
          <Form.Radio value={modes.selected.value}>
            <FormattedMessage {...modes.selected.description} />
          </Form.Radio>

        </Form.RadioSet>
        {/* <Form.Switch
          helperText={
            <span><FormattedMessage {...modes[selectionMode].description} /></span>
          }
          onChange={(e) => onSelectionModeChange({
            selectionMode: (e.target.checked ? modes.selected.value : modes.random.value)
          })}
        >
          <FormattedMessage {...modes[selectionMode].title} />
        </Form.Switch> */}
      </div>
      {
        selectionMode === modes.random.value
        ? <div className='row mb-2 pb-3'>
            <Form.Control
              className='col col-2'
              onChange= {(e) => onCountSettingsChange({
                count: e.target.value,
              })}
              value={selectionSettings.count}
              type="number"
            />
            <label className='col pt-2'>
              <FormattedMessage {...messages.countLabel} />
            </label>
          </div>
        : null
      }
      
      <div className='row mb-2 p-3 border-top'>
        <div className='col p-0'>
          <Form.Switch
            checked={selectionSettings.showReset}
            onChange={(e) => onShowResetSettingsChange({
              showReset: e.target.checked,
            })}
          >
            <FormattedMessage {...messages.resetButton} />
          </Form.Switch>
          <div className="x-small mt-2">
            <FormattedMessage {...messages.resetButtonDescription} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = (state) => ({
  selectedLibrary: selectors.selectedLibrary(state),
  selectionMode: selectors.selectionMode(state),
  selectionSettings: selectors.selectionSettings(state),
})

export const mapDispatchToProps = {
  onCountSettingsChange: actions.onCountSettingsChange,
  onSelectionModeChange: actions.onSelectionModeChange,
  onShowResetSettingsChange: actions.onShowResetSettingsChange,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySettings));
