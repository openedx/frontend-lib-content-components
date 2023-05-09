import React from 'react';
import * as module from './hooks';
import messages from './messages';
import {
  filterKeys,
  filterMessages,
  sortKeys,
  sortMessages,
  sortFunctions,
} from './utils';

export const state = {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  highlighted: (val) => React.useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  searchString: (val) => React.useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  showSelectVideoError: (val) => React.useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  showSizeError: (val) => React.useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  sortBy: (val) => React.useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  filertBy: (val) => React.useState(val),
  // eslint-disable-next-line react-hooks/rules-of-hooks
  hideSelectedVideos: (val) => React.useState(val),
};

export const searchAndSortProps = () => {
  const [searchString, setSearchString] = module.state.searchString('');
  const [sortBy, setSortBy] = module.state.sortBy(sortKeys.dateNewest);
  const [filterBy, setFilterBy] = module.state.filertBy(filterKeys.videoStatus);
  const [hideSelectedVideos, setHideSelectedVideos] = module.state.hideSelectedVideos(false);

  return {
    searchString,
    onSearchChange: (e) => setSearchString(e.target.value),
    clearSearchString: () => setSearchString(''),
    sortBy,
    onSortClick: (key) => () => setSortBy(key),
    sortKeys,
    sortMessages,
    filterBy,
    onFilterClick: (key) => () => setFilterBy(key),
    filterKeys,
    filterMessages,
    showSwitch: true,
    hideSelectedVideos,
    switchMessage: messages.hideSelectedCourseVideosSwitchLabel,
    onSwitchClick: () => setHideSelectedVideos(!hideSelectedVideos),
  };
};

export const filterListBySearch = ({ searchString, videoList }) => (
  videoList.filter(({ displayName }) => displayName.toLowerCase().includes(searchString.toLowerCase()))
);

export const filterListByStatus = ({ statusFilter, videoList }) => {
  if (statusFilter === filterKeys.videoStatus) {
    return videoList;
  }
  return videoList.filter(({ status }) => status === statusFilter);
};

export const filterListByHideSelectedCourse = ({ videoList }) => (
  // TODO Missing to implement this
  videoList
);

export const filterList = ({
  sortBy,
  filterBy,
  searchString,
  videos,
}) => {
  let filteredList = module.filterListBySearch({
    searchString,
    videoList: videos,
  });
  filteredList = module.filterListByStatus({
    statusFilter: filterBy,
    videoList: filteredList,
  });
  filteredList = module.filterListByHideSelectedCourse({
    videoList: filteredList,
  });
  return filteredList.sort(sortFunctions[sortBy in sortKeys ? sortKeys[sortBy] : sortKeys.dateNewest]);
};

export const videoListProps = ({ searchSortProps, videos }) => {
  const [highlighted, setHighlighted] = module.state.highlighted(null);
  const [
    showSelectVideoError,
    setShowSelectVideoError,
  ] = module.state.showSelectVideoError(false);
  const [
    showSizeError,
    setShowSizeError,
  ] = module.state.showSizeError(false);
  const filteredList = module.filterList({ ...searchSortProps, videos });
  return {
    galleryError: {
      show: showSelectVideoError,
      set: () => setShowSelectVideoError(true),
      dismiss: () => setShowSelectVideoError(false),
      message: messages.selectVideoError,
    },
    // TODO We need to update this message when implementing the video upload screen
    inputError: {
      show: showSizeError,
      set: () => setShowSizeError(true),
      dismiss: () => setShowSelectVideoError(false),
      message: messages.fileSizeError,
    },
    galleryProps: {
      galleryIsEmpty: Object.keys(filteredList).length === 0,
      searchIsEmpty: filteredList.length === 0,
      displayList: filteredList,
      highlighted,
      onHighlightChange: (e) => setHighlighted(e.target.value),
      emptyGalleryLabel: messages.emptyGalleryLabel,
      showIdsOnCards: true,
      height: '100%',
    },
    selectBtnProps: {
      onclick: () => {
        // TODO Update this when implementing the selection feature
      },
    },
  };
};

export const fileInputProps = () => {
  // TODO [Update video] Implement this
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = React.useRef();
  const click = () => ref.current.click();

  return {
    click,
    addFile: () => {},
    ref,
  };
};

export const buildVideos = ({ rawVideos }) => {
  let videos = [];
  const rawVideoList = Object.values(rawVideos);
  if (rawVideoList.length > 0) {
    videos = rawVideoList.map(video => ({
      id: video.edx_video_id,
      displayName: video.client_video_id,
      externalUrl: video.course_video_image_url,
      dateAdded: video.created,
      locked: false,
      thumbnail: video.course_video_image_url,
      status: video.status,
      statusBadgeVariant: module.getstatusBadgeVariant({ status: video.status }),
      duration: video.duration,
      transcripts: video.transcripts,
    }));
  }
  return videos;
};

export const getstatusBadgeVariant = ({ status }) => {
  switch (status) {
    case filterKeys.failed:
      return 'danger';
    case filterKeys.uploading:
    case filterKeys.processing:
      return 'light';
    default:
      return null;
  }
};

export const videoProps = ({ videos }) => {
  const searchSortProps = module.searchAndSortProps();
  const videoList = module.videoListProps({ searchSortProps, videos });
  const {
    galleryError,
    galleryProps,
    inputError,
    selectBtnProps,
  } = videoList;
  const fileInput = module.fileInputProps();

  return {
    galleryError,
    inputError,
    fileInput,
    galleryProps,
    searchSortProps,
    selectBtnProps,
  };
};

export default {
  videoProps,
  buildVideos,
};
