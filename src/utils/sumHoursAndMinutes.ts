import { sortDateAsc } from './sortDateAsc';

const pad = (num: number) => String(num).padStart(2, '0');

function timestrToSec(timestr: string) {
  const parts = timestr.split(':');
  return Number(parts[0]) * 3600 + Number(parts[1]) * 60 + Number(parts[2]);
}

function formatTime(seconds: number) {
  return [
    pad(Math.floor(seconds / 3600)),
    pad(Math.floor(seconds / 60) % 60),
    pad(seconds % 60),
  ].join(':');
}

const sumHoursAndMinutes = (date: Date[]) => {
  const hours: string[] = [];
  const workHours: string[] = [];

  const sortDate = sortDateAsc(date);

  for (let i = 0; i < sortDate.length; i++) {
    if (i + 1 >= sortDate.length) {
      break;
    }

    const sub = sortDate[i + 1].getTime() - sortDate[i].getTime();

    /* Add 3 hours timezone */
    const correctTimezone = new Date(sub + 3 * 60 * 60 * 1000);

    hours.push(correctTimezone.toTimeString().split(' GMT')[0]);
  }

  /**
   * Get only work hours, exclude interval
   * [Work], [Interval], [Work], ...
   * ["05:04:00", "00:54:00", "04:12:00"]
   */
  hours.forEach((hour, i) => i % 2 === 0 && workHours.push(hour));

  const sumHours = workHours.reduce((acc, curr) => {
    return formatTime(timestrToSec(curr) + timestrToSec(acc));
  }, '00:00:00');

  return sumHours;
};

export { sumHoursAndMinutes };
