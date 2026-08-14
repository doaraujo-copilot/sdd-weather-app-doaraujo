import { useCallback, useRef, useState } from 'react';

import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty' | 'selecting';

interface UseWeatherResult {
  status: WeatherStatus;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  query: string;
  search: (name: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

type LastOperation = { type: 'search'; name: string } | { type: 'selectCity'; city: City } | null;

// Centraliza a conversão de erro para mensagem de UI, evitando duplicação entre operações.
function resolveErrorMessage(err: unknown): string {
  return err instanceof WeatherServiceError ? err.message : 'Falha de rede.';
}

export function useWeather(): UseWeatherResult {
  const [status, setStatus] = useState<WeatherStatus>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // Guarda a última operação para permitir refazê-la via retry().
  const lastOperationRef = useRef<LastOperation>(null);

  const loadCityWeather = useCallback(async (city: City) => {
    lastOperationRef.current = { type: 'selectCity', city };
    setStatus('loading');
    setError(null);

    try {
      const weather = await getWeather(city);
      setData(weather);
      setStatus('success');
    } catch (err) {
      setError(resolveErrorMessage(err));
      setStatus('error');
    }
  }, []);

  const search = useCallback(
    async (name: string) => {
      setQuery(name);
      lastOperationRef.current = { type: 'search', name };
      setStatus('loading');
      setError(null);

      try {
        const results = await searchCities(name);
        setCities(results);

        if (results.length === 0) {
          setStatus('empty');
          return;
        }

        if (results.length === 1) {
          await loadCityWeather(results[0]);
          return;
        }

        setStatus('selecting');
      } catch (err) {
        setError(resolveErrorMessage(err));
        setStatus('error');
      }
    },
    [loadCityWeather],
  );

  const selectCity = useCallback(
    async (city: City) => {
      await loadCityWeather(city);
    },
    [loadCityWeather],
  );

  const retry = useCallback(async () => {
    const lastOperation = lastOperationRef.current;
    if (!lastOperation) {
      return;
    }

    if (lastOperation.type === 'search') {
      await search(lastOperation.name);
    } else {
      await loadCityWeather(lastOperation.city);
    }
  }, [search, loadCityWeather]);

  return { status, data, cities, error, query, search, selectCity, retry };
}
