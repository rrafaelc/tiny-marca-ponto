import React, { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/app.routes';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import FeatherIcon from 'react-native-vector-icons/Feather';

import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { Clock } from '../../components/Clock';
import { useCalendar } from '../../context/calendarContext';

import { IDatePropsDTO } from '../../dtos/IDatePropsDTO';

import FeatherICon from 'react-native-vector-icons/Feather';

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
  DateList,
  Hour,
  HourText,
  ButtonEditHour,
  ButtonDeleteHour,
  CheckIcon,
} from './styles';

type Props = NativeStackScreenProps<AppStackParamList, 'EditHours'>;
console.log('=====');

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

  const { day_id } = route.params;

  const { reloadCalendar } = useCalendar();

  const formatHour = useCallback((date: Date) => {
    return format(date, 'HH:mm');
  }, []);

  const formatDate = useCallback((date: Date) => {
    return format(date, 'dd/MM/yyyy');
  }, []);

  const parseHour = useCallback((date: IDatePropsDTO) => {
    const hoursArray: IHour[] = [];

    const periods = date.period.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
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
      setHours(parseHour(d));
    },
    [formatDate, parseHour],
  );

  const handleEdit = useCallback(
    (date: Date) => {
      if (hourSelected) {
        const hour = hourSelected;

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
    [hourSelected, hours, day, parseDay],
  );

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: unknown, date: Date | undefined) => {
      setShowDatePicker(false);

      if (date) {
        setSelectDate(date);

        type === 'edit' && handleEdit(date);
      }
    },
    [type, handleEdit],
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

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
        text1: 'Ponto atualizado com sucesso!',
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
    [navigation, hasUnsavedChanges],
  );

  return (
    <Container>
      <ArrowIcon onPress={handleGoBack}>
        <FeatherICon name="arrow-left" size={40} color="#d7d7d7" />
      </ArrowIcon>
      <Clock />

      <ContainerDays>
        <DayTextTitle>{formatDateString}</DayTextTitle>
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
                <ButtonDeleteHour onPress={() => console.log(hour.id)}>
                  <FeatherIcon name="trash" size={24} color="#DE4E4E" />
                </ButtonDeleteHour>
              </Hour>
            )}
            keyExtractor={hour => hour.id}
          />
        </ContainerList>
        <FeatherIcon name="plus-circle" size={24} color="#d7d7d7" />
      </ContainerDays>

      <CheckIcon onPress={handleConfirmation}>
        <FeatherICon name="check" size={30} color="#d7d7d7" />
      </CheckIcon>
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
