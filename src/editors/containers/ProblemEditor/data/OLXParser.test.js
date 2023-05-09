import { OLXParser } from './OLXParser';
import {
  checkboxesOLXWithFeedbackAndHintsOLX,
  getCheckboxesOLXWithFeedbackAndHintsOLX,
  dropdownOLXWithFeedbackAndHintsOLX,
  numericInputWithFeedbackAndHintsOLX,
  textInputWithFeedbackAndHintsOLX,
  multipleChoiceWithoutAnswers,
  multipleChoiceWithFeedbackAndHintsOLX,
  textInputWithFeedbackAndHintsOLXWithMultipleAnswers,
  advancedProblemOlX,
  multipleTextInputProblemOlX,
  multipleNumericProblemOlX,
  NumericAndTextInputProblemOlX,
  blankProblemOLX,
  blankQuestionOLX,
  styledQuestionOLX,
  shuffleProblemOLX,
  scriptProblemOlX,
  labelDescriptionQuestionOLX,
  htmlEntityTestOLX,
  numberParseTestOLX,
} from './mockData/olxTestData';
import { ProblemTypeKeys } from '../../../data/constants/problem';

const blankOlxParser = new OLXParser(blankProblemOLX.rawOLX);
const checkboxOlxParser = new OLXParser(checkboxesOLXWithFeedbackAndHintsOLX.rawOLX);
const numericOlxParser = new OLXParser(numericInputWithFeedbackAndHintsOLX.rawOLX);
const dropdownOlxParser = new OLXParser(dropdownOLXWithFeedbackAndHintsOLX.rawOLX);
const multipleChoiceOlxParser = new OLXParser(multipleChoiceWithFeedbackAndHintsOLX.rawOLX);
const multipleChoiceWithoutAnswersOlxParser = new OLXParser(multipleChoiceWithoutAnswers.rawOLX);
const textInputOlxParser = new OLXParser(textInputWithFeedbackAndHintsOLX.rawOLX);
const textInputMultipleAnswersOlxParser = new OLXParser(textInputWithFeedbackAndHintsOLXWithMultipleAnswers.rawOLX);
const advancedOlxParser = new OLXParser(advancedProblemOlX.rawOLX);
const multipleTextInputOlxParser = new OLXParser(multipleTextInputProblemOlX.rawOLX);
const multipleNumericOlxParser = new OLXParser(multipleNumericProblemOlX.rawOLX);
const numericAndTextInputOlxParser = new OLXParser(NumericAndTextInputProblemOlX.rawOLX);
const labelDescriptionQuestionOlxParser = new OLXParser(labelDescriptionQuestionOLX.rawOLX);
const shuffleOlxParser = new OLXParser(shuffleProblemOLX.rawOLX);

