import React, { useEffect } from 'react';
import api from './data/api';
import * as urls from './data/urls';

export const useLibraryHook = ({
  blockValue,
  initialize,
  studioEndpointUrl,
}) => {
  useEffect(() => {
    const contentStore = api.fetchContentStore({ studioEndpointUrl });
    initialize({
      libraries: contentStore.libraries,
      selectedLibrary: 0,
      selectionMode: 'mode',
      selectionSettings: {
        showReset: blockValue?.data?.metadata?.allow_resetting_children,
        count: 1,
      },
    });
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
  selectedLibrary,
  studioEndpointUrl,
}) => {
  useEffect(() => {
    if (selectedLibrary !== null) {
      const libraryContent = api.fetchLibraryContent({ studioEndpointUrl, selectedLibrary });
      loadBlocksInLibrary({
        blocks: libraryContent.results,
      });
    }
  }, [selectedLibrary]);

  const blockTypeDisplay = (type) => {
    if (type === 'html') return 'Text';
    if (type === 'video') return 'Video';
    if (type === 'problem') return 'Problem';
    return 'Other';
  };

  return ({
    blockLinks: blocksInSelectedLibrary.map(block => (
      urls.blockContent({ studioEndpointUrl, blockId: block.url })
    )),
    blocksTableData: blocksInSelectedLibrary.map(block => ({
      display_name: block.display_name,
      block_type: blockTypeDisplay(block.block_type),
    })),
  });
};
