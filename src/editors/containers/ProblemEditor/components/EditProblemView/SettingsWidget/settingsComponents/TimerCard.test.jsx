import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { TimerCard } from './TimerCard';
import { timerCardHooks } from '../hooks';
import { useDispatch } from 'react-redux';

jest.mock('../hooks', () => ({
  timerCardHooks: jest.fn(),
}));


describe('TimerCard', () => {

  const props = {
    timeBetween: 5,
    intl: { formatMessage },
  };

  const timerCardHooksProps = {
    handleChange: jest.fn().mockName('timerCardHooks.handleChange'),
  };

  timerCardHooks.mockReturnValue(timerCardHooksProps);

  describe('behavior', () => {
    it(' calls timerCardHooks when initialized', () => {
        shallow(<TimerCard {...props} />);
        const dispatch = useDispatch();
        expect(timerCardHooks).toHaveBeenCalledWith( dispatch );
    });
});

  describe('snapshot', () => {
    test('snapshot: renders reset true setting card', () => {
      expect(shallow(<TimerCard {...props} />)).toMatchSnapshot();
    });
  });
});