describe('OLXParser', () => {
  describe('throws error and redirects to advanced editor', () => {
    describe('when settings attributes are on problem tags', () => {
      it('should throw error and contain message regarding opening advanced editor', () => {
        try {
          labelDescriptionQuestionOlxParser.getParsedOLXData();
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e.message).toBe('Misc Attributes asscoiated with problem, opening in advanced editor');
        }
      });
    });
    describe('when settings attributes are on problem tags', () => {
      it('should throw error and contain message regarding opening advanced editor', () => {
        try {
          shuffleOlxParser.getParsedOLXData();
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          expect(e.message).toBe('Misc Tags, reverting to Advanced Editor');
        }
      });
    });
    describe('when question parser finds script tags', () => {
      it('should throw error and contain message regarding opening advanced editor', () => {
        const olxparser = new OLXParser(scriptProblemOlX.rawOLX);
        expect(() => olxparser.parseQuestions('numericalresponse')).toThrow(new Error('Script Tag, reverting to Advanced Editor'));
      });
    });
  });
  describe('getProblemType()', () => {
    describe('given a blank problem', () => {
      const problemType = blankOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.MULTISELECT', () => {
        expect(problemType).toEqual(null);
      });
    });
    describe('given checkbox olx with feedback and hints', () => {
      const problemType = checkboxOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.MULTISELECT', () => {
        expect(problemType).toEqual(ProblemTypeKeys.MULTISELECT);
      });
    });
    describe('given numeric olx with feedback and hints', () => {
      const problemType = numericOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.NUMERIC', () => {
        expect(problemType).toEqual(ProblemTypeKeys.NUMERIC);
      });
    });
    describe('given dropdown olx with feedback and hints', () => {
      const problemType = dropdownOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.DROPDOWN', () => {
        expect(problemType).toEqual(ProblemTypeKeys.DROPDOWN);
      });
    });
    describe('given multiple choice olx with feedback and hints', () => {
      const problemType = multipleChoiceOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.SINGLESELECT', () => {
        expect(problemType).toEqual(ProblemTypeKeys.SINGLESELECT);
      });
    });
    describe('given text input olx with feedback and hints', () => {
      const problemType = textInputOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.TEXTINPUT', () => {
        expect(problemType).toEqual(ProblemTypeKeys.TEXTINPUT);
      });
    });
    describe('given an advanced problem', () => {
      const problemType = advancedOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.ADVANCED', () => {
        expect(problemType).toEqual(ProblemTypeKeys.ADVANCED);
      });
    });
    describe('given a problem with multiple text inputs', () => {
      const problemType = multipleTextInputOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.ADVANCED', () => {
        expect(problemType).toEqual(ProblemTypeKeys.ADVANCED);
      });
    });
    describe('given a problem with multiple numeric inputs', () => {
      const problemType = multipleNumericOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.ADVANCED', () => {
        expect(problemType).toEqual(ProblemTypeKeys.ADVANCED);
      });
    });
    describe('given a problem with both a text and numeric input', () => {
      const problemType = numericAndTextInputOlxParser.getProblemType();
      it('should equal ProblemTypeKeys.ADVANCED', () => {
        expect(problemType).toEqual(ProblemTypeKeys.ADVANCED);
      });
    });
  });
  describe('getHints()', () => {
    describe('given a problem with no hints', () => {
      const hints = labelDescriptionQuestionOlxParser.getHints();
      it('should return an empty array', () => {
        expect(hints).toEqual([]);
      });
    });
    describe('given checkbox olx with feedback and hints', () => {
      const hints = checkboxOlxParser.getHints();
      it('should equal an array of hints', () => {
        expect(hints).toEqual(checkboxesOLXWithFeedbackAndHintsOLX.hints);
      });
    });
    describe('given numeric olx with feedback and hints', () => {
      const hints = numericOlxParser.getHints();
      it('should equal an array of hints', () => {
        expect(hints).toEqual(numericInputWithFeedbackAndHintsOLX.hints);
      });
    });
    describe('given dropdown olx with feedback and hints', () => {
      const hints = dropdownOlxParser.getHints();
      it('should equal an array of hints', () => {
        expect(hints).toEqual(dropdownOLXWithFeedbackAndHintsOLX.hints);
      });
    });
    describe('given multiple choice olx with feedback and hints', () => {
      const hints = multipleChoiceOlxParser.getHints();
      it('should equal an array of hints', () => {
        expect(hints).toEqual(multipleChoiceWithFeedbackAndHintsOLX.hints);
      });
    });
    describe('given text input olx with feedback and hints', () => {
      const hints = textInputOlxParser.getHints();
      it('should equal an array of hints', () => {
        expect(hints).toEqual(textInputWithFeedbackAndHintsOLX.hints);
      });
    });
  });
  describe('parseMultipleChoiceAnswers()', () => {
    describe('given a problem with no answers', () => {
      const { answers } = multipleChoiceWithoutAnswersOlxParser.parseMultipleChoiceAnswers(
        'multiplechoiceresponse',
        'choicegroup',
        'choice',
      );
      it('should return an array of objects with length one', () => {
        expect(answers).toEqual(multipleChoiceWithoutAnswers.data.answers);
        expect(answers).toHaveLength(1);
      });
    });
    describe('given multiple choice olx with hex numbers and leading zeros', () => {
      const olxparser = new OLXParser(numberParseTestOLX.rawOLX);
      const { answers } = olxparser.parseMultipleChoiceAnswers('multiplechoiceresponse', 'choicegroup', 'choice');
      it('should not parse hex numbers and leading zeros', () => {
        expect(answers).toEqual(numberParseTestOLX.data.answers);
      });
      it('should equal an array of objects with length four', () => {
        expect(answers).toHaveLength(4);
      });
    });
    describe('given checkbox olx with feedback and hints', () => {
      const { answers } = checkboxOlxParser.parseMultipleChoiceAnswers('choiceresponse', 'checkboxgroup', 'choice');
      it('should equal an array of objects with length four', () => {
        expect(answers).toEqual(checkboxesOLXWithFeedbackAndHintsOLX.data.answers);
        expect(answers).toHaveLength(4);
      });
    });
    describe('given dropdown olx with feedback and hints', () => {
      const { answers } = dropdownOlxParser.parseMultipleChoiceAnswers('optionresponse', 'optioninput', 'option');
      it('should equal an array of objects with length three', () => {
        expect(answers).toEqual(dropdownOLXWithFeedbackAndHintsOLX.data.answers);
        expect(answers).toHaveLength(3);
      });
    });
    describe('given multiple choice olx with feedback and hints', () => {
      const { answers } = multipleChoiceOlxParser.parseMultipleChoiceAnswers('multiplechoiceresponse', 'choicegroup', 'choice');
      it('should equal an array of objects with length three', () => {
        expect(answers).toEqual(multipleChoiceWithFeedbackAndHintsOLX.data.answers);
        expect(answers).toHaveLength(3);
      });
    });
  });
  describe('parseStringResponse()', () => {
    // describe('given a problem with no answers', () => {
    //   // TODO
    // });
    describe('given text input olx with feedback and hints', () => {
      const { answers } = textInputOlxParser.parseStringResponse();
      it('should equal an array of objects with length three', () => {
        expect(answers).toEqual(textInputWithFeedbackAndHintsOLX.data.answers);
        expect(answers).toHaveLength(3);
      });
    });
    describe('given text input olx with feedback and hints with multiple answers', () => {
      const { answers } = textInputMultipleAnswersOlxParser.parseStringResponse();
      it('should equal an array of objects with length four', () => {
        expect(answers).toEqual(textInputWithFeedbackAndHintsOLXWithMultipleAnswers.data.answers);
        expect(answers).toHaveLength(4);
      });
    });
  });
  describe('parseNumericResponse()', () => {
    // describe('given a problem with no answers', () => {
    //   // TODDO
    // });
    describe('given numeric olx with feedback and hints', () => {
      const { answers } = numericOlxParser.parseNumericResponse();
      it('should equal an array of objects with length two', () => {
        expect(answers).toEqual(numericInputWithFeedbackAndHintsOLX.data.answers);
        expect(answers).toHaveLength(2);
      });
    });
  });
  describe('parseQuestions()', () => {
    describe('given olx with no question content', () => {
      const olxparser = new OLXParser(blankQuestionOLX.rawOLX);
      const problemType = olxparser.getProblemType();
      const question = olxparser.parseQuestions(problemType);
      it('should return an empty string for question', () => {
        expect(question).toBe(blankQuestionOLX.question);
      });
    });
    describe('given a simple problem olx', () => {
      const question = textInputOlxParser.parseQuestions('stringresponse');
      it('should return a string of HTML', () => {
        expect(question).toEqual(textInputWithFeedbackAndHintsOLX.question);
      });
    });
    describe('given olx with html entities', () => {
      const olxparser = new OLXParser(htmlEntityTestOLX.rawOLX);
      const problemType = olxparser.getProblemType();
      const question = olxparser.parseQuestions(problemType);
      it('should not encode html entities', () => {
        expect(question).toEqual(htmlEntityTestOLX.question);
      });
    });
    describe('given olx with styled content', () => {
      const olxparser = new OLXParser(styledQuestionOLX.rawOLX);
      const problemType = olxparser.getProblemType();
      const question = olxparser.parseQuestions(problemType);
      it('should pase/build correct styling', () => {
        expect(question).toBe(styledQuestionOLX.question);
      });
    });
    describe('given olx with label and description tags inside response tag', () => {
      const olxparser = new OLXParser(labelDescriptionQuestionOLX.rawOLX);
      const problemType = olxparser.getProblemType();
      const question = olxparser.parseQuestions(problemType);
      it('should append the label/description to the question', () => {
        expect(question).toBe(labelDescriptionQuestionOLX.question);
      });
    });
  });
  describe('getSolutionExplanation()', () => {
    describe('for checkbox questions', () => {
      test('should parse text in p tags', () => {
        const { rawOLX } = getCheckboxesOLXWithFeedbackAndHintsOLX();
        const olxparser = new OLXParser(rawOLX);
        const problemType = olxparser.getProblemType();
        const explanation = olxparser.getSolutionExplanation(problemType);
        const expected = getCheckboxesOLXWithFeedbackAndHintsOLX().solutionExplanation;
        expect(explanation.replace(/\s/g, '')).toBe(expected.replace(/\s/g, ''));
      });
    });
  });

  // getAnswerFeedback(choice, hintKey) {
  //   let feedback = {};
  //   let feedbackKeys = 'selectedFeedback';
  //   if (_.has(choice, hintKey)) {
  //     const answerFeedback = choice[hintKey];
  //     if (_.isArray(answerFeedback)) {
  //       answerFeedback.forEach((element) => {
  //         if (_.has(element, '@_selected')) {
  //           feedbackKeys = eval(element['@_selected'].toLowerCase()) ? 'selectedFeedback' : 'unselectedFeedback';
  //         }
  //         feedback = {
  //           ...feedback,
  //           [feedbackKeys]: this.builder.build(element),
  //         };
  //       });
  //     } else {
  //       if (_.has(answerFeedback, '@_selected')) {
  //         feedbackKeys = eval(
  //           answerFeedback['@_selected'].toLowerCase()
  //         ) ? 'selectedFeedback' : 'unselectedFeedback';
  //       }
  //       feedback = {
  //         [feedbackKeys]: this.builder.build(answerFeedback),
  //       };
  //     }
  //   }
  //   return feedback;
  // }

  // getGroupedFeedback(choices) {
  //   const groupFeedback = [];
  //   if (_.has(choices, 'compoundhint')) {
  //     const groupFeedbackArray = choices.compoundhint;
  //     if (_.isArray(groupFeedbackArray)) {
  //       groupFeedbackArray.forEach((element) => {
  //         const parsedFeedback = stripNonTextTags({ input: element, tag: '@_value' });
  //         groupFeedback.push({
  //           id: groupFeedback.length,
  //           answers: element['@_value'].split(' '),
  //           feedback: this.builder.build(parsedFeedback),
  //         });
  //       });
  //     } else {
  //       const parsedFeedback = stripNonTextTags({ input: groupFeedbackArray, tag: '@_value' });
  //       groupFeedback.push({
  //         id: groupFeedback.length,
  //         answers: groupFeedbackArray['@_value'].split(' '),
  //         feedback: this.builder.build(parsedFeedback),
  //       });
  //     }
  //   }
  //   return groupFeedback;
  // }
  // getFeedback(xmlElement) {
  //   if (!_.has(xmlElement, 'correcthint')) { return ''; }
  //   const feedback = _.get(xmlElement, 'correcthint');
  //   const feedbackString = this.builder.build(feedback);
  //   return feedbackString;
  // }

  // getGeneralFeedback({ answers, problemType }) {
  //   /* Feedback is Generalized for a Problem IFF:
  //   1. The problem is of Types: Single Select or Dropdown.
  //   2. All the problem's incorrect, if Selected answers are equivalent strings, and there is no other feedback.
  //   */
  //   if (problemType === ProblemTypeKeys.SINGLESELECT || problemType === ProblemTypeKeys.DROPDOWN) {
  //     const firstIncorrectAnswerText = answers.find(answer => answer.correct === false)?.selectedFeedback;
  //     const isAllIncorrectSelectedFeedbackTheSame = answers.every(answer => (answer.correct
  //       ? true
  //       : answer?.selectedFeedback === firstIncorrectAnswerText
  //     ));
  //     if (isAllIncorrectSelectedFeedbackTheSame) {
  //       return firstIncorrectAnswerText;
  //     }
  //   }
  //   return '';
  // }

  // getParsedOLXData() {
  //   if (_.isEmpty(this.problem)) {
  //     return {};
  //   }

  //   if (Object.keys(this.problem).some((key) => key.indexOf('@_') !== -1)) {
  //     throw new Error('Misc Attributes asscoiated with problem, opening in advanced editor');
  //   }

  //   let answersObject = {};
  //   let additionalAttributes = {};
  //   let groupFeedbackList = [];
  //   const problemType = this.getProblemType();
  //   const hints = this.getHints();
  //   const question = this.parseQuestions(problemType);
  //   const solutionExplanation = this.getSolutionExplanation(problemType);

  //   switch (problemType) {
  //     case ProblemTypeKeys.DROPDOWN:
  //       answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.DROPDOWN, 'optioninput', 'option');
  //       break;
  //     case ProblemTypeKeys.TEXTINPUT:
  //       answersObject = this.parseStringResponse();
  //       break;
  //     case ProblemTypeKeys.NUMERIC:
  //       answersObject = this.parseNumericResponse();
  //       break;
  //     case ProblemTypeKeys.MULTISELECT:
  //       answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.MULTISELECT, 'checkboxgroup', 'choice');
  //       break;
  //     case ProblemTypeKeys.SINGLESELECT:
  //       answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.SINGLESELECT, 'choicegroup', 'choice');
  //       break;
  //     case ProblemTypeKeys.ADVANCED:
  //       return {
  //         problemType,
  //         settings: {},
  //       };
  //     default:
  //       // if problem is unset, return null
  //       return {};
  //   }
  //   const generalFeedback = this.getGeneralFeedback({ answers: answersObject.answers, problemType });
  //   if (_.has(answersObject, 'additionalStringAttributes')) {
  //     additionalAttributes = { ...answersObject.additionalStringAttributes };
  //   }

  //   if (_.has(answersObject, 'groupFeedbackList')) {
  //     groupFeedbackList = answersObject.groupFeedbackList;
  //   }
  //   const { answers } = answersObject;
  //   const settings = { hints };
  //   if (ProblemTypeKeys.NUMERIC === problemType && _.has(answers[0], 'tolerance')) {
  //     const toleranceValue = answers[0].tolerance;
  //     if (!toleranceValue || toleranceValue.length === 0) {
  //       settings.tolerance = { value: null, type: 'None' };
  //     } else if (toleranceValue.includes('%')) {
  //       settings.tolerance = { value: parseInt(toleranceValue.slice(0, -1)), type: 'Percent' };
  //     } else {
  //       settings.tolerance = { value: parseInt(toleranceValue), type: 'Number' };
  //     }
  //   }
  //   if (solutionExplanation) { settings.solutionExplanation = solutionExplanation; }
});
