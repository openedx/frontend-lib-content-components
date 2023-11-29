import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { modes } from './constants';
import { actions } from '../../data/redux';
import * as urls from './data/urls';
import * as requests from './data/requests';
import { RequestKeys } from '../../data/constants/requests';
import { getLibraryIndex, getCandidates, getSelectedRows, isV1Library, getLibraryName } from './utils';

export const useLibraryHook = ({
  blockFailed,
  blockFinished,
  libraryPayload,
  blockValue,
}) => {
  const dispatch = useDispatch();
  
  // fetch libraries when block finishes loading
  useEffect(() => {
    if (blockFinished && !blockFailed) {
      dispatch(requests.fetchV2Libraries({
        onSuccess: (response) => {
          dispatch(actions.library.loadLibraryList({
            libraries: response?.data,
          }));
        },
        onFailure: (error) => {
          dispatch(actions.requests.failRequest({
            requestKey: RequestKeys.fetchV2Libraries,
            error,
          }));
        },
      }));
      dispatch(requests.fetchV1Libraries({
        onSuccess: (response) => {
          dispatch(actions.library.loadLibraryList({
            libraries: response?.data?.libraries,
          }));
        },
        onFailure: (error) => {
          dispatch(actions.requests.failRequest({
            requestKey: RequestKeys.fetchV1Libraries,
            error,
          }));
        },
      }));
    }
  }, [blockFinished, blockFailed]);

  // load previously saved library info into state
  useEffect(() => {
    const metadata = blockValue?.data?.metadata;
    const selectedLibraryId = metadata?.source_library_id ?? null;
    let version = '';
    let settings = {};
    if (!!selectedLibraryId) {
      version = metadata?.source_library_version;
      settings = {
        [selectedLibraryId]: {
          mode: metadata?.manual ? modes.selected.value : modes.random.value,
          count: metadata?.max_count,
          showReset: metadata?.allow_resetting_children,
          candidates: metadata?.candidates,
        },
      };
    }
    dispatch(actions.library.initializeFromBlockValue({ selectedLibraryId, version, settings }));
  }, [blockValue]);

  return {
    getContent: () => libraryPayload,
  };
};

export const useLibrarySelectorHook = ({
  libraries,
  selectedLibraryId,
  settings,
}) => {
  const dispatch = useDispatch();
  const [ selectedLibraryIndex, setSelectedLibraryIndex ] = useState(
    getLibraryIndex({
      libraries,
      libraryId: selectedLibraryId,
    })
  );

  // fetch v1 library version
  useEffect(() => {
    if (!!selectedLibraryId && isV1Library(selectedLibraryId)) {
      dispatch(requests.fetchLibraryProperty({
        libraryId: selectedLibraryId,
        onSuccess: (response) => {
          dispatch(actions.library.setLibraryVersion({
            version: response?.data?.version,
          }));
        },
        onFailure: (error) => {
          dispatch(actions.requests.failRequest({
            requestKey: RequestKeys.fetchLibraryProperty,
            error,
          }));
        },
      }));
    }
  }, [selectedLibraryId]);

  useEffect(() => {
    if (selectedLibraryIndex !== null) {
      const selectedLibraryId = libraries[selectedLibraryIndex].id || libraries[selectedLibraryIndex].library_key;
      dispatch(actions.library.setLibraryId({ selectedLibraryId }));
      dispatch(actions.library.setLibraryVersion({ version: libraries[selectedLibraryIndex].version }))
      if (!settings[selectedLibraryId]) {
        dispatch(actions.library.initializeSettings({ selectedLibraryId }));
      }
    } else {
      dispatch(actions.library.unloadLibrary());
    }
  }, [selectedLibraryIndex]);

  return {
    selectionName: getLibraryName(libraries[selectedLibraryIndex])
      ? getLibraryName(libraries[selectedLibraryIndex])
      : 'Select a library',
    setSelectedLibraryIndex,
  };
};

export const useBlocksHook = ({
  blocksInSelectedLibrary,
  selectedLibraryId,
}) => {
  const dispatch = useDispatch();

  // fetch v2 library content
  useEffect(() => {
    if (!!selectedLibraryId) {
      dispatch(requests.fetchLibraryContent({
        libraryId: selectedLibraryId,
        onSuccess: (response) => {
          dispatch(actions.library.setLibraryBlocks({
            blocks: response?.data,
          }));
        },
        onFailure: (error) => {
          dispatch(actions.requests.failRequest({
            requestKey: RequestKeys.fetchLibraryProperty,
            error,
          }));
        },
      }));
    }
  }, [selectedLibraryId]);

  const blockTypeDisplay = (type) => {
    if (type === 'html') return 'Text';
    if (type === 'video') return 'Video';
    if (type === 'problem') return 'Problem';
    return 'Other';
  };

  return ({
    blockUrls: blocksInSelectedLibrary.map(block => (
      urls.blockContent({ blockId: block.id })
    )),
    blocksTableData: blocksInSelectedLibrary.map(block => ({
      display_name: block.display_name,
      block_type: blockTypeDisplay(block.block_type),
    })),
  });
};
