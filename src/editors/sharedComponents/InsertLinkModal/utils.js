import cloneDeep from 'lodash.clonedeep';

export const blockTypes = {
  section: 'chapter',
  subsection: 'sequential',
  unit: 'vertical',
};

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
 * Retrieves a list of sections from the provided blocks object.
 *
 * @param {Object} blocks - The blocks object containing various block types.
 * @returns {Array} An array of section (type: chapter) blocks extracted from the blocks object.
 */
export const getSectionsList = (blocks = {}) => {
  const blocksList = Object.keys(blocks);
  return blocksList.reduce((previousBlocks, blockKey) => {
    const block = cloneDeep(blocks[blockKey]);
    if (block.type === blockTypes.section) {
      return [...previousBlocks, block];
    }

    return previousBlocks;
  }, []);
};

/**
 * Retrieves an array of child blocks based on the children list of a selected block.
 *
 * @param {Object} blockSelected - The selected block for which children are to be retrieved.
 * @param {Object} blocks - The blocks object containing various block types.
 * @returns {Array} An array of child blocks cloned from the blocks object.
 */
export const getChildrenFromList = (blockSelected, blocks) => {
  if (blockSelected.children) {
    return blockSelected.children.map((key) => cloneDeep(blocks[key]));
  }
  return [];
};

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

/**
 * Formats a block path into title and subtitle.
 *
 * @param {string} path - The path to be formatted.
 * @returns {Object} - Formatted block path with title and subtitle.
 */
export const formatBlockPath = (path) => {
  if (!path) {
    return {
      title: '',
      subTitle: '',
    };
  }
  const pathSlitted = path.split(' / ');
  let title = pathSlitted.pop();
  const subTitle = pathSlitted.join(' / ');

  if (!title.trim()) {
    // If the last part is empty or contains only whitespace
    title = pathSlitted.pop();
  }
  return {
    title,
    subTitle,
  };
};

/**
 * Validates a URL using a regular expression.
 *
 * @param {string} url - The URL to be validated.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
export const isValidURL = (url) => {
  // Regular expression for a basic URL validation
  const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

  // Test the provided URL against the pattern
  return urlPattern.test(url);
};
