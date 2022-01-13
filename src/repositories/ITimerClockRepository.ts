import { ITimerClockDTO } from '../dtos/ITimerClockDTO';

export interface ITimerClockRepository {
  create(date: Date): Promise<ITimerClockDTO>;
}
