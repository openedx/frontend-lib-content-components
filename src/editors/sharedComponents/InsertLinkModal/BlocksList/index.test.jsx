import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import BlocksList from '.';

const mockBlocks = {
  'block-key': {
    id: 'block-key',
    blockId: 'edx_block-1',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'chapter',
    displayName: 'Any display name',
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
  },
  'block-children-2': {
    id: 'block-children-2',
    blockId: 'edx_block-2',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'sequential',
    displayName: 'Block children 2',
  },
};

jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('@openedx/paragon');
jest.unmock('@openedx/paragon/icons');

describe('BlocksList Component', () => {
  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en">
      {children}
    </IntlProvider>
  );

  let onBlockSelectedMock;

  beforeEach(() => {
    onBlockSelectedMock = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrideProps = {}) => render(
    <IntlProviderWrapper>
      <BlocksList
        blocks={mockBlocks}
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
    const { getByText } = renderComponent();
    expect(getByText('Any display name')).toBeInTheDocument();
  });

  test('should call onBlockSelected when block name is clicked', () => {
    const { getByTestId } = renderComponent();

    const blockNameButton = getByTestId('block-name');
    fireEvent.click(blockNameButton);
    expect(onBlockSelectedMock).toHaveBeenCalledWith(mockBlocks['block-key']);
  });

  test('should not call onBlockSelected when block navigation is clicked', () => {
    const { getByTestId } = renderComponent();

    const blockNavigateButton = getByTestId('block-navigation');
    fireEvent.click(blockNavigateButton);
    expect(onBlockSelectedMock).not.toHaveBeenCalled();
  });

  test('should show back button when navigation block happens', () => {
    const { getByTestId, getByText } = renderComponent();

    const blockNavigateButton = getByTestId('block-navigation');
    fireEvent.click(blockNavigateButton);

    const backButton = getByTestId('block-back-navigation');
    expect(getByText('Subsections')).toBeInTheDocument();
    expect(getByText('Block children 1')).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
  });

  test('should show previous block when back navigation button is clicked', () => {
    const { getByTestId, getByText } = renderComponent();

    const blockNavigateButton = getByTestId('block-navigation');
    fireEvent.click(blockNavigateButton);

    const backButton = getByTestId('block-back-navigation');
    expect(getByText('Subsections')).toBeInTheDocument();
    expect(getByText('Block children 1')).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(getByText('Any display name')).toBeInTheDocument();
  });

  test('should disabled buttons when prop disableBlocks is true', () => {
    const { getByTestId } = renderComponent({ disableBlocks: true });
    const backButton = getByTestId('block-navigation');
    const blockNameButton = getByTestId('block-name');

    expect(backButton).toHaveAttribute('disabled');
    expect(blockNameButton).toHaveAttribute('disabled');
  });
});
