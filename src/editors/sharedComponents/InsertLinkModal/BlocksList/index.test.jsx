import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import BlocksList from '.';

Enzyme.configure({ adapter: new Adapter() });

const mockBlocks = {
  block1: { id: 'block1', path: 'Block 1', type: 'section' },
  block2: { id: 'block2', path: 'Block 2', type: 'subsection' },
};

describe('BlocksList Component', () => {
  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  );

  test('renders without crashing', () => {
    const wrapper = shallow(
      <IntlProviderWrapper>
        <BlocksList blocks={mockBlocks} onBlockSelected={() => {}} />
      </IntlProviderWrapper>,
    );
    expect(wrapper.exists()).toBeTruthy();
  });
});
