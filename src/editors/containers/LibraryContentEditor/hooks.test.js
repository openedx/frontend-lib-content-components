import { useDispatch } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';

import * as requests from './data/requests';
import { actions } from '../../data/redux';
import * as module from './hooks';
import { RequestKeys } from '../../data/constants/requests';
import modes from './constants';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('./data/requests', () => ({
  fetchV2Libraries: jest.fn(),
  fetchV1Libraries: jest.fn(),
  fetchV2LibraryContent: jest.fn(),
}));

jest.mock('../../data/redux', () => ({
  actions: {
    library: {
      loadLibraries: jest.fn(),
      initializeFromBlockValue: jest.fn(),
      unloadLibrary: jest.fn(),
      setLibraryId: jest.fn(),
      setLibraryVersion: jest.fn(),
      initializeSettings: jest.fn(),
      setLibraryBlocks: jest.fn(),
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

  describe('useEffect when block finishs loading', () => {
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
    it('should fetch v2 and v1 libraries when block finishes loading', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      expect(requests.fetchV2Libraries).toHaveBeenCalled();
      expect(requests.fetchV1Libraries).toHaveBeenCalled();
    });
    it('should call loadLibraries on successful response for fetchV2Libraries', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      const onSuccessCallback = requests.fetchV2Libraries.mock.calls[0][0].onSuccess;
      onSuccessCallback({ data: v2Libraries });
      expect(actions.library.loadLibraries).toHaveBeenCalledWith({
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
    it('should call loadLibraries on successful response for fetchV1Libraries', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useLibraryHook({
        blockFailed: false,
        blockFinished: true,
        blockValue,
      }));
      const onSuccessCallback = requests.fetchV1Libraries.mock.calls[0][0].onSuccess;
      onSuccessCallback({ data: { libraries: v1Libraries } });
      expect(actions.library.loadLibraries).toHaveBeenCalledWith({
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
        selectedLibraryId,
        version,
        settings: {
          [selectedLibraryId]: {
            mode: modes.selected.value,
            count: blockValue.data.metadata.max_count,
            showReset: blockValue.data.metadata.allow_resetting_children,
            candidates: blockValue.data.metadata.candidates,
          },
        },
      });
    });
  });
});

describe('useLibrarySelectorHook', () => {
  const libraries = {
    v2lib: {
      id: 'v2lib',
      title: 'v2name',
      version: 1,
    },
    v1lib: {
      library_key: 'v1lib',
      display_name: 'v1name',
    },
  };
  const settings = { v2lib: 'settingsFields' };

  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('onLibrarySelect', () => {
    const selectedLibraryId = 'v2lib';
    it('should call unloadLibrary when no library is selected', () => {
      useDispatch.mockReturnValue(dispatch);
      const { result } = renderHook(() => module.useLibrarySelectorHook({
        libraries,
        settings,
      }));
      result.current.onLibrarySelect(null);
      expect(actions.library.unloadLibrary).toHaveBeenCalled();
    });
    it('should call setLibraryId and setLibraryVersion when a library is selected', () => {
      useDispatch.mockReturnValue(dispatch);
      const { result } = renderHook(() => module.useLibrarySelectorHook({
        libraries,
        settings,
      }));
      result.current.onLibrarySelect('v2lib');
      expect(actions.library.setLibraryId).toHaveBeenCalledWith({ selectedLibraryId });
      expect(actions.library.setLibraryVersion).toHaveBeenCalledWith({ version: 1 });
      expect(actions.library.initializeSettings).not.toHaveBeenCalled();
    });
    it('should call initializeSettings when there are no settings', () => {
      useDispatch.mockReturnValue(dispatch);
      const { result } = renderHook(() => module.useLibrarySelectorHook({
        libraries,
        settings: {},
      }));
      result.current.onLibrarySelect('v2lib');
      expect(actions.library.initializeSettings).toHaveBeenCalledWith({ selectedLibraryId });
    });
  });
});

describe('useBlocksHook', () => {
  const blocksInSelectedLibrary = [
    { id: 'block1', display_name: 'textblock', block_type: 'html' },
    { id: 'block2', display_name: 'vidblock', block_type: 'video' },
    { id: 'block3', display_name: 'probblock', block_type: 'problem' },
  ];
  const selectedLibraryId = 'libID';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useEffect when selectedLibraryId changes', () => {
    it('should fetch v2 library content', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksHook({
        blocksInSelectedLibrary,
        selectedLibraryId,
      }));
      expect(requests.fetchV2LibraryContent).toHaveBeenCalled();
    });
    it('should call loadLibraries on successful response for fetchV2Libraries', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksHook({
        blocksInSelectedLibrary,
        selectedLibraryId,
      }));
      const onSuccessCallback = requests.fetchV2LibraryContent.mock.calls[0][0].onSuccess;
      onSuccessCallback({ data: 'someData' });
      expect(actions.library.setLibraryBlocks).toHaveBeenCalledWith({
        blocks: 'someData',
      });
    });
    it('should call failRequest on failure response for fetchV2Libraries', () => {
      useDispatch.mockReturnValue(dispatch);
      renderHook(() => module.useBlocksHook({
        blocksInSelectedLibrary,
        selectedLibraryId,
      }));
      const onFailureCallback = requests.fetchV2LibraryContent.mock.calls[0][0].onFailure;
      onFailureCallback(error);
      expect(actions.requests.failRequest).toHaveBeenCalledWith({
        requestKey: RequestKeys.fetchV2LibraryContent,
        error,
      });
    });
  });

  describe('blocksTableData should return an array for passing into paragon DataTable component', () => {
    useDispatch.mockReturnValue(dispatch);
    const { result } = renderHook(() => module.useBlocksHook({
      blocksInSelectedLibrary,
      selectedLibraryId,
    }));
    expect(result.current.blocksTableData).toEqual([
      { display_name: 'textblock', block_type: 'Text' },
      { display_name: 'vidblock', block_type: 'Video' },
      { display_name: 'probblock', block_type: 'Problem' },
    ]);
  });
});
