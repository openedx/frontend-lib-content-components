import { modes } from "./constants";

/**
 * checks if library id is v1. defaults to false
 * @param {[string]} libraryId - target library id
 * @returns {[boolean]} true if library id is v1
 */
export const isV1Library = (libraryId) => {
  if (!libraryId || (typeof libraryId !== 'string')) {
    return false;
  }
  if (libraryId.split(':')[0] === 'library-v1') {
    return true;
  }
  return false;
};

/**
 * gets the name of a library whether it is v1 or v2
 * @param {[object]} library - library
 * @returns {[string]} library name. returns an empty string if nothing is found
 */
export const getLibraryName = (library) => {
  if (!library) {
    return '';
  }
  return library.title || library.display_name || '';
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
