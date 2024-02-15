import cloneDeep from 'lodash.clonedeep';
import blockTypes from '../blockTypes';

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
