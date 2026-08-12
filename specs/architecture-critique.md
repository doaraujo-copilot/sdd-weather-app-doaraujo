# Crítica Arquitetônica — specs/discovery.md

**Analista:** Arquiteto de Soluções Senior  
**Data:** 2026-08-12  
**Viés:** Crítico construtivo (busca evitar retrabalho e ambiguidades)

---

## ⚠️ RESUMO EXECUTIVO

**Status:** ⚠️ **AMARELO** — Documento é bom, mas tem 8 ambiguidades críticas e 5 gaps de design que podem gerar retrabalho se não forem fechadas ANTES de spec.

**Recomendação:** Adicione 2 horas de refinamento antes de chamar agente Spec. Sem isso, risco de retrabalho é **30-40%**.

---

## 🔴 CRÍTICAS PRINCIPAIS

### 1. **VAGO: Definição de "Clima Atual" — O Que Exatamente?**

**Problema:** 
```
"Exibição de Clima Atual"
- Temperatura atual
- Condição climática visual e descritiva
- Umidade relativa
- Velocidade do vento
- Sensação térmica
- Pressão atmosférica (opcional)
- Radiação UV (opcional)
```

**Ambiguidade:**
- ❌ "Opcional" significa o quê? Escondido por padrão? Expansível? Página separada?
- ❌ Qual é a **ordem de exibição** em mobile vs. desktop?
- ❌ **Responsabilidade:** Qual é o dado mais importante? (Temperatura? Sensação térmica? Condição?)
- ❌ **Ícone climático:** De qual fonte? (Tailwind? Fontawesome? SVG custom?)
- ❌ **Unidades:** Pressão em hPa? Precipitação em mm? Open-Meteo fornece, mas **falta decisão de qual usar**.

**Impacto de Não Resolver:**
- ⚠️ Spec vai assumir "tudo visível" → UI fica poluída em mobile
- ⚠️ Dev vai escolher arbitrariamente ícones → inconsistência visual
- ⚠️ Ordem de dados diferente em desktop vs. mobile → UX confuso

**Ação Necessária:**
```markdown
CRIAR: Wireframe ou especificação visual da "Exibição de Clima Atual"
- Versão mobile (< 480px)
- Versão desktop (> 1024px)
- Hierarquia visual (tamanho de fonte, peso, cor)
- Decisão: pressão e UV são necessários? (sugerir: NÃO para MVP)
```

---

### 2. **VAGO: Busca de Cidades — Fluxo Exato Não Documentado**

**Problema:**
```
"Busca de Cidades"
- Limite de resultados: top 5
- Tratamento de ambiguidades
```

**Ambiguidade:**
- ❌ **Debouncing:** Aguardar quantos ms antes de chamar API? (discovery diz "300ms" em risk-analysis.md, mas discovery.md não menciona)
- ❌ **Mínimo de caracteres:** 1, 2, ou 3 letras antes de sugerir?
- ❌ **Comportamento de clique:** Ao selecionar cidade, busca fecha automaticamente?
- ❌ **Histórico:** Se sim, aparece dentro do input ou em dropdown separado?
- ❌ **Busca vazia:** Se usuário apaga input, mostra histórico?
- ❌ **Enter/Return:** Confirmação via teclado?

**Impacto de Não Resolver:**
- ⚠️ Dev implementa sem consenso → 2-3 dias de refactor
- ⚠️ Mobile UX diferente do desktop → frustração de usuários

**Ação Necessária:**
```markdown
CRIAR: Wireframe + fluxo detalhado de "Busca de Cidades"
- Estados: vazio, digitando, resultados, seleção
- Comportamento: keyboard vs. mouse
- Integração com histórico
```

---

### 3. **VAGO: Geolocalização — Fluxo de Consentimento Não Especificado**

**Problema:**
```
Decisões dizem:
"Geolocalização opcional com consentimento"
```

