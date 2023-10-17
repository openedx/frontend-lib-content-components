import React from 'react';
import { modes } from './constants';
import { selectors, thunkActions } from '../../data/redux';

const BlockSettingsEditor = ({
    selectionMode,
    onSelectionModeChange,
    selectionSettings,
    blocksInSelectedLibrary,
    onSelectionSettingsChange,
 }) => {

  const getSelectionSettings = () =>{
    if (selectionMode === modes.all){
      return (<></>)
    }
    if (selectionMode === modes.random){
      return (
        <>
        <Form.Group>
          <Form.Control
            type="number"
            value={selectionSettings.count}
            onChange= {(e)=>onSelectionSettingsChange({
              count: e.target.value,
              ...selectionSettings
            })}
            floatingLabel="How many blocks do you want to show the author?"
          />
        </Form.Group>
        <Form.Group>
          <Form.Switch
            checked={selectionSettings.showReset}
            onChange={(e) => onSelectionSettingsChange({
              showReset: e.target.checked,
              ...selectionSettings
            })}
          >
            Show Reset Button
          </Form.Switch>
          <div className="x-small mt-2">
            Determines whether a 'Reset Problems' button is shown, so users may reset their answers and reshuffle selected items.
          </div>
        </Form.Group>
        {/* TODO: ADD CAPA FILTERING FOR V1 ONLY */}
        </>
      )
    }
    if (selectionMode === modes.selected){
      return (
          <>
          {/*TODO: ADD BLOCK PICKER*/}
          <p>Block Selection Can be Made by Saving the editor and clicking the "view" button or going here.</p>
          {/* Opens library page in new window.*/}
          <a>https://studio.edx.org/container/block-v1:edX+LA101+2022_Summer+type@library_content+block@6a0e7d3c67614ae78e28d575408624cf</a>
          </>
      )
    }
  }
  return (
    <div>
        <Form.Group as={Col} controlId="formGridState">
        <Form.Control floatingLabel="How Do You Want to Select Your Content?" as="select"
            onChange={onSelectionModeChange}
            value={selectionMode}
        >
            {
                modes.values().map(mode => (<option value={mode.value}>{mode.description}</option>))
            }
        </Form.Control>
        {getSelectionSettings()}
        </Form.Group>
    </div>
  );
};

export const mapStateToProps = (state) => ({
    selectionMode: selectors.library.selectionMode(state),
    selectionSettings: selectors.library.selectionSettings(state),
    blocksInSelectedLibrary: selectors.library.blocksInSelectedLibrary(state),
})

export const mapDispatchToProps = {
  onSelectionModeChange: thunkActions.library.onSelectionModeChange,
  onSelectionSettingsChange: thunkActions.library.onSelectionSettingsChange,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibraryBlockPicker));