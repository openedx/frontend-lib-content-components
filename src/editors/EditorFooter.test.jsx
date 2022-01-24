import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditorFooter from './EditorFooter';
import EditorPageContext from './EditorPageContext';
import { ActionStates } from './data/constants';
import { mount } from 'enzyme';

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
  const mockSetSaveUnderway = jest.fn().mockImplementation((input) => { mockUnderway = input; });
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
    setSaveUnderway: mockSetSaveUnderway,
    saveUnderway: mockUnderway,
    setBlockContent: () => {},
  };
  const wrapper= mount(
    <EditorPageContext.Provider value={context}>
      <EditorFooter />
    </EditorPageContext.Provider>
  );

  const button = wrapper.find({children: 'Add To Course'})
  expect(button).toBeTruthy();
  button.simulate('click');
  expect(mockSetSaveUnderway).toHaveBeenCalledWith(ActionStates.IN_PROGRESS);
  expect(window.location.assign).toHaveBeenCalledWith(`${context.studioEndpointUrl}/container/${context.unitUrl.data.ancestors[0].id}`);
});
