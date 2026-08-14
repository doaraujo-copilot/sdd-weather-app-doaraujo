import { useEffect, useRef, useState } from 'react';

import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import UnitToggle from './components/UnitToggle';
import { useWeather } from './hooks/useWeather';
import type { Unit } from './types/weather';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { status, data, cities, error, search, selectCity, retry } = useWeather();
  const resultsRef = useRef<HTMLElement>(null);

  // Move o foco para a região de resultados assim que uma busca termina,
  // para que usuários de teclado e leitor de tela percebam o novo conteúdo.
  useEffect(() => {
    if (
      status === 'success' ||
      status === 'empty' ||
      status === 'error' ||
      status === 'selecting'
    ) {
      resultsRef.current?.focus();
    }
  }, [status]);

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-lg shadow-slate-950/30 backdrop-blur-md">
            <p className="text-2xl font-semibold text-white">Busque uma cidade</p>
            <p className="mt-2 text-slate-300">
              Acompanhe o clima atual e a previsão dos próximos dias.
            </p>
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
      case 'selecting':
        return (
          <section
            aria-label="Selecione uma cidade"
            className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-slate-950/30 backdrop-blur-md sm:p-6"
          >
            <h2 className="text-lg font-semibold text-white">Encontramos mais de uma cidade</h2>
            <p className="mt-1 text-sm text-slate-300">
              Escolha a cidade correta para ver o clima.
            </p>

            <ul className="mt-4 space-y-2">
              {cities.map((city) => (
                <li key={city.id}>
                  <button
                    type="button"
                    onClick={() => selectCity(city)}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/20 px-4 py-3 text-left text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900"
                  >
                    <span className="font-semibold text-white">{city.name}</span>
                    <span className="block text-sm text-slate-400">
                      {city.state ? `${city.state}, ` : ''}
                      {city.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      case 'error':
        return (
          <ErrorState
            title="Não foi possível carregar o clima"
            message={error ?? 'Verifique sua conexão ou tente novamente em alguns segundos.'}
            onRetry={retry}
          />
        );
      case 'success':
        return data ? (
          <div className="space-y-6">
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList forecast={data.forecast} unit={unit} />
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-night-900 via-night-800 to-night-900 text-slate-100">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500/20 text-xl shadow-inner shadow-accent-500/20"
              >
                ☀️
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Weather</p>
                <h1 className="text-xl font-semibold text-white">Forecast</h1>
              </div>
            </div>

            <div className="flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-end">
              <div className="w-full sm:max-w-xl">
                <SearchBar onSearch={search} disabled={status === 'loading'} />
              </div>
              <div className="self-start sm:self-auto">
                <UnitToggle unit={unit} onChange={setUnit} />
              </div>
            </div>
          </div>
        </header>

        <main
          ref={resultsRef}
          tabIndex={-1}
          className="mt-8 focus:outline-none"
          aria-live="polite"
          aria-busy={status === 'loading'}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
