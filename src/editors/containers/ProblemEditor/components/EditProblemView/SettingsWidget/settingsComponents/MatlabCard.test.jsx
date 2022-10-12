import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { matlabCardHooks } from '../hooks';
import { useDispatch } from 'react-redux';
import { MatlabCard } from './MatlabCard';
import messages from '../messages';

jest.mock('../hooks', () => ({
    matlabCardHooks: jest.fn(),
}));


describe('MatlabCard', () => {
    const matLabApiKey = "matlab_api_key"
    const props = {
        matLabApiKey: matLabApiKey,
        intl: { formatMessage },
    };

    describe('behavior', () => {
        it(' calls resetCardHooks when initialized', () => {
            const matlabCardHooksProps = {
                summary: { message: matLabApiKey, values: {}, intl: false },
                handleChange: jest.fn().mockName('matlabCardHooks.handleChange'),
            };
            matlabCardHooks.mockReturnValue(matlabCardHooksProps);
            shallow(<MatlabCard {...props} />);
            const dispatch = useDispatch();
            expect(matlabCardHooks).toHaveBeenCalledWith(matLabApiKey, dispatch);
        });
    });

    describe('snapshot', () => {
        test('snapshot: renders matlab setting card', () => {
            const matlabCardHooksProps = {
                summary: { message: matLabApiKey, values: {}, intl: false },
                handleChange: jest.fn().mockName('matlabCardHooks.handleChange'),
            };
            matlabCardHooks.mockReturnValue(matlabCardHooksProps);
            expect(shallow(<MatlabCard {...props} />)).toMatchSnapshot();
        });
        test('snapshot: renders matlab setting card no key', () => {
            const matlabCardHooksProps = {
                summary: { message: messages.matlabNoKeySummary, values: {}, intl: true },
                handleChange: jest.fn().mockName('matlabCardHooks.handleChange'),
            };
            matlabCardHooks.mockReturnValue(matlabCardHooksProps);
            expect(shallow(<MatlabCard {...props} matLabApiKey="" />)).toMatchSnapshot();
        });
    });
});