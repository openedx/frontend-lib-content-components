import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import messages from './messages';
import { modes } from './constants';
import { actions, selectors } from './data';

export const LibrarySettings = ({
  // redux
  onCountChange,
  onModeChange,
  onShowResetChange,
  selectedLibraryId,
  settings,
}) => {
  if (selectedLibraryId === null) return <></>;

  return (
    <div className='col'>
      <div className='row mb-2 p-3 border-top'>
        <Form.RadioSet
          onChange={e => onModeChange({
            libraryId: selectedLibraryId,
            mode: e.target.value,
          })}
          value={settings[selectedLibraryId]?.mode}
        >
          <Form.Radio value={modes.random.value}>
            <FormattedMessage {...modes.random.description} />
          </Form.Radio>
          <Form.Radio value={modes.selected.value}>
            <FormattedMessage {...modes.selected.description} />
          </Form.Radio>

        </Form.RadioSet>
      </div>
      {
        settings[selectedLibraryId]?.mode === modes.random.value
        ? <div className='row mb-2 pb-3'>
            <Form.Control
              className='col col-2'
              onChange= {(e) => onCountChange({
                libraryId: selectedLibraryId,
                count: e.target.value,
              })}
              value={settings[selectedLibraryId]?.count}
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
            checked={settings[selectedLibraryId]?.showReset}
            onChange={(e) => onShowResetChange({
              libraryId: selectedLibraryId,
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
  selectedLibraryId: selectors.selectedLibraryId(state),
  settings: selectors.settings(state),
})

export const mapDispatchToProps = {
  onCountChange: actions.onCountChange,
  onModeChange: actions.onModeChange,
  onShowResetChange: actions.onShowResetChange,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySettings));
