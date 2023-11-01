import React, { useEffect } from 'react';
import { modes } from './constants';
import api from './data/api';
import * as urls from './data/urls';

export const useLibraryHook = ({
  blockFailed,
  blockFinished,
  blockValue,
  initialize,
  studioEndpointUrl,
}) => {
  useEffect(() => {
    if (blockFinished && !blockFailed) {
      const contentStore = api.fetchContentStore({ studioEndpointUrl });
      initialize({
        libraries: contentStore.libraries,
        selectedLibrary: 0,
        selectionMode: modes.random.value,
        selectionSettings: {
          showReset: blockValue?.data?.metadata?.allow_resetting_children,
          count: 1,
        },
      });
    }
  }, []);

  return {
    getContent: () => ({
      some: 'content'
    }),
  };
};

export const useBlocksHook = ({
  blocksInSelectedLibrary,
  loadBlocksInLibrary,
  onSelectCandidates,
  selectedLibraryId,
  studioEndpointUrl,
}) => {
  useEffect(() => {
    if (selectedLibraryId !== null) {
      const libraryContent = api.fetchLibraryContent({ studioEndpointUrl, libraryId: selectedLibraryId });
      loadBlocksInLibrary({
        blocks: libraryContent.results,
      });
    } else {
      // TODO set candidate to empty list []
    }
  }, [selectedLibraryId]);

  const blockTypeDisplay = (type) => {
    if (type === 'html') return 'Text';
    if (type === 'video') return 'Video';
    if (type === 'problem') return 'Problem';
    return 'Other';
  };

  return ({
    blockLinks: blocksInSelectedLibrary.map(block => (
      urls.blockContent({
        studioEndpointUrl,
        blockId: block.id,
      })
    )),
    blocksTableData: blocksInSelectedLibrary.map(block => ({
      display_name: block.display_name,
      block_type: blockTypeDisplay(block.block_type),
    })),
    selectCandidates: ({ selected }) => {
      let candidates = []
      for (const [key, value] of Object.entries(selected)) {
        if (value) {
          candidates.push([ blocksInSelectedLibrary[key].block_type, blocksInSelectedLibrary[key].id ]);
        }
      }
      onSelectCandidates({ candidates });
    },
  });
};
