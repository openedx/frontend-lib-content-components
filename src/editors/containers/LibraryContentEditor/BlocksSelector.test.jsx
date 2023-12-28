import React from 'react';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { BlocksSelector, RowCheckbox, SELECT_ONE_TEST_ID } from './BlocksSelector';

jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');

jest.mock('./hooks', () => ({
  useBlocksSelectorHook: jest.fn().mockReturnValue({
    blocksTableData: [
      // Mocked blocksTableData
      { id: 1, display_name: 'Block 1', block_type: 'Type A' },
      { id: 2, display_name: 'Block 2', block_type: 'Type B' },
    ],
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
  initialRows: {},
  mode: 'selected',
  blocksInSelectedLibrary: [{}],
  setCandidatesForLibrary: jest.fn(),
  selectedLibraryId: 'exampleLibraryId',
};
const mockOnChange = jest.fn();
const defaultToggleRowSelectedProps = {
  indeterminate: false,
  checked: false,
  onChange: mockOnChange,
};
const mockToggleRowSelectedProps = jest.fn(() => defaultToggleRowSelectedProps);
const defaultRow = {
  id: 'foo',
  getToggleRowSelectedProps: mockToggleRowSelectedProps,
};
const checkedRow = {
  ...defaultRow,
  getToggleRowSelectedProps: jest.fn(() => ({
    ...defaultToggleRowSelectedProps,
    checked: true,
  })),
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
});

describe('RowCheckbox', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a checkbox', () => {
    render(<RowCheckbox contextKey="emails" row={defaultRow} />);
    const checkbox = screen.getByTestId(SELECT_ONE_TEST_ID);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveProperty('checked', false);
  });

  it('renders a selected checkbox', () => {
    render(
      <RowCheckbox contextKey="emails" row={checkedRow} />,
    );
    const checkbox = screen.getByTestId(SELECT_ONE_TEST_ID);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveProperty('checked', true);
  });

  it('deselects the row when selected checkbox is checked', () => {
    render(
      <RowCheckbox contextKey="emails" row={defaultRow} />,
    );
    const checkbox = screen.getByTestId(SELECT_ONE_TEST_ID);
    userEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
});
