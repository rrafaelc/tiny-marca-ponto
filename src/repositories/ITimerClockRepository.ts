import { IDatePropsDTO } from '../dtos/IDatePropsDTO';
import { IFindLastDateDTO } from '../dtos/IFindLastDateDTO';

export interface ITimerClockRepository {
  create(date: Date): Promise<IDatePropsDTO>;
  findLastDate(): Promise<IFindLastDateDTO | null>;
  getMonthDays(month: number, year: number): Promise<IDatePropsDTO[]>;
  getTotalMonthHours(month: number, year: number): Promise<string>;
  findLastDay(day_id: string): Promise<IDatePropsDTO | null>;
}
