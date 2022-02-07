import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditorHeader from './EditorHeader';
import EditorPageContext from './EditorPageContext';
import { ActionStates } from './data/constants';

const locationTemp = window.location;
beforeEach(() => {
  delete window.location;
  window.location = {
    assign: jest.fn(),
  };
});
afterAll(() => {
  window.location = locationTemp;
});

test('Rendering And Click Close Button: Does not Navigate off of Page When Loading', () => {
  const blockType = 'Text';
  const context = {
    unitUrlLoading: ActionStates.IN_PROGRESS,
  };
  render(
    <EditorPageContext.Provider value={context}>
      <EditorHeader blockType={blockType} />
    </EditorPageContext.Provider>,
  );
  // expect(screen.getByLabelText('Edit')).toBeTruthy();
  expect(screen.getByLabelText('Close')).toBeTruthy();
  userEvent.click(screen.getByLabelText('Close'));
  expect(window.location.assign).not.toHaveBeenCalled();
});

test('Rendering And Click Button: Loaded Navigates Away', () => {
  const blockType = 'Text';
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
      <EditorHeader blockType={blockType} />
    </EditorPageContext.Provider>,
  );
  // expect(screen.getByLabelText('Edit')).toBeTruthy();
  expect(screen.getByLabelText('Close')).toBeTruthy();
  userEvent.click(screen.getByLabelText('Close'));
  expect(window.location.assign).toHaveBeenCalled();
});
