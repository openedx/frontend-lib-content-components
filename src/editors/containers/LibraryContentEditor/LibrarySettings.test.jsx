import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { LibrarySettings } from './LibrarySettings';

jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');
jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  FormattedMessage: (content) => <p>{content.defaultMessage}</p>,
}));
jest.mock('./data/api', () => ({
  fetchV2LibraryContent: jest.fn().mockReturnValue({
    blocks: 'SoMe BLOcKs',
  }),
}));

function renderComponent(props) {
  return render(
    <IntlProvider locale="en">
      <LibrarySettings {...props} />
    </IntlProvider>,
  );
}

describe('LibrarySettings Component', () => {
  const props = {
    setCountForLibrary: jest.fn(),
    setModeForLibrary: jest.fn(),
    setShowResetForLibrary: jest.fn(),
    selectedLibraryId: '0',
    settings: { 0: { mode: 'random', count: 5, showReset: true } },
  };

  // For some reason, queyselector stops working outside the first test, so these are all in one test.
  it('renders with selected library and editing form calls handlers', () => {
    const { container, getByRole } = renderComponent(props);

    // Settings values are expected by props.
    expect(container.querySelector('#form-field1').getAttribute('value')).toBe('random');
    expect(container.querySelector('#form-field1').getAttribute('checked')).toBe('');
    expect(container.querySelector('#form-field2').getAttribute('value')).toBe('selected');
    expect(container.querySelector('#form-field2').getAttribute('checked')).toBe(null);
    expect(container.querySelectorAll('input')[2].getAttribute('value')).toBe('5');
    expect(container.querySelector('#form-field3').getAttribute('checked')).toBe('');

    // Count calls handler with correct input
    const newCount = '345';
    fireEvent.change(container.querySelectorAll('input')[2], { target: { value: newCount } });
    expect(props.setCountForLibrary).toHaveBeenCalledWith({
      libraryId: props.selectedLibraryId,
      count: newCount,
    });

    // ShowReset calls hadnler with correct input
    fireEvent.click(getByRole('switch'));
    expect(props.setShowResetForLibrary).toHaveBeenCalledWith({
      libraryId: props.selectedLibraryId,
      showReset: false,
    });

    // Mode Calls handler with correct input
    const newMode = 'selected';
    fireEvent.click(container.querySelector('#form-field2'));
    expect(props.setModeForLibrary).toHaveBeenCalledWith({
      libraryId: props.selectedLibraryId,
      mode: newMode,
    });
  });

  it('Does not render when there are is no selected library', () => {
    const { queryByTestId } = renderComponent({
      ...props,
      selectedLibraryId: null,
    });
    expect(queryByTestId('librarycontenteditor-librarysettings')).toBeFalsy();
  });
});
