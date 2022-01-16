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
import { useCalendar } from '../../components/context/calendarContext';

import {
  DevButtonCreate,
  DevButtonClear,
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

import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const { reloadCalendar } = useCalendar();

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

  const handleDevCreate = useCallback(async () => {
    const timerClockRepository = new TimerClockRepository();
    const date = new Date();

    const _3DaysBefore = new Date(date.getTime() - 3 * 24 * 60 * 60 * 1000);
    const _2DaysBefore = new Date(date.getTime() - 2 * 24 * 60 * 60 * 1000);
    const _1DayBefore = new Date(date.getTime() - 1 * 24 * 60 * 60 * 1000);

    await timerClockRepository.create(new Date(_3DaysBefore.setHours(6, 58)));
    await timerClockRepository.create(new Date(_3DaysBefore.setHours(12, 2)));
    await timerClockRepository.create(new Date(_3DaysBefore.setHours(12, 56)));
    await timerClockRepository.create(new Date(_3DaysBefore.setHours(17, 8)));

    await timerClockRepository.create(new Date(_2DaysBefore.setHours(6, 58)));
    await timerClockRepository.create(new Date(_2DaysBefore.setHours(12, 2)));
    await timerClockRepository.create(new Date(_2DaysBefore.setHours(12, 56)));
    await timerClockRepository.create(new Date(_2DaysBefore.setHours(17, 8)));

    await timerClockRepository.create(new Date(_1DayBefore.setHours(6, 58)));
    await timerClockRepository.create(new Date(_1DayBefore.setHours(12, 2)));
    await timerClockRepository.create(new Date(_1DayBefore.setHours(12, 56)));
    await timerClockRepository.create(new Date(_1DayBefore.setHours(17, 8)));

    Toast.show({
      type: 'success',
      text1: 'Ponto registrado com sucesso!',
    });

    reloadCalendar();
  }, [reloadCalendar]);

  const handleDevClear = useCallback(async () => {
    AsyncStorage.clear();
    reloadCalendar();
  }, [reloadCalendar]);

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
        <HourText>207 horas e 10 minutos</HourText>
      </Hour>

      <Month>
        <MonthText>Maio</MonthText>
        <Period>
          <PeriodText>Total hoje</PeriodText>
          <PeriodText>08:25</PeriodText>
        </Period>
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
