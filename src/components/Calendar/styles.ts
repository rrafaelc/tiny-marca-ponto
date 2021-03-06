import { rgba } from 'polished';
import styled, { css } from 'styled-components/native';

interface IContainerProps {
  loading: boolean;
}

interface IDayProps {
  isAvailable: boolean;
  isActive?: boolean;
  isLastRow?: boolean;
}

export const Container = styled.View<IContainerProps>`
  width: 302px;
  padding: 10px;
  padding-top: 5px;

  border-radius: 30px;
  background-color: ${rgba('#12062c', 0.7)};

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  ${({ loading }) =>
    loading &&
    css`
      justify-content: center;
      height: 220px;
    `}

  margin-bottom: 5px;
`;

export const Loading = styled.View`
  height: 100%;
  justify-content: center;
`;

export const Day = styled.TouchableOpacity<IDayProps>`
  margin-top: 5px;
  width: 36px;
  height: 36px;
  border-radius: 10px;

  justify-content: center;
  align-items: center;

  background-color: ${({ isAvailable }) =>
    isAvailable ? rgba('#299647', 0.75) : '#DE4E4E'};

  ${({ isLastRow }) =>
    /* There is no gap in react native to use correctly */
    isLastRow &&
    css`
      margin-right: 5px;
    `};

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: transparent;
      border: 1px solid #299647;
    `};
`;

export const LastRowDay = styled.View`
  flex-direction: row;
`;

export const DayText = styled.Text`
  font-size: 12px;
  color: #d7d7d7;
`;

export const HourText = styled.Text`
  font-size: 12px;
  color: #d7d7d7;
`;