**Ambiguidade:**
- ❌ **Quando pedir consentimento?** 1º acesso? Antes de começar? Depois de 5s?
- ❌ **Se recusado:** Bloqueia app ou apenas sugere busca manual?
- ❌ **Se falhar (GPS off, timeout):** Qual mensagem exata?
- ❌ **"Não perguntar de novo":** Como armazenar essa decisão? localStorage indefinidamente?
- ❌ **Timeout:** Máx. 5s segundo risk-analysis.md, mas discovery.md **não menciona**.
- ❌ **Localização exata:** latitude/longitude ou apenas "São Paulo"?

**Impacto de Não Resolver:**
- ⚠️ Modal de consentimento não está especificado → dev vai criar UX própria
- ⚠️ Sem timeout definido → app pode ficar 30s "congelado" esperando GPS
- ⚠️ UX diferente por dev → inconsistência

**Ação Necessária:**
```markdown
CRIAR: Fluxo de geolocalização detalhado
- Diagrama de decisão (primeira vez vs. recusou vs. ativado)
- Modal exato: "Usar minha localização? [Permitir] [Agora não]"
- Timeout: 5 segundos
- Mensagens de erro específicas
```

---

### 4. **VAGO: Cache e Atualização — TTL Não Está Especificado**

**Problema:**
```
Requisitos Não-Funcionais mencionam:
"Cache de dados para offline"
"Retry automático"
```

**Ambiguidade:**
- ❌ **TTL de cache:** 10 min? 30 min? 1 hora?
- ❌ **Atualização automática:** A cada 10 min? Apenas ao trocar de cidade?
- ❌ **Dados "stale":** Exibir dados > 30 min com aviso? Ou rejeitar?
- ❌ **localStorage limite:** Quantas cidades podem ser cacheadas? 5? 100?
- ❌ **Persistência entre sessões:** Se usuário fecha browser e reabre, dados ainda estão válidos?

**Impacto de Não Resolver:**
- ⚠️ Dev vai escolher 10 min arbitrariamente → dados podem estar obsoletos
- ⚠️ Sem TTL claro → usuários verão dados antigos sem aviso
- ⚠️ Sem limite de localStorage → app pode ficar lento (storage creep)

**Ação Necessária:**
```markdown
DEFINIR: Estratégia de Cache e Validação
- TTL: 10 minutos (decisão: AQUI, não em code review)
- Atualização automática: ao mudar de cidade OU a cada 10 min
- Aviso visual: "Dados podem estar desatualizados" se > 15 min
- Limite localStorage: máx. 20 cidades (~ 50KB)
```

---

### 5. **VAGO: Conversão de Unidades — Escopo Incompleto**

**Problema:**
```
D3: "Conversão aplica-se a: temperatura, sensação térmica, previsão"
D3: "Vento permanece em km/h"
```

**Ambiguidade:**
- ❌ **Pressão:** Muda de hPa para inHg ao selecionar Fahrenheit?
- ❌ **Precipitação:** Muda de mm para polegadas?
- ❌ **Velocidade do vento:** Mantém km/h ou muda para m/s ou mph?
- ❌ **Visibilidade:** Se adicionar futuramente, qual unidade?
- ❌ **Consistência:** Se só temperatura muda, UI fica confusa ("20°F, 15 km/h" — por que misturado?)

**Impacto de Não Resolver:**
- ⚠️ UI inconsistente: temperatura em °F mas vento em km/h = UX ruim
- ⚠️ Dev vai achar "errado" e refatorar = retrabalho
- ⚠️ Usuários de USA reclamam: "Velocidade em km/h? Ridiculo!"

**Ação Necessária:**
```markdown
DEFINIR: Estratégia de Unidades Completa
Opção A (Simples - MVP):
- Celsius: temp, sensação térmica, min/max (°C) + vento (km/h) + pressão (hPa)
- Fahrenheit: temp, sensação térmica, min/max (°F) + vento (km/h) + pressão (hPa)
  (vento/pressão não convertem no MVP)

Opção B (Completa):
- Celsius: °C, km/h, hPa, mm
- Fahrenheit: °F, mph, inHg, polegadas
  (mais complexo, mas consistente)

ESCOLHA: Opção A (MVP mais simples)
```

