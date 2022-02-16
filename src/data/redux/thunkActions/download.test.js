import JSZip from 'jszip';
import FileSaver from 'file-saver';

import { selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import * as download from './download';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));
jest.mock('jszip', () => {
  const file = jest.fn();
  const zipFile = 'test zip output';
  const generateAsync = jest.fn(() => new Promise((resolve) => resolve(zipFile)));
  return function zip() {
    return { file, zipFile, generateAsync };
  };
});

jest.mock('./requests', () => ({
  networkRequest: (args) => ({ networkRequest: args }),
}));

jest.mock('data/redux/grading/selectors', () => ({
  selected: {
    response: jest.fn(),
  },
}));

jest.useFakeTimers();

describe('download thunkActions', () => {
  const testState = { some: 'testy-state' };
  const mockFile = (name) => ({
    downloadUrl: `home/${name}`,
    name,
    description: `${name} description`,
    size: name.length,
  });
  const files = [mockFile('test-file1.jpg'), mockFile('test-file2.pdf')];
  const blobs = ['blob1', 'blob2'];
  const response = { files };
  let dispatch;
  const getState = () => testState;
  describe('genManifest', () => {
    test('returns a list of strings with filename and description for each file', () => {
      expect(download.genManifest(response.files)).toEqual([
        `Filename: ${files[0].name}\nDescription: ${files[0].description}\nSize: ${files[0].size}`,
        `Filename: ${files[1].name}\nDescription: ${files[1].description}\nSize: ${files[0].size}`,
      ].join('\n\n'));
    });
  });
  describe('zipFileName', () => {
    // add tests when name is more nailed down
  });
  describe('zipFiles', () => {
    test('zips files and manifest', () => {
      const mockZip = new JSZip();
      const mockFilename = 'mock-filename';
      module.genManifest = (testFiles) => ({ genManifest: testFiles });
      download.zipFileName = () => mockFilename;
      return download.zipFiles(files, blobs).then(() => {
        expect(mockZip.file.mock.calls).toEqual([
          ['manifest.txt', download.genManifest(files)],
          [files[0].name, blobs[0]],
          [files[1].name, blobs[1]],
        ]);
        expect(mockZip.generateAsync).toHaveBeenCalledWith({ type: 'blob' });
        expect(FileSaver.saveAs).toHaveBeenCalledWith(mockZip.zipFile, mockFilename);
      });
    });
  });

  describe('downloadFile', () => {
    let fetch;
    const blob = 'test-blob';
    beforeEach(() => {
      fetch = window.fetch;
      window.fetch = jest.fn();
    });
    afterEach(() => {
      window.fetch = fetch;
    });
    it('returns blob output if successful', () => {
      window.fetch.mockReturnValue(new Promise(resolve => resolve({ ok: true, blob: () => blob })));
      return download.downloadFile(files[0]).then(val => expect(val).toEqual(blob));
    });
    it('returns null if not successful', () => {
      window.fetch.mockReturnValue(new Promise(resolve => resolve({ ok: false })));
      return download.downloadFile(files[0]).then(val => expect(val).toEqual(null));
    });
  });

  describe('downloadBlobs', () => {
    it('returns a joing promise mapping all files to download action', async () => {
      download.downloadFile = (file) => new Promise(resolve => resolve(file.name));
      const responses = await download.downloadBlobs(files);
      expect(responses).toEqual(files.map(file => file.name));
    });
  });

  describe('downloadFiles', () => {
    beforeEach(() => {
      dispatch = jest.fn();
      selectors.grading.selected.response = () => ({ files });
      module.zipFiles = jest.fn();
    });
    it('dispatches network request with downloadFiles key', () => {
      module.downloadBlobs = () => new Promise(resolve => resolve(blobs));
      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      expect(networkRequest.requestKey).toEqual(RequestKeys.downloadFiles);
    });
    it('dispatches network request for downloadFiles, zipping output of downloadBlobs', () => {
      module.downloadBlobs = () => new Promise(resolve => resolve(blobs));
      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      networkRequest.promise.then(() => {
        expect(module.zipFile).toHaveBeenCalledWith(files, blobs);
      });
    });
    it('throws an error on failure', () => {
      module.downloadBlobs = () => new Promise((resolve, reject) => reject());
      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      expect(networkRequest.promise).rejects.toThrow('Fetch failed');
    });
  });
});
