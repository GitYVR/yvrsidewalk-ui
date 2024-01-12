import { useMemo } from 'react';
import useSWR from 'swr';

export const enum Currency {
  BONK = 'bonk',
  MATIC = 'matic',
  SOL = 'sol',
  USDC = 'usdc',
}

export function useCurrency() {
  const { data: currency, mutate } = useSWR<Currency>('local:currency', {
    fallbackData: Currency.MATIC,
  });
  return useMemo(
    () => ({
      currency: currency ?? Currency.MATIC,
      setCurrency: mutate,
    }),
    [currency, mutate],
  );
}
