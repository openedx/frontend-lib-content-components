import React from 'react';
import ProblemTypes from '../../../data/constants/ProblemTypes';
import {Button} from '@edx/paragon';

export const hooks = {
    useCreateAnswers: ({problemType, answers})=>{
        return (<p>A List of Answers</p>);
    },
    addAnswer: () => ({answers}) =>{
        return;
    },
}
export const AnswersContainer = ({
  //Redux
  problemType,
  answers
}) => {

  const problemStaticData = ProblemTypes[problemType];
  return (
    <div>
        {hooks.useCreateAnswers({problemType, answers})}
        <div>
        <Button onClick={hooks.addAnswer(answers)}/>
        </div>
    </div>
  );
}

export default