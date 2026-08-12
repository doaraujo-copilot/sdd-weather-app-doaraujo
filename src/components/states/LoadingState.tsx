interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Carregando clima...' }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[220px] w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-lg shadow-slate-950/20 backdrop-blur-md"
    >
      <div className="flex flex-col items-center gap-3 text-slate-100">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-400 border-t-accent-400" />
        <p className="text-sm font-medium tracking-[0.12em] text-slate-300 uppercase">
          {message}
        </p>
      </div>
    </div>
  );
}

export default LoadingState;
