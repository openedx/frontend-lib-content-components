import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { LibraryContentEditor } from './index';

jest.unmock('@edx/paragon');
jest.unmock('@edx/paragon/icons');

jest.mock('./LibrarySettings', () => jest.fn(
  props => <div {...props}>LibrarySettings</div>,
));
jest.mock('./LibrarySelector', () => jest.fn(
  props => <div {...props}>LibrarySelector</div>,
));
jest.mock('./BlocksSelector', () => jest.fn(
  props => <div {...props}>BlocksSelector</div>,
));
jest.mock('../EditorContainer', () => jest.fn(
  props => <div name="EditorContainer" {...props} />,
));

jest.mock('./hooks', () => ({
  useLibraryHook: jest.fn().mockReturnValue({
    getContent: jest.fn(),
  }),
}));

function renderComponent(props) {
  return render(
    <IntlProvider locale="en">
      <LibraryContentEditor {...props} />
    </IntlProvider>,
  );
}

describe('LibraryContentEditor', () => {
  const props = {
    onClose: jest.fn(),
    returnFunction: jest.fn(),
    blockFailed: false,
    blockFinished: true,
    blockValue: 'SoMe VaLue',
    blocksInSelectedLibrary: ['block1', 'block2', 'block3'],
    candidates: ['block3'],
    libraryPayload: { payload: 'pAYloAD' },
    intl: {
      formatMessage: (content) => content.defaultMessage,
    },
  };

  it('Renders a spinner when loading', () => {
    const { getByTestId } = renderComponent({ ...props, blockFinished: false });
    expect(getByTestId('librarycontenteditor-loadingspinner')).toBeTruthy();
  });

  it('Renders LibrarySettings, LibrarySelector and BlocksSelector when loaded', () => {
    const { queryByTestId, getByText } = renderComponent({ ...props });
    expect(queryByTestId('librarycontenteditor-loadingspinner')).toBeFalsy();
    expect(getByText('LibrarySettings')).toBeTruthy();
    expect(getByText('LibrarySelector')).toBeTruthy();
    expect(getByText('BlocksSelector')).toBeTruthy();
  });

  it('Renders a failed message when blockFailed', () => {
    const { queryByTestId } = renderComponent({ ...props, blockFailed: true });
    expect(queryByTestId('librarycontenteditor-blockfailedmessage')).toBeTruthy();
  });
});
