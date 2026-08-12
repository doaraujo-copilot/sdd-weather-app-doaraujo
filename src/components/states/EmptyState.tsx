interface EmptyStateProps {
  title?: string;
  hint?: string;
}

export function EmptyState({
  title = 'Nenhuma cidade encontrada',
  hint = 'Tente buscar por outra cidade ou ajuste o termo da pesquisa.',
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] w-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-lg shadow-slate-950/20 backdrop-blur-md">
      <div className="max-w-md space-y-3 text-slate-100">
        <div className="text-4xl" aria-hidden="true">
          🔎
        </div>

        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-300">{hint}</p>
      </div>
    </div>
  );
}

export default EmptyState;
