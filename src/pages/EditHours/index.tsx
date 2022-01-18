import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/app.routes';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import FeatherIcon from 'react-native-vector-icons/Feather';

import { compareDate } from '../../utils/compareDate';

import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { Clock } from '../../components/Clock';
import { useCalendar } from '../../context/calendarContext';

import FeatherICon from 'react-native-vector-icons/Feather';

const days = [
  {
    id: '1',
    hour: '06:56',
    type: 'in',
  },
  {
    id: '2',
    hour: '06:56',
    type: 'out',
  },
  {
    id: '3',
    hour: '06:56',
    type: 'in',
  },
  {
    id: '4',
    hour: '06:56',
    type: 'out',
  },
  {
    id: '5',
    hour: '06:56',
    type: 'in',
  },
  {
    id: '6',
    hour: '06:56',
    type: 'out',
  },
  {
    id: '7',
    hour: '06:56',
    type: 'in',
  },
  {
    id: '8',
    hour: '06:56',
    type: 'out',
  },
  {
    id: '9',
    hour: '06:56',
    type: 'in',
  },
  {
    id: '10',
    hour: '06:56',
    type: 'out',
  },
];

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
  CheckIcon,
} from './styles';

type Props = NativeStackScreenProps<AppStackParamList, 'EditHours'>;

export const EditHours: React.FC<Props> = ({ navigation, route }) => {
  const [lastDate, setLastDate] = useState<Date | null>(null);
  const [selectDate, setSelectDate] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { reloadCalendar } = useCalendar();

  console.log(route.params.day_id);

  const handleGoBack = useCallback(() => {
    setShowConfirmation(false);
    navigation.goBack();
  }, [navigation]);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: unknown, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (date) {
        setSelectDate(date);
        setShowConfirmation(true);
      }
    },
    [],
  );

  const handleConfirmation = useCallback(async () => {
    if (lastDate) {
      const compare = compareDate({
        chosenDate: selectDate,
        lastDate,
      });

      if (compare === 'future') {
        Toast.show({
          type: 'info',
          text1: 'Não permitido registrar horários futuros',
        });

        return;
      }

      if (compare === 'previous') {
        Toast.show({
          type: 'info',
          text1: 'Não permitido registrar horários anteriores',
        });

        return;
      }

      if (compare === 'equal') {
        Toast.show({
          type: 'info',
          text1: 'Não permitido registrar horários iguais',
        });

        return;
      }
    }

    const timerClockRepository = new TimerClockRepository();

    await timerClockRepository.create(selectDate);

    Toast.show({
      type: 'success',
      text1: 'Ponto registrado com sucesso!',
    });

    reloadCalendar();

    handleGoBack();
  }, [lastDate, selectDate, reloadCalendar, handleGoBack]);

  const formatDate = useCallback((date: Date | null) => {
    if (date) {
      return format(date, 'dd/MM/yyyy');
    }

    return '--:--';
  }, []);

  const formatHour = useCallback((date: Date | null) => {
    if (date) {
      return format(date, 'HH:mm');
    }

    return '--/--/--';
  }, []);

  useEffect(() => {
    const timerClockRepository = new TimerClockRepository();

    timerClockRepository
      .findLastDate()
      .then(response => {
        if (response !== null) {
          // setLastDate(response.date);
        }
      })
      .catch(err => {
        console.log(err);

        Toast.show({
          type: 'error',
          text1: 'Aconteceu um erro',
          text2: 'Aconteceu um erro ao carregar o último horário registrado',
          visibilityTime: 6000,
        });
      });
  }, []);

  return (
    <Container>
      <ArrowIcon onPress={handleGoBack}>
        <FeatherICon name="arrow-left" size={40} color="#d7d7d7" />
      </ArrowIcon>
      <Clock />

      <ContainerDays>
        <DayTextTitle>14/02/2022</DayTextTitle>
        <ContainerList>
          <DateList
            data={days}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: day }) => (
              <Hour>
                <FeatherIcon
                  name={
                    day.type === 'in' ? 'arrow-down-circle' : 'arrow-up-circle'
                  }
                  size={24}
                  color={day.type === 'in' ? '#299647' : '#DE4E4E'}
                />
                <HourText>{day.hour}</HourText>
                <ButtonEditHour>
                  <FeatherIcon name="edit" size={24} />
                </ButtonEditHour>
              </Hour>
            )}
            keyExtractor={day => day.id}
          />
        </ContainerList>
      </ContainerDays>

      <CheckIcon onPress={() => {}}>
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
