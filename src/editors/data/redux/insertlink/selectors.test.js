import { insertlinkState } from './selectors';

describe('insertlink selectors', () => {
  describe('insertlinkState selector', () => {
    it('should return the insertlink slice of the state', () => {
      const state = {
        insertlink: {
          selectedBlocks: {
            block123: { id: 'block123', url: 'https://www.example.com' },
            block456: { id: 'block456', url: 'https://www.example.com' },
          },
        },
      };

      const { selectedBlocks } = insertlinkState(state);
      expect(selectedBlocks).toEqual(state.insertlink.selectedBlocks);
    });
  });
});
