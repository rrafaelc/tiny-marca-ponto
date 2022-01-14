import { compareAsc } from 'date-fns';

interface ICompareDate {
  chosenDate: Date;
  lastDate: Date;
}

export const compareDate = ({ chosenDate, lastDate }: ICompareDate) => {
  const compareCurrentDate = compareAsc(chosenDate, new Date());
  const compare = compareAsc(chosenDate, lastDate);

  if (compareCurrentDate === 1) {
    return 'future';
  }

  if (compare === -1) {
    return 'previous';
  }

  const compareHours =
    lastDate.toDateString() === chosenDate.toDateString() &&
    chosenDate.getHours() === lastDate.getHours() &&
    chosenDate.getMinutes() === lastDate.getMinutes();

  if (compareHours) {
    return 'equal';
  }
};
