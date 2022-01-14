import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/app.routes';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { TimerClockRepository } from '../../repositories/TimerClockRepository';

import { Clock } from '../../components/Clock';

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
  CheckIcon,
} from './styles';

type Props = NativeStackScreenProps<AppStackParamList, 'CreateDate'>;

export const CreateDate: React.FC<Props> = ({ navigation }) => {
  const [lastDate, setLastDate] = useState<Date | null>(null);
  const [selectDate, setSelectDate] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleConfirmation = useCallback(() => {
    // TODO
    handleGoBack();
  }, [handleGoBack]);

  const formatDate = useCallback((date: Date | null) => {
    if (date) {
      return format(date, 'HH:mm');
    }

    return '--:--';
  }, []);

  const formatHour = useCallback((date: Date | null) => {
    if (date) {
      return format(date, 'dd/MM/yyyy');
    }

    return '--/--/--';
  }, []);

  useEffect(() => {
    const getLastDate = async () => {
      const timerClockRepository = new TimerClockRepository();

      const d = await timerClockRepository.findLastDate();

      if (d) {
        setLastDate(d.date);
      }
    };

    getLastDate();
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
            {formatHour(lastDate)}
            <HourText> {formatDate(lastDate)}</HourText>
          </DateText>
        </LastDate>

        <SelectDate onPress={handleToggleDatePicker}>
          <FeatherICon name="clock" size={20} color="#d7d7d7" />
          <SelectDateText>Selecionar horário</SelectDateText>
        </SelectDate>

        {showConfirmation && (
          <>
            <HourSelected>
              <HourSelectedText>{formatHour(selectDate)}</HourSelectedText>
            </HourSelected>
            <CheckIcon onPress={handleConfirmation}>
              <FeatherICon name="check" size={30} color="#d7d7d7" />
            </CheckIcon>
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
