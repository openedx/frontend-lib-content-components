import { StrictDict } from '../../utils';

export const ProblemTypeKeys = StrictDict({
  TEXTINPUT: 'TEXTINPUT',
  NUMERIC: 'NUMERIC',
  DROPDOWN: 'DROPDOWN',
  MULTISELECT: 'MULTISELECT',
  SINGLESELECT: 'SINGLESELECT',
});

export const ProblemTypes = StrictDict({
  [ProblemTypeKeys.SINGLESELECT]: {
    title: 'Single Select Problem',
    preview: ('<div />'),
    description: 'Specify one correct answer from a list of possible options',
    helpLink: 'something.com',
  },
  [ProblemTypeKeys.MULTISELECT]: {
    title: 'Multi Select Problem',
    preview: ('<div />'),
    description: 'Specify one or more correct answers from a list of possible options.',
    helpLink: 'something.com',
  },
  [ProblemTypeKeys.DROPDOWN]: {
    title: 'Dropdown Problem',
    preview: ('<div />'),
    description: 'Specify one correct answer from a list of possible options, selected in a dropdown menu.',
    helpLink: 'something.com',
  },
  [ProblemTypeKeys.NUMERIC]: {
    title: 'Numeric Response Problem',
    preview: ('<div />'),
    description: 'Specify one or more correct numeric answers, submitted in a response field.',
    helpLink: 'something.com',
  },
  [ProblemTypeKeys.TEXTINPUT]: {
    title: 'Text Input Problem',
    preview: ('<div />'),
    description: 'Specify one or more correct text answers, including numbers and special characters, submitted in a response field.',
    helpLink: 'something.com',
  },
});

export const ShowAnswerTypes = StrictDict({
  ALWAYS: {
      name: 'Always',
      value: 'always',
  },
  ANSWERED: {
      name: 'Answered',
      value: 'answered',
  },
  ATTEMPTED: {
      name: 'Attempted or Past Due',
      value: 'attempted',
  },
  CLOSED: {
      name: 'Closed',
      value: 'closed',
  },
  FINISHED: {
      name: 'Finished',
      value: 'finished',
  },
  CORRECT_OR_PAST_DUE: {
      name: 'Correct or Past Due',
      value: 'correct_or_past_due',
  },
  PAST_DUE: {
      name: 'Past Due',
      value: 'past_due',
  },
  NEVER: {
      name: 'Never',
      value: 'never',
  },
  AFTER_SOME_NUMBER_OF_ATTEMPTS: {
      name: 'After Some Number of Attempts',
      value: 'after_attempts',
  },
  AFTER_ALL_ATTEMPTS: {
      name: 'After All Attempts',
      value: 'after_all_attempts',
  },
  AFTER_ALL_ATTEMPTS_OR_CORRECT: {
      name: 'After All Attempts or Correct',
      value: 'after_all_attempts_or_correct',
  },
  ATTEMPTED_NO_PAST_DUE: {
      name: 'Attempted',
      value: 'attempted_no_past_due',
  },
});


export const RandomizationType = StrictDict({
  ALWAYS: {
      name: 'Always',
      value: 'always',
  },
  ONRESET: {
      name: 'On Reset',
      value: 'onreset',
  },
  NEVER: {
      name: 'Never',
      value: 'never',
  },
  PER_STUDENT: {
      name: 'Per Student',
      value: 'per_student',
  },
});

  
