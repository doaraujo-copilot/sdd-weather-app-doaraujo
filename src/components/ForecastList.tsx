import { useMemo } from 'react';

import type { ForecastDay, Unit } from '../types/weather';
import { ForecastCard } from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

// Instância reutilizada para evitar recriar o formatador a cada cálculo de rótulo.
const weekdayFormatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });

const getDayLabel = (dateString: string) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return 'Dia';
  }

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) {
    return 'Hoje';
  }

  if (isTomorrow) {
    return 'Amanhã';
  }

  return weekdayFormatter.format(date);
};

export function ForecastList({ forecast, unit }: ForecastListProps) {
  // Recalcula os rótulos de dia apenas quando a previsão muda, não a cada troca de unidade.
  const forecastWithLabels = useMemo(
    () => forecast.map((day) => ({ day, label: getDayLabel(day.date) })),
    [forecast],
  );

  return (
    <section className="w-full" aria-label="Previsão de 5 dias">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Próximos dias</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecastWithLabels.map(({ day, label }) => (
          <ForecastCard key={day.date} forecast={day} unit={unit} label={label} />
        ))}
      </div>
    </section>
  );
}

export default ForecastList;
