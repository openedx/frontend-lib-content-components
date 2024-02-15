import { getSectionsList, getChildrenFromList } from './utils';

describe('BlockList utils', () => {
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
});
