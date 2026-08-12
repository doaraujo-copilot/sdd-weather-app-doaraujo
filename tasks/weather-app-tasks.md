# Backlog de Tarefas — Weather App

Este arquivo consolida as tarefas derivadas do plano técnico em [plans/weather-app-plan.md](../plans/weather-app-plan.md), organizadas na ordem de implementação correta e com dependências explícitas.

> A ordem respeita o fluxo: tipos → funções puras → services → hook → componentes → integração → testes → hardening.

---

## Entrega 1 — Tipos

### T-01 — Definir tipos do domínio
- Tipo: Data
- Descrição curta: Criar o modelo compartilhado da aplicação para cidade, clima atual, previsão e estados de UI.
- Rastreabilidade: FR-03, FR-04, FR-05, FR-06, NFR-05
- Critérios de aceite:
  - `src/types/weather.ts` compila sem erros em TypeScript strict.
  - A modelagem inclui `TemperatureUnit`, `CitySearchResult`, `CurrentWeather`, `DailyForecast` e `WeatherState`.
  - Os campos obrigatórios para busca, status, clima atual e previsão de 5 dias estão presentes e tipados.
- Dependências: —
- Arquivos prováveis: `src/types/weather.ts`

---

## Entrega 2 — Funções puras

### T-02 — Validar entrada de busca
- Tipo: Data
- Descrição curta: Implementar validação pura para texto de busca antes de disparar a requisição de geocoding.
- Rastreabilidade: FR-01, AC-01
- Critérios de aceite:
  - A função recebe uma string e retorna `true` apenas quando o valor após `trim()` contém conteúdo útil.
  - Entrada vazia, `"   "` e `null`/`undefined` são rejeitados antes de qualquer chamada de rede.
  - Testes unitários cobrem os cenários vazios e válidos.
- Dependências: T-01
- Arquivos prováveis: `src/utils/validation.ts`

### T-03 — Converter temperatura
- Tipo: Data
- Descrição curta: Implementar conversão Celsius↔Fahrenheit em função pura e determinística.
- Rastreabilidade: FR-05, AC-05
- Critérios de aceite:
  - `0°C` converte para `32°F` e `100°C` para `212°F`.
  - `-40°C` converte para `-40°F`.
  - A função retorna número consistente e sem efeitos colaterais.
- Dependências: T-01
- Arquivos prováveis: `src/utils/temperature.ts`

### T-04 — Formatar temperatura para renderização
- Tipo: Data
- Descrição curta: Criar utilitário para exibir temperatura com unidade correta e arredondamento consistente.
- Rastreabilidade: FR-05, AC-05
- Critérios de aceite:
  - A função recebe `number` e `unit` e retorna valor formatado em texto legível.
  - O arredondamento usado pela interface é consistente entre Celsius e Fahrenheit.
  - O retorno inclui unidade em texto, por exemplo `"22°C"` ou `"72°F"`.
- Dependências: T-03
- Arquivos prováveis: `src/utils/temperature.ts`

### T-05 — Mapear códigos de clima para rótulos pt-BR
- Tipo: Data
- Descrição curta: Criar catálogo de mapeamento de `weather_code` para texto legível em português.
- Rastreabilidade: FR-03, FR-04, AC-03, AC-04
- Critérios de aceite:
  - A função mapeia o conjunto principal de `weather_code` da Open-Meteo para labels em pt-BR.
  - Códigos não previstos usam fallback explícito, como `"Condição não disponível"`.
  - O comportamento é testável sem renderizar a tela.
- Dependências: T-01
- Arquivos prováveis: `src/utils/weatherCodes.ts`

### T-06 — Formatar datas e labels de previsão
- Tipo: Data
- Descrição curta: Criar utilitários para transformar datas em textos amigáveis para a UI.
- Rastreabilidade: FR-04, AC-04
- Critérios de aceite:
  - O helper converte o dia atual em `Hoje`, o próximo em `Amanhã` e os demais em nomes de dia da semana em pt-BR.
  - A mesma função produz labels consistentes para os cards de previsão.
  - Datas inválidas ou vazias retornam fallback seguro.
