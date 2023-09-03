import {
  useState,
} from 'react';

export const useImgModalToggle = () => {
  const [isImgOpen, setIsOpen] = useState(false);
  return {
    isImgOpen,
    openImgModal: () => setIsOpen(true),
    closeImgModal: () => setIsOpen(false),
  };
};

export const useSourceCodeModalToggle = (editorRef) => {
  const [isSourceCodeOpen, setIsOpen] = useState(false);
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
  const [selection, setSelection] = useState(val);

  return {
    clearSelection: () => setSelection(null),
    selection,
    setSelection,
  };
};
