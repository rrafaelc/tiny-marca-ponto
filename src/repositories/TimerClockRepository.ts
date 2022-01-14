import { v4 as uuid } from 'uuid';
import { ITimerClockRepository } from './ITimerClockRepository';
import { ITimerClockDTO } from '../dtos/ITimerClockDTO';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IStorage {
  id: string;
  day: number;
  month: number;
  year: number;
  period: Array<{
    id: string;
    date: string;
  }>;
}

export class TimerClockRepository implements ITimerClockRepository {
  public async create(date: Date): Promise<ITimerClockDTO> {
    const storage = await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto');

    if (storage) {
      const jsonStorage: IStorage[] = JSON.parse(storage);

      // Find if already has a day
      const findIndex = jsonStorage.findIndex(
        register =>
          register.day === date.getDate() &&
          register.month === date.getMonth() + 1 &&
          register.year === date.getFullYear(),
      );

      if (findIndex !== -1) {
        const register = jsonStorage[findIndex];

        const parseStringPeriodToDate: Array<{ id: string; date: Date }> = [];
        register.period.forEach(period => {
          parseStringPeriodToDate.push({
            id: period.id,
            date: new Date(period.date),
          });
        });

        const newRegister = {
          ...register,
          period: [...parseStringPeriodToDate, { id: uuid(), date }],
        };

        try {
          await AsyncStorage.setItem(
            '@rrafaelc/tyny-marca-ponto',
            JSON.stringify([newRegister]),
          );
        } catch (err) {
          console.log(err);

          throw new Error('Error saving data');
        }

        return newRegister;
      }
    }

    const registerTimer: ITimerClockDTO = {
      id: uuid(),
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      period: [
        {
          id: uuid(),
          date,
        },
      ],
    };

    try {
      await AsyncStorage.setItem(
        '@rrafaelc/tyny-marca-ponto',
        JSON.stringify([registerTimer]),
      );

      console.log('Salvo');
      console.log(await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto'));
    } catch (err) {
      console.log(err);

      throw new Error('Error saving data');
    }

    return registerTimer;
  }
}
