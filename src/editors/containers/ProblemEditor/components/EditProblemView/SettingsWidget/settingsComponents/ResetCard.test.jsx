import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { ResetCard } from './ResetCard';
import { resetCardHooks } from '../hooks';
import { useDispatch } from 'react-redux';

jest.mock('../hooks', () => ({
  resetCardHooks: jest.fn(),
}));


describe('ResetCard', () => {

  const props = {
    showResetButton: false,
    intl: { formatMessage },
  };

  const resetCardHooksProps = {
    setResetTrue: jest.fn().mockName('resetCardHooks.setResetTrue'),
    setResetFalse: jest.fn().mockName('resetCardHooks.setResetFalse'),
  };

  resetCardHooks.mockReturnValue(resetCardHooksProps);

  describe('behavior', () => {
    it(' calls resetCardHooks when initialized', () => {
        shallow(<ResetCard {...props} />);
        const dispatch = useDispatch();
        expect(resetCardHooks).toHaveBeenCalledWith( dispatch );
    });
});

  describe('snapshot', () => {
    test('snapshot: renders reset true setting card', () => {
      expect(shallow(<ResetCard {...props} />)).toMatchSnapshot();
    });
    test('snapshot: renders reset true setting card', () => {
      expect(shallow(<ResetCard {...props} showResetButton={true} />)).toMatchSnapshot();
    });
  });
});