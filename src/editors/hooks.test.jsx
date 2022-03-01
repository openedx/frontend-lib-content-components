import * as module from './hooks';

jest.mock('react', () => {
    const updateState = jest.fn();
    return {
      updateState,
      useState: jest.fn(val => ([{ state: val }, (newVal) => updateState({ val, newVal })])),
      useRef: jest.fn(val => ({ current: val })),
      useEffect: jest.fn(f=>()=>f()),
      useCallback: jest.fn(val => () => {}),
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
        let output;
        const fakedata = {some : 'data'}
        const mockIntialize = jest.fn(val => (val));
        beforeEach(() => {
            output = module.initializeApp({initialize: mockIntialize, data: fakedata});
        });
        test('calls provided function with provided data as args', () => {
            output();
            expect(mockIntialize).toHaveBeenCalledWith(fakedata);
        });
    });
    describe('prepareEditorRef', () => {
        let output;
        beforeEach(() => {
            output = module.prepareEditorRef();
        });
        test('sets refReady to false by default', () => {
            expect(output.refReady.state).toBe(false);
        });
        test('calling setEditorRef sets the ref to have a value', () => {
            const fakeEditor = {editor: 'faKe Editor'};
            output.setEditorRef(fakeEditor);
            expect(output.editorRef.current).toBe(fakeEditor);
        });
    });
    describe('navigateTo', () => {
        let output;
        const destination = 'HoME';
        beforeEach(() => {
            output = module.navigateTo(destination);
        });
        test('it calls window assign', () => {
            expect(window.location.assign).toHaveBeenCalled();
        });
    });
    describe('navigateCallback', () => {
        let output;
        const destination = 'hOmE'
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
        const mockSaveFn = jest.fn(val =>{val});
        const navSpy =jest.spyOn(module,'navigateCallback');
        const getContentMock = jest.fn();
        const mockEditorRef = {current: {getContent: getContentMock}};
        const url = 'rEtUrNUrl';
        test('it calls the save function with correct arguements', () => {
            module.saveBlock({editorRef: mockEditorRef, returnUrl: url,saveFunction: mockSaveFn});
            expect(mockSaveFn).toHaveBeenCalled();
            expect(navSpy).toHaveBeenCalledWith(url);
            expect(getContentMock).toHaveBeenCalled();
        });
    });
});