import { useEffect } from 'react';

import * as module from './hooks';

export const initializeApp = ({ initialize, data }) => useEffect(
  () => initialize(data),
  [],
);

export const navigateTo = (destination) => {
  window.location.assign(destination);
};

export const navigateCallback = (destination) => () => module.navigateTo(destination);
