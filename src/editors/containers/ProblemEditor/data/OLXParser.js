// Parse OLX to JavaScript objects.
/* eslint no-eval: 0 */

import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import _ from 'lodash-es';
import { ProblemTypeKeys } from '../../../data/constants/problem';

export const indexToLetterMap = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));

export const nonQuestionKeys = [
  'responseparam',
  'formulaequationinput',
  'correcthint',
  '@_answer',
  'optioninput',
  'checkboxgroup',
  'choicegroup',
  'additional_answer',
  'stringequalhint',
  'textline',
  '@_type',
  'formulaequationinput',
  'numericalresponse',
  'stringresponse',
  'multiplechoiceresponse',
  'choiceresponse',
  'optionresponse',
  'demandhint',
];

export class OLXParser {
  constructor(olxString) {
    this.problem = {};
    const options = {
      ignoreAttributes: false,
      alwaysCreateTextNode: true,
      // preserveOrder: true
    };
    this.olxString = olxString;
    const parser = new XMLParser(options);
    const parsedOLX = parser.parse(olxString);
    if (_.has(parsedOLX, 'problem')) {
      this.problem = parsedOLX.problem;
    }
  }

  parseMultipleChoiceAnswers(problemType, widgetName, option) {
    const answers = [];
    let data = {};
    const widget = _.get(this.problem, `${problemType}.${widgetName}`);
    const choice = _.get(widget, option);
    if (_.isArray(choice)) {
      choice.forEach((element, index) => {
        const title = element['#text'];
        const correct = eval(element['@_correct'].toLowerCase());
        const id = indexToLetterMap[index];
        const feedback = this.getAnswerFeedback(element, `${option}hint`);
        answers.push(
          {
            id,
            title,
            correct,
            ...feedback,
          },
        );
      });
    } else {
      const feedback = this.getAnswerFeedback(choice, `${option}hint`);
      answers.push({
        title: choice['#text'],
        correct: eval(choice['@_correct'].toLowerCase()),
        id: indexToLetterMap[answers.length],
        ...feedback,
      });
    }
    data = { answers };
    const groupFeedbackList = this.getGroupedFeedback(widget);
    if (groupFeedbackList.length) {
      data = {
        ...data,
        groupFeedbackList,
      };
    }
    return data;
  }

  getAnswerFeedback(choice, hintKey) {
    let feedback = {};
    let feedbackKeys = 'feedback';
    if (_.has(choice, hintKey)) {
      const answerFeedback = choice[hintKey];
      if (_.isArray(answerFeedback)) {
        answerFeedback.forEach((element) => {
          if (_.has(element, '@_selected')) {
            feedbackKeys = eval(element['@_selected'].toLowerCase()) ? 'selectedFeedback' : 'unselectedFeedback';
          }
          feedback = {
            ...feedback,
            [feedbackKeys]: element['#text'],
          };
        });
      } else {
        if (_.has(answerFeedback, '@_selected')) {
          feedbackKeys = eval(answerFeedback['@_selected'].toLowerCase()) ? 'selectedFeedback' : 'unselectedFeedback';
        }
        feedback = {
          [feedbackKeys]: answerFeedback['#text'],
        };
      }
    }
    return feedback;
  }

  getGroupedFeedback(choices) {
    const groupFeedback = [];
    if (_.has(choices, 'compoundhint')) {
      const groupFeedbackArray = choices.compoundhint;
      if (_.isArray(groupFeedbackArray)) {
        groupFeedbackArray.forEach((element) => {
          groupFeedback.push({
            id: groupFeedback.length,
            answers: element['@_value'].split(' '),
            feedback: element['#text'],
          });
        });
      } else {
        groupFeedback.push({
          id: groupFeedback.length,
          answers: groupFeedbackArray['@_value'].split(' '),
          feedback: groupFeedbackArray['#text'],
        });
      }
    }
    return groupFeedback;
  }

