import { useEffect } from 'react';

import * as module from './hooks';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useRef: jest.fn(val => ({ current: val })),
  useEffect: jest.fn(),
  useCallback: (cb, prereqs) => ({ cb, prereqs }),
}));

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
    test('calls provided function with provided data as args when useEffect is called', () => {
      const mockIntialize = jest.fn(val => (val));
      const fakedata = { some: 'data' };
      module.initializeApp({ initialize: mockIntialize, data: fakedata });
      expect(mockIntialize).not.toHaveBeenCalledWith(fakedata);
      const [cb, prereqs] = useEffect.mock.calls[0];
      expect(prereqs).toStrictEqual([]);
      cb();
      expect(mockIntialize).toHaveBeenCalledWith(fakedata);
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
});
