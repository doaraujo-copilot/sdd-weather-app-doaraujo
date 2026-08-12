import { type FormEvent, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  disabled = false,
  placeholder = 'Buscar cidade',
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = query.trim();

    if (!trimmedValue || disabled) {
      return;
    }

    onSearch(trimmedValue);
    setQuery('');
  };

  const isSubmitDisabled = disabled || query.trim().length === 0;

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="w-full max-w-xl"
      aria-label="Busca por cidade"
      aria-busy={disabled}
    >
      <label
        htmlFor="city-search"
        className="mb-2 block text-sm font-medium text-slate-200"
      >
        Buscar cidade
      </label>

      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 shadow-lg shadow-slate-950/20 backdrop-blur-md sm:flex-row sm:items-center">
        <input
          id="city-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          aria-label="Buscar cidade"
          aria-describedby="city-search-help"
          className="w-full bg-transparent px-3 py-2.5 text-base text-slate-50 placeholder:text-slate-400 focus:border-transparent focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full rounded-xl border border-accent-400/60 bg-accent-500/20 px-4 py-2.5 text-sm font-semibold text-slate-50 transition hover:bg-accent-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          Buscar
        </button>
      </div>

      <p id="city-search-help" className="mt-2 text-xs text-slate-400">
        Digite o nome da cidade e pressione Enter para pesquisar.
      </p>
    </form>
  );
}

export default SearchBar;
