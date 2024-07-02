import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { mergeConfig } from '@edx/frontend-platform';
import { formatMessage } from '../../../../../../../testUtils';
import { scoringCardHooks } from '../hooks';
import { ScoringCard } from './ScoringCard';
import { GradingMethodKeys } from '../../../../../../data/constants/problem';

mergeConfig({
  ENABLE_GRADING_METHOD_IN_PROBLEMS: true,
});

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
    gradingMethod: GradingMethodKeys.LAST_SCORE,
    updateSettings: jest.fn().mockName('args.updateSettings'),
    intl: { formatMessage },
  };

  const props = {
    scoring,
    intl: { formatMessage },
    defaultValue: 1,
  };

  const scoringCardHooksProps = {
    handleMaxAttemptChange: jest.fn().mockName('scoringCardHooks.handleMaxAttemptChange'),
    handleWeightChange: jest.fn().mockName('scoringCardHooks.handleWeightChange'),
    handleOnChange: jest.fn().mockName('scoringCardHooks.handleOnChange'),
    handleGradingMethodChange: jest.fn().mockName('scoringCardHooks.handleGradingMethodChange'),
    local: 5,
  };

  scoringCardHooks.mockReturnValue(scoringCardHooksProps);

  describe('behavior', () => {
    it(' calls scoringCardHooks when initialized', () => {
      shallow(<ScoringCard {...props} />);
      expect(scoringCardHooks).toHaveBeenCalledWith(scoring, props.updateSettings, props.defaultValue);
    });
  });

  describe('snapshot', () => {
    test('snapshot: scoring setting card', () => {
      expect(shallow(<ScoringCard {...props} />).snapshot).toMatchSnapshot();
    });
    test('snapshot: scoring setting card zero zero weight', () => {
      expect(shallow(<ScoringCard
        {...props}
        scoring={{
          ...scoring,
          weight: 0,
        }}
      />).snapshot).toMatchSnapshot();
    });
    test('snapshot: scoring setting card max attempts', () => {
      expect(shallow(<ScoringCard
        {...props}
        scoring={{
          ...scoring,
          attempts: {
            unlimited: true,
            number: 0,
          },
        }}
      />).snapshot).toMatchSnapshot();
    });
  });
});
