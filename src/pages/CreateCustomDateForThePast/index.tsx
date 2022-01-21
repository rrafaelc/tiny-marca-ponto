import React, { useCallback, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/app.routes';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import { TimerClockRepository } from '../../repositories/TimerClockRepository';
import { Clock } from '../../components/Clock';
import { useCalendar } from '../../context/calendarContext';

import FeatherICon from 'react-native-vector-icons/Feather';

import {
  Container,
  ArrowIcon,
  ContainerDate,
  DateText,
  SelectDate,
  SelectDateText,
  HourSelected,
  HourSelectedText,
  Bold,
  SaveButton,
  SaveButtonText,
} from './styles';

type Props = NativeStackScreenProps<
  AppStackParamList,
  'CreateCustomDateForThePast'
>;

export const CreateCustomDateForThePast: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const { day, month, year } = route.params;

  const [selectDate, setSelectDate] = useState(new Date(year, month, day));
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
    const timerClockRepository = new TimerClockRepository();

    await timerClockRepository.create(selectDate);

    Toast.show({
      type: 'success',
      text1: 'Ponto registrado com sucesso!',
    });

    reloadCalendar();

    handleGoBack();
  }, [selectDate, reloadCalendar, handleGoBack]);

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

  return (
    <Container>
      <ArrowIcon onPress={handleGoBack}>
        <FeatherICon name="arrow-left" size={40} color="#d7d7d7" />
      </ArrowIcon>
      <Clock />

      <ContainerDate>
        <DateText>Criar horário no dia</DateText>
        <DateText>{formatDate(selectDate)}</DateText>

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
