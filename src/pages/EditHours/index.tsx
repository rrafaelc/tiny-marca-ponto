import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/app.routes';
import { format, isFuture, isToday } from 'date-fns';
import { v4 as uuid } from 'uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import FeatherIcon from 'react-native-vector-icons/Feather';

import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { Clock } from '../../components/Clock';
import { useCalendar } from '../../context/calendarContext';

import { IDatePropsDTO } from '../../dtos/IDatePropsDTO';

interface IHour {
  id: string;
  date: Date;
  type: 'in' | 'out';
}

import {
  Container,
  ArrowIcon,
  ContainerDays,
  ContainerList,
  DayTextTitle,
  TotalRegisterText,
  DateList,
  Hour,
  HourText,
  ButtonEditHour,
  ButtonCreateHour,
  ButtonCreateHourText,
  ButtonDeleteHour,
  ConfirmationContainer,
  ConfirmationText,
} from './styles';

type Props = NativeStackScreenProps<AppStackParamList, 'EditHours'>;

export const EditHours: React.FC<Props> = ({ navigation, route }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [day, setDay] = useState<IDatePropsDTO | null>(null);
  const [type, setType] = useState<'edit' | 'create'>('edit');
  const [formatDateString, setFormatDateString] = useState('--/--/--');
  const [hours, setHours] = useState<IHour[]>([
    { id: '-', date: new Date(), type: 'in' },
  ]);
  const [hourSelected, setHourSelected] = useState<IHour | null>(null);
  const [selectDate, setSelectDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDayDeleted, setIsDayDeleted] = useState(false);

  const { day_id } = route.params;

  const { reloadCalendar } = useCalendar();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const formatHour = useCallback((date: Date) => {
    return format(date, 'HH:mm');
  }, []);

  const formatDate = useCallback((date: Date) => {
    return format(date, 'dd/MM/yyyy');
  }, []);

  const parseDateToHour = useCallback((date: IDatePropsDTO) => {
    const hoursArray: IHour[] = [];

    const periods = date.period.sort((a, b) => {
      const d1 = new Date(a.date);
      const d2 = new Date(b.date);

      d1.setSeconds(0);
      d2.setSeconds(0);

      return d1.getTime() - d2.getTime();
    });

    const daySort = date;
    daySort.period = periods;

    setDay(daySort);

    periods.forEach((period, i) => {
      // Work Hours
      if (i % 2 === 0) {
        hoursArray.push({
          id: period.id,
          date: new Date(period.date),
          type: 'in',
        });
      } else {
        // Interval
        hoursArray.push({
          id: period.id,
          date: new Date(period.date),
          type: 'out',
        });
      }
    });

    return hoursArray;
  }, []);

  const parseDay = useCallback(
    (d: IDatePropsDTO) => {
      setFormatDateString(formatDate(new Date(d.period[0].date)));
      setHours(parseDateToHour(d));
    },
    [formatDate, parseDateToHour],
  );

  const handleEdit = useCallback(
    (date: Date) => {
      if (hourSelected) {
        const hour = hourSelected;

        date.setSeconds(0);

        if (isToday(date) && isFuture(date)) {
          Toast.show({
            type: 'info',
            text1: 'Não permitido editar horários para o futuro',
            text2: `No data de hoje ${formatDate(date)}`,
            visibilityTime: 5000,
          });

          return;
        }

        hour.date = date;

        const newHour = hours.filter(item => item.id !== hourSelected.id);

        newHour.push(hour);

        const hourSort = newHour.sort((a, b) => {
          return a.date.getTime() - b.date.getTime();
        });

        const hourToSave: { id: string; date: string }[] = [];

        hourSort.forEach(item => {
          hourToSave.push({
            id: item.id,
            date: String(item.date),
          });
        });

        const newDay = day;

        if (newDay) {
          newDay.period = hourToSave;

          setDay(newDay);

          parseDay(newDay);

          setHasUnsavedChanges(true);
        }
      }

      setHourSelected(null);
    },
    [hourSelected, hours, day, formatDate, parseDay],
  );

  const handleCreateAnHour = useCallback(
    async (date: Date) => {
      const newDay = day;

      if (newDay) {
        const getPeriodDate = new Date(newDay.period[0].date);

        date.setFullYear(getPeriodDate.getFullYear());
        date.setMonth(getPeriodDate.getMonth());
        date.setDate(getPeriodDate.getDate());
        date.setSeconds(0);

        if (isToday(date) && isFuture(date)) {
          Toast.show({
            type: 'info',
            text1: 'Não permitido adicionar horários futuros',
            text2: `No data de hoje ${formatDate(date)}`,
            visibilityTime: 5000,
          });

          return;
        }

        const hour = {
          id: uuid(),
          date: String(date),
        };

        newDay.period.push(hour);

        setDay(newDay);

        parseDay(newDay);

        setHasUnsavedChanges(true);
      }
    },
    [day, formatDate, parseDay],
  );

  const handleDeleteAnHour = useCallback(
    async (hourId: string) => {
      let filterHours = hours.filter(hour => hour.id !== hourId);

      if (filterHours.length === 0) {
        setHasUnsavedChanges(false);

        handleGoBack();

        reloadCalendar();

        return;
      }

      const hourSort = filterHours.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      });

      const newDay = day;

      const hourToSave: { id: string; date: string }[] = [];

      hourSort.forEach(item => {
        hourToSave.push({
          id: item.id,
          date: String(item.date),
        });
      });

      if (newDay) {
        newDay.period = hourToSave;

        setDay(newDay);

        parseDay(newDay);

        setHasUnsavedChanges(true);
      }
    },
    [hours, day, parseDay, handleGoBack, reloadCalendar],
  );

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChanged = useCallback(
    async (event: unknown, date: Date | undefined) => {
      setShowDatePicker(false);

      if (date) {
        date.setSeconds(0);

        for (let i = 0; i < hours.length; i++) {
          hours[i].date.setSeconds(0);

          if (
            hours[i].date.getHours() === date.getHours() &&
            hours[i].date.getMinutes() === date.getMinutes()
          ) {
            Toast.show({
              type: 'info',
              text1: 'Não permitido registrar horários iguais',
            });

            return;
          }
        }

        setSelectDate(date);

        type === 'edit' ? handleEdit(date) : await handleCreateAnHour(date);
      }
    },
    [hours, type, handleEdit, handleCreateAnHour],
  );

  const handleEditButton = useCallback(
    (hour: IHour) => {
      setSelectDate(hour.date);
      setHourSelected(hour);

      setType('edit');
      handleToggleDatePicker();
    },

    [handleToggleDatePicker],
  );

  const handleCreateButton = useCallback(() => {
    setSelectDate(new Date());
    setType('create');
    handleToggleDatePicker();
  }, [handleToggleDatePicker]);

  const getTotalRegisterHours = useCallback(() => {
    if (day) {
      return day.period.length;
    }

    return 0;
  }, [day]);

  const handleDeleteButton = useCallback(
    (hourId: string) => {
      if (hours.length === 1) {
        Alert.alert(
          'Excluir último horário?',
          `Tem certeza de que deseja excluir o último horário?\n\nO dia ${formatDateString} será excluído.`,
          [
            {
              text: 'Voltar',
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: async () => {
                try {
                  const timerClockRepository = new TimerClockRepository();

                  await timerClockRepository.delete(day!.id);

                  Toast.show({
                    type: 'success',
                    text1: 'Dia excluído!',
                  });

                  setIsDayDeleted(true);

                  setHasUnsavedChanges(false);

                  handleGoBack();

                  reloadCalendar();
                } catch (e) {
                  console.log(e);

                  Toast.show({
                    type: 'error',
                    text1: 'Aconteceu um erro',
                    visibilityTime: 6000,
                  });
                }
              },
            },
          ],
        );
      }

      if (hours.length !== 1) {
        Alert.alert(
          'Excluir horário?',
          'Tem certeza de que deseja excluir o horário?',
          [
            { text: 'Voltar', style: 'cancel', onPress: () => {} },
            {
              text: 'Excluir',
              style: 'destructive',
              onPress: () => handleDeleteAnHour(hourId),
            },
          ],
        );
      }
    },
    [
      day,
      hours,
      formatDateString,
      handleDeleteAnHour,
      setHasUnsavedChanges,
      handleGoBack,
      reloadCalendar,
    ],
  );

  const handleConfirmation = useCallback(async () => {
    if (hasUnsavedChanges) {
      const timerClockRepository = new TimerClockRepository();

      if (day) {
        await timerClockRepository.update(day.id, day);
      } else {
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Registros alterados com sucesso!',
      });

      setHasUnsavedChanges(false);

      reloadCalendar();

      handleGoBack();
    }
  }, [hasUnsavedChanges, day, reloadCalendar, handleGoBack]);

  useEffect(() => {
    const timerClockRepository = new TimerClockRepository();

    timerClockRepository
      .findLastDay(day_id)
      .then(response => {
        parseDay(response);
      })
      .catch(err => {
        console.log(err);

        Toast.show({
          type: 'error',
          text1: 'Aconteceu um erro',
          visibilityTime: 6000,
        });
      });
  }, [day_id, parseDay]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (isDayDeleted) {
          return;
        }

        if (!hasUnsavedChanges) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          'Descartar alterações?',
          'Você tem alterações não salvas. Tem certeza de descartá-los e sair da tela?',
          [
            { text: 'Não sair', style: 'cancel', onPress: () => {} },
            {
              text: 'Descartar',
              style: 'destructive',
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }),
    [isDayDeleted, navigation, hasUnsavedChanges],
  );

  return (
    <Container>
      <ArrowIcon onPress={handleGoBack}>
        <FeatherIcon name="arrow-left" size={40} color="#d7d7d7" />
      </ArrowIcon>
      <Clock />

      <ContainerDays>
        <DayTextTitle>{formatDateString}</DayTextTitle>
        <TotalRegisterText>
          Total de {getTotalRegisterHours()} registros
        </TotalRegisterText>
        <ContainerList>
          <DateList
            data={hours}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: hour }) => (
              <Hour>
                <ButtonEditHour onPress={() => handleEditButton(hour)}>
                  <FeatherIcon
                    name={
                      hour.type === 'in'
                        ? 'arrow-down-circle'
                        : 'arrow-up-circle'
                    }
                    size={24}
                    color={hour.type === 'in' ? '#299647' : '#DE4E4E'}
                  />
                  <HourText>{formatHour(hour.date)}</HourText>

                  <FeatherIcon name="edit" size={24} color="#d7d7d7" />
                </ButtonEditHour>
                <ButtonDeleteHour onPress={() => handleDeleteButton(hour.id)}>
                  <FeatherIcon name="trash" size={24} color="#DE4E4E" />
                </ButtonDeleteHour>
              </Hour>
            )}
            keyExtractor={hour => hour.id}
          />
        </ContainerList>
        <ButtonCreateHour onPress={handleCreateButton}>
          <ButtonCreateHourText>Adicionar horário</ButtonCreateHourText>
        </ButtonCreateHour>
      </ContainerDays>

      <ConfirmationContainer onPress={handleConfirmation}>
        <ConfirmationText>Salvar</ConfirmationText>
      </ConfirmationContainer>
      {showDatePicker && (
        <DateTimePicker
          value={selectDate}
          mode="time"
          display="spinner"
          onChange={handleDateChanged}
        />
      )}
    </Container>
  );
};
