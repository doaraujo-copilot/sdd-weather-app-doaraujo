# Plano Técnico — Weather App

## Architecture

A aplicação será implementada como uma SPA (Single Page Application) em React + Vite, com arquitetura simples e orientada a responsabilidades. O principal fluxo será:

1. Usuário informa uma cidade na busca.
2. A aplicação valida a entrada e dispara a consulta de geocodificação.
3. A API retorna cidades possíveis e a interface exibe os resultados.
4. O usuário seleciona a cidade desejada.
5. O front-end dispara duas consultas paralelas: clima atual e previsão de 5 dias.
6. A interface renderiza o estado correspondente: loading, sucesso ou erro.
7. O usuário pode alternar a unidade de temperatura em qualquer momento.

A arquitetura de domínio será mínima e enxuta:
- UI layer: componentes React que renderizam estado e interações.
- Service layer: acesso à API e normalização dos dados.
- Utils layer: conversão de temperatura, formatadores e validadores.
- State layer: estado local da aplicação e estados de carregamento/error.

Não haverá backend no MVP. O cliente acessa a Open-Meteo diretamente e a aplicação assume responsabilidade pelo tratamento de erro e fallback.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest + Testing Library
- Playwright (para testes E2E)
- Open-Meteo API

Decisões de arquitetura:
- Sem backend no MVP.
- Sem autenticação.
- Sem persistência server-side.
- UI em pt-BR.
- Unidade padrão Celsius.
- Foco principal em mobile-first.

## Project Structure

A estrutura sugerida será:

- src/
  - components/
    - SearchForm.tsx
    - CityResults.tsx
    - WeatherCurrent.tsx
    - WeatherForecast.tsx
    - TemperatureToggle.tsx
    - ErrorBanner.tsx
    - LoadingState.tsx
  - hooks/
    - useWeatherSearch.ts
    - useWeatherByCity.ts
  - services/
    - weatherApi.ts
    - geocodingApi.ts
  - types/
    - weather.ts
    - geocoding.ts
  - utils/
    - temperature.ts
    - formatters.ts
    - validation.ts
  - app/
    - App.tsx
  - styles/
    - globals.css

Observações:
- O objetivo é manter cada componente com responsabilidade única.
- Lógica de API fica isolada em services.
- A conversão de temperatura e validações ficam em utils.

## Data Model

### 1) Cidade
```ts
interface CitySearchResult {
  id: string;
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}
```

### 2) Clima atual
```ts
interface CurrentWeather {
  temperatureC: number;
  temperatureF?: number;
  conditionCode: number;
  conditionLabel: string;
  feelsLikeC?: number;
  humidity?: number;
  windSpeed?: number;
  timestamp: string;
}
```

### 3) Previsão diária
```ts
interface DailyForecast {
  date: string;
  temperatureMinC: number;
  temperatureMaxC: number;
  conditionCode: number;
  conditionLabel: string;
  temperatureMinF?: number;
  temperatureMaxF?: number;
}
```

### 4) Estado de UI
```ts
type TemperatureUnit = 'C' | 'F';

type WeatherState =
  | { status: 'idle' }
  | { status: 'loading'; message?: string }
  | { status: 'success'; city: CitySearchResult; current: CurrentWeather; forecast: DailyForecast[] }
  | { status: 'empty'; message: string }
  | { status: 'error'; message: string };
```

## Data Flow

### Fluxo principal
1. Usuário digita entrada em SearchForm.
2. SearchForm normaliza a string e valida se é vazia.
3. Se a entrada for válida, dispara a demanda de geocodificação.
4. O serviço retorna uma lista de cidades possíveis.
5. O componente exibe os resultados.
6. O usuário escolhe uma cidade.
7. O app dispara a consulta do clima atual e da previsão de 5 dias.
8. Os dados are normalized and mapped to local types.
9. A UI renderiza os estados: loading, error, empty ou success.
10. Quando a unidade muda, o app recalcula temperaturas em tela sem reconsultar a API.

### Fluxo de erro
- Input vazio: bloqueia a busca e exibe mensagem de validação.
- API falha: exibe banner com retry.
- Geocoding sem resultado: exibe “Nenhuma cidade encontrada”.
- Resposta parcial: renderiza o que foi fornecido e usa fallback para campos ausentes.

