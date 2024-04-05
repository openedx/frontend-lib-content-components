import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
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

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
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
          getContent: () => '<a href="http://example.com" data-block-id="block123">Sample content</a>',
          setContent: jest.fn(),
          getRng: jest.fn(),
          getNode: jest.fn(),
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
    useSelector.mockReturnValue({ selectedBlocks: {} });
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

  test('should show Course pages tab', () => {
    renderComponent();

    const tabs = screen.getAllByRole('tab');
    const [coursePagesTab] = tabs;
    expect(coursePagesTab).toHaveTextContent('Course pages');
  });

  test('should find Cancel and Save buttons', () => {
    renderComponent();

    const cancelButton = screen.getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();

    const saveButton = screen.getByText('Save');
    expect(saveButton).toBeInTheDocument();
  });

  test('should call logError on API error', async () => {
    api.getBlocksFromCourse.mockRejectedValue(new Error('API error'));

    renderComponent();

    // Wait for the useEffect to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(logError).toHaveBeenCalledWith(new Error('API error'));
  });
});
