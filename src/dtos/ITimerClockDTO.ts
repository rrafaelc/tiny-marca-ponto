export interface ITimerClockDTO {
  id: string;
  day: number;
  month: number;
  year: number;
  period: Array<{
    date: Date;
  }>;
}
