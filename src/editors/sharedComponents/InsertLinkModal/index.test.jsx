import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { logError } from '@edx/frontend-platform/logging';

import * as api from './api';

import InsertLinkModal from '.';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('./api', () => ({
  getBlocksFromCourse: jest.fn().mockResolvedValue({
    blocks: {},
    root: {},
  }),
}));

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatBlocks: jest.fn(),
  isValidURL: jest.fn(),
}));

jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('@openedx/paragon');
jest.unmock('@openedx/paragon/icons');

describe('InsertLinkModal', () => {
  const mockProps = {
    courseId: 'course123',
    isOpen: true,
    onClose: jest.fn(),
    editorRef: {
      current: {
        selection: {
          getContent: jest.fn(),
          setContent: jest.fn(),
        },
      },
    },
  };

  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en">{children}</IntlProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (overrideProps = {}) => render(
    <IntlProviderWrapper>
      <InsertLinkModal {...mockProps} {...overrideProps} />
    </IntlProviderWrapper>,
  );

  test('snapshot', async () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  test('renders without crashing', async () => {
    renderComponent();
    expect(screen.getByText('Link to')).toBeInTheDocument();
  });

  test('should show Course pages and URL tabs', () => {
    renderComponent();

    const tabs = screen.getAllByRole('tab');
    const [coursePagesTab, urlTab] = tabs;

    expect(coursePagesTab).toHaveTextContent('Course pages');
    expect(urlTab).toHaveTextContent('URL');
  });

  test('should find Cancel and Save buttons', () => {
    renderComponent();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
  });

  test('should show input for url when URL tab is clicked', () => {
    const { getByTestId } = renderComponent();

    const tabs = screen.getAllByRole('tab');
    const [, urlTab] = tabs;

    fireEvent.click(urlTab);

    const urlInput = getByTestId('url-input');
    expect(urlInput).toBeInTheDocument();
  });

  test('should show message when the url is invalid', () => {
    const { getByTestId, getByText } = renderComponent();

    const tabs = screen.getAllByRole('tab');
    const [, urlTab] = tabs;

    fireEvent.click(urlTab);

    const urlInput = getByTestId('url-input');
    fireEvent.change(urlInput, { target: { value: 'invalid-url' } });

    const saveButton = getByText('Save');
    fireEvent.click(saveButton);

    const errorMessage = getByText('The url provided is invalid');
    expect(errorMessage).toBeInTheDocument();
  });

  test('should call logError on API error', async () => {
    api.getBlocksFromCourse.mockRejectedValue(new Error('API error'));

    renderComponent();

    // Wait for the useEffect to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(logError).toHaveBeenCalledWith(new Error('API error'));
  });
});
