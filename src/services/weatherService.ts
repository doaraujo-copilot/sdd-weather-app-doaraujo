import type { City, CurrentWeather, ForecastDay, WeatherData } from '../types/weather';
import { getWeatherLabel } from '../utils/weatherCodes';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const REQUEST_TIMEOUT_MS = 10000;

/** Erro tipado lançado pelo weatherService com mensagem amigável para o usuário. */
export class WeatherServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WeatherServiceError';
  }
}

/** Dispara um fetch com timeout de 10s, convertendo AbortError e falhas de rede em WeatherServiceError. */
async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new WeatherServiceError('A requisição demorou demais.');
    }
    throw new WeatherServiceError('Falha de rede.');
  } finally {
    clearTimeout(timeoutId);
  }
}

interface GeocodingApiResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface GeocodingApiResponse {
  results?: GeocodingApiResult[];
}

function mapCity(result: GeocodingApiResult): City {
  return {
    id: result.id,
    name: result.name,
    country: result.country,
    state: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

/** Busca cidades pelo nome usando a API de geocoding da Open-Meteo. */
export async function searchCities(name: string): Promise<City[]> {
  const trimmedName = name.trim();
  if (!trimmedName) {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(trimmedName)}&count=5&language=pt&format=json`;

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError('Não foi possível buscar cidades. Tente novamente mais tarde.');
  }

  const data: GeocodingApiResponse = await response.json();
  return (data.results ?? []).map(mapCity);
}

interface ForecastApiResponse {
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    precipitation?: number;
    weather_code: number;
  };
  daily?: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weather_code: number[];
    precipitation_probability_max?: (number | null)[];
  };
}

function mapCurrent(current: NonNullable<ForecastApiResponse['current']>): CurrentWeather {
  return {
    time: current.time,
    temperature: current.temperature_2m,
    apparentTemperature: current.apparent_temperature,
    weatherCode: current.weather_code,
    weatherLabel: getWeatherLabel(current.weather_code),
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    precipitation: current.precipitation,
  };
}

function mapForecast(daily: NonNullable<ForecastApiResponse['daily']>): ForecastDay[] {
  return daily.time.slice(0, 5).map((date, index) => ({
    date,
    minTemp: daily.temperature_2m_min[index],
    maxTemp: daily.temperature_2m_max[index],
    weatherCode: daily.weather_code[index],
    weatherLabel: getWeatherLabel(daily.weather_code[index]),
    precipitationProbability: daily.precipitation_probability_max?.[index] ?? 0,
  }));
}

/** Busca o clima atual e a previsão de 5 dias para a cidade informada. */
export async function getWeather(city: City): Promise<WeatherData> {
  const url =
    `${FORECAST_URL}?latitude=${city.latitude}&longitude=${city.longitude}` +
    '&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code' +
    '&daily=weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max' +
    '&timezone=auto';

  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    throw new WeatherServiceError(
      'Não foi possível obter os dados do clima. Tente novamente mais tarde.',
    );
  }

  const data: ForecastApiResponse = await response.json();

  if (!data.current || !data.daily) {
    throw new WeatherServiceError('Resposta incompleta do serviço de clima.');
  }

  return {
    city,
    current: mapCurrent(data.current),
    forecast: mapForecast(data.daily),
    unit: 'celsius',
  };
}
