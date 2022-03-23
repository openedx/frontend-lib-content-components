import React from 'react';
import * as module from './hooks';
import * as sortUtils from './utils';

jest.mock('react', () => ({
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

describe('imgHooks behavior', () => {
  const fetchImages = jest.fn();
  const setSelection = jest.fn();
  let output;
  beforeEach(() => {
    output = module.imgHooks({ fetchImages, setSelection });
  });
  it('loads images on render', () => {
    const [cb, prereqs] = useEffect.mock.calls[0];
    cb();
    expect(fetchImages).toBeCalledWith({ onSuccess: setImages });
  });
  it('sets a selection when user select an image');
  it('updates searchString when user enters a search');
});

// jest.mock('react', () => {
//   const updateStateMock = jest.fn();
//   return {
//     updateState: updateStateMock,
//     useState: jest.fn(val => ([{ state: val }, (newVal) => updateStateMock({ val, newVal })])),
//     useRef: jest.fn(val => ({ current: val })),
//     useEffect: jest.fn(),
//     useCallback: (cb, prereqs) => ({ cb, prereqs }),
//   };
// });
// Connor Haugh2:09 PM
// const [cb, prereqs] = useEffect.mock.calls[0];
// expect(prereqs).toStrictEqual([]);
// cb();
