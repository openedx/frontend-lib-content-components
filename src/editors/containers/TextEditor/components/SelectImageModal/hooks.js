import React from 'react';
import * as module from './hooks';
import { sortKeys, sortFuncKeys } from './utils';

export const state = {
  images: (val) => React.useState(val),
  highlighted: (val) => React.useState(val),
  searchString: (val) => React.useState(val),
  sortBy: (val) => React.useState(val),
  error: (val) => React.useState(val),
};

export const imgHooks = ({ fetchImages, uploadImage, setSelection }) => {
  const selection = module.selection();
  const searchSortProps = module.searchAndSort();
  const fileInputRef = React.useRef();
  const { error, setError } = module.errorHooks();

  React.useEffect(() => {
    fetchImages({ setImages: selection.setImages });
  }, []);

  return {
    searchSortProps,
    galleryProps: {
      imgList: module.getFilteredImages(selection.images, searchSortProps.searchString, searchSortProps.sortBy),
      highlighted: selection.highlighted,
      onHighlightChange: e => selection.setHighlighted(e.target.value),
    },
    disableNext: !selection.highlighted,

    fileInputRef,
    addFileClick: () => fileInputRef.current.click(),
    addFile: e => uploadImage({
      file: e.target.files[0],
      resetFile: () => {
        fileInputRef.current.value = '';
      },
      setError,
    }),
    onConfirmSelection: () => setSelection(module.getImg(selection.highlighted, selection.images)),
    error,
    setError,
  };
};

export const selection = () => {
  const [images, setImages] = module.state.images([]);
  const [highlighted, setHighlighted] = module.state.highlighted(null);
  return {
    images,
    setImages,
    highlighted,
    setHighlighted,
  };
};

export const searchAndSort = () => {
  const [searchString, setSearchString] = module.state.searchString('');
  const [sortBy, setSortBy] = module.state.sortBy(sortKeys.dateNewest);
  return {
    searchString,
    onSearchChange: e => setSearchString(e.target.value),
    clearSearchString: () => setSearchString(''),
    sortBy,
    onSortClick: key => () => setSortBy(sortKeys[key]),
  };
};

export const errorHooks = () => {
  const [error, setError] = module.state.error(null);
  return {
    error,
    setError,
    clearError: () => setError(null),
  };
};

export const getFilteredImages = (images, searchString, sortBy) => {
  const list = images.filter(img => img.displayName.toLowerCase().includes(searchString.toLowerCase()));
  let sorted = false;
  Object.keys(sortKeys).forEach(key => {
    if (sortBy === sortKeys[key]) {
      list.sort(sortFuncKeys[key]);
      sorted = true;
    }
  });
  if (!sorted) {
    list.sort(sortFuncKeys.dateNewest);
  }
  return list;
};

export const getImg = (imgId, imgList) => imgList.find(img => img.id === imgId);

export default {
  imgHooks,
};
