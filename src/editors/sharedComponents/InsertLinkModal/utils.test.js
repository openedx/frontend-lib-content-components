import {
  addPathToBlocks,
  formatBlocks,
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
