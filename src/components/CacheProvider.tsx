import React from 'react';
import { SWRConfig, SWRConfiguration } from 'swr';

type Props = Readonly<{
  children: React.ReactNode;
}>;

const SWR_CONFIG = {
  fetcher(...args: Parameters<typeof fetch>) {
    return fetch(...args).then((res) => res.json());
  },
} as SWRConfiguration;

export default function CacheProvider({ children }: Props) {
  return <SWRConfig value={SWR_CONFIG}>{children}</SWRConfig>;
}
