import { useDispatch } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

import * as requests from './data/requests';
import { actions } from '../../data/redux';
import * as module from './hooks';
import { RequestKeys, RequestStates } from '../../data/constants/requests';
import modes from './constants';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('./data/requests', () => ({
  fetchV1Libraries: jest.fn(),
  fetchV2Libraries: jest.fn(),
  fetchV1LibraryContent: jest.fn(),
  fetchV2LibraryContent: jest.fn(),
  fetchV1LibraryBlock: jest.fn(),
  fetchChildrenInfo: jest.fn(),
}));

jest.mock('../../data/redux', () => ({
  actions: {
    library: {
      addLibraries: jest.fn(),
      loadChildren: jest.fn(),
      initializeFromBlockValue: jest.fn(),
      setLibraryId: jest.fn(),
      setLibraryVersion: jest.fn(),
      initialLibrarySettings: jest.fn(),
      setLibraryBlocks: jest.fn(),
      addLibraryBlock: jest.fn(),
      setV1BlockRequests: jest.fn(),
      updateV1BlockRequestStatus: jest.fn(),
      setCandidatesForLibrary: jest.fn(),
    },
    requests: {
      failRequest: jest.fn(),
    },
  },
}));

const dispatch = jest.fn();
const error = 'mockError';

describe('useLibraryHook', () => {
  const selectedLibraryId = 'soMeId';
  const version = 'verNum';
  const blockValue = {
    data: {
      metadata: {
        source_library_id: selectedLibraryId,
        source_library_version: version,
        manual: 'this becomes selected if true',
        max_count: 'this becomes count',
        allow_resetting_children: 'this becomes showReset',
        candidates: 'canDIdates TupLes',
        field: 'sOmEFIeld',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useEffect when block finishes loading', () => {
    const v2Libraries = [
      {
        id: 'v2libid',
        title: 'v2libtitle',
      },
    ];
    const v1Libraries = [
      {
        display_name: 'myv1library',
        library_key: 'v1id',
      },
    ];

    it('should fetch v2 libraries and v1 libraries when block finishes loading', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      expect(requests.fetchV2Libraries).toHaveBeenCalled();
      expect(requests.fetchV1Libraries).toHaveBeenCalled();
    });

    it('should call addLibraries on successful response for fetchV2Libraries', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      const onSuccessCallback = requests.fetchV2Libraries.mock.calls[0][0].onSuccess;
      onSuccessCallback({ data: v2Libraries });
      expect(actions.library.addLibraries).toHaveBeenCalledWith({
        libraries: {
          [v2Libraries[0].id]: v2Libraries[0],
        },
      });
    });

    it('should call failRequest on failure response for fetchV2Libraries', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      const onFailureCallback = requests.fetchV2Libraries.mock.calls[0][0].onFailure;
      onFailureCallback(error);
      expect(actions.requests.failRequest).toHaveBeenCalledWith({
        requestKey: RequestKeys.fetchV2Libraries,
        error,
      });
    });

    it('should call addLibraries on successful response for fetchV1Libraries', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      const onSuccessCallback = requests.fetchV1Libraries.mock.calls[0][0].onSuccess;
      onSuccessCallback({ data: { libraries: v1Libraries } });
      expect(actions.library.addLibraries).toHaveBeenCalledWith({
        libraries: {
          [v1Libraries[0].library_key]: v1Libraries[0],
        },
      });
    });

    it('should call failRequest on failure response for fetchV1Libraries', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      const onFailureCallback = requests.fetchV1Libraries.mock.calls[0][0].onFailure;
      onFailureCallback(error);
      expect(actions.requests.failRequest).toHaveBeenCalledWith({
        requestKey: RequestKeys.fetchV1Libraries,
        error,
      });
    });
  });

  describe('useEffect when blockValue is loaded', () => {
    it('should load previously saved library into redux', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      expect(actions.library.initializeFromBlockValue).toHaveBeenCalledWith({
        libraryId: selectedLibraryId,
        settings: {
          [selectedLibraryId]: {
            version: blockValue.data.metadata.source_library_version,
            mode: modes.selected.value,
            count: blockValue.data.metadata.max_count,
            showReset: blockValue.data.metadata.allow_resetting_children,
            candidates: blockValue.data.metadata.candidates,
            blocks: [],
          },
        },
      });
    });
  });
});

