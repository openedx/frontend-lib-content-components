import * as reactRedux from 'react-redux';
import hooks from './hooks';

import { actions } from '../../../../../../data/redux';

const lang1 = 'kLinGon';
const lang1Code = 'kl';
const lang2 = 'eLvIsh';
const lang2Code = 'el';
const lang3 = 'sImLisH';
const lang3Code = 'sl';
const transcript1 = 'fIlEnAme1.srt';
const transcript2 = 'fIlenAME2.srt';
const transcript3 = 'fIlenAmE3.nOtSrt';

const transcripts = {
  [lang1Code]: {
    fileName: transcript1,
  },
  [lang2Code]: {
    fileName: transcript2,
  },
};

jest.mock('../../../../../../data/redux', () => ({
  actions: {
    video: {
      updateField: jest.fn(args => ({ updateField: args })).mockName('actions.video.updateField'),
      replaceTranscript: jest.fn(args => ({ replaceTranscript: args })).mockName('actions.video.replaceTranscript'),
      addTranscript: jest.fn(args => ({ addTranscript: args })).mockName('actions.video.replaceTranscript'),
    },
  },
}));

describe('TextEditor hooks', () => {
  describe('transcriptLanguages', () => {
    test('it returns none when given empty object', () => {
      expect(hooks.transcriptLanguages({})).toEqual('None');
    });
    test('it creates a list based on transcript object', () => {
      expect(hooks.transcriptLanguages(transcripts)).toEqual(`${lang1Code}, ${lang2Code}`);
    });
  });

  describe('onSelectLanguage', () => {
    const mockLangValue = 'soMeLanGuaGeCoDE';
    const mockEvent = { target: { value: mockLangValue } };
    const mockDispatch = jest.fn();

    test('it dispatches the correct thunk', () => {
      const cb = hooks.onSelectLanguage({
        fileName: transcript1, dispatch: mockDispatch, transcripts, languageBeforeChange: lang1Code,
      });
      const newTranscripts = {
        transcripts: { [lang2Code]: { fileName: transcript2 }, [mockLangValue]: { fileName: transcript1 } },
      };
      cb(mockEvent);
      expect(actions.video.updateField).toHaveBeenCalledWith(newTranscripts);
      expect(mockDispatch).toHaveBeenCalledWith({ updateField: newTranscripts });
    });
  });

  describe('replaceFileCallback', () => {
    const mockFile = 'sOmeEbytes';
    const mockFileName = 'one.srt';
    const mockEvent = { target: { value: mockFileName, files: [mockFile] } };
    const mockDispatch = jest.fn();

    const result = { newFile: mockFile, newFileName: mockFileName, language: lang1Code };

    test('it dispatches the correct thunk', () => {
      const cb = hooks.replaceFileCallback({
        dispatch: mockDispatch, language: lang1Code,
      });
      cb(mockEvent);
      expect(actions.video.replaceTranscript).toHaveBeenCalledWith(result);
      expect(mockDispatch).toHaveBeenCalledWith({ replaceTranscript: result });
    });
  });
  describe('addFileCallback', () => {
    const mockFile = 'sOmeEbytes';
    const mockFileName = 'one.srt';
    const mockEvent = { target: { value: mockFileName, files: [mockFile] } };
    const mockDispatch = jest.fn();

    const result = { file: mockFile, fileName: mockFileName };

    test('it dispatches the correct thunk', () => {
      const cb = hooks.addFileCallback({
        dispatch: mockDispatch,
      });
      cb(mockEvent);
      expect(actions.video.addTranscript).toHaveBeenCalledWith(result);
      expect(mockDispatch).toHaveBeenCalledWith({ addTranscript: result });
    });
  });
});
