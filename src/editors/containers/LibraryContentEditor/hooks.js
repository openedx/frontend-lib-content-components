import { useEffect, useState } from 'react';
import { modes } from './constants';
import api from './data/api';

export const useLibraryHook = ({
  blockFailed,
  blockFinished,
  blockValue,
  initialize,
  libraryPayload,
  studioEndpointUrl,
}) => {
  useEffect(() => {
    if (blockFinished && !blockFailed) {
      const libraries = api.fetchContentStore({ studioEndpointUrl }).libraries;
      const metadata = blockValue?.data?.metadata;
      const selectedLibraryId = metadata?.source_library_id;
      let selectedLibrary = null;
      let selectedLibraryVersion = null;
      let blocksInSelectedLibrary = [];
      let settings = {};
      if (!!selectedLibraryId) {
        selectedLibrary = libraries.findIndex(library => {
          library.library_key === selectedLibraryId
        });
        selectedLibraryVersion = api.fetchLibraryProperty({
          studioEndpointUrl,
          libraryId: selectedLibraryId,
        }).version;
        settings = {
          [selectedLibrary]: {
            mode: metadata?.mode,
            count: metadata?.count,
            showReset: metadata?.allow_resetting_children,
            candidates: metadata?.candidates,
          },
        };
        blocksInSelectedLibrary = api.fetchLibraryContent({
          studioEndpointUrl,
          libraryId: selectedLibraryId,
        })?.results;
      }
      initialize({
        libraries,
        selectedLibrary,
        selectedLibraryId: selectedLibraryId ? selectedLibraryId : null,
        selectedLibraryVersion,
        settings,
        blocksInSelectedLibrary: blocksInSelectedLibrary ? blocksInSelectedLibrary : [],
      });
    }
  }, []);

  return {
    getContent: () => libraryPayload,
  };
};

export const useLibrarySelectorHook = ({
  libraries,
  loadLibrary,
  selectedLibrary,
  settings,
  studioEndpointUrl,
  unloadLibrary,
}) => {
  useEffect(() => {
    if (selectedLibrary !== null) {
      const selectedLibraryId = libraries[selectedLibrary].library_key;
      const libraryProperties = api.fetchLibraryProperty({
        studioEndpointUrl,
        libraryId: selectedLibraryId,
      });
      const blocks = api.fetchLibraryContent({
        studioEndpointUrl,
        libraryId: selectedLibraryId,
      })?.results;
      loadLibrary({
        id: selectedLibraryId,
        version: libraryProperties?.version,
        blocks: blocks ? blocks : [],
        settings: settings[selectedLibraryId]
          ? settings[selectedLibraryId]
          : {
              mode: modes.random.value,
              count: -1,
              showReset: false,
              candidates: {},
            },
      });
    } else {
      unloadLibrary();
    }
  }, [selectedLibrary]);

  return {
    title: selectedLibrary === null
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
