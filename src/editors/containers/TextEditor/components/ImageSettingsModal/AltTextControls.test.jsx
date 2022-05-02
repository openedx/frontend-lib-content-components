import React from 'react';
import { shallow } from 'enzyme';

import { formatMessage } from '../../../../../testUtils';
import { AltTextControls } from './AltTextControls';

jest.mock('./hooks', () => ({
  onInputChange: (handler) => ({ 'hooks.onInputChange': handler }),
  onCheckboxChange: (handler) => ({ 'hooks.onCheckboxChange': handler }),
}));

describe('AltTextControls', () => {
  const props = {
    errorProps: {
      isValid: true,
    },
    isDecorative: true,
    value: 'props.value',
    // inject
    intl: { formatMessage },
  };
  beforeEach(() => {
    props.setValue = jest.fn().mockName('props.setValue');
    props.setIsDecorative = jest.fn().mockName('props.setIsDecorative');
  });
  describe('render', () => {
    test('snapshot: isDecorative=true errorProps.isValid=true', () => {
      expect(shallow(<AltTextControls {...props} />)).toMatchSnapshot();
    });
    test('snapshot: isDecorative=true errorProps.isValid=false', () => {
      props.errorProps.isValid = false;
      expect(shallow(<AltTextControls {...props} />)).toMatchSnapshot();
    });
  });
});
