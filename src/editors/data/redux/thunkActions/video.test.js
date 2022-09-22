import { actions } from '..';
import * as thunkActions from './video';
import requests from './requests';

jest.mock('./requests', () => ({
  deleteTranscript: (args) => ({ deleteTranscript: args }),
  downloadTranscript: (args) => ({ fetchUnit: args }),
  addTranscript: (args) => ({ saveBlock: args }),
  replaceTranscript: (args) => ({ fetchImages: args }),
}));

const mockLanguage = 'la';
const mockVideoId = 'soMEvIDEo';
const mockFile = 'soMEtRANscRipT';
const mockFilename = 'soMEtRANscRipT.srt';
const mockDownloadLink = 'soMEeNDPoiNT/xblock/soMEBloCk/handler/studio_transcript/translation?language_code=la';
const mockOnSuccess = jest.fn((args) => ({ onSuccess: args })).mockName('onSuccess');

const testState = { transcripts: { la: 'test VALUE', delete: jest.fn() }, videoId: 'soMEvIDEo' };
const testDelete = {
  filename: mockFilename,
  downloadLink: mockDownloadLink,
};
const testReplaceUpload = {
  transcript: mockFile,
  language: mockLanguage,
  onSuccess: mockOnSuccess,
  videoId: mockVideoId,
};

describe('video thunkActions', () => {
  let dispatch;
  let dispatchedAction;
  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
  });
  describe('deleteTranscript', () => {
    const language = 'lAnG';
    beforeEach(() => {
      thunkActions.deleteTranscript({ language })(dispatch);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches deleteTranscript action', () => {
      expect(dispatchedAction.deleteTranscript).not.toEqual(undefined);
    });
    it('dispatches actions.app.setBlockValue on success', () => {
      dispatch.mockClear();
      dispatchedAction.deleteTranscript.onSuccess();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, actions.video.updateField(testState.transcripts.delete(testDelete)));
      dispatch.mock.calls[1][0].uploadTranscript.onSuccess();

      expect(dispatch.mock.calls[1]).toBe([requests.uploadTranscript(testReplaceUpload)]);
    });
  });
});
