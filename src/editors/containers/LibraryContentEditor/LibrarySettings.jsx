import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@edx/paragon';

import messages from './messages';
import { modes } from './constants';
import { actions, selectors } from './data';
import { isV1Library } from './utils';

export const LibrarySettings = ({
  // redux
  setCountForLibrary,
  setModeForLibrary,
  setShowResetForLibrary,
  selectedLibraryId,
  settings,
}) => {
  if (selectedLibraryId === null) {
    return null;
  }

  const v1LibrarySubsection = () => (
    <div className="row mb-2 p-3 border-top">
      <FormattedMessage {...messages.isV1LibraryDescription} />
    </div>
  );

  const modeSubsection = () => (
    <div className="row mb-2 p-3 border-top">
      <Form.RadioSet
        name="mode"
        onChange={e => setModeForLibrary({
          libraryId: selectedLibraryId,
          mode: e.target.value,
        })}
        value={settings[selectedLibraryId]?.mode ?? modes.random.value}
      >
        <Form.Radio value={modes.random.value}>
          <FormattedMessage {...modes.random.description} />
        </Form.Radio>
        <Form.Radio value={modes.selected.value}>
          <FormattedMessage {...modes.selected.description} />
        </Form.Radio>
      </Form.RadioSet>
    </div>
  );

  const countSubsection = () => (
    <div className="row mb-2 pb-3">
      <Form.Control
        className="col col-2"
        onChange={(e) => setCountForLibrary({
          libraryId: selectedLibraryId,
          count: e.target.value,
        })}
        value={settings[selectedLibraryId]?.count ?? -1}
        type="number"
      />
      <Form.Label className="col">
        <FormattedMessage {...messages.countLabel} />
      </Form.Label>
    </div>
  );

  return (
    <div className="col">
      { isV1Library(selectedLibraryId) ? v1LibrarySubsection() : null }
      { !isV1Library(selectedLibraryId) ? modeSubsection() : null }
      {
        (settings[selectedLibraryId]?.mode === modes.random.value) || isV1Library(selectedLibraryId)
          ? countSubsection()
          : null
      }
      <div className="row mb-2 p-3 border-top">
        <div className="col p-0">
          <Form.Switch
            checked={settings[selectedLibraryId]?.showReset ?? false}
            onChange={(e) => setShowResetForLibrary({
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

LibrarySettings.defaultProps = {
  settings: {},
  selectedLibraryId: null,
};

LibrarySettings.propTypes = {
  // redux
  setCountForLibrary: PropTypes.func.isRequired,
  setModeForLibrary: PropTypes.func.isRequired,
  setShowResetForLibrary: PropTypes.func.isRequired,
  selectedLibraryId: PropTypes.string,
  settings: PropTypes.shape({}),
};

export const mapStateToProps = (state) => ({
  selectedLibraryId: selectors.selectedLibraryId(state),
  settings: selectors.settings(state),
});

export const mapDispatchToProps = {
  setCountForLibrary: actions.setCountForLibrary,
  setModeForLibrary: actions.setModeForLibrary,
  setShowResetForLibrary: actions.setShowResetForLibrary,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySettings));