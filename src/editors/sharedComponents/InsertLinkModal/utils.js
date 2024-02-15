import cloneDeep from 'lodash.clonedeep';

import blockTypes from './blockTypes';

/**
 * Recursively adds path, parent ID, and root status to blocks in a nested structure.
 *
 * @param {Object} block - The current block in the recursion.
 * @param {string} [parentPath=""] - The path of the parent block.
 * @param {Object} blocks - The collection of blocks.
 * @param {string} blockRoot - The key of the root block.
 * @param {string|null} [parentId=null] - The ID of the parent block.
 */
export const addPathToBlocks = (block, blocks, blockRoot, parentId = null, parentPath = '') => {
  const path = parentPath ? `${parentPath} / ${block.displayName}` : block.displayName;
  block.path = path;
  block.parentId = parentId;

  if (block.children && block.children.length > 0) {
    block.children.forEach(childKey => {
      const childBlock = blocks[childKey];
      addPathToBlocks(childBlock, blocks, blockRoot, block.id, path);
    });
  }
};

/**
 * Formats the blocks by adding path information to each block.
 *
 * @param {Object} blocks - The blocks to be formatted.
 * @param {string} blockRoot - The key of the root block.
 * @returns {Object} - The formatted blocks with added path information.
 */
export const formatBlocks = (blocks, blockRoot) => {
  const copyBlocks = cloneDeep(blocks);
  Object.keys(copyBlocks).forEach(key => {
    const block = copyBlocks[key];
    const rootBlock = copyBlocks[blockRoot];
    const parentPath = block.type === blockTypes.section ? rootBlock.displayName : '';

    addPathToBlocks(block, copyBlocks, blockRoot, null, parentPath);
  });

  return copyBlocks;
};

/**
 * Validates a URL using a regular expression.
 *
 * @param {string} url - The URL to be validated.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
export const isValidURL = (url) => {
  try {
    // eslint-disable-next-line no-new
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};
