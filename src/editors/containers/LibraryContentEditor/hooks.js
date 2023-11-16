import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { modes } from './constants';
import { actions } from '../../data/redux';
import * as requests from './data/requests';
import { RequestKeys } from '../../data/constants/requests';
import { getLibraryIndex, getCandidates, getSelectedRow } from './utils';

export const useLibraryHook = ({
  blockFailed,
  blockFinished,
  libraryPayload,
  blockValue,
}) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (blockFinished && !blockFailed) {

    dispatch(requests.fetchContentStore({
      onSuccess: (response) => {
        dispatch(actions.library.loadLibraryList({
          libraries: response?.data?.libraries,
        }));
      },
      onFailure: (error) => {
        dispatch(actions.requests.failRequest({
          requestKey: RequestKeys.fetchContentStore,
          error,
        }));
      },
    }));
  }
  }, [blockFinished, blockFailed]);

  useEffect(() => {
    console.log('testinitlibprop', blockValue)
    const metadata = blockValue?.data?.metadata;
    const selectedLibraryId = metadata?.source_library_id ?? null;
    let settings = {}
    if (!!selectedLibraryId) {
      settings = {
        [selectedLibraryId]: {
          mode: metadata?.mode,
          count: metadata?.count,
          showReset: metadata?.allow_resetting_children,
          candidates: metadata?.candidates,
        },
      };
    }
    dispatch(actions.library.initializeFromBlockValue({ selectedLibraryId, settings }));
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
  const [ selectedLibrary, setSelectedLibrary ] = useState(
    getLibraryIndex({
      libraries,
      libraryId: selectedLibraryId,
    })
  );

  useEffect(() => {
    if (!!selectedLibraryId) {
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
    if (selectedLibrary !== null) {
      const selectedLibraryId = libraries[selectedLibrary].library_key;
      dispatch(actions.library.setLibraryId({ selectedLibraryId }));
      if (!settings[selectedLibraryId]) {
        dispatch(actions.library.initializeSettings({ selectedLibraryId }));
      }
    } else {
      dispatch(actions.library.unloadLibrary());
    }
  }, [selectedLibrary]);

  return {
    setSelectedLibrary,
    selectionName: (selectedLibrary === null)
      ? 'Select a library'
      : libraries[selectedLibrary]?.display_name,
  };
};

export const useBlocksHook = ({
  blocksInSelectedLibrary,
  candidates,
  mode,
  onCandidatesChange,
  selectedLibraryId,
}) => {
  const [ tempLibraryId, setTempLibraryId ] = useState(null);
  const [ tempCandidates, setTempCandidates ] = useState({});
  const [ prevLibraryId, setPrevLibraryId ] = useState(null);
  const [ selectedRows, setSelectedRows ] = useState({});

  const fetchLibraryBlocks = (selectedLibraryId) => useEffect(() => {
    if (!!selectedLibraryId) {
      dispatch(requests.fetchLibraryContent({
        libraryId: selectedLibraryId,
        onSuccess: (response) => {
          dispatch(actions.library.setLibraryBlocks({
            blocks: response?.data?.results,
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
    if (!!prevLibraryId) {
      dispatch(actions.library.onCandidatesChange({
        libraryId: prevLibraryId,
        candidates: getCandidates(selectedRows),
      }));
      // onCandidatesChange({
      //   libraryId: tempLibraryId,
      //   candidates: tempCandidates,
      // });
    }
    setTempLibraryId(selectedLibraryId);
    setTempCandidates(candidates);
  }, [selectedLibraryId]);

  useEffect(() => {
    if (mode === modes.random.value) {
      onCandidatesChange({
        libraryId: tempLibraryId,
        candidates: tempCandidates,
      });
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
    tempCandidates,
    setTempCandidates,
    blockLinks: blocksInSelectedLibrary.map(block => (
      dispatch(requests.fetchBlockContent({
        blockId: block.id,
        onSuccess: (response) => {
          dispatch(actions.library.setLibraryBlocks({
            blocks: response?.data?.results,
          }));
        },
        onFailure: (error) => {
          dispatch(actions.requests.failRequest({
            requestKey: RequestKeys.fetchLibraryProperty,
            error,
          }));
        },
      }))
      // api.fetchBlockContent({ studioEndpointUrl, blockId: block.id })
    )),
    blocksTableData: blocksInSelectedLibrary.map(block => ({
      display_name: block.display_name,
      block_type: blockTypeDisplay(block.block_type),
    })),
  });
};
