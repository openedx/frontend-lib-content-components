import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { IntlProvider } from '@edx/frontend-platform/i18n';

import SearchBlocks from '.';

const mockBlocks = {
  'block-key': {
    id: 'block-key',
    blockId: 'edx_block-1',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'sequential',
    displayName: 'Any display name',
    path: 'Any display name',
    children: ['block-children-1', 'block-children-2'],
  },
  'block-children-1': {
    id: 'block-children-1',
    blockId: 'edx_block-1',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'sequential',
    displayName: 'Block children 1',
    path: 'Any display name / Block children 1',
  },
  'block-children-2': {
    id: 'block-children-2',
    blockId: 'edx_block-2',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'vertical',
    displayName: 'Block children 2',
    path: 'Any display name / Block children 2',
  },
};

jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('@openedx/paragon');
jest.unmock('@openedx/paragon/icons');

describe('SearchBlocks Component', () => {
  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en">{children}</IntlProvider>
  );

  let onSearchFilterMock;
  let onBlockSelectedMock;

  beforeEach(() => {
    onSearchFilterMock = jest.fn();
    onBlockSelectedMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrideProps = {}) => render(
    <IntlProviderWrapper>
      <SearchBlocks
        blocks={mockBlocks}
        onSearchFilter={onSearchFilterMock}
        onBlockSelected={onBlockSelectedMock}
        {...overrideProps}
      />
    </IntlProviderWrapper>,
  );

  test('snapshot', async () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  test('renders without crashing', () => {
    const { getByTestId } = renderComponent();
    expect(getByTestId('search-field')).toBeInTheDocument();
  });

  test('displays placeholder text in the SearchField', () => {
    const { getByPlaceholderText } = renderComponent();

    const searchField = getByPlaceholderText('Search course pages');
    expect(searchField).toBeInTheDocument();
  });

  test('updates searchField state on input change', async () => {
    renderComponent();

    const inputElement = screen.getByRole('searchbox');
    userEvent.type(inputElement, 'New value');

    expect(onSearchFilterMock).toHaveBeenCalledWith(true);
  });

  test('updates searchField state on input change empty value', async () => {
    renderComponent();

    const inputElement = screen.getByRole('searchbox');
    userEvent.type(inputElement, ' ');

    expect(onSearchFilterMock).toHaveBeenCalledWith(false);
  });

  test('search a block when the searchInputValue matches', async () => {
    const { getByTestId } = renderComponent({ searchInputValue: 'Block children 1' });

    const blockFiltered = getByTestId('filtered-block-item');
    expect(blockFiltered).toBeInTheDocument();
  });

  test('should call onBlockSelected when a block is selected', async () => {
    const { getByTestId } = renderComponent({ searchInputValue: 'Block children 1' });

    const blockFiltered = getByTestId('filtered-block-item');
    expect(blockFiltered).toBeInTheDocument();
    fireEvent.click(blockFiltered);
    expect(onBlockSelectedMock).toHaveBeenCalledWith(mockBlocks['block-children-1']);
  });

  test('should disable the blocks filtered when disabledBlocks is true', async () => {
    const { queryAllByTestId } = renderComponent({ searchInputValue: 'Block', disabledBlocks: true });

    const blocksFiltered = queryAllByTestId('filtered-block-item');
    blocksFiltered.forEach((button) => {
      expect(button).toHaveAttribute('disabled');
    });
  });
});