- Dependências: T-01
- Arquivos prováveis: `src/utils/formatters.ts`

---

## Entrega 3 — Services

### T-07 — Implementar request de geocoding
- Tipo: Data
- Descrição curta: Encapsular a chamada `fetch` da API de geocoding da Open-Meteo.
- Rastreabilidade: FR-01, AC-01
- Critérios de aceite:
  - A função recebe uma string de busca e dispara requisição com `fetch` para o endpoint público de geocoding.
  - Requisições com input vazio não são disparadas.
  - Falhas de rede, timeout e resposta inválida retornam erro bem definido.
- Dependências: T-02
- Arquivos prováveis: `src/services/geocodingApi.ts`

### T-08 — Normalizar resposta de geocoding
- Tipo: Data
- Descrição curta: Transformar a resposta da API em `CitySearchResult` da aplicação.
- Rastreabilidade: FR-01, FR-02, AC-01, AC-02
- Critérios de aceite:
  - A função converte resultados da API para `CitySearchResult` com `id`, `name`, `country`, `state`, `latitude`, `longitude` e `timezone` quando disponíveis.
  - A lista vazia gera resultado vazio explícito sem quebrar o fluxo.
  - Resultados com campos faltantes continuam sendo aceitos com valores seguros.
- Dependências: T-01, T-07
- Arquivos prováveis: `src/services/geocodingApi.ts`

### T-09 — Implementar request de forecast
- Tipo: Data
- Descrição curta: Encapsular a chamada de API para buscar clima atual e previsão de 5 dias por coordenadas.
- Rastreabilidade: FR-03, FR-04, AC-03, AC-04
- Critérios de aceite:
  - A função recebe latitude e longitude e consulta a endpoint de forecast da Open-Meteo.
  - A resposta inclui `current` e `daily` quando disponível.
  - Requisições falhas retornam erro padronizado sem exceção não tratada.
- Dependências: T-01
- Arquivos prováveis: `src/services/weatherApi.ts`

### T-10 — Normalizar resposta de forecast
- Tipo: Data
- Descrição curta: Mapear a resposta bruta de forecast para `CurrentWeather` e `DailyForecast` do domínio local.
- Rastreabilidade: FR-03, FR-04, AC-03, AC-04
- Critérios de aceite:
  - O mapeamento converte `temperature_2m`, `weather_code`, `time`, `humidity`, `wind_speed_10m` e `apparent_temperature` para os modelos internos.
  - `daily` produz lista de 5 dias no formato interno, cada um com data, min, max e condição.
  - Campos ausentes recebem fallback seguro sem quebrar a UI.
- Dependências: T-01, T-05, T-09
- Arquivos prováveis: `src/services/weatherApi.ts`

---

## Entrega 4 — Hooks

### T-11 — Criar hook de busca por cidade
- Tipo: Data
- Descrição curta: Orquestrar a busca de cidades e o estado de resultados da pesquisa.
- Rastreabilidade: FR-01, FR-02, AC-01, AC-02
- Critérios de aceite:
  - O hook expõe `query`, `results`, `loading` e `error` com estados explícitos.
  - A busca é disparada somente quando a string válida é submetida.
  - Se a API não retorna resultados, o estado de vazio fica acessível para a UI.
- Dependências: T-02, T-07, T-08
- Arquivos prováveis: `src/hooks/useWeatherSearch.ts`

### T-12 — Criar hook de clima por cidade selecionada
- Tipo: Data
- Descrição curta: Carregar clima atual e previsão quando uma cidade é selecionada.
- Rastreabilidade: FR-03, FR-04, FR-05, AC-03, AC-04, AC-05
- Critérios de aceite:
  - O hook recebe a cidade selecionada e dispara a consulta de clima atual e previsão.
  - O estado final é `idle`, `loading`, `success` ou `error` em todas as transições.
  - A troca de unidade não dispara nova chamada de API.