  parseStringResponse() {
    const { stringresponse } = this.problem;
    const answers = [];
    let answerFeedback = '';
    let additionalStringAttributes = {};
    let data = {};
    const feedback = this.getFeedback(stringresponse);
    answers.push({
      id: indexToLetterMap[answers.length],
      title: stringresponse['@_answer'],
      correct: true,
      feedback,
    });

    // Parsing additional_answer for string response.
    const additionalAnswer = _.get(stringresponse, 'additional_answer', []);
    if (_.isArray(additionalAnswer)) {
      additionalAnswer.forEach((newAnswer) => {
        answerFeedback = this.getFeedback(newAnswer);
        answers.push({
          id: indexToLetterMap[answers.length],
          title: newAnswer['@_answer'],
          correct: true,
          feedback: answerFeedback,
        });
      });
    } else {
      answerFeedback = this.getFeedback(additionalAnswer);
      answers.push({
        id: indexToLetterMap[answers.length],
        title: additionalAnswer['@_answer'],
        correct: true,
        feedback: answerFeedback,
      });
    }

    // Parsing stringequalhint for string response.
    const stringEqualHint = _.get(stringresponse, 'stringequalhint', []);
    if (_.isArray(stringEqualHint)) {
      stringEqualHint.forEach((newAnswer) => {
        answers.push({
          id: indexToLetterMap[answers.length],
          title: newAnswer['@_answer'],
          correct: false,
          feedback: newAnswer['#text'],
        });
      });
    } else {
      answers.push({
        id: indexToLetterMap[answers.length],
        title: stringEqualHint['@_answer'],
        correct: false,
        feedback: stringEqualHint['#text'],
      });
    }

    // TODO: Support multiple types.
    additionalStringAttributes = {
      type: _.get(stringresponse, '@_type'),
      textline: {
        size: _.get(stringresponse, 'textline.@_size'),
      },
    };

    data = {
      answers,
      additionalStringAttributes,
    };

    return data;
  }

  parseNumericResponse() {
    const { numericalresponse } = this.problem;
    let answers = [];
    let subAnswers = [];
    let data = {};
    // TODO: Find a way to add answers using additional_answers v/s numericalresponse
    if (_.isArray(numericalresponse)) {
      numericalresponse.forEach((numericalAnswer) => {
        subAnswers = this.parseNumericResponseObject(numericalAnswer, answers.length);
        answers = _.concat(answers, subAnswers);
      });
    } else {
      subAnswers = this.parseNumericResponseObject(numericalresponse, answers.length);
      answers = _.concat(answers, subAnswers);
    }

    data = {
      answers,
    };

    return data;
  }

  parseNumericResponseObject(numericalresponse, answerOffset) {
    let answerFeedback = '';
    const answers = [];
    let responseParam = {};
    // TODO: UI needs to be added to support adding tolerence in numeric response.
    const feedback = this.getFeedback(numericalresponse);
    if (_.has(numericalresponse, 'responseparam')) {
      const type = _.get(numericalresponse, 'responseparam.@_type');
      const defaultValue = _.get(numericalresponse, 'responseparam.@_default');
      responseParam = {
        [type]: defaultValue,
      };
    }
    answers.push({
      id: indexToLetterMap[answers.length + answerOffset],
      title: numericalresponse['@_answer'],
      correct: true,
      feedback,
      ...responseParam,
    });

    // Parsing additional_answer for numerical response.
    const additionalAnswer = _.get(numericalresponse, 'additional_answer', []);
    if (_.isArray(additionalAnswer)) {
      additionalAnswer.forEach((newAnswer) => {
        answerFeedback = this.getFeedback(newAnswer);
        answers.push({
          id: indexToLetterMap[answers.length + answerOffset],
          title: newAnswer['@_answer'],
          correct: true,
          feedback: answerFeedback,
        });
      });
    } else {
      answerFeedback = this.getFeedback(additionalAnswer);
      answers.push({
        id: indexToLetterMap[answers.length + answerOffset],
        title: additionalAnswer['@_answer'],
        correct: true,
        feedback: answerFeedback,
      });
    }
    return answers;
  }

  parseQuestions(problemType) {
    const getQuestionObject = (parsedOlx) => {
      const hasNonQuestionKeys = (obj) => !(_.some(nonQuestionKeys, (key) => _.has(obj, key)));
      const isWhiteSpace = (obj) => _.get(obj, '#text', 'nonemptystring').trim() !== '';
      const transformIntoQuestionObject = (root) => _.filter(_.filter(root, isWhiteSpace), hasNonQuestionKeys);
      let questionObject = {};

      // Try to find question within problemType node; odd path because of `preserveOrder` option used for parsing.
      const problemTypeObject = _.get(
        _.find(parsedOlx[0].problem, (obj) => _.has(obj, problemType)),
        problemType,
        {},
      );
      questionObject = transformIntoQuestionObject(problemTypeObject);

      // If haven't found any question nodes, check if question is stored in the problem node.
      if (_.isEmpty(questionObject)) {
        questionObject = transformIntoQuestionObject(parsedOlx[0].problem);
      }
      return questionObject;
    };

    const mapQuestionTags = (questionObject) => {
      /* TODO: How do we uniquely identify the label and description?
        In order to parse label and description, there should be two states
        and settings should be introduced to edit the label and description.
        In turn editing the settings update the state and then it can be added to
        the parsed OLX.
      */
      const tagMap = {
        label: 'strong',
        description: 'em',
      };

      return _.map(questionObject, (obj) => _.mapKeys(obj, (value, key) => _.get(tagMap, key, key)));
    };

    // To be able to generate question's HTML, such that it respects the initial
    // order of elements and styles stored in the OLX, we parse and build
    // original `olxString` with `preserveOrder: true`. We parse and build the
    // question separately, because the JSON structure produced with
    // `preserveOrder: true` option is more complex and hard to work with, and
    // since the order of nested elements is not important in other places, we
    // restrict the complexity of the produced JSON within the scope of this
    // method.
    const parser = new XMLParser({
      preserveOrder: true,
      trimValues: false,
      ignoreAttributes: false,
    });
    const parsedOlx = parser.parse(this.olxString);

    const questionObject = getQuestionObject(parsedOlx);
    const serializedQuestion = mapQuestionTags(questionObject);

    const builder = new XMLBuilder({
      preserveOrder: true,
      attributeNamePrefix: '@_',
      ignoreAttributes: false,
      format: false,
    });
    return builder.build(serializedQuestion);
  }

