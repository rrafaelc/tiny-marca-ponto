export interface IDatePropsDTO {
  id: string;
  day: number;
  month: number;
  year: number;
  period: Array<{
    id: string;
    date: string;
  }>;
}