- Dependências: T-10, T-11
- Arquivos prováveis: `src/hooks/useWeatherByCity.ts`

---

## Entrega 5 — Componentes

### T-13 — Construir formulário de busca
- Tipo: UI
- Descrição curta: Criar input e botão para pesquisa de cidade.
- Rastreabilidade: FR-01, AC-01
- Critérios de aceite:
  - O campo possui `label` acessível e `aria-label` equivalente quando necessário.
  - O botão fica desabilitado quando o valor informado é vazio ou só espaços.
  - Ao enviar busca válida, o componente dispara a ação de pesquisa do hook.
- Dependências: T-11
- Arquivos prováveis: `src/components/SearchForm.tsx`

### T-14 — Implementar estado de carregamento
- Tipo: UI
- Descrição curta: Exibir indicador de carregamento para busca e consulta de clima.
- Rastreabilidade: FR-06, AC-06
- Critérios de aceite:
  - O componente aparece quando `loading === true` em qualquer fluxo principal.
  - O texto apresentado comunica claramente que os dados estão sendo carregados.
  - O componente não bloqueia a tela inteira de forma que o usuário não saiba o que está acontecendo.
- Dependências: T-11, T-12
- Arquivos prováveis: `src/components/LoadingState.tsx`

### T-15 — Implementar estado de erro
- Tipo: UI
- Descrição curta: Exibir banner de erro com mensagem amigável e opção de retry.
- Rastreabilidade: FR-06, AC-06, NFR-04
- Critérios de aceite:
  - O componente renderiza mensagem clara para erro de rede, timeout ou busca sem resultado.
  - A ação de retry aparece quando a ação puder ser repetida sem reabrir a interface.
  - O componente não exige que a cidade anterior seja carregada para exibir o erro.
- Dependências: T-11, T-12
- Arquivos prováveis: `src/components/ErrorBanner.tsx`

### T-16 — Implementar estado vazio
- Tipo: UI
- Descrição curta: Exibir estado informativo para ausência de resultado ou dado incompleto.
- Rastreabilidade: FR-01, FR-06, AC-01, AC-06
- Critérios de aceite:
  - O componente aparece quando a busca não encontra cidade ou quando o retorno da API está vazio.
  - A mensagem final é específica: “Nenhuma cidade encontrada” ou equivalente ao contexto.
  - O layout usa o mesmo padrão visual dos outros estados para não quebrar a identidade da UI.
- Dependências: T-11
- Arquivos prováveis: `src/components/EmptyState.tsx`

### T-17 — Exibir clima atual
- Tipo: UI
- Descrição curta: Renderizar o card principal com os dados do clima atual da cidade selecionada.
- Rastreabilidade: FR-03, AC-03
- Critérios de aceite:
  - O card exibe nome da cidade, temperatura atual e condição climática.
  - Caso disponível, exibe sensação térmica, umidade e vento.
  - A temperatura respeita a unidade selecionada no momento do render.
  - Se campos essenciais vierem ausentes, o componente renderiza fallback em vez de quebrar.
- Dependências: T-04, T-05, T-10, T-12
- Arquivos prováveis: `src/components/WeatherCurrent.tsx`

### T-18 — Exibir previsão de 5 dias
- Tipo: UI
- Descrição curta: Renderizar lista de 5 dias com clima diário em sequência.
- Rastreabilidade: FR-04, AC-04
- Critérios de aceite:
  - A lista renderiza 5 registros diários começando no dia atual.
  - Cada item inclui data, mínima, máxima e descrição climática do dia.
  - Todos os valores de temperatura refletem a unidade atual no momento da renderização.
- Dependências: T-06, T-10, T-12
- Arquivos prováveis: `src/components/WeatherForecast.tsx`

### T-19 — Exibir um card de previsão individual
- Tipo: UI
- Descrição curta: Criar componente reutilizável para cada item do card diário.
- Rastreabilidade: FR-04, AC-04
- Critérios de aceite:
  - O componente recebe os dados diários e renderiza data, condições, mínima e máxima.
  - O card não contém lógica de API nem cálculo de conversão; ele apenas apresenta dados.
