import { afterEach, describe, expect, it, vi } from 'vitest';

import { getWeather, searchCities, WeatherServiceError } from '../../src/services/weatherService';
import type { City } from '../../src/types/weather';

function jsonResponse(body: unknown, ok = true): Response {
  return {
    ok,
    json: async () => body,
  } as Response;
}

const city: City = {
  id: 1,
  name: 'São Paulo',
  country: 'Brazil',
  latitude: -23.55,
  longitude: -46.63,
};

describe('searchCities', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('não chama fetch para input vazio', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const result = await searchCities('   ');

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('mapeia results da API para City[]', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        results: [
          {
            id: 42,
            name: 'Curitiba',
            country: 'Brazil',
            admin1: 'Paraná',
            latitude: -25.43,
            longitude: -49.27,
            timezone: 'America/Sao_Paulo',
          },
        ],
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await searchCities('Curitiba');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result).toEqual([
      {
        id: 42,
        name: 'Curitiba',
        country: 'Brazil',
        state: 'Paraná',
        latitude: -25.43,
        longitude: -49.27,
        timezone: 'America/Sao_Paulo',
      },
    ]);
  });

  it('retorna [] quando results está ausente', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal('fetch', fetchMock);

    const result = await searchCities('Cidade Inexistente');

    expect(result).toEqual([]);
  });

  it('lança WeatherServiceError em resposta não-ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, false));
    vi.stubGlobal('fetch', fetchMock);

    await expect(searchCities('Curitiba')).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('normaliza e codifica caracteres especiais, acentos e espaços extras na URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ results: [] }));
    vi.stubGlobal('fetch', fetchMock);

    await searchCities("  São Paulo - Zona Sul d'Oeste  ");

    const requestedUrl = fetchMock.mock.calls[0][0] as string;
    expect(requestedUrl).toContain(encodeURIComponent("São Paulo - Zona Sul d'Oeste"));
    expect(requestedUrl).not.toContain('  ');
  });
});

describe('getWeather', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('mapeia current e daily para CurrentWeather e 5 ForecastDay', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        current: {
          time: '2026-08-14T12:00',
          temperature_2m: 25,
          apparent_temperature: 27,
          relative_humidity_2m: 60,
          wind_speed_10m: 10,
          precipitation: 0,
          weather_code: 1,
        },
        daily: {
          time: ['2026-08-14', '2026-08-15', '2026-08-16', '2026-08-17', '2026-08-18'],
          temperature_2m_min: [18, 17, 16, 15, 14],
          temperature_2m_max: [26, 25, 24, 23, 22],
          weather_code: [1, 2, 3, 61, 0],
          precipitation_probability_max: [10, 20, 30, 40, 50],
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await getWeather(city);

    expect(result.city).toBe(city);
    expect(result.current).toMatchObject({
      time: '2026-08-14T12:00',
      temperature: 25,
      apparentTemperature: 27,
      weatherCode: 1,
    });
    expect(result.forecast).toHaveLength(5);
    expect(result.forecast[0]).toMatchObject({
      date: '2026-08-14',
      minTemp: 18,
      maxTemp: 26,
      weatherCode: 1,
      precipitationProbability: 10,
    });
  });

  it('converte precipitação nula para 0', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        current: {
          time: '2026-08-14T12:00',
          temperature_2m: 25,
          weather_code: 1,
        },
        daily: {
          time: ['2026-08-14', '2026-08-15', '2026-08-16', '2026-08-17', '2026-08-18'],
          temperature_2m_min: [18, 17, 16, 15, 14],
          temperature_2m_max: [26, 25, 24, 23, 22],
          weather_code: [1, 2, 3, 61, 0],
          precipitation_probability_max: [null, null, null, null, null],
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await getWeather(city);

    expect(result.forecast.every((day) => day.precipitationProbability === 0)).toBe(true);
  });

  it('lança WeatherServiceError quando current está ausente', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        daily: {
          time: ['2026-08-14'],
          temperature_2m_min: [18],
          temperature_2m_max: [26],
          weather_code: [1],
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });

  it('lança WeatherServiceError quando daily está ausente', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        current: {
          time: '2026-08-14T12:00',
          temperature_2m: 25,
          weather_code: 1,
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(getWeather(city)).rejects.toBeInstanceOf(WeatherServiceError);
  });
});
