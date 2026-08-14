/** Mapeamento dos principais códigos WMO retornados pela Open-Meteo para rótulos em pt-BR. */
const WEATHER_CODE_LABELS: Record<number, string> = {
  0: 'Céu limpo',
  1: 'Ensolarado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa fraca',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  56: 'Garoa congelante fraca',
  57: 'Garoa congelante intensa',
  61: 'Possibilidade de chuva',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  66: 'Chuva congelante fraca',
  67: 'Chuva congelante forte',
  71: 'Neve fraca',
  73: 'Neve moderada',
  75: 'Neve forte',
  77: 'Grãos de neve',
  80: 'Pancadas de chuva fracas',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva violentas',
  85: 'Pancadas de neve fracas',
  86: 'Pancadas de neve fortes',
  95: 'Trovoadas',
  96: 'Trovoadas com granizo fraco',
  99: 'Trovoadas com granizo forte',
};

export function getWeatherLabel(weatherCode: number | null | undefined): string {
  if (weatherCode === null || weatherCode === undefined) {
    return 'Condição não disponível';
  }

  return WEATHER_CODE_LABELS[weatherCode] ?? 'Condição não disponível';
}