## External APIs

### Open-Meteo Geocoding API
Objetivo: buscar cidades a partir do texto digitado.

Contrato esperado:
```ts
interface GeocodingApiResponse {
  results?: Array<{
    id: number;
    name: string;
    country: string;
    state?: string;
    latitude: number;
    longitude: number;
    timezone?: string;
  }>;
}
```

### Open-Meteo Forecast API
Objetivo: obter clima atual e previsão para uma coordenada.

Contrato esperado:
```ts
interface ForecastApiResponse {
  current?: {
    temperature_2m: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    weather_code: number;
    time: string;
  };
  daily?: {
    time: string[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    weather_code: number[];
  };
}
```

Regras de integração:
- Sem API key.
- Requisições via client-side.
- Timeout de 5 segundos por requisição.
- Fallback para mensagem amigável em caso de falha.

## State Management

O MVP não requer biblioteca de estado global. A gestão de estado será local e simples:

- useState para dados da cidade ativa, clima atual e previsão.
- useEffect para disparar consultas quando a cidade selecionada mudar.
- Estado derivado para unidade e estados de carregamento/erro.

Estrutura de estado resumida:
```ts
interface WeatherContextState {
  selectedCity: CitySearchResult | null;
  temperatureUnit: TemperatureUnit;
  weatherState: WeatherState;
  searchQuery: string;
  searchResults: CitySearchResult[];
}
```

Por simplicidade, evitaremos Redux/Zustand no MVP. O estado permanece centralizado em um componente principal ou em hooks específicos.

## Error Handling

A aplicação deve tratar erros de forma explícita e sem quebrar a UI.

### Cenários de erro
- Input vazio
- Cidade inexistente
- API indisponível
- Timeout
- Resposta parcial
- Dados ausentes em propriedades esperadas

### Estratégia
- Validar entrada antes da requisição.
- Fallback para mensagens de erro curtas e amigáveis.
- Mostrar loader durante a requisição.
- Mostrar redirecionamento de UI nada mais para um estado vazio sem dados.
- Em caso de nova tentativa, limpar apenas o estado de erro e manter a última cidade válida se houver.

### Contratos de erro
```ts
interface ApiError {
  code: 'INVALID_INPUT' | 'NOT_FOUND' | 'TIMEOUT' | 'NETWORK' | 'UNKNOWN';
  message: string;
}
```

## Testing Strategy

### Unit tests
Cobrir lógica pura e transformações:
- validação de input de busca,
- conversão Celsius/Fahrenheit,
- formatação de data e temperatura,
- normalização de campos incompletos.

### Component tests
Cobrir os estados principais da UI:
- loading,
- empty,
- error,
- success,
- troca de unidade,
- responsividade básica.

### E2E tests
Cobrir jornada principal:
1. Usuário busca por uma cidade válida.
2. Seleciona cidade.
3. Visualiza clima atual.
4. Visualiza previsão de 5 dias.
5. Alterna para Fahrenheit.
6. Valida estados de erro e ausência de resultado.

Estratégia de prioridade:
- primeiro: busca → seleção → clima → previsão,
- depois: erro e empty states,
- por fim: responsividade mobile.

## Risks & Trade-offs

### Risco principal: dependência da API externa
A aplicação depende da Open-Meteo para dados. Qualquer falha de rede ou mudança de contrato pode afetar diretamente o usuário.

Mitigação:
- timeout configurado,
- fallback de erro,
- validação defensiva,
- cache local de última consulta.

### Trade-off: simplicidade x extensibilidade
A decisão de manter o MVP sem backend e sem biblioteca de estado global reduz complexidade e tempo de entrega. O custo é menos escalabilidade para cenários mais avançados no futuro, como favoritos, histórico e autenticação.

### Trade-off: mobile-first x desktop polish
A interface prioriza mobile-first, o que reduz a complexidade de layout em telas pequenas, mas exige atenção para manter a qualidade visual em desktop.

### Trade-off: dados completos x robustez defensiva
A solução prioriza renderização resiliente para respostas parciais, mesmo que isso signifique mostrar valores incompletos em vez de bloquear a interface.
