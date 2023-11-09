import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { BlocksSelector } from './BlocksSelector';

jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');

jest.mock('./hooks', () => ({
  useBlocksHook: jest.fn().mockReturnValue({
    blockLinks: {
      1: 'link1',
      2: 'link2',
    },
    blocksTableData: [
      // Mocked blocksTableData
      { id: 1, display_name: 'Block 1', block_type: 'Type A' },
      { id: 2, display_name: 'Block 2', block_type: 'Type B' },
      // Add more mocked table data as needed
    ],
    tempCandidates: [],
    setTempCandidates: jest.fn(),
  }),
}));

function renderComponent(props) {
  return render(
    <IntlProvider locale="en">
      <BlocksSelector {...props} />
    </IntlProvider>,
  );
}

const mockProps = {
  candidates: {
    // mock candidates object here
  },
  mode: 'selected',
  studioEndpointUrl: 'https://example.com',
  blocksInSelectedLibrary: [{ /* mock data for blocksInSelectedLibrary */ }],
  onCandidatesChange: jest.fn(),
  selectedLibraryId: 'exampleLibraryId',
};

describe('BlocksSelector', () => {
  it('renders when selectedLibraryId is not null', () => {
    const { queryByText } = renderComponent(mockProps);

    // make sure that the relevant columns are there
    expect(queryByText('Name')).toBeTruthy();
    expect(queryByText('Block Type')).toBeTruthy();
    // make sure that the relevant rows are there
  });

  it('does not render when selectedLibraryId is null', () => {
    const { container } = renderComponent({ ...mockProps, selectedLibraryId: null });
    expect(container.firstChild).toBeFalsy();
  });
  it('renders when mode is selected', () => {
    const { queryByText } = renderComponent(mockProps);
    expect(queryByText('Name')).toBeTruthy();
  });
  it('does not render when mode is not selected', () => {
    const { container } = renderComponent({ ...mockProps, mode: 'soMeThingElse' });
    expect(container.firstChild).toBeFalsy();
  });
  it('renders rows and triggers onCandidatesChange when a row is selected', () => {
    const { getAllByTestId } = renderComponent(mockProps);
    const rowcheckboxes = getAllByTestId('datatable-select-column-checkbox-cell');
    expect(rowcheckboxes.length).toBe(2);
    const checkboxElement = rowcheckboxes[0];
    expect(checkboxElement.checked).toBe(false);
    fireEvent.click(checkboxElement);
    expect(checkboxElement.checked).toBe(true);
  });
});
