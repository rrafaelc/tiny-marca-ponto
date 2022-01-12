import styled, { css } from 'styled-components/native';

type CircleProps = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export const Container = styled.View`
  flex: 1;
  background-color: #342457;
`;

export const Circle = styled.View<CircleProps>`
  position: absolute;
  background-color: rgba(164, 43, 167, 0.8);
  width: 227px;
  height: 227px;
  border-radius: ${227 / 2}px;

  ${({ top }) =>
    top &&
    css`
      top: ${top}px;
    `}

  ${({ right }) =>
    right &&
    css`
      right: ${right}px;
    `}

  ${({ bottom }) =>
    bottom &&
    css`
      bottom: ${bottom}px;
    `}
    
  ${({ left }) =>
    left &&
    css`
      left: ${left}px;
    `}
`;
