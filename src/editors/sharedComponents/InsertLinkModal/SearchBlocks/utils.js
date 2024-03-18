/* eslint-disable import/prefer-default-export */
import cloneDeep from 'lodash.clonedeep';

/**
 * Filters blocks based on the provided searchText.
 *
 * @param {string} searchText - The text to filter blocks.
 * @param {Object} blocks - The object containing blocks.
 * @returns {Object} - Filtered blocks.
 */
export const filterBlocksByText = (searchText, blocks) => {
  if (!searchText) {
    return {};
  }
  const copyBlocks = cloneDeep(blocks);
  return Object.keys(copyBlocks).reduce((result, key) => {
    const item = copyBlocks[key];
    if (item.path.toLowerCase().includes(searchText.toLowerCase())) {
      result[key] = item;
    }
    return result;
  }, {});
};
