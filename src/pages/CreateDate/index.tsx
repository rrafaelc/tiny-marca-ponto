import React, { useCallback, useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../routes/app.routes';
import FeatherICon from 'react-native-vector-icons/Feather';

import { Clock } from '../../components/Clock';

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
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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

        <SelectDate>
          <FeatherICon name="clock" size={20} color="#d7d7d7" />
          <SelectDateText>Selecionar horário</SelectDateText>
        </SelectDate>

        {showConfirmation && (
          <>
            <HourSelected>
              <HourSelectedText>12:00</HourSelectedText>
            </HourSelected>
            <CheckIcon>
              <FeatherICon name="check" size={30} color="#d7d7d7" />
            </CheckIcon>
          </>
        )}
      </ContainerDate>
    </Container>
  );
};
