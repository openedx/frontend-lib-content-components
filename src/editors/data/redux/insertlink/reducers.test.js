import { reducer, actions, initialState } from './reducers';

describe('insertlink reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle addBlock', () => {
    const payload = {
      block123: { id: 'block123', content: 'Block 123 content' },
      block456: { id: 'block456', content: 'Block 456 content' },
    };
    const action = actions.addBlock(payload);

    const previousState = {
      selectedBlocks: { block789: { id: 'block789', content: 'Block 789 content' } },
    };

    const expectedState = {
      selectedBlocks: {
        ...previousState.selectedBlocks,
        ...payload,
      },
    };

    expect(reducer(previousState, action)).toEqual(expectedState);
  });
});
