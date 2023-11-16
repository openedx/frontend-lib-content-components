/**
 * gets the index of a library id
 * @param {[array]} libraries - list of libraries
 * @param {[string]} libraryId - target library id
 */
export const getLibraryIndex = ({
  libraries,
  libraryId,
}) => {
  const index = libraries.findIndex(library => library.library_key === libraryId);
  if (index >= 0) {
    return index;
  } else {
    return null;
  }
};

/**
 * gets the 
 * @param {[array]} candidates - list of candidates in tuples
 * @param {[string]} libraryId - target library id
 */
export const getSelectedRow = ({
  candidates,
}) => {

};

/**
 * gets the index of a library id
 * @param {[object]} getSelectedRow - 
 * @param {[string]} libraryId - target library id
 */
export const getCandidates = ({
  getSelectedRow,
}) => {

};
