/* eslint-disable import/prefer-default-export */
import messages from './messages';

export const ToleranceTypes = {
  percent: {
    value: 'percentage',
    message: messages.typesPercentage,
  },
  number: {
    value: 'number',
    message: messages.typesNumber,

  },
  none: {
    value: null,
    message: messages.typesNone,
  },
};

