interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Não foi possível carregar o clima',
  message = 'Tente novamente em instantes.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[220px] w-full items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-center shadow-lg shadow-slate-950/20 backdrop-blur-md"
    >
      <div className="flex max-w-md flex-col items-center gap-4 text-slate-100">
        <div className="text-4xl" aria-hidden="true">
          ⚠️
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-300">{message}</p>
        </div>

        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-night-900"
          >
            Tentar novamente
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ErrorState;
