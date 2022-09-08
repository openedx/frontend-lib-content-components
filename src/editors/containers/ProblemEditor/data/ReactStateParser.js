import _ from "lodash";
import { ProblemTypeKeys } from "../../../data/constants/problem";
import { indexToLetterMap } from "./MarkDownParser";


export class ReactStateParser{
    constructor(problemState){
        this.problemState = problemState;
    }

    parseQuestion() {
        let question = this.problemState.question;
        let paresedQuestion = this.splitLines(question);
        let parsedString = '';
        for (const line in paresedQuestion) {
            let replacedString = paresedQuestion[line].replace("<p>", ">>").replace("</p>", "<<");
            parsedString += `${replacedString}\n`
        }
        return parsedString;
    }

    parseHints() {
        let hintString = '';
        let hitnsList = this.problemState.hints;
        for (const hint in hitnsList){
            hintString += `||${hitnsList[hint].value}||\n`;
        }
        return hintString
    }

    parseDropdown(){
        let answerString = '';
        let answers = this.problemState.answers;
        for (const answer in answers){
            let answerOptionString = '';
            let answerObject = answers[answer];
            let answerContent = answerObject.title;
            let answerFeedback = answerObject?.feedback;
            if (answerObject.correct) {
                answerOptionString += ` (${answerContent})`
            } else {
                answerOptionString += ` ${answerContent}`
            }
            if (answerFeedback !== undefined && answerFeedback.trim() !== ''){
                answerOptionString += ` {{${answerFeedback}}}`
            }
            answerString += `${answerOptionString}\n`
        }
        answerString = `[[\n${answerString}]]\n`;
        return answerString;
    }

    parseCheckBox(){
        let anwerString = '';
        let answers = this.problemState.answers;
        for (const answer in answers){
            let answerObject = answers[answer];
            let answerContent = answerObject.title;
            let answerSelectedFeedback = answerObject?.selectedFeedback;
            let answerUnselectedFeedback = answerObject?.unselectedFeedback;
            let isSelectedFeedbackPresent = (answerSelectedFeedback.trim() !== '' && answerSelectedFeedback !== undefined);
            let isUnselectedFeedbackPresent = (answerUnselectedFeedback.trim() !== '' && answerUnselectedFeedback !== undefined);
            if (answerObject.correct) {
                anwerString += `[x] ${answerContent}`
            } else {
                anwerString += `[ ] ${answerContent}`
            }
            if (isSelectedFeedbackPresent && isUnselectedFeedbackPresent){
                anwerString += `{{selected: ${answerSelectedFeedback}},{unselected: ${answerUnselectedFeedback}}}`
            } else if (isSelectedFeedbackPresent) {
                anwerString += `{{selected: ${answerSelectedFeedback}}}`
            } else if (isUnselectedFeedbackPresent) {
                anwerString += `{{unselected: ${answerUnselectedFeedback}}}`
            }
            anwerString += "\n";
        }
        return anwerString;
    }


    parseRadioButton(){
        let answerString = '';
        let answers = this.problemState.answers;
        for (const answer in answers){
            let answerOptionString = '';
            let answerObject = answers[answer];
            let answerContent = answerObject.title;
            let answerFeedback = answerObject?.feedback;
            if (answerObject.correct) {
                answerOptionString += `(x) ${answerContent}`;
            } else {
                answerOptionString += `( ) ${answerContent}`;
            }
            if (answerFeedback.trim() !== '' && answerFeedback !== undefined){
                answerOptionString += ` {{${answerFeedback}}}`;
            }
            answerString += `${answerOptionString}\n`;
        }
        return answerString;
    }

    parseInputAnswers(){
        let answerString = '';
        let answers = this.problemState.answers;
        let correctAnswer = false;
        for (const answer in answers){
            let answerObject = answers[answer];
            let answerContent = answerObject.title;
            let answerFeedback = answerObject?.feedback;
            let answerOptionString = ''
            if (answerObject.correct && !correctAnswer) {
                answerOptionString += `=${answerContent}`;
                correctAnswer = true;
            } else if (answerObject.correct && correctAnswer) {
                answerOptionString += `or=${answerContent}`;
            } else if (!answerObject.correct){
                answerOptionString += `not=${answerContent}`;
            }
            if (answerFeedback.trim() !== '' && answerFeedback !== undefined){
                answerOptionString += ` {{${answerFeedback}}}`;
            }
            answerString += `${answerOptionString}\n`;
        }
        return answerString;
    }

    parseGroupFeedback() {
        let feedbackString = "";
        const groupFeedbackArray = this.problemState.groupFeedbackList;
        if (!_.isEmpty(groupFeedbackArray)){
            for (const groupFeeback in groupFeedbackArray) {
                let answers = groupFeedbackArray[groupFeeback].answers;
                let options = `(( ${answers.join(" ")} ))`;
                feedbackString += `{{ ${options} ${groupFeedbackArray[groupFeeback].feedback} }}\n`;
            }
        }
        return feedbackString
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
}
