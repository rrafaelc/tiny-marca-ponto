import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/app.routes';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import { compareDate } from '../../utils/compareDate';

import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { Clock } from '../../components/Clock';
import { useCalendar } from '../../context/calendarContext';

import FeatherICon from 'react-native-vector-icons/Feather';

import {
  Container,
  ArrowIcon,
  ContainerDate,
  LastDate,
  LastDateTitle,
  DateText,
  HourText,
  SelectDate,
  SelectDateText,
  HourSelected,
  HourSelectedText,
  Bold,
  SaveButton,
  SaveButtonText,
} from './styles';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateCustomDate'>;

export const CreateCustomDate: React.FC<Props> = ({ navigation }) => {
  const [lastDate, setLastDate] = useState<Date | null>(null);
  const [selectDate, setSelectDate] = useState(new Date());
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { reloadCalendar } = useCalendar();

  const handleGoBack = useCallback(() => {
    setShowSaveButton(false);
    navigation.goBack();
  }, [navigation]);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChanged = useCallback(
    (event: unknown, date: Date | undefined) => {
      // if (Platform.OS === 'android') {
      setShowDatePicker(false);
      // }

      if (date) {
        date.setSeconds(0);
        setSelectDate(date);
        setShowSaveButton(true);
      }
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (lastDate) {
      const compare = compareDate({
        date: selectDate,
        dateToCompare: lastDate,
      });

      if (compare === 'future') {
        Toast.show({
          type: 'info',
          text1: 'Não permitido registrar horários futuros',
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

    return '--/--/--';
  }, []);

  const formatHour = useCallback((date: Date | null) => {
    if (date) {
      return format(date, 'HH:mm');
    }

    return '--:--';
  }, []);

  useEffect(() => {
    const timerClockRepository = new TimerClockRepository();

    timerClockRepository
      .findLastDate()
      .then(response => {
        if (response) {
          setLastDate(response.date);
        } else {
          setLastDate(null);
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

      <ContainerDate>
        <LastDate>
          <LastDateTitle>Último horário registrado</LastDateTitle>
          <DateText>
            {formatDate(lastDate)}
            <HourText> {formatHour(lastDate)}</HourText>
          </DateText>
        </LastDate>

        <SelectDate onPress={handleToggleDatePicker}>
          <FeatherICon name="clock" size={20} color="#d7d7d7" />
          <SelectDateText>Selecionar horário</SelectDateText>
        </SelectDate>

        {showSaveButton && (
          <>
            <HourSelected onPress={handleToggleDatePicker}>
              <HourSelectedText>
                Registrar ponto às <Bold>{formatHour(selectDate)}</Bold>
              </HourSelectedText>
              <HourSelectedText>
                No dia <Bold>{formatDate(selectDate)}</Bold>
              </HourSelectedText>
            </HourSelected>
            <SaveButton activeOpacity={0.6} onPress={handleSave}>
              <SaveButtonText>Salvar</SaveButtonText>
            </SaveButton>
          </>
        )}
      </ContainerDate>

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