- Dependências: T-18
- Arquivos prováveis: `src/components/ForecastCard.tsx`

### T-20 — Implementar toggle de unidade
- Tipo: UI
- Descrição curta: Permitir alternância entre Celsius e Fahrenheit durante a sessão.
- Rastreabilidade: FR-05, AC-05
- Critérios de aceite:
  - O controle existe com botão ou switch acessível por mouse e teclado.
  - O clique alterna entre `C` e `F` e atualiza todos os valores visíveis imediatamente.
  - Nenhuma nova chamada de API é disparada ao trocar a unidade.
- Dependências: T-03, T-04
- Arquivos prováveis: `src/components/TemperatureToggle.tsx`

---

## Entrega 6 — Integração

### T-21 — Montar composição final da aplicação
- Tipo: UI
- Descrição curta: Integrar busca, clima, previsão, estados e toggle para montar a tela principal.
- Rastreabilidade: FR-01 a FR-07, AC-01 a AC-07, NFR-02, NFR-03
- Critérios de aceite:
  - O fluxo principal funciona: pesquisar cidade → selecionar resultado → exibir clima atual e previsão.
  - O app renderiza os estados de loading, empty e error sem quebrar a tela.
  - O layout principal permanece legível em 375px e em desktop.
- Dependências: T-13, T-14, T-15, T-16, T-17, T-18, T-19, T-20
- Arquivos prováveis: `src/App.tsx`

---

## Entrega 7 — Testes

### T-22 — Configurar ambiente de testes
- Tipo: Infra
- Descrição curta: Preparar a base de testes para Vitest e Playwright.
- Rastreabilidade: NFR-05
- Critérios de aceite:
  - O projeto tem configuração de testes unitários e E2E executáveis localmente.
  - Os scripts do `package.json` permitem rodar testes de utilitários, componentes e E2E.
  - `pnpm test` e `pnpm build` são executáveis sem falhas de setup.
- Dependências: —
- Arquivos prováveis: `vitest.config.ts`, `playwright.config.ts`, `package.json`

### T-23 — Testar conversão de unidade (unitário)
- Tipo: Test
- Descrição curta: Cobrir a lógica de conversão Celsius/Fahrenheit em testes unitários isolados.
- Rastreabilidade: FR-05, AC-05
- Critérios de aceite:
  - Testes validam `0°C -> 32°F`, `100°C -> 212°F` e `-40°C -> -40°F`.
  - Testes confirmam que valores decimais e negativos seguem a regra de arredondamento definida pela UI.
  - A suíte é executada sem qualquer dependência de React ou DOM.
- Dependências: T-03, T-22
- Arquivos prováveis: `tests/unit/temperature.test.ts`

### T-24 — Testar utilitários e formatadores
- Tipo: Test
- Descrição curta: Cobrir validação de input, formatadores de data e labels de clima em unidade isolada.
- Rastreabilidade: FR-01, FR-04, AC-01, AC-04
- Critérios de aceite:
  - Testes validam trim/empty e comportamento de entrada inválida.
  - Testes validam `Hoje`, `Amanhã` e nomes de dias da semana para previsão.
  - Testes validam fallback para códigos de clima não mapeados.
- Dependências: T-02, T-05, T-06, T-22
- Arquivos prováveis: `tests/unit/validation.test.ts`, `tests/unit/formatters.test.ts`, `tests/unit/weatherCodes.test.ts`

### T-25 — Testar service com mock de fetch
- Tipo: Test
- Descrição curta: Cobrir geocoding e forecast com mock de `fetch` para sucesso, erro e timeout.
- Rastreabilidade: FR-01, FR-03, FR-04, AC-01, AC-03, AC-04, NFR-04
- Critérios de aceite:
  - Testes cobrem `fetch` com sucesso, erro HTTP e timeout para geocoding.
  - Testes cobrem `fetch` com sucesso e payload incompleto para forecast.
  - A normalização de payload bruto para modelos internos é validada explicitamente.
  - O mock de `fetch` é usado em cada cenário relevante e não depende da UI.
