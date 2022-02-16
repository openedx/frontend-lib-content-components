import JSZip from 'jszip';
import FileSaver from 'file-saver';

import { RequestKeys } from 'data/constants/requests';
import { selectors } from 'data/redux';
import { downloadFileBlobs } from 'data/services/download';

import { networkRequest } from './requests';
import * as module from './download';

/**
 * Generate a manifest file content based on files object
 * @param {obj[]} files - list of file entries with downloadUrl, name, description, and size
 * @return {string} - manifest text file content.
 */
export const genManifest = (files) => files.map(
  (file) => `Filename: ${file.name}\nDescription: ${file.description}\nSize: ${file.size}`,
).join('\n\n');

/**
 * Returns the zip filename
 * @return {string} - zip download file name
 */
export const zipFileName = () => {
  const currentDate = new Date().getTime();
  return `ora-files-download-${currentDate}.zip`;
};

/**
 * Zip the blob output of a set of files with a manifest file.
 * @param {obj[]} files - list of file entries with downloadUrl, name, and description
 * @param {blob[]} blobs - file content blobs
 * @return {Promise} - zip async process promise.
 */
export const zipFiles = (files, blobs) => {
  const zip = new JSZip();
  zip.file('manifest.txt', module.genManifest(files));
  blobs.forEach((blob, i) => zip.file(files[i].name, blob));
  return zip.generateAsync({ type: 'blob' }).then(
    zipFile => FileSaver.saveAs(zipFile, module.zipFileName()),
  );
};

export const DownloadException = (files) => ({
  files,
  name: 'DownloadException',
});


/**
 * Download all files for the selected submission as a zip file.
 * Throw error and do not download zip if any of the files fail to fetch.
 */
export const downloadFiles = () => (dispatch, getState) => {
  const { files } = selectors.grading.selected.response(getState());
  dispatch(networkRequest({
    requestKey: RequestKeys.downloadFiles,
    promise: downloadFileBlobs(files).then(blobs => {
      if (blobs.some(blob => blob === null)) {
        console.log({ blobs });
        const failed = blobs
          .map((blob, blobIndex) => ({ blob, blobIndex }))
          .filter(({ blob }) => blob === null)
          .map(({ blobIndex }) => files[blobIndex].name);
        throw DownloadException(failed);
      }
      module.zipFiles(files, blobs);
    }),
  }));
};

export default {
  downloadFiles,
};
