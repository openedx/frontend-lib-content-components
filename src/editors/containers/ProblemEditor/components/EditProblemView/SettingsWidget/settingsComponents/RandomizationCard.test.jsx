import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { randomizationCardHooks } from '../hooks';
import { useDispatch } from 'react-redux';
import { RandomizationCard } from './RandomizationCard';

jest.mock('../hooks', () => ({
    randomizationCardHooks: jest.fn(),
}));


describe('RandomizationCard', () => {

  const props = {
    randomization: "never",
    intl: { formatMessage },
  };

  const randomizationCardHooksProps = {
    handleChange: jest.fn().mockName('randomizationCardHooks.handleChange'),
  };

  randomizationCardHooks.mockReturnValue(randomizationCardHooksProps);

  describe('behavior', () => {
    it(' calls resetCardHooks when initialized', () => {
        shallow(<RandomizationCard {...props} />);
        const dispatch = useDispatch();
        expect(randomizationCardHooks).toHaveBeenCalledWith( dispatch );
    });
});

  describe('snapshot', () => {
    test('snapshot: randomization setting card', () => {
      expect(shallow(<RandomizationCard {...props} />)).toMatchSnapshot();
    });
  });
});