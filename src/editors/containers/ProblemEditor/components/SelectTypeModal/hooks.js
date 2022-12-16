import {
  useState,
} from 'react';
import { AdvanceProblemKeys, AdvanceProblems } from '../../../../data/constants/problem';
import { actions } from '../../../../data/redux';
import { StrictDict } from '../../../../utils';

export const state = StrictDict({
  selected: (val) => useState('blankadvanced'),
});

export const onSelect = ({ selected, dispatch }) => {
  if (Object.entries(AdvanceProblemKeys).includes(selected)) {
    dispatch(actions.problem.updateField({rawOlx: AdvanceProblems[selected].template}))
  }
  return;
};

export default { state, onSelect };
