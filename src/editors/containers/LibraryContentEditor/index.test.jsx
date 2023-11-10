import React from 'react';
import { render, fireEvent, prettyDOM } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { LibraryContentEditor } from './index';


jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');

jest.mock('./LibrarySettings', ()=>{
    return jest.fn(
        (props)=>(<div {...props}>LibrarySettings</div>)
    );
});
jest.mock('./LibrarySelector', ()=>{
    return jest.fn(
        (props)=>(<div {...props}> LibrarySelector</div>)
    );
});
jest.mock('./BlocksSelector', ()=>{
    return jest.fn(
        (props)=>(<div {...props}>BlocksSelector</div>)
    );
});
jest.mock('../EditorContainer', ()=>{
    return jest.fn(
        (props)=>(<div name="EditorContainer"{...props}></div>)
    );
});


jest.mock('./hooks', () => ({
    useLibraryHook: jest.fn().mockReturnValue({
        getContent: jest.fn()
    }),
}));


function renderComponent(props) {
    return render(
      <IntlProvider locale="en">
        <LibraryContentEditor {...props} />
      </IntlProvider>,
    );
  }

describe('LibraryContentEditor',()=>{
    const mockLibId = 'lIb iD';

    const props = {
        onClose: jest.fn(),
        returnFunction: jest.fn(),
        blockValue: 'SoMe VaLue',
        blockFailed: false,
        blockFinished: true,
        initialize: jest.fn(),
        libraryPayload: true,
        studioEndpointUrl: 'A UrL',
        selectedLibraryId: mockLibId,
        settings: {
            [mockLibId]: {
                candidates: [1,2,3,45],
                mode: 'a ModE'

            }
        },
        intl: {
            formatMessage: (content)=>content.defaultMessage,
        }
    }

    it('Renders a spinner when loading', ()=>{
        const {container, getByTestId} = renderComponent({...props, blockFinished: false});
        expect(getByTestId("librarycontenteditor-loadingspinner")).toBeTruthy();
    });
    it('Renders as expected once loaded', ()=>{
        const {container, queryByTestId, getByText} = renderComponent({...props});
        console.log(prettyDOM(container));
        expect(queryByTestId("librarycontenteditor-loadingspinner")).toBeFalsy();

        expect(getByText('LibrarySettings')).toBeTruthy();
        expect(getByText('LibrarySelector')).toBeTruthy();
        expect(getByText('BlocksSelector')).toBeTruthy();
    });


})