/** Rotula um dia da previsão pela posição: 0 = Hoje, 1 = Amanhã, demais = dia da semana. */
export function getDayLabel(index: number, dateString: string): string {
  if (index === 0) {
    return 'Hoje';
  }

  if (index === 1) {
    return 'Amanhã';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Dia';
  }

  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
}

/** Formata uma data ISO em texto curto "dd/mm", com fallback seguro para entradas inválidas. */
export function getShortDate(dateString: string): string {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '--/--';
  }

  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
}
