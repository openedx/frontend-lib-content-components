import _ from 'lodash-es';
import { XMLBuilder } from 'fast-xml-parser';
import { ProblemTypeKeys } from '../../../data/constants/problem';

class ReactStateOLXParser {
  constructor(problemState) {
    this.parserOptions = {
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
    };
    this.builderOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      suppressBooleanAttributes: false,
      format: true,
    };
    this.builder = new XMLBuilder(this.builderOptions);
    this.problemState = problemState.problem;
  }

  addHints() {
    const hintsArray = [];
    const hints = _.get(this.problemState, 'settings.hints', []);
    hints.forEach(element => {
      hintsArray.push({
        '#text': element.value,
      });
    });
    const demandhint = {
      demandhint: {
        hint: hintsArray,
      },
    };
    return demandhint;
  }

  addMultiSelectAnswers(option) {
    const choice = [];
    let compoundhint = [];
    let widget = {};
    const { answers } = this.problemState;
    answers.forEach((answer) => {
      const feedback = [];
      let singleAnswer = {};
      if (this.hasAttributeWithValue(answer, 'title')) {
        if (this.hasAttributeWithValue(answer, 'selectedFeedback')) {
          feedback.push({
            '#text': _.get(answer, 'selectedFeedback'),
            '@_selected': true,
          });
        }
        if (this.hasAttributeWithValue(answer, 'unselectedFeedback')) {
          feedback.push({
            '#text': _.get(answer, 'unselectedFeedback'),
            '@_selected': false,
          });
        }
        if (this.hasAttributeWithValue(answer, 'feedback')) {
          feedback.push({
            '#text': _.get(answer, 'feedback'),
          });
        }
        if (feedback.length) {
          singleAnswer[`${option}hint`] = feedback;
        }
        singleAnswer = {
          '#text': answer.title,
          '@_correct': answer.correct,
          ...singleAnswer,
        };
        choice.push(singleAnswer);
      }
    });
    widget = { [option]: choice };
    if (_.has(this.problemState, 'groupFeedbackList')) {
      compoundhint = this.addGroupFeedbackList();
      widget = {
        ...widget,
        compoundhint,
      };
    }
    return widget;
  }

  addGroupFeedbackList() {
    const compoundhint = [];
    const { groupFeedbackList } = this.problemState;
    groupFeedbackList.forEach((element) => {
      compoundhint.push({
        '#text': element.feedback,
        '@_value': element.answers.join(' '),
      });
    });
    return compoundhint;
  }

  buildOLXWithQuestion(problemObject, problemType) {
    const olxWithoutQuestion = this.builder.build(problemObject);

    return this.insertQuestionIntoOLX(olxWithoutQuestion, problemType);
  }

  insertQuestionIntoOLX(olx, tagName) {
    const { question } = this.problemState;

    const tagPattern = new RegExp(`<${tagName}[^>]*>`);
    const match = olx.match(tagPattern);
    const insertIndex = match.index + match[0].length;

    const olxWithQuestion = `${olx.slice(0, insertIndex)}\n${question}${olx.slice(insertIndex)}`;

    return olxWithQuestion;
  }

  buildMultiSelectProblem(problemType, widget, option) {
    const widgetObject = this.addMultiSelectAnswers(option);
    const demandhint = this.addHints();
    const problemObject = {
      problem: {
        [problemType]: {
          [widget]: widgetObject,
        },
        ...demandhint,
      },
    };

    return this.buildOLXWithQuestion(problemObject, problemType);
  }

  buildTextInput() {
    const problemType = ProblemTypeKeys.TEXTINPUT;
    const demandhint = this.addHints();
    const answerObject = this.buildTextInputAnswersFeedback();
    const problemObject = {
      problem: {
        [problemType]: {
          ...answerObject,
        },
        ...demandhint,
      },
    };

    return this.buildOLXWithQuestion(problemObject, problemType);
  }

  buildTextInputAnswersFeedback() {
    const { answers } = this.problemState;
    let answerObject = {};
    const additionAnswers = [];
    const wrongAnswers = [];
    let firstCorrectAnswerParsed = false;
    answers.forEach((answer) => {
      const correcthint = this.getAnswerHints(answer);
      if (this.hasAttributeWithValue(answer, 'title')) {
        if (answer.correct && firstCorrectAnswerParsed) {
          additionAnswers.push({
            '@_answer': answer.title,
            ...correcthint,
          });
        } else if (answer.correct && !firstCorrectAnswerParsed) {
          firstCorrectAnswerParsed = true;
          answerObject = {
            '@_answer': answer.title,
            ...correcthint,
          };
        } else if (!answer.correct) {
          wrongAnswers.push({
            '@_answer': answer.title,
            '#text': answer.feedback,
          });
        }
      }
    });
    answerObject = {
      ...answerObject,
      additional_answer: additionAnswers,
      stringequalhint: wrongAnswers,
      '@_type': _.get(this.problemState, 'additionalAttributes.type', 'ci'),
      textline: {
        '@_size': _.get(this.problemState, 'additionalAttributes.textline.size', 20),
      },
    };
    return answerObject;
  }

  buildNumericInput() {
    const demandhint = this.addHints();
    const answerObject = this.buildNumericalResponse();
    const problemObject = {
      problem: {
        [ProblemTypeKeys.NUMERIC]: answerObject,
        ...demandhint,
      },
    };

    // Passing 'problem' as problem type, because for this type of problems the question has to be inserted under
    // <problem> tag, instead of <${problemType}> tag.
    return this.buildOLXWithQuestion(problemObject, 'problem');
  }

  buildNumericalResponse() {
    const { answers } = this.problemState;
    let answerObject = {};
    const additionalAnswers = [];
    let firstCorrectAnswerParsed = false;
    /*
    TODO: Need to figure out how to add multiple numericalresponse,
    the parser right now converts all the other right answers into
    additional answers.
    */
    answers.forEach((answer) => {
      const correcthint = this.getAnswerHints(answer);
      if (this.hasAttributeWithValue(answer, 'title')) {
        if (answer.correct && !firstCorrectAnswerParsed) {
          firstCorrectAnswerParsed = true;
          let responseParam = {};
          if (_.has(answer, 'tolerance')) {
            responseParam = {
              responseparam: {
                '@_type': 'tolerance',
                '@_default': _.get(answer, 'tolerance', 0),
              },
            };
          }
          answerObject = {
            '@_answer': answer.title,
            ...responseParam,
            ...correcthint,
          };
        } else if (answer.correct && firstCorrectAnswerParsed) {
          additionalAnswers.push({
            '@_answer': answer.title,
            ...correcthint,
          });
        }
      }
    });
    answerObject = {
      ...answerObject,
      additional_answer: additionalAnswers,
      formulaequationinput: {
        '#text': '',
      },
    };
    return answerObject;
  }

  getAnswerHints(elementObject) {
    const feedback = elementObject?.feedback;
    let correcthint = {};
    if (feedback !== undefined && feedback !== '') {
      correcthint = {
        correcthint: {
          '#text': feedback,
        },
      };
    }
    return correcthint;
  }

  hasAttributeWithValue(obj, attr) {
    return _.has(obj, attr) && _.get(obj, attr, '').trim() !== '';
  }

  buildOLX() {
    const { problemType } = this.problemState;
    let problemString = '';
    switch (problemType) {
      case ProblemTypeKeys.MULTISELECT:
        problemString = this.buildMultiSelectProblem(ProblemTypeKeys.MULTISELECT, 'checkboxgroup', 'choice');
        break;
      case ProblemTypeKeys.DROPDOWN:
        problemString = this.buildMultiSelectProblem(ProblemTypeKeys.DROPDOWN, 'optioninput', 'option');
        break;
      case ProblemTypeKeys.SINGLESELECT:
        problemString = this.buildMultiSelectProblem(ProblemTypeKeys.SINGLESELECT, 'choicegroup', 'choice');
        break;
      case ProblemTypeKeys.TEXTINPUT:
        problemString = this.buildTextInput();
        break;
      case ProblemTypeKeys.NUMERIC:
        problemString = this.buildNumericInput();
        break;
      default:
        break;
    }
    return problemString;
  }
}

export default ReactStateOLXParser;
