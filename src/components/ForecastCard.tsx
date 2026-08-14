import type { ForecastDay, Unit } from '../types/weather';

interface ForecastCardProps {
  forecast: ForecastDay;
  unit: Unit;
  label: string;
}

const weatherIcons: Record<number, string> = {
  0: '☀️',
  1: '🌤️',
  2: '⛅',
  3: '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  56: '🌧️',
  57: '🌧️',
  61: '🌦️',
  63: '🌧️',
  65: '🌧️',
  66: '🌧️',
  67: '🌧️',
  71: '🌨️',
  73: '🌨️',
  75: '🌨️',
  77: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  85: '🌨️',
  86: '🌨️',
  95: '⛈️',
  96: '⛈️',
  99: '⛈️',
};

const toDisplayTemperature = (value: number | null | undefined, unit: Unit) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }

  if (unit === 'fahrenheit') {
    return `${Math.round((value * 9) / 5 + 32)}°F`;
  }

  return `${Math.round(value)}°C`;
};

export function ForecastCard({ forecast, unit, label }: ForecastCardProps) {
  const icon =
    (forecast.weatherCode !== null ? weatherIcons[forecast.weatherCode] : undefined) ?? '🌤️';

  const ariaLabel = `${label}: máxima ${toDisplayTemperature(forecast.maxTemp, unit)}, mínima ${toDisplayTemperature(forecast.minTemp, unit)}, probabilidade de chuva ${forecast.precipitationProbability ?? 0}%`;

  return (
    <article
      aria-label={ariaLabel}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-lg shadow-slate-950/20 backdrop-blur-md"
    >
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-300">{label}</p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-3xl" aria-label={forecast.weatherLabel} role="img">
          {icon}
        </span>
        <span className="text-xs rounded-full border border-white/10 bg-slate-950/20 px-2 py-1 text-slate-200">
          {forecast.precipitationProbability ?? 0}% chuva
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-200">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Máx</span>
          <span className="font-semibold text-white">
            {toDisplayTemperature(forecast.maxTemp, unit)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Mín</span>
          <span className="font-semibold text-white">
            {toDisplayTemperature(forecast.minTemp, unit)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ForecastCard;