---

### 6. **VAGO: Indicador de "Última Atualização" — Exibição Não Definida**

**Problema:**
```
Requisitos mencionam:
"Indicador visual de 'última atualização'"
"Timestamp sempre exibido"
```

**Ambiguidade:**
- ❌ **Formato:** "13:45"? "13:45:30"? "Há 5 minutos"? "Hoje 13:45"?
- ❌ **Localização:** Embaixo dos dados? Ao lado? Em tooltip?
- ❌ **Fonte de verdade:** Open-Meteo retorna timestamp? Usar data local?
- ❌ **Atualização:** Muda a cada 1 min? Apenas ao refrescar?
- ❌ **Timezone:** Exibir horário local da cidade ou UTC?

**Impacto de Não Resolver:**
- ⚠️ Dev coloca timestamp em lugar errado → UI fica poluída
- ⚠️ Sem formato definido → inconsistência visual
- ⚠️ Sem timezone claro → confusão (usuário em São Paulo vê hora de Nova York)

**Ação Necessária:**
```markdown
DEFINIR: Timestamp de "Última Atualização"
- Formato: "Última atualização: 13:45" (horário local da cidade)
- Localização: Rodapé da seção de clima atual, pequeno, cinzento
- Atualização: Apenas ao refrescar dados (não em tempo real)
- Timezone: Hora local da cidade consultada (não UTC)
```

---

### 7. **VAGO: Tratamento de Erro de API — Mensagens Não Especificadas**

**Problema:**
```
Requisitos Não-Funcionais:
"Tratamento robusto de erros de conexão"
"Mensagens de erro claras e acionáveis"
```

**Ambiguidade:**
- ❌ **Erro 429 (Rate Limiting):** Qual mensagem? "Tente novamente em 1 hora"?
- ❌ **Erro 503 (Serviço Indisponível):** "Servidor fora do ar, use dados em cache"?
- ❌ **Timeout:** "Conexão lenta, tente novamente"?
- ❌ **CORS Bloqueado:** "Seu navegador/firewall bloqueou a solicitação"?
- ❌ **Sem internet:** Fallback automático para cache? Ou mensagem?
- ❌ **Cache expirado:** Se dados > 1h, exibir aviso ou rejeitar?

**Impacto de Não Resolver:**
- ⚠️ Sem mensagens claras → usuário vê "Error 429" (confuso)
- ⚠️ Dev inventa mensagens próprias → inconsistência
- ⚠️ Sem fallback definido → app quebra ao perder conexão

**Ação Necessária:**
```markdown
CRIAR: Matriz de Erros e Respostas
| Erro | Código HTTP | Mensagem | Ação |
|------|-------------|----------|------|
| Rate limit | 429 | "Muitas buscas. Aguarde 1 hora." | Exibir cache |
| Servidor fora | 503 | "Serviço temporariamente indisponível. Mostrando dados anteriores." | Cache |
| Timeout | - | "Conexão lenta. Tente novamente." | Retry com backoff |
| CORS bloqueado | - | "Seu navegador bloqueou esta solicitação." | Instruir VPN |
| Sem internet | - | "Sem conexão. Mostrando dados em cache." | Cache |
```

---

### 8. **VAGO: Validação de Entrada — Quais Regras Exatas?**

**Problema:**
```
Requisitos mencionam:
"Validação de entrada do usuário (busca de cidades)"
```

**Ambiguidade:**
- ❌ **Caracteres especiais:** "São Paulo" (ok), "São Paulo!!!" (ok ou recusado)?
- ❌ **SQL Injection:** Como garantir que entrada não quebra? (sanitize input?)
- ❌ **Tamanho máximo:** Máx. 100 caracteres? 255?
- ❌ **Regex:** Aceitar números? Acentos? Caracteres de emoji?
- ❌ **Espaços em branco:** Trim automaticamente?

