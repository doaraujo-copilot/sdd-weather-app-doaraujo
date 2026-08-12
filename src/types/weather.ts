export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number; // Identificador único da cidade retornado pela API de geocodificação.
  name: string; // Nome da cidade.
  country: string; // País da localização.
  state?: string; // Estado, província ou região administrativa, quando disponível.
  latitude: number; // Latitude da cidade para consulta do clima.
  longitude: number; // Longitude da cidade para consulta do clima.
  timezone?: string; // Fuso horário local da cidade, quando informado pela API.
}

export interface CurrentWeather {
  time: string; // Horário UTC da observação atual.
  temperature: number; // Temperatura atual em °C ou °F conforme a unidade selecionada.
  apparentTemperature?: number; // Sensação térmica, quando disponível.
  weatherCode: number; // Código de condição climática da Open-Meteo.
  weatherLabel: string; // Texto legível para a condição climática.
  humidity?: number; // Umidade relativa do ar em porcentagem.
  windSpeed?: number; // Velocidade do vento em km/h, quando disponível.
  precipitation?: number; // Precipitação acumulada em mm, quando disponível.
  pressure?: number; // Pressão atmosférica em hPa, quando disponível.
}

export interface ForecastDay {
  date: string; // Data do dia da previsão em formato ISO local.
  minTemp: number; // Temperatura mínima do dia em °C ou °F conforme a unidade.
  maxTemp: number; // Temperatura máxima do dia em °C ou °F conforme a unidade.
  weatherCode: number; // Código de condição climática do dia.
  weatherLabel: string; // Texto legível da condição climática do dia.
  precipitationProbability?: number; // Probabilidade de chuva em porcentagem.
}

export interface WeatherData {
  city: City; // Cidade selecionada para a consulta.
  current: CurrentWeather; // Dados do clima atual da cidade.
  forecast: ForecastDay[]; // Previsão para os próximos 5 dias, incluindo o dia atual.
  unit: Unit; // Unidade ativa da apresentação no momento.
}

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    country: 'Brazil',
    state: 'São Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo',
  },
  unit: 'celsius',
  current: {
    time: '2026-08-12T14:00:00-03:00',
    temperature: 27,
    apparentTemperature: 29,
    weatherCode: 1,
    weatherLabel: 'Ensolarado',
    humidity: 62,
    windSpeed: 12,
  },
  forecast: [
    {
      date: '2026-08-12',
      minTemp: 20,
      maxTemp: 28,
      weatherCode: 1,
      weatherLabel: 'Ensolarado',
      precipitationProbability: 12,
    },
    {
      date: '2026-08-13',
      minTemp: 19,
      maxTemp: 27,
      weatherCode: 2,
      weatherLabel: 'Parcialmente nublado',
      precipitationProbability: 22,
    },
    {
      date: '2026-08-14',
      minTemp: 18,
      maxTemp: 25,
      weatherCode: 3,
      weatherLabel: 'Nublado',
      precipitationProbability: 38,
    },
    {
      date: '2026-08-15',
      minTemp: 17,
      maxTemp: 24,
      weatherCode: 61,
      weatherLabel: 'Possibilidade de chuva',
      precipitationProbability: 58,
    },
    {
      date: '2026-08-16',
      minTemp: 18,
      maxTemp: 26,
      weatherCode: 1,
      weatherLabel: 'Ensolarado',
      precipitationProbability: 10,
    },
  ],
};
