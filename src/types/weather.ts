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
}

export interface ForecastDay {
  date: string; // Data do dia da previsão em formato ISO local.
  minTemp: number; // Temperatura mínima do dia em °C ou °F conforme a unidade.
  maxTemp: number; // Temperatura máxima do dia em °C ou °F conforme a unidade.
  weatherCode: number; // Código de condição climática do dia.
  weatherLabel: string; // Texto legível da condição climática do dia.
}

export interface WeatherData {
  city: City; // Cidade selecionada para a consulta.
  current: CurrentWeather; // Dados do clima atual da cidade.
  forecast: ForecastDay[]; // Previsão para os próximos 5 dias, incluindo o dia atual.
  unit: Unit; // Unidade ativa da apresentação no momento.
}
