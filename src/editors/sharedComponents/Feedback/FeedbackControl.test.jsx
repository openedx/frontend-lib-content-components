import { shallow } from 'enzyme';
import FeedbackControl from './FeedbackControl';

const answerWithFeedback = {
  id: 'A',
  title: 'Answer 1',
  correct: true,
  selectedFeedback: 'some feedback',
  unselectedFeedback: 'unselectedFeedback',
};

const props = {
  answer: answerWithFeedback,
  intl: { formatMessage: jest.fn() },
  setAnswer: jest.fn(),
  feedback: 'feedback',
  onChange: jest.fn(),
  labelMessage: 'msg',
  labelMessageBoldUnderline: 'msg',
};

describe('FeedbackBox component', () => {
  test('renders', () => {
    expect(shallow(<FeedbackControl {...props} />)).toMatchSnapshot();
  });
});
