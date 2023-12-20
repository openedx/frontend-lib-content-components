import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { LibrarySelector } from './LibrarySelector';

jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');

jest.mock('./data/api', () => ({
  fetchV2LibraryContent: jest.fn().mockReturnValue({
    blocks: 'SoMe BLOcKs',
  }),
}));

function renderComponent(props) {
  return render(
    <IntlProvider locale="en">
      <LibrarySelector {...props} />
    </IntlProvider>,
  );
}

describe('LibrarySelector', () => {
  const mocklibraries = [
    {
      title: 'lIb1',
      id: 'LiB KEy 1',
    },
    {
      display_name: 'LIb2',
      library_key: 'LIb KEy 2',
    },
    {
      display_name: 'liB3',
      library_key: 'lIb keY 3',
    },
  ];
  const props = {
    libraries: mocklibraries,
    selectedLibraryId: mocklibraries[0].id,
    settings: {
      [mocklibraries[0].id]: {
        value: 'SoMethIng',
      },
    },
  };

  it('Renders as expected with default props', () => {
    const { container, queryByText, queryByTestId } = renderComponent(props);

    expect(queryByTestId('dropdown')).toBeTruthy();
    // The other members of the library are not rendered.
    expect(queryByText(mocklibraries[1].display_name)).toBeFalsy();
    expect(queryByText(mocklibraries[2].display_name)).toBeFalsy();

    // Clicking on the dropdown displays the options
    fireEvent.click(container.querySelector('#library-selector'));
    expect(queryByText(mocklibraries[0].title)).toBeTruthy();
    expect(queryByText(mocklibraries[1].display_name)).toBeTruthy();
    expect(queryByText(mocklibraries[2].display_name)).toBeTruthy();
    expect(queryByText('FormattedMessage')).toBeTruthy();
  });

  it('Does not render dropdown when there are no libraries', () => {
    const { queryByTestId } = renderComponent({
      ...props,
      libraries: [],
    });
    expect(queryByTestId('dropdown')).toBeFalsy();
  });
});