**Impacto de Não Resolver:**
- ⚠️ Sem validação → potencial XSS (não crítico pois Open-Meteo, mas bad practice)
- ⚠️ Dev vai validar arbitrariamente → inconsistência
- ⚠️ Usuário digita " São Paulo " (com espaços) → nenhum resultado (UX confuso)

**Ação Necessária:**
```markdown
DEFINIR: Regras de Validação de Entrada
- Mínimo: 2 caracteres
- Máximo: 50 caracteres
- Aceitar: letras, números, acentos, hífens, espaços
- Recusar: caracteres especiais (!@#$%^&*), emoji
- Trim automaticamente espaços antes/depois
- Case-insensitive (não importa maiúscula/minúscula)
```

---

## 🟡 GAPS DE DESIGN

### Gap 1: Modelo de Dados — Open-Meteo Response Não Mapeado

**Problema:**
```
Discovery menciona Open-Meteo, mas não documenta:
- Qual endpoint exato usar?
- Qual é o schema de resposta?
- Como mapear WMO Weather Codes para UI?
```

**Por Quê Importa:**
- ❌ Spec vai precisar disso
- ❌ Dev vai descobrir descobrirá que "conditions: 0" é "Clear" (não documentado)
- ❌ Sem schema, não consegue fazer mock de testes

**Ação Necessária:**
```markdown
DOCUMENTAR: Open-Meteo API Mapping
1. Endpoint: GET https://api.open-meteo.com/v1/forecast
2. Parâmetros: latitude, longitude, daily, current, timezone
3. Response schema:
   {
     current: { temperature, weather_code, wind_speed_10m, relative_humidity_2m, apparent_temperature },
     daily: { time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_sum, precipitation_probability_max }
   }
4. WMO Weather Code Mapping:
   0 → "Céu limpo"
   1,2 → "Parcialmente nublado"
   3 → "Nublado"
   45,48 → "Névoa"
   51,53,55 → "Chuva leve"
   61,63,65 → "Chuva moderada"
   ... etc (detalhar todos os 80+ códigos)
5. Ícone para cada código (de qual biblioteca?)
```

---

### Gap 2: Estrutura de Arquivo localStorage — Não Documentada

**Problema:**
```
Discovery menciona localStorage para cache e histórico, mas:
- Qual é a estrutura exata?
- Qual é o tamanho máximo?
- Como migrar entre versões?
```

**Por Quê Importa:**
- ❌ Dev vai inventar estrutura → pode não ser eficiente
- ❌ Sem versioning → app quebra se mudar schema
- ❌ Sem migração → histórico se perde ao atualizar

**Ação Necessária:**
```markdown
DOCUMENTAR: localStorage Schema
{
  "version": 1,
  "temperatureUnit": "celsius",  // ou "fahrenheit"
  "searchHistory": [
    { "city": "São Paulo", "country": "Brazil", "lat": -23.55, "lon": -46.63, "timestamp": 1234567890 }
  ],
  "cachedWeather": {
    "-23.55,-46.63": {
      "temperature": 25,
      "condition": "Parcialmente nublado",
      "timestamp": 1234567890,
      "ttl": 600  // 10 minutos
    }
  }
}
```

---

### Gap 3: Projeto Visual (Dark Glassmorphism) — Não Especificado

**Problema:**
```
Requisitos mencionam:
"Tema dark glassmorphism funcional"
```

