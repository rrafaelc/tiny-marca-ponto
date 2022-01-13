import React, { useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/app.routes';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

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

  const formatHour = useMemo(() => {
    return format(selectDate, 'HH:mm');
  }, [selectDate]);

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
            14/02/2022
            <HourText> 06:56:23</HourText>
          </DateText>
        </LastDate>

        <SelectDate onPress={handleToggleDatePicker}>
          <FeatherICon name="clock" size={20} color="#d7d7d7" />
          <SelectDateText>Selecionar horário</SelectDateText>
        </SelectDate>

        {showConfirmation && (
          <>
            <HourSelected>
              <HourSelectedText>{formatHour}</HourSelectedText>
            </HourSelected>
            <CheckIcon>
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
