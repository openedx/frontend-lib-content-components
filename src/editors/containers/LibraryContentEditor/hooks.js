import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { modes } from './constants';
import { actions } from '../../data/redux';
import api from './data/api';
import * as requests from './data/requests';
import { RequestKeys } from '../../data/constants/requests';

const getLibraryIndex = (libraries, libraryId) => {
  const index = libraries.findIndex(library => library.library_key === libraryId);
  if (index >= 0) {
    return index;
  } else {
    return null;
  }
};

export const useLibraryHook = ({
  libraryPayload,
}) => {
  const dispatch = useDispatch();
  
  const fetchLibraryList = () => useEffect(() => {
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
  }, []);

  const initializeLibraryProperty = (blockValue) => useEffect(() => {
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
    initializeEditor: (blockValue) => {
      fetchLibraryList();
      initializeLibraryProperty(blockValue);
    },
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
    getLibraryIndex(libraries, selectedLibraryId)
  );

  const fetchLibraryVersion = (selectedLibraryId) => useEffect(() => {
    if (!!selectedLibraryId) {
      dispatch(requests.fetchLibraryProperty({
        libraryId: selectedLibraryId,
        onSuccess: (response) => {
          console.log('testlibprop', response)
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

  const fetchLibraryBlocks = (selectedLibraryId) => useEffect(() => {
    if (!!selectedLibraryId) {
      dispatch(requests.fetchLibraryContent({
        libraryId: selectedLibraryId,
        onSuccess: (response) => {
          console.log('testlibblock', response)
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

  const onSelectedLibraryChange = () => useEffect(() => {
    if (selectedLibrary !== null) {
      const selectedLibraryId = libraries[selectedLibrary].library_key;
      // const libraryProperties = api.fetchLibraryProperty({
      //   studioEndpointUrl,
      //   libraryId: selectedLibraryId,
      // });
      // const blocks = api.fetchLibraryContent({
      //   studioEndpointUrl,
      //   libraryId: selectedLibraryId,
      // })?.results;
      dispatch(actions.library.setLibraryId({ selectedLibraryId }));
      // loadLibrary({
      //   id: selectedLibraryId,
      //   version: libraryProperties?.version,
      //   blocks: blocks ? blocks : [],
      //   settings: settings[selectedLibraryId]
      //     ? settings[selectedLibraryId]
      //     : {
      //         mode: modes.random.value,
      //         count: -1,
      //         showReset: false,
      //         candidates: {},
      //       },
      // });
    } else {
      dispatch(actions.library.unloadLibrary());
    }
  }, [selectedLibrary]);
  console.log('testselectedlib', selectedLibrary)

  return {
    initializeLibrary: (selectedLibraryId) => {
      fetchLibraryVersion(selectedLibraryId);
      fetchLibraryBlocks(selectedLibraryId);
    },
    fetchLibraryVersion,
    fetchLibraryBlocks,
    onSelectedLibraryChange,
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
  studioEndpointUrl,
}) => {
  const [ tempLibraryId, setTempLibraryId ] = useState(null);
  const [ tempCandidates, setTempCandidates ] = useState({});
  
  useEffect(() => {
    if (!!tempLibraryId) {
      onCandidatesChange({
        libraryId: tempLibraryId,
        candidates: tempCandidates,
      });
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
    tempCandidates,
    setTempCandidates,
    blockLinks: blocksInSelectedLibrary.map(block => (
      api.fetchBlockContent({ studioEndpointUrl, blockId: block.id })
    )),
    blocksTableData: blocksInSelectedLibrary.map(block => ({
      display_name: block.display_name,
      block_type: blockTypeDisplay(block.block_type),
    })),
  });
};
