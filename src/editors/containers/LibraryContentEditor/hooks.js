import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { modes } from './constants';
import { actions } from '../../data/redux';
import * as requests from './data/requests';
import { RequestKeys, RequestStates } from '../../data/constants/requests';
import { isV1Library, getCandidates, getSelectedRows } from './utils';

export const blockTypeDisplay = (type) => {
  if (type === 'html') { return 'Text'; }
  if (type === 'video') { return 'Video'; }
  if (type === 'problem') { return 'Problem'; }
  return 'Other';
};

export const useLibraryHook = ({
  blockFailed,
  blockFinished,
  blockValue,
}) => {
  const dispatch = useDispatch();

  // load previously saved block data from blockValue
  useEffect(() => {
    const metadata = blockValue?.data?.metadata;
    const libraryId = metadata?.source_library_id ?? null;
    let settings = {};
    if (libraryId) {
      settings = {
        [libraryId]: {
          version: metadata?.source_library_version,
          mode: metadata?.manual ? modes.selected.value : modes.random.value,
          count: metadata?.max_count,
          showReset: metadata?.allow_resetting_children,
          candidates: metadata?.candidates,
          blocks: [],
        },
      };
    }
    dispatch(actions.library.initializeFromBlockValue({ libraryId, settings }));
  }, [blockValue]);

  // fetch libraries when block finishes loading
  useEffect(() => {
    if (blockFinished && !blockFailed) {
      dispatch(requests.fetchV2Libraries({
        onSuccess: (response) => {
          const libraries = {};
          response?.data.forEach(library => {
            libraries[library.id] = library;
          });
          dispatch(actions.library.addLibraries({ libraries }));
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
          dispatch(actions.library.addLibraries({ libraries }));
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
};

export const useLibrarySelectorHook = ({
  selectedLibraryId,
  settings,
}) => {
  const dispatch = useDispatch();

  return {
    onLibrarySelect: (id) => {
      if (id !== selectedLibraryId) {
        dispatch(actions.library.setLibraryId({ selectedLibraryId: id }));
        if (!settings[id]) {
          dispatch(actions.library.initialLibrarySettings({ selectedLibraryId: id }));
        }
      }
    },
  };
};

export const useBlocksSelectorHook = ({
  blocks,
  candidates,
  libraries,
  savedLibraryId,
  selectedLibraryId,
  v1BlockRequests,
}) => {
  const dispatch = useDispatch();

  const [tableDataLoaded, setTableDataLoaded] = useState(false);

  // fetch library version and blocks
  useEffect(() => {
    setTableDataLoaded(false);
    if (!blocks || blocks.length === 0) {
      if (selectedLibraryId === savedLibraryId) {
        dispatch(requests.fetchChildrenInfo({
          onSuccess: (response) => {
            const children = response?.data?.children;
            dispatch(actions.library.setLibraryBlocks({
              blocks: children.map(block => ({
                id: block.id,
                display_name: block.display_name,
                block_type: block.category,
              })),
            }));
          },
          onFailure: (error) => {
            dispatch(actions.requests.failRequest({
              requestKey: RequestKeys.fetchChildrenInfo,
              error,
            }));
          },
        }));
      } else if (isV1Library(selectedLibraryId)) {
        if (!v1BlockRequests || Object.keys(v1BlockRequests).length === 0) {
          dispatch(requests.fetchV1LibraryContent({
            libraryId: selectedLibraryId,
            onSuccess: (response) => {
              const v1Blocks = response.data?.blocks ?? [];
              const initialRequestStatus = {};
              v1Blocks.forEach(id => {
                initialRequestStatus[id] = RequestStates.inactive;
              });
              dispatch(actions.library.setLibraryVersion({
                version: response.data?.version,
              }));
              dispatch(actions.library.setV1BlockRequests({
                v1BlockRequests: initialRequestStatus,
              }));
            },
            onFailure: (error) => {
              dispatch(actions.requests.failRequest({
                requestKey: RequestKeys.fetchV1LibraryContent,
                error,
              }));
            },
          }));
        }
      } else {
        dispatch(actions.library.setLibraryVersion({
          version: libraries[selectedLibraryId]?.version,
        }));
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
    }
  }, [selectedLibraryId]);

  // set up blocks for v1 library
  useEffect(() => {
    if (blocks.length < Object.keys(v1BlockRequests).length) {
      if (isV1Library(selectedLibraryId)) {
        Object.keys(v1BlockRequests).forEach(blockId => {
          const status = v1BlockRequests[blockId];
          if (status === RequestStates.inactive) {
            dispatch(actions.library.updateV1BlockRequestStatus({
              blockId,
              status: RequestStates.pending,
            }));
            dispatch(requests.fetchV1LibraryBlock({
              blockId,
              onSuccess: (response) => {
                const v1Block = {
                  id: blockId,
                  display_name: response.data?.display_name ?? '',
                  block_type: response.data?.category ?? '',
                };
                dispatch(actions.library.addLibraryBlock({ block: v1Block }));
                dispatch(actions.library.updateV1BlockRequestStatus({
                  blockId,
                  status: RequestStates.completed,
                }));
              },
              onFailure: () => {
                dispatch(actions.library.updateV1BlockRequestStatus({
                  blockId,
                  status: RequestStates.failed,
                }));
              },
            }));
          }
        });
      }
    }
  }, [v1BlockRequests]);

  // check if blocks for table is loaded
  useEffect(() => {
    let loaded = true;
    Object.keys(v1BlockRequests).forEach(blockId => {
      const status = v1BlockRequests[blockId];
      if ((status === RequestStates.inactive) || (status === RequestStates.pending)) {
        loaded = false;
      }
    });
    setTableDataLoaded(loaded);
  }, [v1BlockRequests]);

  return {
    tableDataLoaded,
    data: useMemo(() => {
      if (tableDataLoaded) {
        return blocks.map(block => ({
          display_name: block.display_name,
          block_type: blockTypeDisplay(block.block_type),
        }));
      }
      return [];
    }, [blocks, tableDataLoaded]),

    initialRows: useMemo(() => {
      if (tableDataLoaded) {
        return getSelectedRows({ blocks, candidates });
      }
      return {};
    }, [blocks, candidates, tableDataLoaded]),

    onSelectedRowsChanged: useCallback((selected) => {
      if (tableDataLoaded) {
        dispatch(actions.library.setCandidatesForLibrary({
          candidates: getCandidates({
            blocks,
            rows: selected,
          }),
        }));
      }
    }, [blocks, tableDataLoaded]),
  };
};
