import React, { useCallback, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Clock } from '../../components/Clock';
import { Calendar } from '../../components/Calendar';
import { MonthCard } from '../../components/MonthCard';

import FeatherIcon from 'react-native-vector-icons/Feather';

import {
  Container,
  Hour,
  HourText,
  Month,
  MonthText,
  Period,
  PeriodText,
  CalendarNoteText,
  MonthCardList,
  Button,
  ButtonText,
  Modal,
  ModalCloseIcon,
  ModalButton,
  ModalText,
  ModalContainer,
} from './styles';

import { AppStackParamList } from '../../routes/app.routes';
type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

interface IMonthCardProps {
  id: string;
  month: number;
  hour: number;
  minute: number;
}

const monthCards: IMonthCardProps[] = [
  {
    id: String(Math.random()),
    month: 4,
    hour: 205,
    minute: 42,
  },
  {
    id: String(Math.random()),
    month: 3,
    hour: 205,
    minute: 42,
  },
  {
    id: String(Math.random()),
    month: 2,
    hour: 205,
    minute: 42,
  },
  {
    id: String(Math.random()),
    month: 1,
    hour: 205,
    minute: 42,
  },
  {
    id: String(Math.random()),
    month: 12,
    hour: 205,
    minute: 42,
  },
  {
    id: String(Math.random()),
    month: 11,
    hour: 205,
    minute: 42,
  },
];

export const Dashboard: React.FC<Props> = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);

  const handleToggleModal = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  const handleNavigationCreateDate = useCallback(() => {
    setShowModal(false);
    navigation.navigate('CreateDate');
  }, [navigation]);

  return (
    <Container>
      <Clock />
      <Hour>
        <HourText>207 horas e 10 minutos</HourText>
      </Hour>

      <Month>
        <MonthText>Maio</MonthText>
        <Period>
          <PeriodText>Manhã - 4:45</PeriodText>
          <PeriodText>Tarde - 4:45</PeriodText>
        </Period>
      </Month>

      <Calendar />
      <CalendarNoteText>Nota: Clique em um dia para editar</CalendarNoteText>

      <MonthCardList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={monthCards}
        renderItem={({ item: card }) => (
          <MonthCard month={card.month} hour={card.hour} minute={card.minute} />
        )}
        keyExtractor={card => card.id}
      />

      <Button activeOpacity={0.6} color="#c4c4c4">
        <ButtonText color="#000">Configurações</ButtonText>
      </Button>

      <Button activeOpacity={0.6} color="#299647" onPress={handleToggleModal}>
        <ButtonText color="#d7d7d7">Marcar Ponto</ButtonText>
      </Button>

      {showModal && (
        <TouchableWithoutFeedback onPress={handleToggleModal}>
          <ModalContainer>
            <Modal>
              <ModalCloseIcon onPress={handleToggleModal}>
                <FeatherIcon name="x-circle" size={20} color="#d7d7d7" />
              </ModalCloseIcon>

              <ModalButton
                activeOpacity={0.6}
                onPress={handleNavigationCreateDate}>
                <ModalText>Data Personalizada</ModalText>
              </ModalButton>

              <ModalButton activeOpacity={0.6}>
                <ModalText>Hora Atual</ModalText>
              </ModalButton>
            </Modal>
          </ModalContainer>
        </TouchableWithoutFeedback>
      )}
    </Container>
  );
};
