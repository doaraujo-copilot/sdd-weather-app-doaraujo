import { useState } from 'react';

import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import UnitToggle from './components/UnitToggle';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import { mockWeatherData, type Unit } from './types/weather';

type ViewState = 'idle' | 'loading' | 'empty' | 'error' | 'success';

const defaultWeather = mockWeatherData;

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [status, setStatus] = useState<ViewState>('success');
  const [data, setData] = useState(defaultWeather);

  const handleSearch = (city: string) => {
    const normalized = city.trim().toLowerCase();

    if (!normalized) {
      setStatus('idle');
      return;
    }

    setStatus('loading');

    window.setTimeout(() => {
      if (normalized.includes('erro') || normalized.includes('falha')) {
        setStatus('error');
        return;
      }

      if (normalized.includes('vazio') || normalized.includes('nenhuma')) {
        setStatus('empty');
        return;
      }

      setData({
        ...mockWeatherData,
        city: {
          ...mockWeatherData.city,
          name: city.trim(),
          state: 'São Paulo',
        },
      });
      setStatus('success');
    }, 600);
  };

  const handleRetry = () => {
    setStatus('success');
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-lg shadow-slate-950/30 backdrop-blur-md">
            <p className="text-2xl font-semibold text-white">Busque uma cidade</p>
            <p className="mt-2 text-slate-300">Acompanhe o clima atual e a previsão dos próximos dias.</p>
          </div>
        );
      case 'loading':
        return <LoadingState message="Buscando clima..." />;
      case 'empty':
        return (
          <EmptyState
            title="Nenhuma cidade encontrada"
            hint="Tente buscar por outra cidade ou ajuste o termo da pesquisa."
          />
        );
      case 'error':
        return (
          <ErrorState
            title="Não foi possível carregar o clima"
            message="Verifique sua conexão ou tente novamente em alguns segundos."
            onRetry={handleRetry}
          />
        );
      case 'success':
      default:
        return (
          <div className="space-y-6">
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-night-900 via-night-800 to-night-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500/20 text-xl shadow-inner shadow-accent-500/20">
                ☀️
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400 sm:text-xs">Weather</p>
                <h1 className="text-xl font-semibold text-white">Forecast</h1>
              </div>
            </div>

            <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-end">
              <div className="w-full sm:max-w-xl">
                <SearchBar onSearch={handleSearch} />
              </div>
              <div className="self-start sm:self-auto">
                <UnitToggle unit={unit} onChange={setUnit} />
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8" aria-live="polite" aria-busy={status === 'loading'}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
