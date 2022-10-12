import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { scoringCardHooks } from '../hooks';
import { useDispatch } from 'react-redux';
import { ScoringCard } from './ScoringCard';

jest.mock('../hooks', () => ({
    scoringCardHooks: jest.fn(),
}));


describe('ScoringCard', () => {
    const scoring = {
        weight: 1.5,
        attempts: {
            unlimited: false,
            number: 5,
        },
    };
    
    const props = {
        scoring: scoring,
        intl: { formatMessage },
    };

    const scoringCardHooksProps = {
        handleMaxAttemptChange: jest.fn().mockName('scoringCardHooks.handleMaxAttemptChange'),
        handleWeightChange: jest.fn().mockName('scoringCardHooks.handleWeightChange'),
    };

    scoringCardHooks.mockReturnValue(scoringCardHooksProps);

    describe('behavior', () => {
        it(' calls scoringCardHooks when initialized', () => {
            shallow(<ScoringCard {...props} />);
            const dispatch = useDispatch();
            expect(scoringCardHooks).toHaveBeenCalledWith(scoring,dispatch);
        });
    });

      describe('snapshot', () => {
        test('snapshot: scoring setting card', () => {
          expect(shallow(<ScoringCard {...props} />)).toMatchSnapshot();
        });
        test('snapshot: scoring setting card zero zero weight', () => {
            expect(shallow(<ScoringCard {...props} scoring={{
                ...scoring,
                weight:0,
            }} />)).toMatchSnapshot();
          });
          test('snapshot: scoring setting card max attempts', () => {
            expect(shallow(<ScoringCard {...props} scoring={{
                ...scoring,
                attempts: {
                    unlimited: true,
                    number: 0,
                },
            }} />)).toMatchSnapshot();
          });
      });
});