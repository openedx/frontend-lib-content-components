import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { modes } from './constants';
import { actions } from '../../data/redux';
import * as requests from './data/requests';
import { RequestKeys } from '../../data/constants/requests';
import { isV1Library } from './utils';

export const useLibraryHook = ({
  blockFailed,
  blockFinished,
  blockValue,
}) => {
  const dispatch = useDispatch();

  // fetch libraries and child blocks when block finishes loading
  useEffect(() => {
    if (blockFinished && !blockFailed) {
      dispatch(requests.fetchV2Libraries({
        onSuccess: (response) => {
          const libraries = {};
          response?.data.forEach(library => {
            libraries[library.id] = library;
          });
          dispatch(actions.library.loadLibraries({ libraries }));
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
          const libraries = {};
          response?.data?.libraries.forEach(library => {
            libraries[library.library_key] = library;
          });
          dispatch(actions.library.loadLibraries({ libraries }));
        },
        onFailure: (error) => {
          dispatch(actions.requests.failRequest({
            requestKey: RequestKeys.fetchV1Libraries,
            error,
          }));
        },
      }));
      dispatch(requests.fetchChildrenInfo({
        onSuccess: (response) => {
          const children = response?.data?.children;
          dispatch(actions.library.loadChildren({ children }));
        },
        onFailure: (error) => {
          dispatch(actions.requests.failRequest({
            requestKey: RequestKeys.fetchChildrenInfo,
            error,
          }));
        },
      }));
    }
  }, [blockFinished, blockFailed]);

  // load previously saved library into redux
  useEffect(() => {
    const metadata = blockValue?.data?.metadata;
    const libraryId = metadata?.source_library_id ?? null;
    let version = '';
    let settings = {};
    if (libraryId) {
      version = metadata?.source_library_version;
      settings = {
        [libraryId]: {
          mode: metadata?.manual ? modes.selected.value : modes.random.value,
          count: metadata?.max_count,
          showReset: metadata?.allow_resetting_children,
          candidates: metadata?.candidates,
        },
      };
    }
    dispatch(actions.library.initializeFromBlockValue({
      libraryId, version, settings,
    }));
  }, [blockValue]);
};

export const useLibrarySelectorHook = ({
  libraries,
  settings,
}) => {
  const dispatch = useDispatch();

  return {
    onLibrarySelect: (id) => {
      if (id === null) {
        dispatch(actions.library.unloadLibrary());
      } else {
        dispatch(actions.library.setLibraryId({ selectedLibraryId: id }));
        dispatch(actions.library.setLibraryVersion({ version: libraries[id]?.version }));
        if (!settings[id]) {
          dispatch(actions.library.initializeSettings({ selectedLibraryId: id }));
        }
      }
    },
  };
};

export const useBlocksSelectorHook = ({
  blocksInSelectedLibrary,
  savedChildren,
  savedLibraryId,
  selectedLibraryId,
}) => {
  const dispatch = useDispatch();

  // fetch v2 library content
  // If selected library is the same as the saved library,
  //   use the children blocks of the library content block instead.
  useEffect(() => {
    if (selectedLibraryId === savedLibraryId) {
      dispatch(actions.library.setLibraryBlocks({
        blocks: savedChildren.map(block => ({
          id: block.id,
          display_name: block.display_name,
          block_type: block.category,
        })),
      }));
    } else if (!isV1Library(selectedLibraryId)) {
      dispatch(requests.fetchV2LibraryContent({
        libraryId: selectedLibraryId,
        onSuccess: (response) => {
          dispatch(actions.library.setLibraryBlocks({
            blocks: response?.data,
          }));
        },
        onFailure: (error) => {
          dispatch(actions.requests.failRequest({
            requestKey: RequestKeys.fetchV2LibraryContent,
            error,
          }));
        },
      }));
    }
  }, [selectedLibraryId, savedChildren]);

  const blockTypeDisplay = (type) => {
    if (type === 'html') { return 'Text'; }
    if (type === 'video') { return 'Video'; }
    if (type === 'problem') { return 'Problem'; }
    return 'Other';
  };

  return {
    blocksTableData: blocksInSelectedLibrary.map(block => ({
      display_name: block.display_name,
      block_type: blockTypeDisplay(block.block_type),
    })),
  };
};
