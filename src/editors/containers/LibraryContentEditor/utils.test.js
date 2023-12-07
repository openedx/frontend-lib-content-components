import * as module from './utils';

describe('utils', () => {
  const blocks = [
    { id: 'block1', display_name: 'textblock', block_type: 'html' },
    { id: 'block2', display_name: 'vidblock', block_type: 'video' },
    { id: 'block3', display_name: 'probblock', block_type: 'problem' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isV1Library', () => {
    const v1Id = 'library-v1:id';
    const v2Id = 'lib:org:id';
    it('should return true if the id is for a v1 library', () => {
      expect(module.isV1Library(v1Id)).toBe(true);
    });
    it('should return false if the id is not for a v1 library', () => {
      expect(module.isV1Library(v2Id)).toBe(false);
    });
  });

  describe('getLibraryName', () => {
    const v1Lib = {
      library_key: 'v1lib',
      display_name: 'v1name',
    };
    const v2Lib = {
      id: 'v2lib',
      title: 'v2name',
      version: 1,
    };
    it('should return v1 library name for a v1 library', () => {
      expect(module.getLibraryName(v1Lib)).toEqual(v1Lib.display_name);
    });
    it('should return v2 library name for a v2 library', () => {
      expect(module.getLibraryName(v2Lib)).toEqual(v2Lib.title);
    });
    it('should return an empty string for anything else', () => {
      expect(module.getLibraryName({})).toEqual('');
    });
  });

  describe('getSelectedRow', () => {
    it('should return the correct true/false row mapping', () => {
      expect(module.getSelectedRows({
        blocks,
        candidates: [ [blocks[2].block_type, blocks[2].id] ],
      })).toEqual({
        2: true,
      });
      expect(module.getSelectedRows({
        blocks,
        candidates: [
          [blocks[1].block_type, blocks[1].id],
          [blocks[0].block_type, blocks[0].id],
        ],
      })).toEqual({
        0: true,
        1: true,
      });
    });
    it('should return an empty object for anything else', () => {
      expect(module.getSelectedRows({ blocks })).toEqual({});
    });
  });

  describe('getCandidates', () => {
    it('should return an array of candidate tuples', () => {
      expect(module.getCandidates({
        blocks,
        rows: { 0: true },
      })).toEqual([
        [ blocks[0].block_type, blocks[0].id ],
      ]);
      expect(module.getCandidates({
        blocks,
        rows: { 1: true, 2: true },
      })).toEqual([
        [ blocks[1].block_type, blocks[1].id ],
        [ blocks[2].block_type, blocks[2].id ],
      ]);
    });
    it('should return an empty array for anything else', () => {
      expect(module.getCandidates({ blocks })).toEqual([]);
    });
  });
});
