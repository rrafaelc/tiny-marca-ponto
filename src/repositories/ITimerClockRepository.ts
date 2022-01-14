import { ICreateDateDTO } from '../dtos/ICreateDateDTO';
import { IFindLastDateDTO } from '../dtos/IFindLastDateDTO';

export interface ITimerClockRepository {
  create(date: Date): Promise<ICreateDateDTO>;
  findLastDate(): Promise<IFindLastDateDTO | null>;
}
