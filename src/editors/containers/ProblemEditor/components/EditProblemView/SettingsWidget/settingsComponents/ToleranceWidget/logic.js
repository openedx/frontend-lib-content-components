export const canBetSet = ({ answers }) => {
  console.log(answers);
  if (answers.length > 1 || answers.length < 0) {
    return false;
  }
  for (let i = 0; i < answers; i++) {
    if (answers[i].isAnswerRange) {
      return false;
    }
  }
  return true;
};

export const setTolerance = ({ answers, oldTolerance, newTolerance }) => {
  if (!canBetSet({ answers })) {
    return oldTolerance;
  }
  return newTolerance;
};
export const unsetTolerance = ({

}) => ({})=> {
    return

};

export default { canBetSet, setTolerance };
