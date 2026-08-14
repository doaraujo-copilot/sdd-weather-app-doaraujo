import { describe, expect, it } from 'vitest';

import { getWeatherLabel } from '../../src/lib/weatherCodes';

describe('getWeatherLabel', () => {
  it('retorna o rótulo em pt-BR para códigos conhecidos', () => {
    expect(getWeatherLabel(0)).toBe('Céu limpo');
    expect(getWeatherLabel(1)).toBe('Ensolarado');
    expect(getWeatherLabel(61)).toBe('Possibilidade de chuva');
    expect(getWeatherLabel(95)).toBe('Trovoadas');
  });

  it('retorna fallback para código desconhecido', () => {
    expect(getWeatherLabel(9999)).toBe('Condição não disponível');
  });

  it('retorna fallback para código negativo ou fora do catálogo', () => {
    expect(getWeatherLabel(-1)).toBe('Condição não disponível');
  });
});
