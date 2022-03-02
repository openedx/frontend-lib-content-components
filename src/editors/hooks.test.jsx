import { useEffect, updateState } from 'react';
import * as module from './hooks';

jest.mock('react', () => {
  const updateStateMock = jest.fn();
  return {
    updateState: updateStateMock,
    useState: jest.fn(val => ([{ state: val }, (newVal) => updateState({ val, newVal })])),
    useRef: jest.fn(val => ({ current: val })),
    useEffect: jest.fn(),
    useCallback: (cb, prereqs) => ({ cb, prereqs }),
  };
});
describe('hooks', () => {
  const locationTemp = window.location;
  beforeAll(() => {
    delete window.location;
    window.location = {
      assign: jest.fn(),
    };
  });
  afterAll(() => {
    window.location = locationTemp;
  });
  describe('initializeApp', () => {
    const fakedata = { some: 'data' };
    const mockIntialize = jest.fn(val => (val));
    test('calls provided function with provided data as args when useEffect is called', () => {
      module.initializeApp({ initialize: mockIntialize, data: fakedata });
      expect(mockIntialize).not.toHaveBeenCalledWith(fakedata);
      const [cb, prereqs] = useEffect.mock.calls[0];
      expect(prereqs).toBe([]);
      cb();
      expect(mockIntialize).toHaveBeenCalledWith(fakedata);
    });
  });
  describe('prepareEditorRef', () => {
    let output;
    beforeEach(() => {
      output = module.prepareEditorRef();
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    test('sets refReady to false by default, ref is null', () => {
      expect(output.refReady.state).toBe(false);
      expect(output.editorRef.current).toBe(null);
    });
    test('calling setEditorRef sets the ref to have a value which is only ready when useEffect is called', () => {
      const fakeEditor = { editor: 'faKe Editor' };
      expect(output.editorRef.current).not.toBe(fakeEditor);
      output.setEditorRef.cb(fakeEditor);
      expect(output.editorRef.current).toBe(fakeEditor);
      expect(updateState).not.toHaveBeenCalled();
      const [cb, prereqs] = useEffect.mock.calls[0];
      expect(prereqs).toBe([]);
      cb();
      expect(updateState).toHaveBeenCalledWith({ newVal: true, val: false });
    });
  });
  describe('navigateTo', () => {
    const destination = 'HoME';
    beforeEach(() => {
      module.navigateTo(destination);
    });
    test('it calls window assign', () => {
      expect(window.location.assign).toHaveBeenCalled();
    });
  });
  describe('navigateCallback', () => {
    let output;
    const destination = 'hOmE';
    beforeEach(() => {
      output = module.navigateCallback(destination);
    });
    test('it calls navigateTo with output destination', () => {
      const spy = jest.spyOn(module, 'navigateTo');
      output();
      expect(spy).toHaveBeenCalledWith(destination);
    });
  });
  describe('saveBlock', () => {
    const mockSaveFn = jest.fn(val => val);
    const navSpy = jest.spyOn(module, 'navigateCallback');
    const getContentMock = jest.fn();
    const mockEditorRef = { current: { getContent: getContentMock } };
    const url = 'rEtUrNUrl';
    test('it calls the save function with correct arguements', () => {
      module.saveBlock({ editorRef: mockEditorRef, returnUrl: url, saveFunction: mockSaveFn });
      expect(mockSaveFn).toHaveBeenCalled();
      expect(navSpy).toHaveBeenCalledWith(url);
      expect(getContentMock).toHaveBeenCalled();
    });
  });
});
