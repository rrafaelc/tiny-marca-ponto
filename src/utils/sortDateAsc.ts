export const sortDateAsc = (date: Array<Date>) => {
  return date.sort((a, b) => {
    return a.getTime() - b.getTime();
  });
};
