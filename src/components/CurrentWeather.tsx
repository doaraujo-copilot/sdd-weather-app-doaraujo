import type { City, CurrentWeather as CurrentWeatherType, Unit } from '../types/weather';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherType;
  unit: Unit;
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

const formatMetric = (value?: number, suffix = '') => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '—';
  }

  return `${value}${suffix}`;
};

export function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const icon =
    (current.weatherCode !== null ? weatherIcons[current.weatherCode] : undefined) ?? '🌤️';

  return (
    <section
      aria-labelledby="current-weather-title"
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur-md sm:p-8"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-300 sm:text-sm">
            Clima agora
          </p>
          <h2 id="current-weather-title" className="text-2xl font-semibold text-white sm:text-4xl">
            {city.name}
          </h2>
          <p className="text-sm text-slate-300">
            {city.state ? `${city.state}, ` : ''}
            {city.country}
          </p>
        </div>

        <div className="flex items-center gap-3 text-slate-100">
          <span className="text-5xl sm:text-6xl" aria-label={current.weatherLabel} role="img">
            {icon}
          </span>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Condição</p>
            <p className="text-lg font-medium text-white">{current.weatherLabel}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-[1.3fr_1fr] md:items-end">
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {toDisplayTemperature(current.temperature, unit)}
          </span>
          <span className="pb-3 text-xs uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
            {unit === 'celsius' ? 'Celsius' : 'Fahrenheit'}
          </span>
        </div>

        {current.apparentTemperature !== undefined ? (
          <div className="rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3 text-sm text-slate-200">
            Sensação térmica:{' '}
            <span className="font-semibold text-white">
              {toDisplayTemperature(current.apparentTemperature, unit)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Umidade</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatMetric(current.humidity, '%')}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Vento</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatMetric(current.windSpeed, ' km/h')}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Precipitação</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatMetric(current.precipitation, ' mm')}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pressão</p>
          <p className="mt-2 text-xl font-semibold text-white">
            {formatMetric(current.pressure, ' hPa')}
          </p>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;
