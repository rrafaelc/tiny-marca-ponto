import styled, { css } from 'styled-components/native';

interface IContainerProps {
  selected: boolean;
}

export const Container = styled.TouchableOpacity<IContainerProps>`
  margin-right: 20px;
  width: 88px;
  height: 55px;

  border-radius: 10px;
  border: 1px solid #808080;

  ${({ selected }) =>
    selected &&
    css`
      border-color: #fa0;
    `}

  justify-content: center;
  align-items: center;
`;

export const Text = styled.Text`
  text-transform: capitalize;
  font-size: 14px;
  color: #d7d7d7;
`;
