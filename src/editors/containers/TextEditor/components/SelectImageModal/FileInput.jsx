import React from 'react';
import PropTypes from 'prop-types';

import { acceptedImgKeys } from './utils';

export const FileInput = ({ fileInput }) => (
  <input
    accept={Object.values(acceptedImgKeys).join()}
    className="upload d-none"
    onChange={fileInput.addFile}
    ref={fileInput.ref}
    type="file"
  />
);

FileInput.propTypes = {
  fileInput: PropTypes.shape({
    addFile: PropTypes.func,
    ref: PropTypes.func,
  }).isRequired,
};

export default FileInput;
