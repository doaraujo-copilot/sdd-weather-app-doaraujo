import type { ForecastDay, Unit } from '../types/weather';
import { ForecastCard } from './ForecastCard';

interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

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

  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
};

export function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Próximos dias</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.map((day) => (
          <ForecastCard
            key={day.date}
            forecast={day}
            unit={unit}
            label={getDayLabel(day.date)}
          />
        ))}
      </div>
    </section>
  );
}

export default ForecastList;