- Dependências: T-07, T-08, T-09, T-10, T-22
- Arquivos prováveis: `tests/unit/weatherApi.test.ts`, `tests/unit/geocodingApi.test.ts`

### T-26 — Testar componentes nos estados loading/erro/vazio
- Tipo: Test
- Descrição curta: Validar renderização dos principais estados de UI e feedback ao usuário.
- Rastreabilidade: FR-01, FR-03, FR-06, AC-01, AC-06
- Critérios de aceite:
  - Testes validam renderização de `loading`, `error` e `empty` na tela principal ou nos componentes específicos.
  - Testes garantem que mensagens de erro e vazios aparecem em contextos corretos.
  - Testes validam que o botão de retry ou a ação de busca não é acionado inadvertidamente em estado vazio.
- Dependências: T-13, T-14, T-15, T-16, T-21, T-22
- Arquivos prováveis: `tests/unit/SearchForm.test.tsx`, `tests/unit/ErrorBanner.test.tsx`, `tests/unit/EmptyState.test.tsx`, `tests/unit/LoadingState.test.tsx`

### T-27 — Testar componentes de unidade e clima atual
- Tipo: Test
- Descrição curta: Validar interação de toggle e renderização do card de clima atual.
- Rastreabilidade: FR-03, FR-05, AC-03, AC-05
- Critérios de aceite:
  - Teste do toggle valida alternância entre Celsius e Fahrenheit e atualização visual dos valores.
  - Teste do clima atual valida nome da cidade, temperatura e texto de condição climática.
  - Testes cobrem fallback quando campos opcionais vierem ausentes.
- Dependências: T-17, T-20, T-21, T-22
- Arquivos prováveis: `tests/unit/TemperatureToggle.test.tsx`, `tests/unit/WeatherCurrent.test.tsx`

### T-28 — Implementar testes E2E do fluxo principal
- Tipo: Test
- Descrição curta: Verificar o fluxo completo em navegador, incluindo laptop/desktop e viewport mobile.
- Rastreabilidade: FR-01 a FR-07, AC-01 a AC-07, NFR-02, NFR-03
- Critérios de aceite:
  - O cenário simula pesquisa de cidade, seleção do resultado e renderização do clima atual.
  - O cenário valida viewport mobile de 375px e desktop de 1280px.
  - O teste valida que uma busca sem resultado mostra mensagem de ausência de dados.
  - O usuário consegue seguir o fluxo principal sem interações manuais extras.
- Dependências: T-21, T-22
- Arquivos prováveis: `tests/e2e/weather-flow.spec.ts`, `tests/e2e/mobile.spec.ts`

### T-29 — Implementar testes E2E de regressão do fluxo principal
- Tipo: Test
- Descrição curta: Cobrir cenários de regressão do fluxo principal em mobile e desktop.
- Rastreabilidade: FR-01 a FR-07, AC-01 a AC-07, NFR-02
- Critérios de aceite:
  - Teste cobre tentativa de busca vazia e resultado sem cidade encontrada.
  - Teste cobre troca de unidade no fluxo completo sem quebrar a navegação.
  - O cenário aceita mock de API para garantir execução determinística.
- Dependências: T-21, T-28
- Arquivos prováveis: `tests/e2e/weather-regression.spec.ts`

---

## Entrega 8 — Hardening

### T-27 — Revisar acessibilidade e tratamento de erro
- Tipo: UI
- Descrição curta: Ajustar foco, feedback visual e tratamento de edge cases em runtime.
- Rastreabilidade: FR-06, AC-06, NFR-03, NFR-04
- Critérios de aceite:
  - Todos os controles principais têm foco visível e navegação por teclado válida.
  - Labels e mensagens de erro têm leitura apropriada para assistive tech.
  - Timeout, resposta parcial e ausência de dados não quebram a UI.
