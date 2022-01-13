export const formatPtBrTimezone = (date: Date) =>
  new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
