import React from 'react';
import * as module from './hooks';
import * as sortUtils from './sortUtils';

export const state = {
  loading: (val) => React.useState(val),
  images: (val) => React.useState(val),
  selected: (val) => React.useState(val),
  searchString: (val) => React.useState(val),
  sortFilter: (val) => React.useState(val),
};

// setState(null)
//sortCategory

export const imgHooks = ({ fetchImages, setSelection }) => {
  const [loading, setLoading] = module.state.loading(true);
  const [images, setImages] = module.state.images([]);
  const [selected, setSelected] = module.state.selected("");
  const [searchString, setSearchString] = module.state.searchString("");
  const [sortFilter, setSortFilter] = module.state.sortFilter(0);

  React.useEffect(() => {
    fetchImages({ onSuccess: setImages });
    setLoading(false);
  }, []);

  return {
    loading,
    imgList: getFilteredImages(images, searchString, sortFilter),
    searchString, setSearchString,
    sortFilter, setSortFilter,
    selected,
    selectImg: (e) => onSelectImg(e, setSelected),
    onConfirmSelection: setSelection(images.find(img => img.id === selected)),
  };
};

export const uploadHooks = ({ uploadImage }) => {
  const addFileRef = React.useRef();

  return {
    addFileRef,
    addFileClick: () => addFileRef.current.click(),
    addFile: (file) => {
      console.log(file)
      uploadImage(file)
    },
  }
};

export const getFilteredImages = (images, searchString, sortFilter) => {
  const list = images.filter(img => 
    img.displayName.toLowerCase().includes(searchString.toLowerCase())  
  );
  switch ( sortFilter ) {
    case 0:
      list.sort(sortUtils.dateNewest);
      break;
    case 1:
      list.sort(sortUtils.dateOldest);
      break;
    case 2:
      list.sort(sortUtils.nameAscending);
      break;
    case 3:
      list.sort(sortUtils.nameDescending);
      break;
  }
  return list;
};

export const onSelectImg = (e, setSelected) => 
  e.target.value === selected
  ? setSelected("")
  : setSelected(e.target.value);

export default {
  imgHooks,
  uploadHooks,
};