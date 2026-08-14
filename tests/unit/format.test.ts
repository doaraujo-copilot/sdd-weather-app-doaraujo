import { describe, expect, it } from 'vitest';

import { getDayLabel, getShortDate } from '../../src/lib/format';

describe('getDayLabel', () => {
  it('retorna "Hoje" para o índice 0', () => {
    expect(getDayLabel(0, '2026-08-14')).toBe('Hoje');
  });

  it('retorna "Amanhã" para o índice 1', () => {
    expect(getDayLabel(1, '2026-08-15')).toBe('Amanhã');
  });

  it('retorna o dia da semana em pt-BR para os demais índices', () => {
    const label = getDayLabel(2, '2026-08-16');
    expect(label).toBe(
      new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(new Date('2026-08-16')),
    );
  });

  it('retorna fallback seguro para data inválida em índice além de Hoje/Amanhã', () => {
    expect(getDayLabel(3, 'data-invalida')).toBe('Dia');
  });
});

describe('getShortDate', () => {
  it('formata a data ISO em "dd/mm"', () => {
    const expected = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(
      new Date('2026-08-14'),
    );
    expect(getShortDate('2026-08-14')).toBe(expected);
  });

  it('retorna fallback para data inválida', () => {
    expect(getShortDate('data-invalida')).toBe('--/--');
  });

  it('retorna fallback para string vazia', () => {
    expect(getShortDate('')).toBe('--/--');
  });
});
