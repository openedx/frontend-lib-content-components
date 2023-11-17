import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { modes } from './constants';
import { actions } from '../../data/redux';
import * as urls from './data/urls';
import * as requests from './data/requests';
import { RequestKeys } from '../../data/constants/requests';
import { getLibraryIndex, getCandidates, getSelectedRows } from './utils';

export const useLibraryHook = ({
  blockFailed,
  blockFinished,
  libraryPayload,
  blockValue,
}) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (blockFinished && !blockFailed) {

    // TODO fetch v1 as well and put them in a list together
    dispatch(requests.fetchV2Libraries({
      onSuccess: (response) => {
        dispatch(actions.library.loadLibraryList({
          libraries: response?.data,  //v2 libraries
          // libraries: response?.data?.libraries,  // this is for v1
        }));
      },
      onFailure: (error) => {
        dispatch(actions.requests.failRequest({
          requestKey: RequestKeys.fetchV2Libraries,
          error,
        }));
      },
    }));
  }
  }, [blockFinished, blockFailed]);

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

  // needed to fetch v1 library version
  // useEffect(() => {
  //   if (!!selectedLibraryId) {
  //     dispatch(requests.fetchLibraryProperty({
  //       libraryId: selectedLibraryId,
  //       onSuccess: (response) => {
  //         dispatch(actions.library.setLibraryVersion({
  //           version: response?.data?.version,
  //         }));
  //       },
  //       onFailure: (error) => {
  //         dispatch(actions.requests.failRequest({
  //           requestKey: RequestKeys.fetchLibraryProperty,
  //           error,
  //         }));
  //       },
  //     }));
  //   }
  // }, [selectedLibraryId]);

  useEffect(() => {
    if (selectedLibraryIndex !== null) {
      const selectedLibraryId = libraries[selectedLibraryIndex].id;
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
    setSelectedLibraryIndex,
    selectionName: (selectedLibraryIndex === null)
      ? 'Select a library'
      : libraries[selectedLibraryIndex]?.title,
  };
};

export const useBlocksHook = ({
  blocksInSelectedLibrary,
  candidates,
  mode,
  selectedLibraryId,
}) => {
  const dispatch = useDispatch();
  const [ prevLibraryId, setPrevLibraryId ] = useState(null);
  const [ selectedRows, setSelectedRows ] = useState({});

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
  
  useEffect(() => {
    console.log('testcandidates', candidates)
    if (!!prevLibraryId) {
      dispatch(actions.library.onCandidatesChange({
        libraryId: prevLibraryId,
        candidates: getCandidates({
          blocks: blocksInSelectedLibrary,
          rows: selectedRows,
        }),
      }));
      // onCandidatesChange({
      //   libraryId: tempLibraryId,
      //   candidates: tempCandidates,
      // });
    }
    setPrevLibraryId(selectedLibraryId);
    setSelectedRows(
      getSelectedRows({
        blocks: blocksInSelectedLibrary,
        candidates,
      })
    );
    // setTempLibraryId(selectedLibraryId);
    // setTempCandidates(candidates);
  }, [selectedLibraryId]);

  useEffect(() => {
    if (mode === modes.random.value) {
      // onCandidatesChange({
      //   libraryId: tempLibraryId,
      //   candidates: tempCandidates,
      // });
      dispatch(actions.library.onCandidatesChange({
        libraryId: selectedLibraryId,
        candidates: getCandidates({
          blocks: blocksInSelectedLibrary,
          rows: selectedRows,
        }),
      }));
    }
  }, [mode]);

  const blockTypeDisplay = (type) => {
    if (type === 'html') return 'Text';
    if (type === 'video') return 'Video';
    if (type === 'problem') return 'Problem';
    return 'Other';
  };

  return ({
    selectedRows,
    setSelectedRows,
    blockUrls: blocksInSelectedLibrary.map(block => (
      urls.blockContent({ blockId: block.id })
    )),
    blocksTableData: blocksInSelectedLibrary.map(block => ({
      display_name: block.display_name,
      block_type: blockTypeDisplay(block.block_type),
    })),
  });
};
