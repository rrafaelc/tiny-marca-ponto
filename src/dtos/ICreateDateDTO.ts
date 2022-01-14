export interface ICreateDateDTO {
  id: string;
  day: number;
  month: number;
  year: number;
  period: Array<{
    id: string;
    date: Date;
  }>;
}
