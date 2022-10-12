import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { ShowAnswerCard } from './ShowAnswerCard';
import { showAnswerCardHooks } from '../hooks';
import { useDispatch } from 'react-redux';

jest.mock('../hooks', () => ({
    showAnswerCardHooks: jest.fn(),
}));


describe('ShowAnswerCard', () => {
    const showAnswer = {
        on: "after_attempts",
        afterAttempts: 5,
    }
    const props = {
        showAnswer: showAnswer,
        intl: { formatMessage },
    };

    const showAnswerCardHooksProps = {
        handleShowAnswerChange: jest.fn().mockName('showAnswerCardHooks.handleShowAnswerChange'),
        handleAttemptsChange: jest.fn().mockName('showAnswerCardHooks.handleAttemptsChange'),
    };

    showAnswerCardHooks.mockReturnValue(showAnswerCardHooksProps);

    describe('behavior', () => {
        it(' calls showAnswerCardHooks when initialized', () => {
            shallow(<ShowAnswerCard {...props} />);
            const dispatch = useDispatch();
            expect(showAnswerCardHooks).toHaveBeenCalledWith(showAnswer, dispatch);
        });
    });

    describe('snapshot', () => {
        test('snapshot: show answer setting card', () => {
            expect(shallow(<ShowAnswerCard {...props} />)).toMatchSnapshot();
        });
    });
});