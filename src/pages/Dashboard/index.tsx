import React, { useCallback, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { compareDate } from '../../utils/compareDate';

import { Clock } from '../../components/Clock';
import { Calendar } from '../../components/Calendar';
import { MonthCard } from '../../components/MonthCard';

import FeatherIcon from 'react-native-vector-icons/Feather';

import { TimerClockRepository } from '../../repositories/TimerClockRepository';

import { AppStackParamList } from '../../routes/app.routes';
import { useCalendar } from '../../context/calendarContext';

import {
  DevButtonCreate,
  DevButtonClear,
  Container,
  Hour,
  HourText,
  Month,
  MonthText,
  Total,
  TotalText,
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

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

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
  const [totalHours, setTotalHours] = useState('00 horas e 00 minutos');

  const { loading, reloadCalendar, setCalendarLoading, totalToday } =
    useCalendar();

  const handleToggleModal = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  const handleNavigationCreateDate = useCallback(() => {
    setShowModal(false);
    navigation.navigate('CreateDate');
  }, [navigation]);

  const handleCreateTimerClock = useCallback(async () => {
    try {
      const timerClockRepository = new TimerClockRepository();
      const date = new Date();

      const lastDate = await timerClockRepository.findLastDate();

      if (lastDate) {
        const compare = compareDate({
          chosenDate: date,
          lastDate: lastDate.date,
        });

        if (compare === 'equal') {
          Toast.show({
            type: 'info',
            text1: 'Não permitido registrar horários iguais',
          });

          return;
        }
      }

      await timerClockRepository.create(date);

      reloadCalendar();

      Toast.show({
        type: 'success',
        text1: 'Ponto registrado com sucesso!',
      });

      setShowModal(false);
    } catch (err) {
      console.log(err);

      Toast.show({
        type: 'error',
        text1: 'Aconteceu um erro ao registrar o ponto',
      });
    }
  }, [reloadCalendar]);

  const getTotalHours = useCallback(async (month: number) => {
    const timerClockRepository = new TimerClockRepository();

    return timerClockRepository.getTotalMonthHours(month);
  }, []);

  const handleGetTotalHoursComponent = useCallback(async () => {
    const total = await getTotalHours(new Date().getMonth());

    const hour = total.split(':');

    setTotalHours(`${hour[0]} horas e ${hour[1]} minutos`);
  }, [getTotalHours]);

  const handleDevCreate = useCallback(async () => {
    const timerClockRepository = new TimerClockRepository();
    const date = new Date();

    setCalendarLoading(true);

    for (let i = 1; i < 8; i++) {
      const oldDays = new Date(date.getTime() - i * 24 * 60 * 60 * 1000);
      const random = () => Math.random() * (60 - 0) + 0;

      await timerClockRepository.create(
        new Date(oldDays.setHours(6, random())),
      );
      await timerClockRepository.create(
        new Date(oldDays.setHours(12, random())),
      );
      await timerClockRepository.create(
        new Date(oldDays.setHours(12, random())),
      );
      await timerClockRepository.create(
        new Date(oldDays.setHours(17, random())),
      );
    }

    Toast.show({
      type: 'success',
      text1: 'Ponto registrado com sucesso!',
    });
    setCalendarLoading(false);

    reloadCalendar();
  }, [reloadCalendar, setCalendarLoading]);

  const handleDevClear = useCallback(async () => {
    setCalendarLoading(true);

    AsyncStorage.clear();

    setCalendarLoading(false);

    reloadCalendar();
  }, [reloadCalendar, setCalendarLoading]);

  useEffect(() => {
    handleGetTotalHoursComponent();
  }, [handleGetTotalHoursComponent, loading]);

  return (
    <Container>
      <DevButtonCreate onPress={handleDevCreate}>
        <FeatherIcon name="tool" size={20} color="#fff" />
      </DevButtonCreate>
      <DevButtonClear onPress={handleDevClear}>
        <FeatherIcon name="trash-2" size={20} color="#fff" />
      </DevButtonClear>
      <Clock />
      <Hour>
        <HourText>{totalHours}</HourText>
      </Hour>

      <Month>
        <MonthText>Maio</MonthText>
        <Total>
          <TotalText>Horas trabalhadas hoje</TotalText>
          <TotalText>{totalToday}</TotalText>
        </Total>
      </Month>

      <Calendar month={0} year={2022} />
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
                <ModalText>Hora Personalizada</ModalText>
              </ModalButton>

              <ModalButton activeOpacity={0.6} onPress={handleCreateTimerClock}>
                <ModalText>Hora Atual</ModalText>
              </ModalButton>
            </Modal>
          </ModalContainer>
        </TouchableWithoutFeedback>
      )}
    </Container>
  );
};