  getHints() {
    const hintsObject = [];
    if (_.has(this.problem, 'demandhint.hint')) {
      const hint = _.get(this.problem, 'demandhint.hint');
      if (_.isArray(hint)) {
        hint.forEach(element => {
          hintsObject.push({
            id: hintsObject.length,
            value: element['#text'],
          });
        });
      } else {
        hintsObject.push({
          id: hintsObject.length,
          value: hint['#text'],
        });
      }
    }
    return hintsObject;
  }

  getFeedback(xmlElement) {
    return _.has(xmlElement, 'correcthint') ? _.get(xmlElement, 'correcthint.#text') : '';
  }

  getProblemType() {
    const problemKeys = Object.keys(this.problem);
    const problemTypeKeys = problemKeys.filter(key => Object.values(ProblemTypeKeys).indexOf(key) !== -1);
    if (problemTypeKeys.length === 0) {
      // a blank problem is a problem which contains only `<problem></problem>` as it's olx.
      // blank problems are not given types, so that a type may be selected.
      if (problemKeys.length === 1 && problemKeys[0] === '#text' && this.problem[problemKeys[0]] === '') {
        return null;
      }
      // if we have no matching problem type, the problem is advanced.
      return ProblemTypeKeys.ADVANCED;
    }
    // make sure compound problems are treated as advanced
    // TODO: Find a way to add answers using additional_answers v/s numericalresponse
    if ((problemTypeKeys.length > 1)
      || (problemTypeKeys[0] !== ProblemTypeKeys.NUMERIC // multiple numeric problems are really just multiple answers
        && _.isArray(this.problem[problemTypeKeys[0]])
        && this.problem[problemTypeKeys[0]].length > 1)) {
      return ProblemTypeKeys.ADVANCED;
    }
    const problemType = problemTypeKeys[0];
    return problemType;
  }

  getParsedOLXData() {
    if (_.isEmpty(this.problem)) {
      return {};
    }
    let answersObject = {};
    let additionalAttributes = {};
    let groupFeedbackList = [];
    const problemType = this.getProblemType();
    const hints = this.getHints();
    const question = this.parseQuestions(problemType);
    switch (problemType) {
      case ProblemTypeKeys.DROPDOWN:
        answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.DROPDOWN, 'optioninput', 'option');
        break;
      case ProblemTypeKeys.TEXTINPUT:
        answersObject = this.parseStringResponse();
        break;
      case ProblemTypeKeys.NUMERIC:
        answersObject = this.parseNumericResponse();
        break;
      case ProblemTypeKeys.MULTISELECT:
        answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.MULTISELECT, 'checkboxgroup', 'choice');
        break;
      case ProblemTypeKeys.SINGLESELECT:
        answersObject = this.parseMultipleChoiceAnswers(ProblemTypeKeys.SINGLESELECT, 'choicegroup', 'choice');
        break;
      case ProblemTypeKeys.ADVANCED:
        return {
          problemType,
          settings: {},
        };
      default:
        // if problem is unset, return null
        return {};
    }

    if (_.has(answersObject, 'additionalStringAttributes')) {
      additionalAttributes = { ...answersObject.additionalStringAttributes };
    }

    if (_.has(answersObject, 'groupFeedbackList')) {
      groupFeedbackList = answersObject.groupFeedbackList;
    }
    const { answers } = answersObject;
    const settings = { hints };
    return {
      question,
      settings,
      answers,
      problemType,
      additionalAttributes,
      groupFeedbackList,
    };
  }
}
