# Matriz de Rastreabilidade — Weather App

## Objetivo

Mapear cada User Story aos Acceptance Criteria e aos Requisitos Não-Funcionais relevantes, para facilitar a quebra de tarefas e a validação por testes automatizados.

## Tabela de rastreabilidade

| User Story | Requisito funcional relacionado | Acceptance Criteria relacionados | NFRs relevantes |
|---|---|---|---|
| US-01: Busca por cidade | FR-01: Busca por cidade | AC-01: Busca e validação de entrada | NFR-01: Performance; NFR-03: Acessibilidade; NFR-02: Responsividade |
| US-02: Seleção correta da cidade | FR-02: Seleção da cidade | AC-02: Seleção de cidade em resultado único ou múltiplo | NFR-01: Performance; NFR-03: Acessibilidade |
| US-03: Clima atual | FR-03: Clima atual | AC-03: Clima atual | NFR-01: Performance; NFR-04: Confiabilidade; NFR-03: Acessibilidade |
| US-04: Previsão de 5 dias | FR-04: Previsão de 5 dias | AC-04: Previsão de 5 dias | NFR-01: Performance; NFR-02: Responsividade; NFR-04: Confiabilidade |
| US-05: Alternar unidade | FR-05: Alternância de unidade de temperatura | AC-05: Conversão de unidade | NFR-01: Performance; NFR-03: Acessibilidade |
| US-06: Estado de erro e vazio | FR-06: Estados de carregamento, erro e vazio | AC-06: Estados de erro e carregamento | NFR-04: Confiabilidade; NFR-03: Acessibilidade |
| US-07: Uso mobile | FR-07: Layout responsivo | AC-07: Responsividade | NFR-02: Responsividade; NFR-03: Acessibilidade; NFR-01: Performance |

## Mapeamento por requisito funcional

| Requisito funcional | User Stories vinculadas | Acceptance Criteria vinculados |
|---|---|---|
| FR-01: Busca por cidade | US-01 | AC-01 |
| FR-02: Seleção da cidade | US-02 | AC-02 |
| FR-03: Clima atual | US-03 | AC-03 |
| FR-04: Previsão de 5 dias | US-04 | AC-04 |
| FR-05: Alternância de unidade de temperatura | US-05 | AC-05 |
| FR-06: Estados de carregamento, erro e vazio | US-06 | AC-06 |
| FR-07: Layout responsivo | US-07 | AC-07 |

## Observações para execução

- A busca e a seleção de cidade cobrem o fluxo principal da jornada e devem ser validados primeiro em testes automatizados.
- O clima atual e a previsão são os blocos de dados centrais e dependem diretamente de confiabilidade da API e de fallback em caso de dados incompletos.
- A conversão de unidade precisa ser validada em todos os componentes que exibem temperatura, inclusive previsão.
- O NFR-02 e o NFR-03 devem ser checados em testes de UI em mobile, especialmente em largura de 375px.
- O NFR-04 deve ser validado com cenários de falha de rede, timeout e resposta parcial.
