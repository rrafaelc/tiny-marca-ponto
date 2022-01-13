import styled from 'styled-components/native';
import { FlatList, ScrollView } from 'react-native';
import { rgba } from 'polished';

interface IButtonProps {
  color: string;
}

type IButtonTextProps = IButtonProps;

// https://github.com/styled-components/styled-components/issues/785
export const Container = styled.ScrollView.attrs(() => ({
  // https://stackoverflow.com/a/62692442
  contentContainerStyle: {
    alignItems: 'center',
    // paddingVertical: 20,
    // paddingBottom: 20,
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
  font-size: 18px;
  color: #d7d7d7;
`;

export const Period = styled.View`
  flex-direction: row;
`;

export const PeriodText = styled.Text`
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

export const Button = styled.TouchableOpacity<IButtonProps>`
  width: 100%;
  padding: 10px 0;
  margin-bottom: 20px;
  border-radius: 10px;
  background-color: ${({ color }) => color};

  align-items: center;
`;

export const ButtonText = styled.Text<IButtonTextProps>`
  font-size: 18px;
  color: ${({ color }) => color};
`;

export const ModalContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  justify-content: flex-end;
  align-items: center;
  padding-bottom: 80px;
`;

export const Modal = styled.View`
  background: ${rgba('#12062c', 0.9)};

  width: 219px;
  padding: 15px 0;
  height: 100px;
  border-radius: 10px;

  justify-content: space-between;
  align-items: center;
`;

export const ModalButton = styled.TouchableOpacity`
  width: 150px;
  margin-right: 10px;
  background: #c4c4c4;
  align-items: center;
  padding: 5px 0;
  border-radius: 7px;
`;

export const ModalText = styled.Text`
  color: #000;
  font-size: 14px;
`;

export const ModalCloseIcon = styled.TouchableOpacity`
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 4px;
`;
