import React, { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';

import { Container } from './styles';

export const Clock = () => {
  const [dateFormatted, setDateFormatted] = useState(
    format(new Date(), 'HH:mm'),
  );

  const formatDate = useCallback(() => format(new Date(), 'HH:mm'), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateFormatted(formatDate);
    }, 1000);

    return () => clearInterval(interval);
  }, [formatDate]);

  return <Container>{dateFormatted}</Container>;
};
