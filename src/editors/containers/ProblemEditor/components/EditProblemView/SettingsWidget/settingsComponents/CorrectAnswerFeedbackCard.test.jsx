import React from 'react';
import { shallow } from 'enzyme';
import { formatMessage } from '../../../../../../../testUtils';
import { correctAnswerFeedbackHooks } from '../hooks';
import { CorrectAnswerFeedbackCard } from './CorrectAnswerFeedbackCard';
import messages from '../messages';

jest.mock('../hooks', () => ({
  correctAnswerFeedbackHooks: jest.fn(),
}));

describe('CorrectAnswerFeedbackCard', () => {
  const correctAnswerFeedback = 'SomEFeEdbacK';
  const props = {
    correctAnswerFeedback,
    updateSettings: jest.fn().mockName('args.updateSettings'),
    intl: { formatMessage },
  };

  describe('behavior', () => {
    it(' calls correctAnswerFeedbackHooks when initialized', () => {
      const correctAnswerFeedbackProps = {
        summary: { message: correctAnswerFeedback, values: {}, intl: false },
        handleChange: jest.fn().mockName('correctAnswerFeedbackHooks.handleChange'),
      };
      correctAnswerFeedbackHooks.mockReturnValue(correctAnswerFeedbackProps);
      shallow(<CorrectAnswerFeedbackCard {...props} />);
      expect(correctAnswerFeedbackHooks).toHaveBeenCalledWith(correctAnswerFeedback, props.updateSettings);
    });
  });

  describe('snapshot', () => {
    test('snapshot: renders correct answer feedback setting card', () => {
      const correctAnswerFeedbackProps = {
        summary: { message: correctAnswerFeedback, values: {}, intl: false },
        handleChange: jest.fn().mockName('correctAnswerFeedbackHooks.handleChange'),
      };
      correctAnswerFeedbackHooks.mockReturnValue(correctAnswerFeedbackProps);
      expect(shallow(<CorrectAnswerFeedbackCard {...props} />)).toMatchSnapshot();
    });
    test('snapshot: renders correct answer feedback setting card no key', () => {
      const correctAnswerFeedbackProps = {
        summary: { message: messages.noCorrectAnswerFeedbackSummary, values: {}, intl: true },
        handleChange: jest.fn().mockName('correctAnswerFeedbackHooks.handleChange'),
      };
      correctAnswerFeedbackHooks.mockReturnValue(correctAnswerFeedbackProps);
      expect(shallow(<CorrectAnswerFeedbackCard {...props} correctAnswerFeedback="" />)).toMatchSnapshot();
    });
  });
});
