import { useEffect, useState } from 'react';
import { StrictDict } from '../../../../utils';
import { ProblemTypeKeys, ProblemTypeOrder } from '../../../../data/constants/problem';
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

export const useArrowNav = (selected, setSelected) => {
  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown, true);

    return () => {
      document.removeEventListener('keydown', detectKeyDown, true);
    };
  }, [selected, setSelected]);

  const detectKeyDown = (e) => {
    let ind = ProblemTypeOrder.findIndex(el => el === selected);
    switch (e.key) {
      case "ArrowUp":
        ind--;
        if (ind < 0) {
          ind = 0;
        }
        break;
      case "ArrowDown":
        ind++;
        if (ind > 4) {
          ind = 4;
        }
        break;
    }
    setSelected(ProblemTypeOrder[ind]);
  };
};

export default { state, selectHooks, onSelect, useArrowNav };
