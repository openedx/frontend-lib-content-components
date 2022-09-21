import { actions } from '..';
import { camelizeKeys } from '../../../utils';
import * as thunkActions from './video';

jest.mock('./requests', () => ({
  deleteTranscript: (args) => ({ deleteTranscript: args }),
  downloadTranscript: (args) => ({ fetchUnit: args }),
  addTranscript: (args) => ({ saveBlock: args }),
  replaceTranscript: (args) => ({ fetchImages: args }),
}));

const testValue = { data: { assets: 'test VALUE' } };

describe('video thunkActions', () => {
  let dispatch;
  let dispatchedAction;
  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
  });
  describe('deleteTranscript', () => {
    beforeEach(() => {
      const language = 'lAnG';
      thunkActions.deleteTranscript({ language })(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches deleteTranscript action', () => {
      expect(dispatchedAction.deleteTranscript).not.toEqual(undefined);
    });
    it('dispatches actions.app.setBlockValue on success', () => {
      dispatch.mockClear();
      dispatchedAction.fetchBlock.onSuccess(testValue);
      expect(dispatch).toHaveBeenCalledWith(actions.video.deleteTranscript(testValue));
    });
  });
});