- Dependências: T-21, T-26
- Arquivos prováveis: `src/components/*`, `src/hooks/useWeatherSearch.ts`, `src/services/weatherApi.ts`

### T-30 — Verificação final de qualidade
- Tipo: Infra
- Descrição curta: Validar o conjunto do app antes de fechar a entrega.
- Rastreabilidade: FR-01 a FR-07, NFR-01 a NFR-05
- Critérios de aceite:
  - A suíte de testes unitários, de componentes e E2E passa sem falhas.
  - `pnpm build` conclui com sucesso em ambiente limpo.
  - O comportamento principal e os edge cases relevantes da spec ficam validados.
- Dependências: T-22, T-23, T-24, T-25, T-26, T-27, T-28, T-29
- Arquivos prováveis: `package.json`, `src/**`, `tests/**`

---

## Matriz de rastreabilidade: requisitos funcionais x tarefas

| Requisito funcional | Tarefas principais | Tarefas de validação | Status |
| --- | --- | --- | --- |
| FR-01 — Busca por cidade | T-02, T-07, T-08, T-11, T-13, T-21 | T-23, T-24, T-26, T-28 | Coberto |
| FR-02 — Seleção da cidade | T-08, T-11, T-21 | T-24, T-28 | Coberto |
| FR-03 — Clima atual | T-05, T-09, T-10, T-12, T-17, T-21 | T-25, T-27, T-28 | Coberto |
| FR-04 — Previsão de 5 dias | T-05, T-06, T-10, T-12, T-18, T-19, T-21 | T-24, T-27, T-28 | Coberto |
| FR-05 — Alternância de unidade | T-03, T-04, T-20, T-21 | T-23, T-27, T-28 | Coberto |
| FR-06 — Estados de carregamento, erro e vazio | T-11, T-14, T-15, T-16, T-21 | T-26, T-28 | Coberto |
| FR-07 — Layout responsivo | T-13, T-17, T-18, T-20, T-21 | T-28, T-29 | Coberto |

### Requisitos sem tarefa correspondente

Nenhum requisito funcional da spec ficou sem tarefa correspondente.

Os requisitos FR-01 a FR-07 são cobertos por pelo menos uma tarefa de implementação e, na maioria dos casos, também por tarefas de teste/validação.

---

## Ordem final de execução

1. T-01 — tipos
2. T-02 a T-06 — funções puras
3. T-07 a T-10 — services
4. T-11 a T-12 — hooks
5. T-13 a T-20 — componentes
6. T-21 — integração final
7. T-22 — setup de testes
8. T-23 a T-29 — testes dedicados
9. T-30 — hardening e validação final

## Dependências cruzadas resumidas

- T-01 → T-02, T-03, T-05, T-06, T-07, T-09
- T-02 → T-07, T-11, T-24
- T-03 → T-04, T-20, T-23
- T-04 → T-17, T-20, T-23
- T-05 → T-10, T-24
- T-06 → T-18, T-24
- T-07 → T-08, T-11, T-25
- T-08 → T-11, T-25
- T-09 → T-10, T-25
- T-10 → T-12, T-17, T-18, T-25
- T-11 → T-12, T-13, T-14, T-15, T-16
- T-12 → T-14, T-15, T-17, T-18, T-26, T-27
- T-13 → T-21, T-26
- T-14 → T-21, T-26
- T-15 → T-21, T-26
- T-16 → T-21, T-26
- T-17 → T-21, T-27
- T-18 → T-19, T-21, T-27
- T-19 → T-21, T-27
- T-20 → T-21, T-27
- T-21 → T-26, T-27, T-28, T-29
- T-22 → T-23, T-24, T-25, T-26, T-27, T-28, T-29
- T-23 → T-30
- T-24 → T-30
- T-25 → T-30
- T-26 → T-30
- T-27 → T-30
- T-28 → T-29, T-30
- T-29 → T-30
