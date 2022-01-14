interface SortDateProps {
  date: Date;
}

export const sortData = (date: SortDateProps[]) => {
  const sortedDate: SortDateProps[] = [];

  const sortDate = date.sort(
    (d1, d2) => new Date(d1.date).getTime() - new Date(d2.date).getTime(),
  );

  sortDate.forEach(d => sortedDate.push(d));

  return sortedDate;
};
