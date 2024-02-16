import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import ConfirmLinkFormatAlert from '.';

jest.unmock('@edx/frontend-platform/i18n');
jest.unmock('@openedx/paragon');
jest.unmock('@openedx/paragon/icons');

describe('ConfirmLinkFormatAlert', () => {
  const mockProps = {
    url: 'www.example.com',
    onCloseAlert: jest.fn(),
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
      <ConfirmLinkFormatAlert {...mockProps} {...overrideProps} />
    </IntlProviderWrapper>,
  );

  test('snapshot', async () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  test('renders without crashing', async () => {
    renderComponent();
    expect(screen.getByText('URL format')).toBeInTheDocument();
  });

  test('clicking cancel button calls onCloseAlert', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('cancel-button'));
    expect(mockProps.onCloseAlert).toHaveBeenCalled();
  });

  test('confirm button is disabled when protocol is not selected', () => {
    renderComponent();
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).toBeDisabled();
  });

  test('confirm button is enabled when protocol is selected', () => {
    renderComponent();
    fireEvent.click(screen.getByTestId('radio-http'));
    const confirmButton = screen.getByTestId('confirm-button');
    expect(confirmButton).not.toBeDisabled();
  });
});
