import React from 'react';
import { useDispatch } from 'react-redux';

import { actions } from '../../../../../../data/redux';

// export const parseImage = ({ reader, file }) => {
//   reader.readAsDataURL(file);
//   return
// }

export const fileInput = (imgRef) => {
  const dispatch = useDispatch()
  const ref = React.useRef();
  const click = () => ref.current.click();
  const addFile = (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      imgRef.current.src = reader.result
    }
    const file = e.target.files[0];
    if (file) {
      reader.readAsDataURL(file)
      console.log(reader);
      dispatch(actions.video.updateField({ thumbnail: file }))
      console.log(imgRef);
    }
  };
  return {
    click,
    addFile,
    ref,
  };
};

export default {
  fileInput,
};
