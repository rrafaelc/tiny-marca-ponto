import React, { useCallback, useState } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { format, isFuture } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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
  ReloadMonthButton,
  Total,
  TotalText,
  CalendarNoteText,
  MonthCardList,
  Button,
  ModalContainer,
  Modal,
  ModalTitleContainer,
  ModalTitle,
  ModalCloseIcon,
  ModalButton,
  ModalText,
} from './styles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

interface IMonthCardProps {
  id: number;
  month: number;
  hour: string;
  minute: string;
}

interface IHandleCardSelect {
  id: number;
  month: number;
}

export const Dashboard: React.FC<Props> = ({ navigation }) => {
  const [monthCards, setMonthCards] = useState<IMonthCardProps[]>([]);
  const [cardSelectedId, setCardSelectedId] = useState(-1);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [monthText, setMonthText] = useState(
    format(new Date(), 'MMMM', { locale: ptBR }),
  );
  const [totalHours, setTotalHours] = useState('00 horas e 00 minutos');

  const { loading, reloadCalendar, setCalendarLoading, totalToday } =
    useCalendar();

  const handleToggleModal = useCallback(() => {
    setShowModal(!showModal);
  }, [showModal]);

  const handleNavigationCreateDay = useCallback(() => {
    setShowModal(false);
    navigation.navigate('CreateDay');
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

  const getTotalHours = useCallback(async (month: number, year: number) => {
    const timerClockRepository = new TimerClockRepository();

    return timerClockRepository.getTotalMonthHours(month, year);
  }, []);

  const handleGetTotalHoursComponent = useCallback(async () => {
    const total = await getTotalHours(selectedMonth, selectedYear);

    const hour = total.split(':');

    setTotalHours(`${hour[0]} horas e ${hour[1]} minutos`);
  }, [selectedMonth, selectedYear, getTotalHours]);

  const getMonthCardData = useCallback(
    async (amount: number) => {
      const localMonthCards: IMonthCardProps[] = [];

      let localMonth = new Date().getMonth();
      let localYear = new Date().getFullYear();

      // For not render a card with current month
      if (localMonth === 0) {
        localYear -= 1;
        localMonth = 11;
      } else {
        localMonth -= 1;
      }

      for (let i = 0; i <= amount; i++) {
        const data = await getTotalHours(localMonth, localYear);
        const split = data.split(':');

        const hour = split[0];
        const minute = split[1];

        localMonthCards.push({
          id: localMonth,
          month: localMonth,
          hour,
          minute,
        });

        if (localMonth === 0) {
          localYear -= 1;
          localMonth = 12;
        }

        localMonth -= 1;
      }

      setMonthCards(localMonthCards);
    },
    [getTotalHours],
  );

  const handleCardSelect = useCallback(({ id, month }: IHandleCardSelect) => {
    setCardSelectedId(id);
    setSelectedMonth(month);

    setMonthText(format(new Date().setMonth(month), 'MMMM', { locale: ptBR }));

    const future = isFuture(new Date().setMonth(month));

    if (future) {
      setSelectedYear(new Date().getFullYear() - 1);
    } else {
      setSelectedYear(new Date().getFullYear());
    }
  }, []);

  const handleResetMonth = useCallback(() => {
    const currentDate = new Date();

    setCardSelectedId(-1);
    setSelectedMonth(currentDate.getMonth());
    setSelectedYear(currentDate.getFullYear());
    setMonthText(format(currentDate, 'MMMM', { locale: ptBR }));
  }, []);

  const handleDevCreate = useCallback(async () => {
    const timerClockRepository = new TimerClockRepository();
    const date = new Date();

    setCalendarLoading(true);

    for (let i = 1; i < 60; i++) {
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
    getMonthCardData(10);
  }, [handleGetTotalHoursComponent, getMonthCardData, loading]);

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
        <MonthText>{monthText}</MonthText>
        <ReloadMonthButton disabled={loading} onPress={handleResetMonth}>
          <FeatherIcon name="rotate-cw" size={18} color="#d7d7d7" />
        </ReloadMonthButton>
        <Total>
          <TotalText>Hoje</TotalText>
          <TotalText>{totalToday}</TotalText>
        </Total>
      </Month>

      <Calendar month={selectedMonth} year={selectedYear} />
      <CalendarNoteText>Nota: Clique em um dia para editar</CalendarNoteText>

      <MonthCardList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={monthCards}
        renderItem={({ item: card }) => (
          <MonthCard
            id={card.month}
            selected={cardSelectedId}
            month={card.month}
            hour={card.hour}
            minute={card.minute}
            disabled={loading}
            callback={handleCardSelect}
          />
        )}
        keyExtractor={card => String(card.id)}
      />

      <Button activeOpacity={0.6} onPress={handleToggleModal}>
        <FeatherIcon name="plus-circle" size={60} color="#d7d7d7" />
      </Button>

      {showModal && (
        <TouchableWithoutFeedback onPress={handleToggleModal}>
          <ModalContainer>
            <ModalTitleContainer>
              <ModalTitle>Registrar horário</ModalTitle>
            </ModalTitleContainer>
            <Modal>
              <ModalCloseIcon onPress={handleToggleModal}>
                <FeatherIcon name="x-circle" size={30} color="#d7d7d7" />
              </ModalCloseIcon>

              <ModalButton
                activeOpacity={0.6}
                onPress={handleNavigationCreateDay}>
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
