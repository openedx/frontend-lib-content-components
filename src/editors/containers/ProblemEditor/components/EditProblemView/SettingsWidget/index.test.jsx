import React from 'react';
import { shallow } from 'enzyme';
import { showAdvancedSettingsCards } from './hooks';
import { SettingsWidget } from '.';

jest.mock('./hooks', () => ({
    showAdvancedSettingsCards: jest.fn(),
}));


describe('SettingsWidget', () => {

    const props = {
        problemType: "TEXTINPUT",
        settings: {},
    };

    describe('behavior', () => {
        it(' calls showAdvancedSettingsCards when initialized', () => {
            const showAdvancedSettingsCardsProps = {
                isAdvancedCardsVisible: false,
                setResetTrue: jest.fn().mockName('showAdvancedSettingsCards.setResetTrue'),
            };
            showAdvancedSettingsCards.mockReturnValue(showAdvancedSettingsCardsProps);
            shallow(<SettingsWidget {...props} />);
            expect(showAdvancedSettingsCards).toHaveBeenCalledWith();
        });
    });

    describe('snapshot', () => {
        test('snapshot: renders Settings widget page', () => {
            const showAdvancedSettingsCardsProps = {
                isAdvancedCardsVisible: false,
                setResetTrue: jest.fn().mockName('showAdvancedSettingsCards.setResetTrue'),
            };
            showAdvancedSettingsCards.mockReturnValue(showAdvancedSettingsCardsProps);
            expect(shallow(<SettingsWidget {...props} />)).toMatchSnapshot();
        });
        test('snapshot: renders Settings widget page advanced settings visible', () => {
            const showAdvancedSettingsCardsProps = {
                isAdvancedCardsVisible: true,
                setResetTrue: jest.fn().mockName('showAdvancedSettingsCards.setResetTrue'),
            };
            showAdvancedSettingsCards.mockReturnValue(showAdvancedSettingsCardsProps);
            expect(shallow(<SettingsWidget {...props} />)).toMatchSnapshot();
        });
    });
});