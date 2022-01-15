import { v4 as uuid } from 'uuid';
import { ITimerClockRepository } from './ITimerClockRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ICreateDateDTO } from '../dtos/ICreateDateDTO';
import { IFindLastDateDTO } from '../dtos/IFindLastDateDTO';

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
  public async create(date: Date): Promise<ICreateDateDTO> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const jsonStorage: ICreateDateDTO[] = JSON.parse(storage);

    // Find if already has a saved day
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
        period: [
          ...parseStringPeriodToDate,
          {
            id: uuid(),
            date,
          },
        ],
      };

      const newStorage = jsonStorage;

      newStorage.splice(findIndex, 1, newRegister);

      try {
        await AsyncStorage.setItem(
          '@rrafaelc/tyny-marca-ponto',
          JSON.stringify(newStorage),
        );
      } catch (err) {
        console.log(err);

        throw new Error('Error saving data');
      }

      return newRegister;
    }

    const registerTimer: ICreateDateDTO = {
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
      const oldStorage = await AsyncStorage.getItem(
        '@rrafaelc/tyny-marca-ponto',
      );

      const oldStorageParsed: [] = JSON.parse(oldStorage || '[]');

      await AsyncStorage.setItem(
        '@rrafaelc/tyny-marca-ponto',
        JSON.stringify([...oldStorageParsed, registerTimer]),
      );
    } catch (err) {
      console.log(err);

      throw new Error('Error saving data');
    }

    return registerTimer;
  }

  public async findLastDate(): Promise<IFindLastDateDTO | null> {
    const storage = await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto');

    if (storage) {
      const parseStorage: IStorage[] = JSON.parse(storage);

      const allDates: number[] = [];

      parseStorage.forEach(st =>
        st.period.forEach(period =>
          allDates.push(new Date(period.date).getTime()),
        ),
      );

      const lastDate = {
        date: new Date(Math.max(...allDates)),
      };

      return lastDate;
    }

    return null;
  }

  public async getMonthDays(month: number): Promise<void> {
    const storage = await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto');

    if (storage) {
      const parseStorage: IStorage[] = JSON.parse(storage);

      const days = parseStorage.filter(date => date.month === month);

      console.log('==START==');
      days.forEach(day =>
        day.period.forEach(period =>
          console.log(new Date(period.date).toLocaleString()),
        ),
      );
      console.log('==END==');
    }
  }
}
