import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { LibrarySelector } from './LibrarySelector';

jest.mock('./data/api', () => ({
    fetchLibraryContent: jest.fn().mockReturnValue({
        blocks: 'SoMe BLOcKs',
    }),
    fetchlibraryMetadata: jest.fn().mockReturnValue({
        version: 'lIkE a VeRsiOn',
    }),
  }));

function renderComponent(props) {
  return render(
    <IntlProvider locale="en">
      <LibrarySelector {...props} />
    </IntlProvider>,
  );
}

describe('LibrarySelector',()=>{
    const mocklibraries = [
        {
            display_name: 'lIb1',
            library_key: 'LiB KEy 1',
        },
        {
            display_name: 'LIb2',
            library_key: 'LIb KEy 2',
        },
        {
            display_name: 'liB3',
            library_key: 'lIb keY 3',
        }
    ]
    const props = {
        studioEndpointUrl: 'eXaMplE.com',
        libraries: mocklibraries,
        settings: {
            [mocklibraries[0].library_key]: {
                value: 'SoMethIng'
            }
        },
        unloadLibrary: jest.fn(),
    }
    it('Renders as expected with default props',()=>{
        const {container, queryByText, queryByTestId} = renderComponent(props);

        expect(queryByTestId('dropdown')).toBeTruthy();
        // It renders the selected library as the title.
        expect(queryByText(mocklibraries[0].display_name)).toBeTruthy();
        // The other members of the library are not rendered.
        expect(queryByText(mocklibraries[1].display_name)).toBeFalsy();
        expect(queryByText(mocklibraries[2].display_name)).toBeFalsy();

        //Clicking on the dropdown displays the options
        fireEvent.click(container.querySelector("#library-selector"));
        expect(queryByText(mocklibraries[1].display_name)).toBeTruthy();
        expect(queryByText(mocklibraries[2].display_name)).toBeTruthy();
        expect(queryByText('FormattedMessage')).toBeTruthy();
    });
    it('Does not render dropdown when there are no libraries',()=>{
        const {container, queryByTestId} = renderComponent({
            ...props,
            libraries: null,
        });
        expect(queryByTestId('dropdown')).toBeFalsy();
    });
});
