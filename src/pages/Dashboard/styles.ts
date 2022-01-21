import styled from 'styled-components/native';
import { FlatList, ScrollView } from 'react-native';
import { rgba } from 'polished';

export const DevButtonCreate = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  left: 20px;

  background-color: #299647;
  padding: 10px;
  border-radius: 50px;
`;

export const DevButtonClear = styled.TouchableOpacity`
  position: absolute;
  top: 20px;
  right: 20px;

  background-color: #ff0000;
  padding: 10px;
  border-radius: 50px;
`;

// https://github.com/styled-components/styled-components/issues/785
export const Container = styled.ScrollView.attrs(() => ({
  // https://stackoverflow.com/a/62692442
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
}))`` as unknown as typeof ScrollView;

export const Hour = styled.View`
  width: 250px;
  height: 40px;
  background-color: ${rgba('#42138f', 0.75)};

  border-radius: 10px;
  justify-content: center;
  align-items: center;

  margin-bottom: 30px;
`;

export const HourText = styled.Text`
  font-size: 20px;
  color: #d7d7d7;
  font-weight: bold;
`;

export const Month = styled.View`
  width: 100%;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;
`;

export const MonthText = styled.Text`
  text-transform: capitalize;
  font-size: 18px;
  color: #d7d7d7;
`;

export const ReloadMonthButton = styled.TouchableOpacity`
  flex: 1;
  margin-left: 10px;
`;

export const Total = styled.View`
  flex-direction: row;
`;

export const TotalText = styled.Text`
  margin-left: 15px;
  font-size: 14px;
  color: #d7d7d7;
`;

export const CalendarNoteText = styled.Text`
  font-size: 12px;
  color: #d7d7d7;

  margin-bottom: 20px;
`;

// https://stackoverflow.com/a/66056471
export const MonthCardList = styled.FlatList`
  margin-bottom: 25px;
` as unknown as typeof FlatList;

export const Button = styled.TouchableOpacity`
  margin-bottom: 30px;
  padding: 10px 20px;
  border-radius: 15px;
  border: 1px solid #299647;
`;

export const ButtonText = styled.Text`
  font-size: 18px;
  color: #d7d7d7;
`;

export const ModalContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  padding-bottom: 80px;

  background: ${rgba('#000', 0.7)};
`;

export const Modal = styled.View`
  width: 100%;

  align-items: center;
`;

export const ModalButton = styled.TouchableOpacity`
  width: 210px;
  padding: 15px 0;
  margin-bottom: 25px;
  background: #342457;
  align-items: center;
  border-radius: 15px;
`;

export const ModalText = styled.Text`
  color: #d7d7d7;
  font-size: 18px;
`;

export const ModalCloseIcon = styled.TouchableOpacity`
  position: absolute;
  top: -60px;
  right: 25px;
  padding: 8px;
`;
