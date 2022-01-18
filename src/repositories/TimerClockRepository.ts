import { v4 as uuid } from 'uuid';
import { ITimerClockRepository } from './ITimerClockRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IDayPropsDTO } from '../dtos/IDayPropsDTO';
import { IFindLastDayDTO } from '../dtos/IFindLastDayDTO';
import { sumHoursAndMinutes } from '../utils/sumHoursAndMinutes';

export class TimerClockRepository implements ITimerClockRepository {
  public async create(date: Date): Promise<IDayPropsDTO> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const jsonStorage: IDayPropsDTO[] = JSON.parse(storage);

    // Find if already has a saved day
    const findIndex = jsonStorage.findIndex(
      register =>
        register.day === date.getDate() &&
        register.month === date.getMonth() &&
        register.year === date.getFullYear(),
    );

    if (findIndex !== -1) {
      const register = jsonStorage[findIndex];

      const parseStringPeriodToDate: Array<{ id: string; date: string }> = [];
      register.period.forEach(period => {
        parseStringPeriodToDate.push({
          id: period.id,
          date: period.date,
        });
      });

      const newRegister = {
        ...register,
        period: [
          ...parseStringPeriodToDate,
          {
            id: uuid(),
            date: String(date),
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

    const registerTimer: IDayPropsDTO = {
      id: uuid(),
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      period: [
        {
          id: uuid(),
          date: String(date),
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

  public async findLastDate(): Promise<IFindLastDayDTO | null> {
    const storage = await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto');

    if (storage) {
      const parseStorage: IDayPropsDTO[] = JSON.parse(storage);

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

  public async getMonthDays(
    month: number,
    year: number,
  ): Promise<IDayPropsDTO[]> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const parseStorage: IDayPropsDTO[] = JSON.parse(storage);

    const days = parseStorage.filter(date => {
      return date.month === month && date.year === year;
    });

    return days;
  }

  public async getTotalMonthHours(
    month: number,
    year: number,
  ): Promise<string> {
    const days = await this.getMonthDays(month, year);

    const dates: Date[] = [];

    days.forEach(item =>
      item.period.forEach(date => dates.push(new Date(date.date))),
    );

    const total = sumHoursAndMinutes(dates);

    return total;
  }
}
