import styled from 'styled-components/native';
import { rgba } from 'polished';
import { FlatList, ScrollView } from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
`;

export const ArrowIcon = styled.TouchableOpacity`
  position: absolute;
  top: 15px;
  left: 15px;
`;

export const ContainerDays = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const DayTextTitle = styled.Text`
  font-size: 18px;
  color: #d7d7d7;
  margin-bottom: 20px;
`;

export const ContainerList = styled.View`
  height: 200px;
  padding: 20px;

  align-items: center;
  justify-content: center;

  border-radius: 10px;
  background: ${rgba('#12062C', 0.9)};
`;

export const DateList = styled.FlatList.attrs(
  () => ({}),
)`` as unknown as typeof FlatList;

export const Hour = styled.View`
  margin-bottom: 20px;
  flex-direction: row;
`;

export const HourText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #d7d7d7;

  margin: 0 15px;
`;

export const ButtonEditHour = styled.TouchableOpacity``;

export const CheckIcon = styled.TouchableOpacity`
  position: absolute;
  bottom: 15px;

  padding: 15px;
  background: #299647;
  border-radius: 50px;
`;
