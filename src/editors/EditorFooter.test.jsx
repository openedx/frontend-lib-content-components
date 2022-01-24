import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditorFooter from './EditorFooter';
import EditorPageContext from './EditorPageContext';
import { ActionStates } from './data/constants';
import { saveBlock } from './data/api';

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
jest.mock('./data/api', () => {
  const originalModule = jest.requireActual('./data/api');

  // Mock the default export and named export saveBlock
  return {
    __esModule: true,
    ...originalModule,
    saveBlock: jest.fn(() => {}),
  };
});

test('Rendering: loaded', () => {
  const context = {
    unitUrlLoading: ActionStates.FINISHED,
  };
  render(
    <EditorPageContext.Provider value={context}>
      <EditorFooter />
    </EditorPageContext.Provider>,
  );
  expect(screen.getByText('Cancel')).toBeTruthy();
  expect(screen.getByText('Add To Course')).toBeTruthy();
});

test('Rendering: loading url', () => {
  const context = {
    unitUrlLoading: ActionStates.NOT_BEGUN,
  };
  render(
    <EditorPageContext.Provider value={context}>
      <EditorFooter />
    </EditorPageContext.Provider>,
  );
  expect(screen.getByText('Cancel')).toBeTruthy();
  expect(screen.getAllByRole('button', { 'aria-label': 'Save' })).toBeTruthy();
  expect(screen.queryByText('Add To Course')).toBeNull();
});

test('Navigation: Cancel', () => {
  const context = {
    unitUrlLoading: ActionStates.FINISHED,
    unitUrl: {
      data: {
        ancestors:
        [
          { id: 'fakeblockid' },
        ],
      },
    },
    studioEndpointUrl: 'Testurl',
  };
  render(
    <EditorPageContext.Provider value={context}>
      <EditorFooter />
    </EditorPageContext.Provider>,
  );
  expect(screen.getByText('Cancel')).toBeTruthy();
  userEvent.click(screen.getByText('Cancel'));
  expect(window.location.assign).toHaveBeenCalled();
});

test('Navigation: Save', () => {
  let mockUnderway = ActionStates.NOT_BEGUN;
  const context = {
    unitUrlLoading: ActionStates.FINISHED,
    blockLoading: ActionStates.FINISHED,
    unitUrl: {
      data: {
        ancestors:
        [
          { id: 'fakeblockid' },
        ],
      },
    },
    studioEndpointUrl: 'Testurl',
    editorRef: {
      current: {
        getContent: () => 'Some Content',
      },
    },
    setSaveUnderway: (input) => { mockUnderway = input; },
    saveUnderway: mockUnderway,
    setBlockContent: () => {},
  };
  render(
    <EditorPageContext.Provider value={context}>
      <EditorFooter />
    </EditorPageContext.Provider>,
  );

  expect(screen.getByText('Add To Course')).toBeTruthy();
  userEvent.click(screen.getByText('Add To Course'));
  expect(saveBlock).not.toHaveBeenCalled(); // not called by footer, called in provider
  expect(window.location.assign).toHaveBeenCalledWith(`${context.studioEndpointUrl}/container/${context.unitUrl.data.ancestors[0].id}`);
});
