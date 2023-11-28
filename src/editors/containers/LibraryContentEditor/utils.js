import { modes } from "./constants";

/**
 * checks if library id is v1
 * @param {[string]} libraryId - target library id
 * @returns {[boolean]} true if library id is v1
 */
export const isV1Library = ({
  libraryId,
}) => {
  return true
};

/**
 * gets the index of a library id
 * @param {[array]} libraries - list of all libraries
 * @param {[string]} libraryId - target library id
 * @returns {[number]} index of the library id or null if it can't be found
 */
export const getLibraryIndex = ({
  libraries,
  libraryId,
}) => {
  const index = libraries.findIndex(library => library.id === libraryId);
  if (index >= 0) {
    return index;
  } else {
    return null;
  }
};

/**
 * gets a mapping of selected rows given a list of candidates
 * @param {[array]} blocks - list of all blocks in library
 * @param {[array]} candidates - list of candidates
 * @returns {[object]} true/false mapping that shows whether a row is selected
 *    ie. first row is selected here { {0: true}, {1: false} }
 */
export const getSelectedRows = ({
  blocks,
  candidates,
}) => {
  let selectedRows = {};
  let candidatesMapping = {};
  if (candidates && candidates.length > 0) {
    candidates.forEach(candidate => {
      candidatesMapping[candidate] = true;
    });
    blocks.forEach((block, index) => {
      selectedRows[index] = !!candidatesMapping[block.id];
    });
  }
  return selectedRows;
};

/**
 * gets the index of a library id
 * @param {[array]} blocks - list of all blocks in library
 * @param {[object]} rows - true/false mapping that shows whether a row is selected
 * @returns {[array]} list of candidates
 */
export const getCandidates = ({
  blocks,
  rows,
}) => {
  let candidates = [];
  if (Object.keys(rows).length > 0) {
    blocks.forEach((block, index) => {
      if (rows[index]) {
        candidates.push(block.id);
      }
    });
  }
  return candidates;
};
