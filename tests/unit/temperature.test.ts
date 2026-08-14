import { describe, expect, it } from 'vitest';

import { convertTemperature, formatTemperature, unitLabel } from '../../src/lib/temperature';

describe('convertTemperature', () => {
  it('converte 0°C para 32°F', () => {
    expect(convertTemperature(0, 'fahrenheit')).toBe(32);
  });

  it('converte 100°C para 212°F', () => {
    expect(convertTemperature(100, 'fahrenheit')).toBe(212);
  });

  it('converte -40°C para -40°F', () => {
    expect(convertTemperature(-40, 'fahrenheit')).toBe(-40);
  });

  it('retorna o valor inalterado para celsius', () => {
    expect(convertTemperature(23, 'celsius')).toBe(23);
  });
});

describe('formatTemperature', () => {
  it('arredonda e formata em celsius', () => {
    expect(formatTemperature(22.4, 'celsius')).toBe('22°C');
    expect(formatTemperature(22.6, 'celsius')).toBe('23°C');
  });

  it('arredonda e formata em fahrenheit', () => {
    expect(formatTemperature(0, 'fahrenheit')).toBe('32°F');
    expect(formatTemperature(100, 'fahrenheit')).toBe('212°F');
  });

  it('formata temperaturas negativas corretamente', () => {
    expect(formatTemperature(-40, 'fahrenheit')).toBe('-40°F');
  });
});

describe('unitLabel', () => {
  it('retorna "°C" para celsius', () => {
    expect(unitLabel('celsius')).toBe('°C');
  });

  it('retorna "°F" para fahrenheit', () => {
    expect(unitLabel('fahrenheit')).toBe('°F');
  });
});