**Ambiguidade:**
- ❌ **Cor de fundo:** Qual? (#000, #0f0f0f, #1a1a2e?)
- ❌ **Glassmorphism:** Blur, opacity, border-radius exatos?
- ❌ **Paleta de cores:** Primária? Secundária? Acentos?
- ❌ **Tipografia:** Qual fonte? Tamanho base?
- ❌ **Espaçamento:** 4px? 8px? Sistema de grid?
- ❌ **Componentes:** Button, input, card — estilos exatos?

**Por Quê Importa:**
- ❌ Sem design system → UI inconsistente
- ❌ Dev coloca cores arbitrariamente → visual ruim
- ❌ Sem Figma/mockup → especificador vai assumir errado

**Ação Necessária:**
```markdown
CRIAR: Design System ou Figma
- Tipografia: Fundação (base 16px), heading (24/32px)
- Cores: Background (#0f0f0f), Surface (#1a1a2e), Primary (#00d4ff), Error (#ff4444)
- Spacing: 4, 8, 12, 16, 24, 32px (8px base)
- Border radius: 8px (cards), 4px (inputs)
- Glassmorphism: backdrop-filter: blur(10px), opacity: 0.8, border: 1px rgba(255,255,255,0.2)
- Componentes: Button, Input, Card, Modal, Badge com variantes
```

---

### Gap 4: Estratégia de Testes — Não Documentada

**Problema:**
```
Requisitos mencionam:
"Testes automatizados com cobertura ≥ 80%"
```

**Ambiguidade:**
- ❌ **Quais componentes testar?** Todos? Só lógica?
- ❌ **Testes E2E:** Quantos cenários? (happy path + 5 edge cases?)
- ❌ **Mocks:** Como mockar Open-Meteo? (MSW? jest mock?)
- ❌ **Cobertura:** 80% em quê? (Linhas? Statements? Branches?)

**Por Quê Importa:**
- ❌ Sem critério claro → dev coloca testes aleatórios
- ❌ Cobertura 80% pode significar nada se não testar paths críticos
- ❌ Sem E2E → regressão visual não é detectada

**Ação Necessária:**
```markdown
DOCUMENTAR: Estratégia de Testes
Unit Tests (Vitest):
- weatherService.ts: 100% (lógica de API é crítica)
- conversion.ts: 100% (conversão de unidades crítica)
- searchCity.ts: 90%+ (lógica de busca)
- Componentes React: 60%+ (foco em lógica, não snapshot)

E2E Tests (Playwright):
- Happy path: buscar cidade → exibir clima → alterar unidades
- Error: API indisponível → exibir cache
- Mobile: geolocalização → clima → histórico
- Performance: FCP < 1.5s, TTI < 3s

Coverage: ≥ 80% overall, 100% em services, 60% em components
```

---

### Gap 5: Diferença entre Spec + Decisions — Redundância Perigosa

**Problema:**
```
Decisões estão AQUI em discovery.md (D1-D5)
Mas também estão em decisions.md
E também algumas em risk-analysis.md
E também em personas.md (Persona 3 — Pedro)
```

**Por Quê Importa:**
- ❌ **Falta de Single Source of Truth** → decisões divergem se editadas em lugar errado
- ❌ **Confusão:** Qual arquivo consultado? discovery.md? decisions.md? risk-analysis.md?
- ❌ **Retrabalho:** Spec vai ler discovery.md e perder tempo processando decisões que já foram formalizadas

**Ação Necessária:**
```markdown
CONSOLIDAR: Mover Decisões (D1-D5) APENAS para specs/decisions.md
- discovery.md: remove seção "🎯 Decisões Fechadas" (ou deixa link)
- Link em discovery.md: "Veja specs/decisions.md para decisões validadas"
- Spec Agent referencia: specs/decisions.md + specs/discovery.md + specs/personas.md
```

---

## 📊 CHECKLIST: O Que Falta Antes de Chamar Spec?

### Críticas (DEVE Resolver)
- [ ] **Clima Atual:** Wireframe ou especificação visual (mobile + desktop)
- [ ] **Busca:** Fluxo detalhado (debouncing, timeout, keyboard)
- [ ] **Geolocalização:** Modal de consentimento + fluxo de erros
- [ ] **Cache:** TTL definido (10 min), atualização automática especificada
- [ ] **Conversão:** Escopo claro (temperatura apenas ou tudo?)
- [ ] **Timestamp:** Formato, localização, timezone especificados
- [ ] **Erros:** Matriz de erros com mensagens exatas
- [ ] **Validação:** Regras de entrada documentadas

### Gaps (DEVE Documentar)
- [ ] **Open-Meteo API:** Schema de request/response + WMO Code Mapping
- [ ] **localStorage:** Schema versionado para cache e histórico
- [ ] **Design System:** Cores, tipografia, espaçamento, componentes
- [ ] **Testes:** Estratégia (unit + E2E), cobertura, mocks
- [ ] **Consolidação:** Decisões centralizadas em decisions.md

### Seria Legal (PODE Resolver Depois)
- [ ] Figma mockup de UI
- [ ] Diagrama de arquitetura de componentes React
- [ ] API contract (Swagger/OpenAPI) para Open-Meteo

---

## 🎯 TEMPO ESTIMADO PARA RESOLVER

| Item | Tempo | Criticalidade |
|------|-------|----------------|
| Wireframes (Clima + Busca) | 2h | 🔴 CRÍTICO |
| Fluxo de geolocalização | 1h | 🔴 CRÍTICO |
| Cache + TTL especificado | 0.5h | 🔴 CRÍTICO |
| Conversão de unidades (escopo) | 0.5h | 🟡 IMPORTANTE |
| Timestamp especificação | 0.5h | 🟡 IMPORTANTE |
| Matriz de erros | 1h | 🔴 CRÍTICO |
| Validação de entrada | 0.5h | 🟡 IMPORTANTE |
| Open-Meteo API mapping | 1h | 🔴 CRÍTICO |
| localStorage schema | 0.5h | 🟡 IMPORTANTE |
| Design system (básico) | 1.5h | 🟡 IMPORTANTE |
| Teste strategy | 1h | 🔴 CRÍTICO |
| Consolidação (decisions.md) | 0.5h | 🟡 IMPORTANTE |
| **TOTAL** | **~10 horas** | - |

**Recomendação:** Fazer em 2-3 sessões de pair design com PM + Dev + Designer.

---

## 📝 CONCLUSÃO

### Pontos Fortes do Discovery
✅ Contexto bem definido  
✅ Requisitos amplos (funcionais + não-funcionais)  
✅ Riscos identificados  
✅ Personas criadas (Ana, João, Pedro)  
✅ Decisões principais fechadas (D1-D5)  
✅ Suposições documentadas  

### Fraquezas Críticas
❌ Wireframes ausentes → UI vai ser inventada  
❌ Fluxos não documentados (busca, geolocalização) → retrabalho  
❌ Cache/TTL não especificado → dados obsoletos  
❌ Schema Open-Meteo não mapeado → dev vai descobrir durante code  
❌ Erros não especificados → UX inconsistente  
❌ Design system não existe → visual ruim  
❌ Testes sem critério → cobertura sem sentido  
❌ Redundância de decisões em 3 arquivos → confusão  

### Recomendação Final
**👉 NÃO CHAMAR SPEC AINDA.**

**Próximas 2-3 horas:** Refinar com checklist acima. Depois, chamar Spec com confiança de que retrabalho será mínimo.

**Se chamar Spec agora:** Spec vai fazer 100 suposições → Spec vai gerar especificação bonita mas vaga → Code vai interpretar errado → 30-40% retrabalho.

**Quando chamar Spec:** Após resolver 70% dos items críticos (wireframes, fluxos, Open-Meteo, erros, testes).

---

## 🎬 Próximos Passos (Sugerido)

1. **[0.5h] Consolidar:** Mover Decisões para decisions.md (single source of truth)
2. **[2h] Wireframes:** Criar simples ASCII ou Figma para Clima Atual + Busca
3. **[1h] Fluxos:** Documentar Busca (debouncing) + Geolocalização (consentimento)
4. **[1h] Open-Meteo:** Mapear schema + WMO codes
5. **[1h] Erros:** Criar matriz de erros com mensagens exatas
6. **[1h] Cache/localStorage:** Definir TTL + schema
7. **[1h] Testes:** Estratégia e cobertura (unit + E2E)
8. **[1h] Design:** Paleta de cores básica (não precisa Figma, pode ser CSS variables)
9. **[0.5h] Review:** PM + Dev revisam tudo
10. **➡️ Chamar Spec:** Com estes 10 items resolvidos ✅

**Tempo total:** ~11h de refinement = evita 30-40% de retrabalho depois. ROI excelente.
