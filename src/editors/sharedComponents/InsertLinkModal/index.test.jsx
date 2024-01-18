import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import InsertLinkModal from '.';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('./api', () => ({
  getBlocksFromCourse: jest.fn(),
}));

// Set up any necessary data for props or state
const mockProps = {
  courseId: 'course123',
  isOpen: true,
  onClose: jest.fn(),
  editorRef: { current: { selection: { getContent: jest.fn(), setContent: jest.fn() } } },
};

describe('InsertLinkModal', () => {
  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  );

  test('renders without crashing', () => {
    shallow(
      <IntlProviderWrapper>
        <InsertLinkModal {...mockProps} />
      </IntlProviderWrapper>,
    );
  });

  test('snapshot', () => {
    const wrapper = shallow(
      <IntlProviderWrapper>
        <InsertLinkModal {...mockProps} />
      </IntlProviderWrapper>,
    );
    expect(wrapper).toMatchSnapshot();
  });

  test('renders BaseModal', () => {
    const wrapper = mount(
      <IntlProviderWrapper>
        <InsertLinkModal {...mockProps} />
      </IntlProviderWrapper>,
    );
    expect(wrapper.find('BaseModal').exists()).toBe(true);
  });
});
