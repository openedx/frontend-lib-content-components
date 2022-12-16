import { useEffect, useState } from 'react';
import { StrictDict } from '../../../../utils';
import { ProblemTypeKeys, ProblemTypes } from '../../../../data/constants/problem';
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

export const onSelect = ( setProblemType, selected ) => () => {
  setProblemType({ selected });
};

export const useArrowNav = (selected, setSelected) => {
  useEffect(() => {
    document.addEventListener('keydown', detectKeyDown, true);

    return () => {
      document.removeEventListener('keydown', detectKeyDown, true);
    };
  }, [selected, setSelected]);

  const detectKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (ProblemTypes[selected].prev) {
          setSelected(ProblemTypes[selected].prev);
        }
        break;
      case "ArrowDown":
        if (ProblemTypes[selected].next) {
          setSelected(ProblemTypes[selected].next);
        }
        break;
    }
  };
};

export default {
  state,
  selectHooks,
  onSelect,
  useArrowNav
};
