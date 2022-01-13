import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
  flex: 1;
`;

export const ArrowIcon = styled.TouchableOpacity`
  position: absolute;
  top: 15px;
  left: 15px;
`;

export const ContainerDate = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 150px;
`;

export const LastDate = styled.View`
  align-items: center;
  justify-content: center;

  margin-bottom: 10px;
`;

export const LastDateTitle = styled.Text`
  font-size: 14px;
  color: #d7d7d7;
`;

export const DateText = styled.Text`
  font-size: 14px;
  color: #d7d7d7;
`;

export const HourText = styled.Text`
  font-weight: bold;
`;

export const SelectDate = styled.TouchableOpacity`
  padding: 10px;
  border-radius: 10px;
  background: #12062c;

  flex-direction: row;
  align-items: center;

  margin-bottom: 10px;
`;

export const SelectDateText = styled.Text`
  font-size: 14px;
  color: #d7d7d7;
  margin-left: 8px;
`;

export const HourSelected = styled.View`
  padding: 10px;
  border-radius: 10px;
  background: #299647;

  align-items: center;
  justify-content: center;
`;

export const HourSelectedText = styled.Text`
  font-size: 18px;
  color: #d7d7d7;
`;

export const CheckIcon = styled.TouchableOpacity`
  position: absolute;
  bottom: 15px;

  padding: 15px;
  background: #299647;
  border-radius: 50px;
`;
