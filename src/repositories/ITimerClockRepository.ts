import { IDayPropsDTO } from '../dtos/IDayPropsDTO';
import { IFindLastDayDTO } from '../dtos/IFindLastDayDTO';

export interface ITimerClockRepository {
  create(date: Date): Promise<IDayPropsDTO>;
  findLastDate(): Promise<IFindLastDayDTO | null>;
  getMonthDays(month: number, year: number): Promise<IDayPropsDTO[]>;
  getTotalMonthHours(month: number, year: number): Promise<string>;
  findDay(day_id: string): Promise<IDayPropsDTO>;
}
