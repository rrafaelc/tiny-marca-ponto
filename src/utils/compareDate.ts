import { compareAsc } from 'date-fns';

interface ICompareDate {
  date: Date;
  dateToCompare: Date;
}

export const compareDate = ({ date, dateToCompare }: ICompareDate) => {
  const compareCurrentDate = compareAsc(date, new Date());
  const compare = compareAsc(date, dateToCompare);

  if (compareCurrentDate === 1) {
    return 'future';
  }

  if (compare === -1) {
    return 'past';
  }

  const compareHours =
    dateToCompare.toDateString() === date.toDateString() &&
    date.getHours() === dateToCompare.getHours() &&
    date.getMinutes() === dateToCompare.getMinutes();

  if (compareHours) {
    return 'equal';
  }
};