describe('useLibrarySelectorHook', () => {
  const settings = {
    v2lib: 'settingsFields',
    otherlib: 'settingsFields',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('onLibrarySelect', () => {
    const selectedLibraryId = 'v2lib';

    it('should not call setLibraryId when selected library is the same as current library', () => {
      useDispatch.mockReturnValue(dispatch);
      const { result } = renderHook(() => module.useLibrarySelectorHook({
        selectedLibraryId,
        settings,
      }));
      result.current.onLibrarySelect(selectedLibraryId);
      expect(actions.library.setLibraryId).not.toHaveBeenCalled();
      expect(actions.library.initialLibrarySettings).not.toHaveBeenCalled();
    });

    it('should call setLibraryId when a library is selected', () => {
      useDispatch.mockReturnValue(dispatch);
      const { result } = renderHook(() => module.useLibrarySelectorHook({
        selectedLibraryId,
        settings,
      }));
      result.current.onLibrarySelect('lib');
      expect(actions.library.setLibraryId).toHaveBeenCalledWith({ selectedLibraryId: 'lib' });
    });

    it('should call initialLibrarySettings when there are no settings for the selected library', () => {
      useDispatch.mockReturnValue(dispatch);
      const { result } = renderHook(() => module.useLibrarySelectorHook({
        selectedLibraryId,
        settings: {},
      }));
      result.current.onLibrarySelect('lib');
      expect(actions.library.initialLibrarySettings).toHaveBeenCalledWith({ selectedLibraryId: 'lib' });
    });

    it('should not call initialLibrarySettings when there are settings for the selected library', () => {
      useDispatch.mockReturnValue(dispatch);
      const { result } = renderHook(() => module.useLibrarySelectorHook({
        selectedLibraryId,
        settings,
      }));
      result.current.onLibrarySelect('otherlib');
      expect(actions.library.initialLibrarySettings).not.toHaveBeenCalled();
    });
  });
});

describe('useBlocksSelectorHook', () => {
  const args = {
    blocks: [],
    candidates: ['block1', 'block3'],
    libraries: { libId: { version: 'ver' } },
    savedLibraryId: 'savedLib',
    selectedLibraryId: 'libID',
    v1BlockRequests: [],
  };
  const blocks = [
    { id: 'block1', display_name: 'textblock', block_type: 'html' },
    { id: 'block2', display_name: 'vidblock', block_type: 'video' },
    { id: 'block3', display_name: 'probblock', block_type: 'problem' },
  ];
  const v1LibraryId = 'library-v1:im+a+v1+lib';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useEffect when selectedLibraryId changes', () => {
    it('should fetch children when selectedLibraryId is the same as savedLibraryId', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args, selectedLibraryId: args.savedLibraryId }));
      expect(requests.fetchChildrenInfo).toHaveBeenCalled();
    });

    it('should call setLibraryBlocks on successful response for fetchChildrenInfo', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args, selectedLibraryId: args.savedLibraryId }));
      const onSuccessCallback = requests.fetchChildrenInfo.mock.calls[0][0].onSuccess;
      onSuccessCallback({
        data: {
          children: [
            {
              id: 'blockID',
              display_name: 'BloCKName',
              category: 'blOckType',
            },
          ],
        },
      });
      expect(actions.library.setLibraryBlocks).toHaveBeenCalledWith({
        blocks: [
          {
            id: 'blockID',
            display_name: 'BloCKName',
            block_type: 'blOckType',
          },
        ],
      });
    });

    it('should call failRequest on failure response for fetchChildrenInfo', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args, selectedLibraryId: args.savedLibraryId }));
      const onFailureCallback = requests.fetchChildrenInfo.mock.calls[0][0].onFailure;
      onFailureCallback(error);
      expect(actions.requests.failRequest).toHaveBeenCalledWith({
        requestKey: RequestKeys.fetchChildrenInfo,
        error,
      });
    });

    it('should fetch v1 library content when a v1 library is selected that is not the saved library and v1 block requests are not set up', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args, selectedLibraryId: v1LibraryId }));
      expect(requests.fetchV1LibraryContent).toHaveBeenCalled();
    });

    it('should call setLibraryVersion and setV1BlockRequests on successful response for fetchV1LibraryContent', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args, selectedLibraryId: v1LibraryId }));
      const onSuccessCallback = requests.fetchV1LibraryContent.mock.calls[0][0].onSuccess;
      onSuccessCallback({
        data: {
          blocks: ['someblockDta'],
          version: 'VERv1',
        },
      });
      expect(actions.library.setLibraryVersion).toHaveBeenCalledWith({
        version: 'VERv1',
      });
      expect(actions.library.setV1BlockRequests).toHaveBeenCalledWith({
        v1BlockRequests: { someblockDta: RequestStates.inactive },
      });
    });

    it('should call failRequest on failure response for fetchV1LibraryContent', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args, selectedLibraryId: v1LibraryId }));
      const onFailureCallback = requests.fetchV1LibraryContent.mock.calls[0][0].onFailure;
      onFailureCallback(error);
      expect(actions.requests.failRequest).toHaveBeenCalledWith({
        requestKey: RequestKeys.fetchV1LibraryContent,
        error,
      });
    });

    it('should fetch v2 library content when a v2 library is selected that is not the saved library', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args }));
      expect(actions.library.setLibraryVersion).toHaveBeenCalled();
      expect(requests.fetchV2LibraryContent).toHaveBeenCalled();
    });

    it('should call addLibraries on successful response for fetchV2LibraryContent', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args }));
      const onSuccessCallback = requests.fetchV2LibraryContent.mock.calls[0][0].onSuccess;
      onSuccessCallback({ data: 'someData' });
      expect(actions.library.setLibraryBlocks).toHaveBeenCalledWith({
        blocks: 'someData',
      });
    });

    it('should call failRequest on failure response for fetchV2LibraryContent', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({ ...args }));
      const onFailureCallback = requests.fetchV2LibraryContent.mock.calls[0][0].onFailure;
      onFailureCallback(error);
      expect(actions.requests.failRequest).toHaveBeenCalledWith({
        requestKey: RequestKeys.fetchV2LibraryContent,
        error,
      });
    });
  });

  describe('useEffect when v1BlockRequests changes', () => {
    const v1BlockRequests = {
      block1: RequestStates.inactive,
      block2: RequestStates.inactive,
      block3: RequestStates.inactive,
    };
    it('should fetch block data for each v1 block when blocks have not been loaded', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({
        ...args,
        selectedLibraryId: v1LibraryId,
        v1BlockRequests,
      }));
      expect(requests.fetchV1LibraryBlock).toHaveBeenCalledTimes(3);
    });

    it('should call addLibraryBlock on successful response for fetchV1LibraryBlock', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({
        ...args,
        selectedLibraryId: v1LibraryId,
        v1BlockRequests,
      }));
      const onSuccessCallback = requests.fetchV1LibraryBlock.mock.calls[0][0].onSuccess;
      onSuccessCallback({
        data: {
          display_name: 'someName',
          category: 'someCaTgory',
        },
      });
      expect(actions.library.addLibraryBlock).toHaveBeenCalledWith({
        block: {
          id: 'block1',
          display_name: 'someName',
          block_type: 'someCaTgory',
        },
      });
    });

    it('should update request status on failure response for fetchV1LibraryBlock', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksSelectorHook({
        ...args,
        selectedLibraryId: v1LibraryId,
        v1BlockRequests,
      }));
      const onFailureCallback = requests.fetchV1LibraryBlock.mock.calls[0][0].onFailure;
      onFailureCallback(error);
      expect(actions.library.updateV1BlockRequestStatus).toHaveBeenCalledWith({
        blockId: 'block1',
        status: RequestStates.failed,
      });
    });
  });

  describe('data should return an array for passing into paragon DataTable component', () => {
    useDispatch.mockReturnValue(dispatch);
    const { result } = renderHook(() => module.useBlocksSelectorHook({ ...args, blocks }));
    expect(result.current.data).toEqual([
      { display_name: 'textblock', block_type: 'Text' },
      { display_name: 'vidblock', block_type: 'Video' },
      { display_name: 'probblock', block_type: 'Problem' },
    ]);
  });

  describe('initialRows should return initial row data for paragon DataTable component', () => {
    useDispatch.mockReturnValue(dispatch);
    const { result } = renderHook(() => module.useBlocksSelectorHook({ ...args, blocks }));
    expect(result.current.initialRows).toEqual({ 0: true, 1: false, 2: true });
  });

  describe('onSelectedRowsChanged', () => {
    const selected = { 0: true };
    it('should call setCandidatesForLibrary with the selected candidate blocks', () => {
      useDispatch.mockReturnValue(dispatch);
      const { result } = renderHook(() => module.useBlocksSelectorHook({ ...args, blocks }));
      result.current.onSelectedRowsChanged(selected);
      expect(actions.library.setCandidatesForLibrary).toHaveBeenCalledWith({
        candidates: ['block1'],
      });
    });
  });
});
