import type { Unit } from '../types/weather';

/** Converte uma temperatura em Celsius para a unidade alvo. */
export function convertTemperature(celsius: number, unit: Unit): number {
  if (unit === 'fahrenheit') {
    return (celsius * 9) / 5 + 32;
  }

  return celsius;
}

/** Retorna o símbolo textual da unidade, ex.: "°C" ou "°F". */
export function unitLabel(unit: Unit): string {
  return unit === 'fahrenheit' ? '°F' : '°C';
}

/** Converte, arredonda e formata a temperatura para exibição, ex.: "22°C". */
export function formatTemperature(celsius: number, unit: Unit): string {
  const converted = convertTemperature(celsius, unit);
  return `${Math.round(converted)}${unitLabel(unit)}`;
}
