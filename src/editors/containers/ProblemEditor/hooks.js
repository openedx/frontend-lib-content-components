import {
  useRef, useEffect, useCallback, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../data/redux/app';
import { StrictDict } from '../../utils';

import { RequestKeys } from '../../data/constants/requests';

import * as module from './hooks';

export const state = StrictDict({
  selected: (val) => useState(val),

});

export const getStep = () => {
  const problemType = useSelector(selectors.problem.problemType);
  return {
    problemType,
  };
};
