import { StrictDict } from '../../../../utils';

export const sortKeys = StrictDict({
  dateNewest: 'sortByDateNewest',
  dateOldest: 'sortByDateOldest',
  nameAscending: 'sortByNameAscending',
  nameDescending: 'sortByNameDescending',
});

export const sortFuncKeys = StrictDict({
  dateNewest: (a, b) => b.jsDate - a.jsDate,
  dateOldest: (a, b) => a.jsDate - b.jsDate,
  nameAscending: (a, b) => {
    const nameA = a.displayName.toLowerCase();
    const nameB = b.displayName.toLowerCase();
    if (nameA < nameB) { return -1; }
    if (nameB < nameA) { return 1; }
    return b.jsDate - a.jsDate;
  },
  nameDescending: (a, b) => {
    const nameA = a.displayName.toLowerCase();
    const nameB = b.displayName.toLowerCase();
    if (nameA < nameB) { return 1; }
    if (nameB < nameA) { return -1; }
    return b.jsDate - a.jsDate;
  },
});

export const acceptedImgKeys = StrictDict({
  gif: '.gif',
  jpg: '.jpg',
  jpeg: '.jpeg',
  png: '.png',
  tif: '.tif',
  tiff: '.tiff',
});
