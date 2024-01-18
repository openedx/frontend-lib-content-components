import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import BlocksList from '.';

Enzyme.configure({ adapter: new Adapter() });

const mockBlocks = {
  'block-key': {
    id: 'block-key',
    blockId: 'edx_block-1',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'character',
    displayName: 'Any display name',
    children: ['block-children-1', 'block-children-2'],
  },
  'block-children-1': {
    id: 'block-children-1',
    blockId: 'edx_block-1',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'sequential',
    displayName: 'Block children 1',
  },
  'block-children-2': {
    id: 'block-children-2',
    blockId: 'edx_block-2',
    lmsWebUrl: 'http://localhost/weburl',
    legacyWebUrl: 'http://localhost/legacy',
    studentViewUrl: 'http://localhost/studentview',
    type: 'sequential',
    displayName: 'Block children 2',
  },
};

describe('BlocksList Component', () => {
  // eslint-disable-next-line react/prop-types
  const IntlProviderWrapper = ({ children }) => (
    <IntlProvider locale="en" messages={{}}>
      {children}
    </IntlProvider>
  );

  const wrapper = shallow(
    <IntlProviderWrapper>
      <BlocksList blocks={mockBlocks} onBlockSelected={() => {}} />
    </IntlProviderWrapper>,
  );

  test('renders without crashing', () => {
    expect(wrapper.exists()).toBeTruthy();
  });

  test('snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
