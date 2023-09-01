import {
  useState,
  useRef,
  useEffect,
} from 'react';

import { StrictDict } from '../../utils';

import {
  addImagesAndDimensionsToRef,
} from './logic';

export const state = StrictDict({
  // eslint-disable-next-line react-hooks/rules-of-hooks
  isImageModalOpen: (val) => useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  isSourceCodeModalOpen: (val) => useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  imageSelection: (val) => useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  refReady: (val) => useState(val),
});

export const useImagesEffect = ({ assets, editorContentHtml }) => {
  const imagesRef = useRef([]);

  useEffect(() => {
    addImagesAndDimensionsToRef({ imagesRef, assets, editorContentHtml });
  }, []);

  return { imagesRef };
};

export const useImgModalToggle = () => {
  const [isImgOpen, setIsOpen] = state.isImageModalOpen(false);
  return {
    isImgOpen,
    openImgModal: () => setIsOpen(true),
    closeImgModal: () => setIsOpen(false),
  };
};

export const useSourceCodeModalToggle = (editorRef) => {
  const [isSourceCodeOpen, setIsOpen] = state.isSourceCodeModalOpen(false);
  return {
    isSourceCodeOpen,
    openSourceCodeModal: () => setIsOpen(true),
    closeSourceCodeModal: () => {
      setIsOpen(false);
      editorRef.current.focus();
    },
  };
};

export const useSelectedImage = (val) => {
  const [selection, setSelection] = state.imageSelection(val);

  return {
    clearSelection: () => setSelection(null),
    selection,
    setSelection,
  };
};
