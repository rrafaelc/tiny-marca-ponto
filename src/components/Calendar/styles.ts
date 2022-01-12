import styled, { css } from 'styled-components/native';

type DayProps = {
  available: boolean;
  active?: boolean;
  isLastRow?: boolean;
};

export const Container = styled.View`
  width: 302px;
  padding: 10px;
  padding-top: 5px;

  border-radius: 30px;
  background-color: rgba(18, 6, 44, 0.7);

  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  margin-bottom: 5px;
`;

export const Day = styled.View<DayProps>`
  margin-top: 5px;
  width: 36px;
  height: 36px;
  border-radius: 10px;

  justify-content: center;
  align-items: center;

  background-color: ${({ available }) =>
    available ? 'rgba(41, 150, 71, 0.75)' : 'rgba(222,78,78,1)'};

  ${({ isLastRow }) =>
    /* There is no gap in react native to use correctly */
    isLastRow &&
    css`
      margin-right: 5px;
    `};
`;

export const LastRowDay = styled.View`
  /* margin-top: 5px; */
  flex-direction: row;
  /* margin-right: 5px; */
`;

export const DayText = styled.Text`
  font-size: 12px;
`;

export const HourText = styled.Text`
  font-size: 12px;
`;
