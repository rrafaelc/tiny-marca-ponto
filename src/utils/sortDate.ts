interface SortDateProps {
  date: Date;
}

export const sortDate = (date: SortDateProps[]) => {
  const sortedDate: SortDateProps[] = [];

  const sort = date.sort(
    (d1, d2) => new Date(d1.date).getTime() - new Date(d2.date).getTime(),
  );

  sort.forEach(d => sortedDate.push(d));

  return sortedDate;
};
