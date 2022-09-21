import { actions } from '..';
import * as requests from './requests';
import * as thunkActions from './video';

jest.mock('./requests', () => ({
  deleteTranscript: (args) => ({ deleteTranscript: args }),
  uploadTranscript: (args) => ({ uploadTranscript: args }),
}));

const mockLanguage = 'la';
const mockVideoId = 'soMEvIDEo';
const mockFile = 'soMEtRANscRipT';
const mockFilename = 'soMEtRANscRipT.srt';
const mockDownloadLink = 'soMEeNDPoiNT/xblock/soMEBloCk/handler/studio_transcript/translation?language_code=la';
const mockOnSuccess = jest.fn().mockName('onSuccess');

const testState = { transcripts: { la: 'test VALUE', delete: jest.fn() }, videoId: 'soMEvIDEo' };
const testUpload = {
  transcripts: {
    delete: jest.fn(),
    la: {
      filename: mockFilename,
      downloadLink: mockDownloadLink,
    },
  },
};
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
  let getState;
  let dispatchedAction;
  beforeEach(() => {
    dispatch = jest.fn((action) => ({ dispatch: action }));
    getState = jest.fn(() => ({
      app: { studioEndpointUrl: 'soMEeNDPoiNT', blockId: 'soMEBloCk' },
      video: testState,
    }));
  });
  describe('deleteTranscript', () => {
    beforeEach(() => {
      thunkActions.deleteTranscript({ language: mockLanguage })(dispatch, getState);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches deleteTranscript action', () => {
      expect(dispatchedAction.deleteTranscript).not.toEqual(undefined);
    });
    // test('passes language as transcript prop', () => {
    //   expect(dispatchedAction.deleteTranscript.image).toEqual(testState);
    // });
    it('dispatches actions.video.updateField on success', () => {
      dispatch.mockClear();
      dispatchedAction.deleteTranscript.onSuccess();
      expect(dispatch).toHaveBeenCalledWith(actions.video.updateField(testState.transcripts.delete(testDelete)));
    });
  });
  describe('uploadTranscript', () => {
    beforeEach(() => {
      thunkActions.uploadTranscript({
        language: 'la',
        filename: 'soMEiMage.jpeg',
        file: 'soMEiMage',
      })(dispatch, getState);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches uploadTranscript action', () => {
      expect(dispatchedAction.uploadTranscript).not.toEqual(undefined);
    });
    it('dispatches actions.video.updateField on success', () => {
      dispatch.mockClear();
      dispatchedAction.uploadTranscript.onSuccess();
      expect(dispatch).toHaveBeenCalledWith(actions.video.updateField(testUpload));
    });
  });
  describe('replaceTranscript', () => {
    beforeEach(() => {
      thunkActions.replaceTranscript({
        newFile: mockFile,
        newFilename: mockFilename,
        language: mockLanguage,
      })(dispatch, getState);
      [[dispatchedAction]] = dispatch.mock.calls;
    });
    it('dispatches deleteTranscript action', () => {
      expect(dispatchedAction.deleteTranscript).not.toEqual(undefined);
    });
    it('dispatches actions.video.updateField and replaceTranscript success', () => {
      dispatch.mockClear();
      dispatchedAction.deleteTranscript.onSuccess();
      expect(dispatch).toHaveBeenCalledTimes(2);
      expect(dispatch).toHaveBeenNthCalledWith(1, actions.video.updateField(testState.transcripts.delete(testDelete)));
      expect(dispatch.mock.calls[1]).toBe([requests.uploadTranscript(testReplaceUpload)]);
    });
  });
});
