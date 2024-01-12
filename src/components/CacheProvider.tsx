import React from 'react';
import { Cache, State, SWRConfig, SWRConfiguration } from 'swr';

type Props = Readonly<{
  children: React.ReactNode;
}>;

function localStorageCacheProvider(): Cache {
  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map<string, State<unknown, unknown>>(
    JSON.parse(localStorage.getItem('sidewalk-app-cache') || '[]'),
  );

  // Before unloading the app, we write back all the local data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const localData = Array.from(map.entries()).filter(([key]) =>
      key.startsWith('local:'),
    );
    localStorage.setItem('sidewalk-app-cache', JSON.stringify(localData));
  });

  // We still use the map for write & read for performance.
  return map;
}

const SWR_CONFIG = {
  fetcher(...args: Parameters<typeof fetch>) {
    return fetch(...args).then((res) => res.json());
  },
  provider: localStorageCacheProvider,
} as SWRConfiguration;

export default function CacheProvider({ children }: Props) {
  return <SWRConfig value={SWR_CONFIG}>{children}</SWRConfig>;
}
