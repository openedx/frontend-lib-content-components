import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import FilterBlock from '.';

Enzyme.configure({ adapter: new Adapter() });

const mockBlock = {
  id: 'block-key',
  blockId: 'edx_block-1',
  lmsWebUrl: 'http://localhost/weburl',
  legacyWebUrl: 'http://localhost/legacy',
  studentViewUrl: 'http://localhost/studentview',
  type: 'sequential',
  displayName: 'Any display name',
  path: 'Path / To / Block 1',
  children: ['block-children-1', 'block-children-2'],
};

describe('FilteredBlock Component', () => {
  const mockOnBlockFilterClick = jest.fn();

  const setup = (
    block = mockBlock,
    onBlockFilterClick = mockOnBlockFilterClick,
  ) => mount(<FilterBlock block={block} onBlockFilterClick={onBlockFilterClick} />);

  test('renders without crashing', () => {
    const wrapper = setup();
    expect(wrapper.exists()).toBeTruthy();
  });

  test('snapshot', () => {
    const wrapper = setup();
    expect(wrapper).toMatchSnapshot();
  });

  test('calls onBlockFilterClick when the button is clicked', () => {
    const wrapper = setup();
    const button = wrapper.find('Button[data-testid="filter-block-item"]');
    button.simulate('click');
    expect(mockOnBlockFilterClick).toHaveBeenCalledWith(mockBlock);
  });

  test('displays the block title and subtitle', () => {
    const wrapper = setup();
    expect(wrapper.find('.h5').text()).toContain('Path / To');
    expect(wrapper.find('.h3').text()).toContain('Block 1');
  });
});
