import { IDatePropsDTO } from '../dtos/IDatePropsDTO';
import { IFindLastDateDTO } from '../dtos/IFindLastDateDTO';

export interface ITimerClockRepository {
  create(date: Date): Promise<IDatePropsDTO>;
  update(day_id: string, day: IDatePropsDTO): Promise<void>;
  findLastDate(): Promise<IFindLastDateDTO | null>;
  getAllMonthDays(): Promise<IDatePropsDTO[]>;
  getMonthDays(month: number, year: number): Promise<IDatePropsDTO[]>;
  getTotalMonthHours(month: number, year: number): Promise<string>;
  findLastDay(day_id: string): Promise<IDatePropsDTO>;
  delete(day_id: string): Promise<void>;
}
