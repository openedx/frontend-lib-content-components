import React from 'react';
import { Dropdown } from '@edx/paragon';


const LibrarySelector = ({ libraries, selectedLibrary, onSelectLibrary }) => {
  return (
    <div>
      <label>Select a Library: </label>
      <Dropdown
        id="librarySelector"
        label=""
        placeholder="Select a library"
        options={libraries.map(library => ({
          label: library.name,
          value: library.id,
        }))}
        value={selectedLibrary}
        onChange={onSelectLibrary}
      />
    </div>
  );
};

export const mapStateToProps = (state) => ({
  selectionMode: selectors.library.libraries(state),
  selectionSettings: selectors.library.selectedLibrary(state),
})

export const mapDispatchToProps = {
  onSelectLibrary: reducers.library.onSelectLibrary,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LibrarySelector));


