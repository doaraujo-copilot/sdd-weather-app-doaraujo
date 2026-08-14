import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import CurrentWeather from '../../src/components/CurrentWeather';
import UnitToggle from '../../src/components/UnitToggle';
import type { City, CurrentWeather as CurrentWeatherType, Unit } from '../../src/types/weather';

const city: City = {
  id: 1,
  name: 'São Paulo',
  country: 'Brazil',
  latitude: -23.55,
  longitude: -46.63,
};

const current: CurrentWeatherType = {
  time: '2026-08-14T12:00:00',
  temperature: 0,
  weatherCode: 0,
  weatherLabel: 'Céu limpo',
};

function UnitAwareWeather() {
  const [unit, setUnit] = useState<Unit>('celsius');

  return (
    <div>
      <UnitToggle unit={unit} onChange={setUnit} />
      <CurrentWeather city={city} current={current} unit={unit} />
    </div>
  );
}

describe('Conversão de unidade (UnitToggle + CurrentWeather)', () => {
  it('exibe 32° ao alternar para °F com temperatura de 0°C', async () => {
    const user = userEvent.setup();
    render(<UnitAwareWeather />);

    expect(screen.getByText('0°C')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unidade °F' }));

    expect(screen.getByText('32°F')).toBeInTheDocument();
  });
});
