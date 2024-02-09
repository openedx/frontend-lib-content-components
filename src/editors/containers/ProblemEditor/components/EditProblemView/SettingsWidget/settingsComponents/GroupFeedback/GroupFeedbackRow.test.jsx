import React from 'react';
import { shallow } from '@edx/react-unit-test-utils';
import { formatMessage } from '../../../../../../../../testUtils';
import { GroupFeedbackRow } from './GroupFeedbackRow';

jest.mock('@edx/paragon', () => ({
  ...jest.requireActual('@edx/paragon'),
  Row: 'Row',
  IconButton: 'IconButton',
  Icon: 'Icon',
  Form: {
    CheckboxSet: 'Form.CheckboxSet',
    Checkbox: 'Form.CheckboxSet',
    Control: 'Form.Control',
  },
  ActionRow: 'ActionRow',
}));
jest.mock('@edx/paragon/icons', () => ({
  ...jest.requireActual('@edx/paragon/icons'),
  DeleteOutline: 'DeleteOutline',
}));

describe('GroupFeedbackRow', () => {
  const props = {
    value: { answers: ['A', 'C'], feedback: 'sOmE FeEDBACK' },
    answers: ['A', 'B', 'C', 'D'],
    handleAnswersSelectedChange: jest.fn().mockName('handleAnswersSelectedChange'),
    handleFeedbackChange: jest.fn().mockName('handleFeedbackChange'),
    handleDelete: jest.fn().mockName('handleDelete'),
    intl: { formatMessage },
  };

  describe('snapshot', () => {
    test('snapshot: renders hints row', () => {
      expect(shallow(<GroupFeedbackRow {...props} />).snapshot).toMatchSnapshot();
    });
  });
});
