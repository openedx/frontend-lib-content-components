import { useState } from 'react';
import { StrictDict } from '../../../../utils';
import { ProblemTypeKeys } from '../../../../data/constants/problem';
import * as module from './hooks';

export const state = StrictDict({
  selected: (val) => useState(val),
});

export const selectHooks = () => {
  const [ selected, setSelected ] = module.state.selected(ProblemTypeKeys.SINGLESELECT);
  return {
    selected,
    setSelected,
  };
};

export const onSelect = ( setProblemType, selected ) => () =>
  setProblemType({ selected });

export default { state, selectHooks, onSelect };
