import React from 'react';
import { shallow } from 'enzyme';
import { showAdvancedSettingsCards } from './hooks';
import { SettingsWidget, mapDispatchToProps } from '.';
import { ProblemTypeKeys } from '../../../../../data/constants/problem';
import { actions } from '../../../../../data/redux';

jest.mock('./hooks', () => ({
  showAdvancedSettingsCards: jest.fn(),
}));

jest.mock('./settingsComponents/GeneralFeedback', () => 'GeneralFeedback');
jest.mock('./settingsComponents/GroupFeedback', () => 'GroupFeedback');
jest.mock('./settingsComponents/Randomization', () => 'Randomization');
jest.mock('./settingsComponents/HintsCard', () => 'HintsCard');
jest.mock('./settingsComponents/MatlabCard', () => 'MatlabCard');
jest.mock('./settingsComponents/ResetCard', () => 'ResetCard');
jest.mock('./settingsComponents/ScoringCard', () => 'ScoringCard');
jest.mock('./settingsComponents/ShowAnswerCard', () => 'ShowAnswerCard');
jest.mock('./settingsComponents/SwitchToAdvancedEditorCard', () => 'SwitchToAdvancedEditorCard');
jest.mock('./settingsComponents/TimerCard', () => 'TimerCard');
jest.mock('./settingsComponents/TypeCard', () => 'TypeCard');

describe('SettingsWidget', () => {
  const props = {
    problemType: ProblemTypeKeys.TEXTINPUT,
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

  describe('mapDispatchToProps', () => {
    test('updateSettings from actions.problem.updateSettings', () => {
      expect(mapDispatchToProps.updateSettings).toEqual(actions.problem.updateSettings);
    });
  });

  describe('mapDispatchToProps', () => {
    test('updateField from actions.problem.updateField', () => {
      expect(mapDispatchToProps.updateField).toEqual(actions.problem.updateField);
    });
  });
});
