import {
  addPathToBlocks,
  formatBlocks,
  getSectionsList,
  getChildrenFromList,
  filterBlocksByText,
  formatBlockPath,
  isValidURL,
} from './utils';

describe('utils', () => {
  describe('addPathToBlocks function', () => {
    const testBlocks = {
      'block-key': {
        id: 'block-key',
        blockId: 'edx_block-1',
        lmsWebUrl: 'http://localhost/weburl',
        legacyWebUrl: 'http://localhost/legacy',
        studentViewUrl: 'http://localhost/studentview',
        type: 'sequential',
        displayName: 'Any display name',
        children: ['block-children-1', 'block-children-2'],
      },
      'block-children-1': {
        id: 'block-children-1',
        blockId: 'edx_block-1',
        lmsWebUrl: 'http://localhost/weburl',
        legacyWebUrl: 'http://localhost/legacy',
        studentViewUrl: 'http://localhost/studentview',
        type: 'sequential',
        displayName: 'Block children 1',
      },
      'block-children-2': {
        id: 'block-children-2',
        blockId: 'edx_block-2',
        lmsWebUrl: 'http://localhost/weburl',
        legacyWebUrl: 'http://localhost/legacy',
        studentViewUrl: 'http://localhost/studentview',
        type: 'sequential',
        displayName: 'Block children 2',
      },
    };

    test('Adds path to block without parent', () => {
      const testBlock = testBlocks['block-key'];
      addPathToBlocks(testBlock, testBlocks, 'block-key');

      expect(testBlock.path).toBe('Any display name');
      expect(testBlock.parentId).toBe(null);
    });

    test('Adds path to nested block', () => {
      const rootBlockId = 'block-key';
      const parentBlock = testBlocks[rootBlockId];
      const nestedBlock1 = testBlocks['block-children-1'];
      const nestedBlock2 = testBlocks['block-children-2'];

      addPathToBlocks(nestedBlock1, testBlocks, rootBlockId, parentBlock.id, parentBlock.displayName);
      addPathToBlocks(nestedBlock2, testBlocks, rootBlockId, parentBlock.id, parentBlock.displayName);

      expect(nestedBlock1.path).toBe('Any display name / Block children 1');
      expect(nestedBlock1.parentId).toBe(rootBlockId);

      expect(nestedBlock2.path).toBe('Any display name / Block children 2');
      expect(nestedBlock2.parentId).toBe(rootBlockId);
    });
  });

  describe('formatBlocks', () => {
    const mockBlocks = {
      blockRoot: {
        id: 'blockRoot',
        blockId: 'edx_block-1',
        lmsWebUrl: 'http://localhost/weburl',
        legacyWebUrl: 'http://localhost/legacy',
        studentViewUrl: 'http://localhost/studentview',
        type: 'character',
        displayName: 'Any display name',
        children: ['block1', 'block2'],
      },
      block1: {
        id: 'block1',
        blockId: 'edx_block-1',
        lmsWebUrl: 'http://localhost/weburl',
        legacyWebUrl: 'http://localhost/legacy',
        studentViewUrl: 'http://localhost/studentview',
        displayName: 'Block children 1',
        type: 'sequential',
      },
      block2: {
        id: 'block2',
        blockId: 'edx_block-2',
        lmsWebUrl: 'http://localhost/weburl',
        legacyWebUrl: 'http://localhost/legacy',
        studentViewUrl: 'http://localhost/studentview',
        type: 'sequential',
        displayName: 'Block children 2',
      },
    };

    test('correctly formats blocks with path information', () => {
      const formattedBlocks = formatBlocks(mockBlocks, 'blockRoot');
      expect(formattedBlocks.block1.path).toBeDefined();
      expect(formattedBlocks.block2.path).toBeDefined();
    });

    test('correctly assigns parentId to blocks', () => {
      const formattedBlocks = formatBlocks(mockBlocks, 'blockRoot');
      expect(formattedBlocks.block1.parentId).toBeDefined();
      expect(formattedBlocks.block2.parentId).toBeDefined();
    });

    test('returns an empty object when blocks are empty', () => {
      const formattedBlocks = formatBlocks({}, 'blockRoot');
      expect(formattedBlocks).toEqual({});
    });

    test('handles invalid input gracefully', () => {
      const formattedBlocks = formatBlocks(mockBlocks, 'nonExistingRoot');
      expect(formattedBlocks.blockRoot.parentId).toBeNull();
      expect(formattedBlocks.block1.parentId).toBeNull();
      expect(formattedBlocks.block2.parentId).toBeNull();
    });

    test('maintains the original structure of blocks', () => {
      const formattedBlocks = formatBlocks(mockBlocks, 'blockRoot');
      expect(formattedBlocks.block1.id).toEqual('block1');
      expect(formattedBlocks.block1.displayName).toEqual('Block children 1');
    });
  });

  describe('getSectionsList function', () => {
    test('returns an empty array for an empty blocks object', () => {
      const result = getSectionsList({});
      expect(result).toEqual([]);
    });

    test('returns an empty array if there are no sections in the blocks object', () => {
      const blocks = {
        block1: {
          id: 'block1',
          type: 'unit',
        },
        block2: {
          id: 'block2',
          type: 'vertical',
        },
      };
      const result = getSectionsList(blocks);
      expect(result).toEqual([]);
    });

    test('returns an array containing sections from the blocks object', () => {
      const blocks = {
        section1: {
          id: 'section1',
          type: 'chapter',
        },
        block1: {
          id: 'block1',
          type: 'unit',
        },
        section2: {
          id: 'section2',
          type: 'chapter',
        },
        block2: {
          id: 'block2',
          type: 'vertical',
        },
      };
      const result = getSectionsList(blocks);
      const expected = [
        {
          id: 'section1',
          type: 'chapter',
        },
        {
          id: 'section2',
          type: 'chapter',
        },
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('getChildrenFromList function', () => {
    test('returns an empty array when blockSelected has no children', () => {
      const blocks = {
        parentBlock: {
          id: 'parentBlock',
        },
      };

      const selectedBlock = blocks.parentBlock;
      const childrenList = getChildrenFromList(selectedBlock, blocks);

      expect(childrenList).toEqual([]);
    });

    test('returns an array of child blocks when blockSelected has children', () => {
      const blocks = {
        parentBlock: {
          id: 'parentBlock',
          children: ['child1', 'child2'],
        },
        child1: {
          id: 'child1',
        },
        child2: {
          id: 'child2',
        },
      };

      const selectedBlock = blocks.parentBlock;
      const childrenList = getChildrenFromList(selectedBlock, blocks);

      expect(childrenList).toHaveLength(2);
      expect(childrenList).toContainEqual(blocks.child1);
      expect(childrenList).toContainEqual(blocks.child2);
    });

    test('returns an empty array when blockSelected.children is undefined', () => {
      const blocks = {
        parentBlock: {
          id: 'parentBlock',
          children: undefined,
        },
      };

      const selectedBlock = blocks.parentBlock;
      const childrenList = getChildrenFromList(selectedBlock, blocks);

      expect(childrenList).toEqual([]);
    });

    test('returns an empty array when blockSelected.children is an empty array', () => {
      const blocks = {
        parentBlock: {
          id: 'parentBlock',
          children: [],
        },
      };

      const selectedBlock = blocks.parentBlock;
      const childrenList = getChildrenFromList(selectedBlock, blocks);

      expect(childrenList).toEqual([]);
    });
  });

  describe('filterBlocksByText function', () => {
    const testBlocks = {
      block1: {
        id: 'block1',
        path: 'Root / Child 1',
      },
      block2: {
        id: 'block2',
        path: 'Root / Child 2',
      },
      block3: {
        id: 'block3',
        path: 'Another / Block',
      },
    };

    test('returns an empty object when searchText is empty', () => {
      const searchText = '';
      const filteredBlocks = filterBlocksByText(searchText, testBlocks);
      expect(filteredBlocks).toEqual({});
    });

    test('filters blocks based on case-insensitive searchText', () => {
      const searchText = 'child';
      const filteredBlocks = filterBlocksByText(searchText, testBlocks);
      expect(filteredBlocks).toEqual({
        block1: {
          id: 'block1',
          path: 'Root / Child 1',
        },
        block2: {
          id: 'block2',
          path: 'Root / Child 2',
        },
      });
    });

    test('returns an empty object when no blocks match searchText', () => {
      const searchText = 'nonexistent';
      const filteredBlocks = filterBlocksByText(searchText, testBlocks);
      expect(filteredBlocks).toEqual({});
    });

    test('filters blocks with partial matches in path', () => {
      const searchText = 'root';
      const filteredBlocks = filterBlocksByText(searchText, testBlocks);
      expect(filteredBlocks).toEqual({
        block1: {
          id: 'block1',
          path: 'Root / Child 1',
        },
        block2: {
          id: 'block2',
          path: 'Root / Child 2',
        },
      });
    });
  });

  describe('formatBlockPath function', () => {
    test('formats a simple path with title and subtitle', () => {
      const path = 'Root / Child 1 / Grandchild';
      const formattedPath = formatBlockPath(path);
      expect(formattedPath).toEqual({
        title: 'Grandchild',
        subTitle: 'Root / Child 1',
      });
    });

    test('handles an empty title by using the previous part as title', () => {
      const path = 'Root / Child 1 / ';
      const formattedPath = formatBlockPath(path);
      expect(formattedPath).toEqual({
        title: 'Child 1',
        subTitle: 'Root / Child 1',
      });
    });

    test('handles an empty path by returning an empty title and subtitle', () => {
      const path = '';
      const formattedPath = formatBlockPath(path);
      expect(formattedPath).toEqual({
        title: '',
        subTitle: '',
      });
    });

    test('handles whitespace in the title by using the previous part as title', () => {
      const path = 'Root / Child 1 /   ';
      const formattedPath = formatBlockPath(path);
      expect(formattedPath).toEqual({
        title: 'Child 1',
        subTitle: 'Root / Child 1',
      });
    });

    test('handles a path with only one part by using it as the title', () => {
      const path = 'SinglePart';
      const formattedPath = formatBlockPath(path);
      expect(formattedPath).toEqual({
        title: 'SinglePart',
        subTitle: '',
      });
    });
  });

  describe('isValidURL function', () => {
    test('returns true for a valid HTTP URL', () => {
      const validHTTPUrl = 'http://www.example.com';
      expect(isValidURL(validHTTPUrl)).toBe(true);
    });

    test('returns true for a valid HTTPS URL', () => {
      const validHTTPSUrl = 'https://www.example.com';
      expect(isValidURL(validHTTPSUrl)).toBe(true);
    });

    test('returns true for a valid FTP URL', () => {
      const validFTPUrl = 'ftp://ftp.example.com';
      expect(isValidURL(validFTPUrl)).toBe(true);
    });

    test('returns false for an invalid URL', () => {
      const invalidUrl = 'invalid-url';
      expect(isValidURL(invalidUrl)).toBe(false);
    });

    test('returns false for an empty URL', () => {
      const emptyUrl = '';
      expect(isValidURL(emptyUrl)).toBe(false);
    });

    test('returns false for a URL with spaces', () => {
      const urlWithSpaces = 'http://www.example with spaces.com';
      expect(isValidURL(urlWithSpaces)).toBe(false);
    });
  });
});
