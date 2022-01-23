import { v4 as uuid } from 'uuid';
import { ITimerClockRepository } from './ITimerClockRepository';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IDatePropsDTO } from '../dtos/IDatePropsDTO';
import { IFindLastDateDTO } from '../dtos/IFindLastDateDTO';
import { sumHoursAndMinutes } from '../utils/sumHoursAndMinutes';

export class TimerClockRepository implements ITimerClockRepository {
  public async create(date: Date): Promise<IDatePropsDTO> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const jsonStorage: IDatePropsDTO[] = JSON.parse(storage);

    // Find if already has a saved day
    const findIndex = jsonStorage.findIndex(
      register =>
        register.day === date.getDate() &&
        register.month === date.getMonth() &&
        register.year === date.getFullYear(),
    );

    if (findIndex !== -1) {
      const register = jsonStorage[findIndex];

      const getPeriods: Array<{ id: string; date: string }> = [];

      register.period.forEach(period => {
        getPeriods.push({
          id: period.id,
          date: period.date,
        });
      });

      date.setSeconds(0);
      // Create a new period
      getPeriods.push({
        id: uuid(),
        date: String(date),
      });

      // Sort all periods date in order
      const sortPeriods = getPeriods.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      const newRegister: IDatePropsDTO = {
        ...register,
        period: [...sortPeriods],
      };

      const updateStorage = jsonStorage;

      // Replace the location of old register with the new register
      updateStorage.splice(findIndex, 1, newRegister);

      try {
        await AsyncStorage.setItem(
          '@rrafaelc/tyny-marca-ponto',
          JSON.stringify(updateStorage),
        );
      } catch (err) {
        console.log(err);

        throw new Error('Error saving data');
      }

      return newRegister;
    }

    date.setSeconds(0);

    const registerTimer: IDatePropsDTO = {
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

      const oldStorageParsed: IDatePropsDTO[] = JSON.parse(oldStorage || '[]');

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

  public async update(day_id: string, day: IDatePropsDTO): Promise<void> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const dayStorage: IDatePropsDTO[] = JSON.parse(storage);

    // Find if has a saved day
    const getDayIndex = dayStorage.findIndex(item => item.id === day_id);

    if (getDayIndex !== -1) {
      const periods: { id: string; date: string }[] = [];

      day.period.forEach(period => periods.push(period));

      const sortPeriods = periods.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      const updatedDay: IDatePropsDTO = {
        ...day,
        period: sortPeriods,
      };

      const updateStorage = dayStorage;

      updateStorage.splice(getDayIndex, 1, updatedDay);

      try {
        await AsyncStorage.setItem(
          '@rrafaelc/tyny-marca-ponto',
          JSON.stringify(updateStorage),
        );
      } catch (err) {
        console.log(err);

        throw new Error('Error saving data');
      }
    } else {
      throw new Error(`Id ${day_id} not found`);
    }
  }

  public async findLastDate(): Promise<IFindLastDateDTO | null> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const parseStorage: IDatePropsDTO[] = JSON.parse(storage);

    if (parseStorage.length > 0) {
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
  ): Promise<IDatePropsDTO[]> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const parseStorage: IDatePropsDTO[] = JSON.parse(storage);

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

  public async findLastDay(day_id: string): Promise<IDatePropsDTO> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const parseStorage: IDatePropsDTO[] = JSON.parse(storage);

    const day = parseStorage.filter(date => {
      return date.id === day_id;
    })[0];

    return day;
  }

  public async delete(day_id: string): Promise<void> {
    const storage =
      (await AsyncStorage.getItem('@rrafaelc/tyny-marca-ponto')) || '[]';

    const dayStorage: IDatePropsDTO[] = JSON.parse(storage);

    // Find if has a saved day
    const getDayIndex = dayStorage.findIndex(item => item.id === day_id);

    if (getDayIndex !== -1) {
      const updateStorage = dayStorage;

      updateStorage.splice(getDayIndex, 1);

      try {
        await AsyncStorage.setItem(
          '@rrafaelc/tyny-marca-ponto',
          JSON.stringify(updateStorage),
        );
      } catch (err) {
        console.log(err);

        throw new Error('Error deleting day');
      }
    } else {
      throw new Error(`Id ${day_id} not found`);
    }
  }
}
