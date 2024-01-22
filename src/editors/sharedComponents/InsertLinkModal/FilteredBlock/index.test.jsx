import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import FilterBlock from '.';

jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');

describe('FilteredBlock Component', () => {
  const mockOnBlockFilterClick = jest.fn();

  const mockBlock = {
    id: 'block-key',
    blockId: 'edx_block-1',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'sequential',
    displayName: 'Any display name',
    path: 'Path / To / Block 1',
    children: ['block-children-1', 'block-children-2'],
  };

  const renderComponent = (overrideProps = {}) => render(
    <FilterBlock
      block={mockBlock}
      onBlockFilterClick={mockOnBlockFilterClick}
      {...overrideProps}
    />,
  );

  test('renders without crashing', () => {
    const { container } = renderComponent();
    expect(container).toBeTruthy();
  });

  test('snapshot', () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  test('calls onBlockFilterClick when the button is clicked', () => {
    const { getByTestId } = renderComponent();
    const button = getByTestId('filter-block-item');
    fireEvent.click(button);
    expect(mockOnBlockFilterClick).toHaveBeenCalledWith(mockBlock);
  });

  test('displays the block title and subtitle', () => {
    renderComponent();
    expect(screen.getByText('Path / To')).toBeInTheDocument();
    expect(screen.getByText('Block 1')).toBeInTheDocument();
  });
});
