import styled from 'styled-components/native';
import { rgba } from 'polished';
import { FlatList } from 'react-native';

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
`;

export const TotalRegisterText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #d7d7d7;
  margin-bottom: 5px;
`;

export const ContainerList = styled.View`
  height: 250px;
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

export const ButtonCreateHour = styled.TouchableOpacity`
  margin-top: 10px;

  background: #299647;
  border-radius: 8px;

  padding: 10px 20px;

  align-items: center;
  justify-content: center;
`;

export const ButtonCreateHourText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #d7d7d7;
`;

export const ButtonEditHour = styled.TouchableOpacity`
  flex-direction: row;
  margin-right: 20px;
`;

export const ButtonDeleteHour = styled.TouchableOpacity``;

export const ConfirmationContainer = styled.TouchableOpacity`
  position: absolute;
  bottom: 20px;

  width: 180px;
  padding: 8px 0;
  border: 1px solid #299647;
  border-radius: 15px;

  align-items: center;
`;

export const ConfirmationText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #d7d7d7;
`;
