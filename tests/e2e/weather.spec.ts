import { expect, type Page, test } from '@playwright/test';

const geocodingResponse = {
  results: [
    {
      id: 1,
      name: 'Curitiba',
      country: 'Brazil',
      admin1: 'Paraná',
      latitude: -25.43,
      longitude: -49.27,
      timezone: 'America/Sao_Paulo',
    },
  ],
};

const forecastResponse = {
  current: {
    time: '2026-08-14T12:00',
    temperature_2m: 0,
    apparent_temperature: -2,
    relative_humidity_2m: 60,
    wind_speed_10m: 10,
    precipitation: 0,
    weather_code: 0,
  },
  daily: {
    time: ['2026-08-14', '2026-08-15', '2026-08-16', '2026-08-17', '2026-08-18'],
    temperature_2m_min: [10, 11, 12, 13, 14],
    temperature_2m_max: [20, 21, 22, 23, 24],
    weather_code: [0, 1, 2, 3, 61],
    precipitation_probability_max: [0, 10, 20, 30, 40],
  },
};

// Registra explicitamente os mocks de rede para o teste, sem depender de precedência
// implícita entre rotas registradas em hooks compartilhados.
async function mockOpenMeteo(
  page: Page,
  options: { geocoding?: unknown; forecast?: unknown } = {},
) {
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    await route.fulfill({ json: options.geocoding ?? geocodingResponse });
  });

  await page.route('**/api.open-meteo.com/v1/forecast**', async (route) => {
    await route.fulfill({ json: options.forecast ?? forecastResponse });
  });
}

async function searchCity(page: Page, cityName: string) {
  const searchForm = page.getByRole('search', { name: 'Busca por cidade' });
  await searchForm.getByLabel('Buscar cidade').fill(cityName);
  await searchForm.getByRole('button', { name: 'Buscar' }).click();
}

test('busca cidade, exibe clima atual, previsão de 5 dias e converte unidade', async ({ page }) => {
  await mockOpenMeteo(page);
  await page.goto('/');

  await searchCity(page, 'Curitiba');

  const currentWeather = page.getByRole('region', { name: 'Curitiba' });
  await expect(page.getByRole('heading', { name: 'Curitiba' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toBeVisible();
  await expect(currentWeather.getByText('0°C')).toBeVisible();

  await page.getByRole('button', { name: 'Unidade °F' }).click();

  await expect(currentWeather.getByText('32°F')).toBeVisible();
});

test('exibe "Nenhuma cidade encontrada" quando o geocoding retorna sem results', async ({
  page,
}) => {
  await mockOpenMeteo(page, { geocoding: {} });
  await page.goto('/');

  await searchCity(page, 'Cidade Inexistente');

  await expect(page.getByText('Nenhuma cidade encontrada')).toBeVisible();
});

test('permite selecionar manualmente uma cidade quando o geocoding retorna múltiplos resultados', async ({
  page,
}) => {
  await mockOpenMeteo(page, {
    geocoding: {
      results: [
        { ...geocodingResponse.results[0], id: 1, name: 'Curitiba' },
        { ...geocodingResponse.results[0], id: 2, name: 'Curitiba', admin1: 'Goiás' },
      ],
    },
  });
  await page.goto('/');

  await searchCity(page, 'Curitiba');

  const selectionRegion = page.getByRole('region', { name: 'Selecione uma cidade' });
  await expect(selectionRegion).toBeVisible();
  await expect(selectionRegion.getByRole('button', { name: /Goiás/ })).toBeVisible();

  await selectionRegion.getByRole('button', { name: /Goiás/ }).click();

  await expect(page.getByRole('heading', { name: 'Curitiba' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toBeVisible();
});

test('busca com acentos, hífen, apóstrofo e espaços extras encontra a cidade normalmente', async ({
  page,
}) => {
  let requestedUrl = '';
  await mockOpenMeteo(page);
  await page.route('**/geocoding-api.open-meteo.com/v1/search**', async (route) => {
    requestedUrl = route.request().url();
    await route.fulfill({ json: geocodingResponse });
  });

  await page.goto('/');

  await searchCity(page, "  São Paulo - Zona Sul d'Oeste  ");

  await expect(page.getByRole('heading', { name: 'Curitiba' })).toBeVisible();

  const requestedName = new URL(requestedUrl).searchParams.get('name');
  expect(requestedName).toBe("São Paulo - Zona Sul d'Oeste");
});

test.describe('viewport mobile', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('fluxo principal de busca renderiza o clima corretamente no mobile', async ({ page }) => {
    await mockOpenMeteo(page);
    await page.goto('/');

    await searchCity(page, 'Curitiba');

    const currentWeather = page.getByRole('region', { name: 'Curitiba' });
    await expect(page.getByRole('heading', { name: 'Curitiba' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Previsão de 5 dias' })).toBeVisible();
    await expect(currentWeather.getByText('0°C')).toBeVisible();
  });
});
