import { FlatList, ScrollView } from 'react-native';
import styled from 'styled-components/native';

// export const Container = styled.View`
//   padding: 20px 30px 10px 30px;
//   align-items: center;
// `;

// https://github.com/styled-components/styled-components/issues/785
export const Container = styled.ScrollView.attrs(() => ({
  // https://stackoverflow.com/a/62692442
  contentContainerStyle: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
}))`` as unknown as typeof ScrollView;

export const Hour = styled.View`
  width: 250px;
  height: 40px;
  background-color: rgba(86, 19, 143, 0.75);

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
  /* margin-bottom: 20px; */
` as unknown as typeof FlatList;
