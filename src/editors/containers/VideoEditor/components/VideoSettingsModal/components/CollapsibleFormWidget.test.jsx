import React from 'react';
import { shallow } from 'enzyme';

import { CollapsibleFormWidget } from './CollapsibleFormWidget';

describe('CollapsibleFormWidget', () => {
  const props = {
    isError: false,
    subtitle: 'SuBTItle',
    title: 'tiTLE',
  };
  describe('render', () => {
    const testContent = (<p>Some test string</p>);
    test('snapshots: renders as expected with default props', () => {
      expect(
        shallow(<CollapsibleFormWidget {...props}>{testContent}</CollapsibleFormWidget>),
      ).toMatchSnapshot();
    });
    test('snapshots: renders with open={true} when there is error', () => {
      expect(
        shallow(<CollapsibleFormWidget {...props} isError>{testContent}</CollapsibleFormWidget>),
      ).toMatchSnapshot();
    });
  });
});
