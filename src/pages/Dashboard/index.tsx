import React, { useCallback, useState } from 'react';
import { ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { format } from 'date-fns';
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
  LoadingCard,
  Total,
  TotalText,
  CalendarNoteText,
  MonthCardList,
  Button,
  ButtonText,
  ModalContainer,
  Modal,
  ModalCloseIcon,
  ModalButton,
  ModalText,
} from './styles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

interface IMonthCardProps {
  id: string;
  month: number;
  year: number;
  hour: string;
  minute: string;
}

interface IHandleCardSelect {
  id: string;
  month: number;
  year: number;
}

if (__DEV__) {
  console.log('Running in dev mode');
}

export const Dashboard: React.FC<Props> = ({ navigation }) => {
  const [monthCards, setMonthCards] = useState<IMonthCardProps[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [cardSelectedId, setCardSelectedId] = useState(
    `${selectedYear}${selectedMonth}`,
  );
  const [loadingCard, setLoadingCard] = useState(false);
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

  const handleNavigationCreateCustomDate = useCallback(() => {
    setShowModal(false);
    navigation.navigate('CreateCustomDate');
  }, [navigation]);

  const handleCreateTimerClock = useCallback(async () => {
    try {
      const timerClockRepository = new TimerClockRepository();
      const date = new Date();
      date.setSeconds(0);

      const lastDate = await timerClockRepository.findLastDate();

      if (lastDate) {
        const compare = compareDate({
          date,
          dateToCompare: lastDate.date,
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

  const getMonthCardData = useCallback(async () => {
    setLoadingCard(true);
    const localMonthCards: IMonthCardProps[] = [];

    const timerClockRepository = new TimerClockRepository();

    const dates = await timerClockRepository.getAllMonthDays();

    let previousMonth: number;
    let previousYear: number;

    // https://gist.github.com/joeytwiddle/37d2085425c049629b80956d3c618971
    await dates.reduce(async (a, date) => {
      await a;

      const month = date.month;
      const year = date.year;

      if (previousMonth === month && previousYear === year) {
        return;
      }

      const totalHrs = await getTotalHours(month, year);

      const split = totalHrs.split(':');

      const hour = split[0];
      const minute = split[1];

      previousMonth = month;
      previousYear = year;

      localMonthCards.push({
        id: String(`${year}${month}`),
        month,
        year,
        hour,
        minute,
      });
    }, Promise.resolve());

    setMonthCards(localMonthCards);

    setLoadingCard(false);
  }, [getTotalHours]);

  const handleCardSelect = useCallback(
    ({ id, month, year }: IHandleCardSelect) => {
      setCardSelectedId(id);
      setSelectedMonth(month);
      setSelectedYear(year);

      setMonthText(format(new Date(year, month), 'MMMM', { locale: ptBR }));
    },
    [],
  );

  const handleDevCreate = useCallback(async () => {
    const timerClockRepository = new TimerClockRepository();
    const date = new Date();

    setCalendarLoading(true);

    for (let i = 1; i < 400; i++) {
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
    getMonthCardData();
  }, [handleGetTotalHoursComponent, getMonthCardData, loading]);

  return (
    <Container>
      {__DEV__ && (
        <>
          <DevButtonCreate onPress={handleDevCreate}>
            <FeatherIcon name="tool" size={20} color="#fff" />
          </DevButtonCreate>
          <DevButtonClear onPress={handleDevClear}>
            <FeatherIcon name="trash-2" size={20} color="#fff" />
          </DevButtonClear>
        </>
      )}
      <Clock />
      <Hour>
        <HourText>{totalHours}</HourText>
      </Hour>

      <Month>
        <MonthText>{monthText}</MonthText>
        <Total>
          <TotalText>Hoje</TotalText>
          <TotalText>{totalToday}</TotalText>
        </Total>
      </Month>

      <Calendar month={selectedMonth} year={selectedYear} />
      <CalendarNoteText>Nota: Clique em um dia para editar</CalendarNoteText>

      {loadingCard ? (
        <LoadingCard>
          <ActivityIndicator size="large" color="#d7d7d7" />
        </LoadingCard>
      ) : (
        <MonthCardList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={monthCards}
          renderItem={({ item: card }) => (
            <MonthCard
              id={card.id}
              selected={cardSelectedId}
              month={card.month}
              year={card.year}
              hour={card.hour}
              minute={card.minute}
              callback={handleCardSelect}
            />
          )}
          keyExtractor={card => String(card.id)}
        />
      )}

      <Button activeOpacity={0.6} onPress={handleToggleModal}>
        <ButtonText>Marcar ponto</ButtonText>
      </Button>

      {showModal && (
        <TouchableWithoutFeedback onPress={handleToggleModal}>
          <ModalContainer>
            <Modal>
              <ModalCloseIcon onPress={handleToggleModal}>
                <FeatherIcon name="x-circle" size={30} color="#d7d7d7" />
              </ModalCloseIcon>

              <ModalButton
                activeOpacity={0.6}
                onPress={handleNavigationCreateCustomDate}>
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
