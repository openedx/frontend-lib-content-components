import _ from "lodash";
import { ProblemTypeKeys } from "../../../data/constants/problem";
import { indexToLetterMap } from "./MarkDownParser";
import { popuplateItem } from "./SettingsParser";

export class ReactStateParser {
  constructor(problemState) {
    this.problemState = problemState;
  }

  parseQuestion() {
    const { question } = this.problemState;
    const paresedQuestion = this.splitLines(question);
    let parsedString = '';
    for (const line in paresedQuestion) {
      const replacedString = paresedQuestion[line].replace('<p>', '>>').replace('</p>', '<<');
      parsedString += `${replacedString}\n`;
    }
    return parsedString;
  }

  parseHints() {
    let hintString = '';
    const hitnsList = this.problemState.settings.hints;
    for (const hint in hitnsList) {
      hintString += `||${hitnsList[hint].value}||\n`;
    }
    return hintString;
  }

  parseDropdown() {
    let answerString = '';
    const { answers } = this.problemState;
    for (const answer in answers) {
      let answerOptionString = '';
      const answerObject = answers[answer];
      const answerContent = answerObject.title;
      const answerFeedback = answerObject?.feedback;
      if (answerObject.correct) {
        answerOptionString += ` (${answerContent})`;
      } else {
        answerOptionString += ` ${answerContent}`;
      }
      if (answerFeedback !== undefined && answerFeedback.trim() !== '') {
        answerOptionString += ` {{${answerFeedback}}}`;
      }
      answerString += `${answerOptionString}\n`;
    }
    answerString = `[[\n${answerString}]]\n`;
    return answerString;
  }

  parseCheckBox() {
    let anwerString = '';
    const { answers } = this.problemState;
    for (const answer in answers) {
      const answerObject = answers[answer];
      const answerContent = answerObject.title;
      const answerSelectedFeedback = _.get(answerObject, 'selectedFeedback', '');
      const answerUnselectedFeedback = _.get(answerObject, 'unselectedFeedback', '');
      const isSelectedFeedbackPresent = (answerSelectedFeedback.trim() !== '' && answerSelectedFeedback !== undefined);
      const isUnselectedFeedbackPresent = (answerUnselectedFeedback.trim() !== '' && answerUnselectedFeedback !== undefined);
      if (answerObject.correct) {
        anwerString += `[x] ${answerContent}`;
      } else {
        anwerString += `[ ] ${answerContent}`;
      }
      if (isSelectedFeedbackPresent && isUnselectedFeedbackPresent) {
        anwerString += `{{selected: ${answerSelectedFeedback}},{unselected: ${answerUnselectedFeedback}}}`;
      } else if (isSelectedFeedbackPresent) {
        anwerString += `{{selected: ${answerSelectedFeedback}}}`;
      } else if (isUnselectedFeedbackPresent) {
        anwerString += `{{unselected: ${answerUnselectedFeedback}}}`;
      }
      anwerString += '\n';
    }
    return anwerString;
  }

  parseRadioButton() {
    let answerString = '';
    const { answers } = this.problemState;
    for (const answer in answers) {
      let answerOptionString = '';
      const answerObject = answers[answer];
      const answerContent = answerObject.title;
      const answerFeedback = _.get(answerObject, 'feedback', '');
      if (answerObject.correct) {
        answerOptionString += `(x) ${answerContent}`;
      } else {
        answerOptionString += `( ) ${answerContent}`;
      }
      if (answerFeedback.trim() !== '' && answerFeedback !== undefined) {
        answerOptionString += ` {{${answerFeedback}}}`;
      }
      answerString += `${answerOptionString}\n`;
    }
    return answerString;
  }

  parseInputAnswers() {
    let answerString = '';
    const { answers } = this.problemState;
    let correctAnswer = false;
    for (const answer in answers) {
      const answerObject = answers[answer];
      const answerContent = answerObject.title;
      const answerFeedback = answerObject?.feedback;
      let answerOptionString = '';
      if (answerObject.correct && !correctAnswer) {
        answerOptionString += `=${answerContent}`;
        correctAnswer = true;
      } else if (answerObject.correct && correctAnswer) {
        answerOptionString += `or=${answerContent}`;
      } else if (!answerObject.correct) {
        answerOptionString += `not=${answerContent}`;
      }
      if (answerFeedback.trim() !== '' && answerFeedback !== undefined) {
        answerOptionString += ` {{${answerFeedback}}}`;
      }
      answerString += `${answerOptionString}\n`;
    }
    return answerString;
  }

  parseGroupFeedback() {
    let feedbackString = '';
    const groupFeedbackArray = this.problemState.groupFeedbackList;
    if (!_.isEmpty(groupFeedbackArray)) {
      for (const groupFeeback in groupFeedbackArray) {
        const { answers } = groupFeedbackArray[groupFeeback];
        const options = `(( ${answers.join(' ')} ))`;
        feedbackString += `{{ ${options} ${groupFeedbackArray[groupFeeback].feedback} }}\n`;
      }
    }
    return feedbackString;
  }
  
    getMarkdown() {
        let answers = ''
        switch (this.problemState.problemType) {
            case ProblemTypeKeys.DROPDOWN:
                answers = this.parseDropdown();
                break;
            case ProblemTypeKeys.MULTISELECT:
                answers = this.parseCheckBox();
                break;
            case ProblemTypeKeys.SINGLESELECT:
                answers = this.parseRadioButton();
                break;
            case ProblemTypeKeys.NUMERIC:
            case ProblemTypeKeys.TEXTINPUT:
                answers = this.parseInputAnswers();
                break;
            default:
                break;
        }
        let markdown = `${this.parseQuestion()}${answers}${this.parseHints()}${this.parseGroupFeedback()}`;
        return markdown;
    }

    splitLines(inputString){
        return inputString.trim().split("\n");
    }

    getSettings() {
        let settings = {}
        const stateSettings = this.problemState.settings

        settings = popuplateItem(settings, 'matLabApiKey', 'matlab_api_key', stateSettings)
        settings = popuplateItem(settings, 'number', 'max_attempts', stateSettings.scoring.attempts);
        settings = popuplateItem(settings, 'weight', 'weight', stateSettings.scoring);
        settings = popuplateItem(settings, 'randomization', 'rerandomize', stateSettings);
        settings = popuplateItem(settings, 'on', 'showanswer', stateSettings.showAnswer);
        settings = popuplateItem(settings, 'afterAttempts', 'attempts_before_showanswer_button', stateSettings.showAnswer);
        settings = popuplateItem(settings, 'showResetButton', 'show_reset_button', stateSettings);
        settings = popuplateItem(settings, 'timeBetween', 'submission_wait_seconds', stateSettings);

        return settings;
    }

    getMetadata() {
        let markdown = this.getMarkdown();
        let settings = this.getSettings();
        return { ...settings, markdown }

    }
}
