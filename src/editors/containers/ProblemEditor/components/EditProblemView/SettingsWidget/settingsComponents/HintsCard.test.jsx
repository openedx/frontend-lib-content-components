import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { HintsCard } from './HintsCard';
import { hintsCardHooks, hintsRowHooks } from '../hooks';
import messages from '../messages';
import { useDispatch } from 'react-redux';

jest.mock('../hooks', () => ({
    hintsCardHooks: jest.fn(),
    hintsRowHooks: jest.fn(),
}));

describe('HintsCard', () => {
    const hint1 = { id: 1, value: "hint1" }
    const hint2 = { id: 2, value: "" }
    const hints_0 = [];
    const hints_1 = [hint1];
    const hints_2 = [hint1, hint2];
    const props = {
        intl: { formatMessage },
        hints: hints_0,
        updateSettings: jest.fn(),
    };

    const hintsRowHooksProps = {
        handleChange: jest.fn().mockName('hintsRowHooks.handleChange'),
        handleDelete: jest.fn().mockName('hintsRowHooks.handleDelete'),
    }
    hintsRowHooks.mockReturnValue(hintsRowHooksProps);

    describe('behavior', () => {
        it(' calls hintsCardHooks when initialized', () => {
            const hintsCardHooksProps = {
                summary: { message: messages.noHintSummary, values: {} },
                handleAdd: jest.fn().mockName('hintsCardHooks.handleAdd'),
            };
            
            hintsCardHooks.mockReturnValue(hintsCardHooksProps);
            shallow(<HintsCard {...props} />);
            const dispatch = useDispatch();
            expect(hintsCardHooks).toHaveBeenCalledWith( hints_0, dispatch );
        });
    });

    describe('snapshot', () => {
        test('snapshot: renders hints setting card no hints', () => {
            const hintsCardHooksProps = {
                summary: { message: messages.noHintSummary, values: {} },
                handleAdd: jest.fn().mockName('hintsCardHooks.handleAdd'),
            };

            hintsCardHooks.mockReturnValue(hintsCardHooksProps);
            expect(shallow(<HintsCard {...props} />)).toMatchSnapshot();
        });
        test('snapshot: renders hints setting card one hint', () => {
            const hintsCardHooksProps = {
                summary: {
                    message: messages.hintSummary,
                    values: { hint: hint1.value, count: 1 }
                },
                handleAdd: jest.fn().mockName('hintsCardHooks.handleAdd'),
            };

            hintsCardHooks.mockReturnValue(hintsCardHooksProps);
            expect(shallow(<HintsCard {...props} hints={hints_1} />)).toMatchSnapshot();
        });
        test('snapshot: renders hints setting card multiple hints', () => {
            const hintsCardHooksProps = {
                summary: {
                    message: messages.hintSummary,
                    values: { hint: hint2.value, count: 2 }
                },
                handleAdd: jest.fn().mockName('hintsCardHooks.handleAdd'),
            };

            hintsCardHooks.mockReturnValue(hintsCardHooksProps);
            expect(shallow(<HintsCard {...props} hints={hints_2} />)).toMatchSnapshot();
        });
    });
});