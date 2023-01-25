import { shallow } from 'enzyme';
import { FeedbackBox } from './FeedbackBox';

const answerWithFeedback = {
  id: 'A',
  title: 'Answer 1',
  correct: true,
  selectedFeedback: 'some feedback',
  unselectedFeedback: 'unselectedFeedback',
};

const props = {
  answer: answerWithFeedback,
  intl: {},
  setAnswer: jest.fn(),
};

describe('FeedbackBox component', () => {
  let el;
  beforeEach(() => {
    el = shallow(<FeedbackBox {...props} />);
  });
  test('renders', () => {
    expect(el).toMatchSnapshot();
  });
  test('updateVideoId is tied to id field onBlur', () => {
    expect(el.children().at(0).props().onChange).toBeDefined();
    expect(el.children().at(1).props().onChange).toBeDefined();
  });
});
