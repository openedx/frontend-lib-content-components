import React from 'react';
import { ProblemTypes } from '../../../../../data/constants/problem';
import {Button} from '@edx/paragon';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../data/redux';

export const hooks = {
    displayAnswers: ({problemType, answers})=>{
        // Some modifcation of the redux state
        return (<p>A List of Answers</p>);
    },
    addAnswer: () => ({answers}) =>{
         // Some modifcation of the redux state
        return;
    },
}
export const AnswersContainer = ({
  //Redux
  answers
}) => {
  const problemType = useSelector(selectors.problem.problemType);
  const problemStaticData = ProblemTypes[problemType];
  return (
    <div>
        {hooks.displayAnswers({problemType, answers})}
        <div>
        <Button onClick={hooks.addAnswer(answers)}/>
        </div>
    </div>
  );
}

export default AnswersContainer;
