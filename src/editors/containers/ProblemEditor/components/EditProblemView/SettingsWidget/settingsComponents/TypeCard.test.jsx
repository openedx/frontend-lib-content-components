import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { TypeCard } from './TypeCard';

describe('TypeCard', () => {

  const props = {
    problemType: "TEXTINPUT",
    intl: { formatMessage },
  };


  describe('snapshot', () => {
    test('snapshot: renders type setting card', () => {
      expect(shallow(<TypeCard {...props} />)).toMatchSnapshot();
    });
  });
});