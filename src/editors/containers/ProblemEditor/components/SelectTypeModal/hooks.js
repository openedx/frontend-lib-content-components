import {
  useState,
} from 'react';
import { StrictDict } from '../../../../utils';

export const state = StrictDict({
  selected: (val) => useState(val),
});

export const onSelect = ({ selected }) => {
  return;
};

export default { state, onSelect };
