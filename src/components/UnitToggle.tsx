import type { KeyboardEvent } from 'react';

import type { Unit } from '../types/weather';

interface UnitToggleProps {
  unit: Unit;
  onChange: (unit: Unit) => void;
}

const options: Array<{ value: Unit; label: string }> = [
  { value: 'celsius', label: '°C' },
  { value: 'fahrenheit', label: '°F' },
];

export function UnitToggle({ unit, onChange }: UnitToggleProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, value: Unit) => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      onChange(value);
    }
  };

  return (
    <div
      role="group"
      aria-label="Unidade de temperatura"
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md shadow-lg shadow-slate-950/20"
    >
      {options.map((option) => {
        const isActive = option.value === unit;

        return (
          <button
            key={option.value}
            type="button"
            aria-label={`Unidade ${option.label}`}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            onKeyDown={(event) => handleKeyDown(event, option.value)}
            className={[
              'min-w-12 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-night-900',
              isActive
                ? 'bg-accent-500/25 text-white shadow-sm ring-1 ring-accent-400/60'
                : 'text-slate-200 hover:bg-white/5',
            ].join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default UnitToggle;
