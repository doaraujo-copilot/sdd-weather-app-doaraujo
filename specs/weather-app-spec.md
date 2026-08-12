# Especificação do Produto — Weather App

## Overview

O Weather App é uma aplicação web responsiva para consulta de previsão do tempo em cidades brasileiras e internacionais. O escopo inicial permite ao usuário pesquisar uma cidade, visualizar o clima atual e consultar a previsão para os próximos 5 dias, incluindo a troca entre Celsius e Fahrenheit.

A aplicação será entregue como produto web de baixa complexidade, com foco principal em uso mobile, em português do Brasil. O backend não será necessário para o MVP: a aplicação consumirá a API Open-Meteo diretamente no cliente, sem autenticação e sem persistência de dados no servidor.

A unidade padrão da interface será Celsius. A opção de alternar para Fahrenheit deve estar disponível em toda a sessão do usuário.

## Functional Requirements

### FR-01: Busca por cidade
O sistema deve permitir que o usuário pesquise uma cidade pelo nome e receba resultados de geocodificação compatíveis com a busca informada.

Critérios de aceitação:
- Given que o usuário acessa a tela principal, when digita um termo de pesquisa e envia a consulta, then o sistema deve remover espaços vazios do início e do final do texto antes de realizar a busca.
- Given que o termo digitado possui no valor após a limpeza, when o usuário tenta buscar, then o sistema deve impedir a requisição e exibir mensagem de validação.
- Given uma busca válida, when a resposta for recebida, then o sistema deve mostrar até 5 resultados ordenados por relevância e compatibilidade com o termo pesquisado.
- Given que a busca retornar múltiplos resultados, when o usuário seleciona uma cidade, then o sistema deve carregar o clima dessa localidade e manter o nome da cidade selecionada visível.
- Given uma busca sem resultados, when a resposta for processada, then o sistema deve exibir mensagem de “Nenhuma cidade encontrada” e manter a interface em estado estável.

### FR-02: Seleção da cidade
O usuário deve poder selecionar a cidade correta quando a busca retornar mais de um resultado possível.

Critérios de aceitação:
- Given que a busca retorna mais de um resultado, when o usuário visualiza a lista, then cada item deve apresentar nome da cidade, país ou estado/região e uma ação de seleção explícita.
- Given que o usuário seleciona um item da lista, when a cidade for confirmada, then a aplicação deve atualizar o estado da cidade ativa e iniciar o carregamento do clima atual e da previsão.
- Given que a busca retorna apenas um resultado, when a resposta for processada, then o sistema deve selecionar automaticamente essa cidade e carregar os dados sem exigir ação adicional do usuário.

### FR-03: Clima atual
O sistema deve exibir as condições climáticas atuais da cidade selecionada.

Critérios de aceitação:
- Given que uma cidade foi selecionada corretamente, when os dados forem carregados, then a interface deve exibir o nome da cidade, a temperatura atual e a descrição do clima.
- Given que a API retorna dados complementares, when a consulta for concluída com sucesso, then a tela deve apresentar, quando disponíveis, sensação térmica, umidade e velocidade do vento.
- Given que algum campo obrigatório não vier preenchido, when a resposta for tratada, then o sistema deve mostrar um fallback textual em vez de quebrar o layout.
- Given que a requisição de clima atual falhar, when o carregamento não for concluído, then a interface deve exibir uma mensagem de erro e manter a última cidade válida em contexto, se houver.

### FR-04: Previsão de 5 dias
O sistema deve exibir a previsão meteorológica para o período de hoje + 4 dias.

Critérios de aceitação:
- Given que uma cidade foi selecionada, when a previsão for carregada, then o sistema deve mostrar 5 registros diários em sequência, começando no dia atual e incluindo quatro dias futuros.
- Given cada item da previsão, when o dado for exibido, then o componente deve apresentar a data, a temperatura máxima, a temperatura mínima e a condição climática do dia.
- Given que a unidade ativa for Celsius ou Fahrenheit, when a previsão for renderizada, then todos os valores de temperatura devem refletir a unidade selecionada.
- Given que a API retornar dados incompletos para um dia específico, when a previsão for montada, then o sistema deve renderizar o dia com informações parciais e manter a lista completa visível.

### FR-05: Alternância de unidade de temperatura
O usuário deve poder trocar entre Celsius e Fahrenheit em qualquer momento.

Critérios de aceitação:
- Given que o usuário acessa a aplicação pela primeira vez, when a tela principal for renderizada, then a unidade padrão deve ser Celsius.
- Given que o usuário clica no controle de unidade, when a troca for acionada, then o sistema deve converter todas as temperaturas exibidas em tela para a nova unidade imediatamente.
- Given que o valor da unidade foi alterado, when o componente for re-renderizado, then a escolha deve permanecer válida durante a sessão atual e não reverter automaticamente.
- Given que a conversão for aplicada, when o valor for exibido, then o texto deve conter unidade correta e o número deve respeitar o formato de decimal utilizado pela interface.

### FR-06: Estados de carregamento, erro e vazio
O sistema deve informar claramente o estado atual da aplicação para o usuário.

Critérios de aceitação:
- Given que uma consulta está em andamento, when o usuário acessa a tela, then o sistema deve exibir um indicador de carregamento com texto ou acessibilidade apropriados.
- Given que a API falhar, when a resposta for inválida ou a requisição exceder o tempo limite, then o sistema deve mostrar um banner de erro com ação de tentar novamente.
- Given que a busca não retornar resultados, when o resultado for processado, then o sistema deve exibir mensagem de ausência de resultados e manter o formulário acessível.
- Given qualquer condição de erro ou vazio, when o estado for exibido, then a interface não deve ficar em branco, quebrada ou com conteúdo inconsistente.

### FR-07: Layout responsivo
O sistema deve funcionar corretamente em dispositivos móveis e manter a principal jornada de uso acessível em desktop.

Critérios de aceitação:
- Given que a aplicação é aberta em um celular com largura de 375px, when o layout for renderizado, then o campo de busca, o botão principal e o controle de unidade devem permanecer visíveis e funcionalmente acessíveis sem zoom manual.
- Given que a tela for reduzida, when o conteúdo for re-renderizado, then os elementos essenciais da jornada — busca, cidade selecionada e previsão — devem permanecer visíveis sem ocultação de informações críticas.
- Given que a interface é utilizada em desktop, when a largura da tela for maior que 1024px, then o layout deve manter leitura confortável e distribuição organizada dos blocos de informação.

## User Stories

### US-01: Busca por cidade
Como Maria, usuária diária em trânsito, quero pesquisar uma cidade rapidamente para saber o clima antes de sair de casa.

### US-02: Seleção correta da cidade
Como Carlos, gestor de rotina, quero escolher a cidade correta entre os resultados de busca para garantir que a previsão seja da localidade certa.

### US-03: Clima atual
Como Maria, usuária em movimento, quero ver o clima atual da cidade selecionada para decidir a roupa adequada e o tempo de deslocamento.

### US-04: Previsão de 5 dias
Como Ana, usuária de planejamento, quero consultar a previsão dos próximos 5 dias para decidir sobre atividades ao ar livre e compromissos.

### US-05: Alternar unidade
Como Maria, usuária em trânsito, quero trocar entre Celsius e Fahrenheit para visualizar a temperatura no formato que uso no dia a dia.

### US-06: Estado de erro e vazio
Como Ana, usuária de planejamento, quero receber feedback claro quando não há resultados ou quando a API falha para continuar usando o app com confiança.

### US-07: Uso mobile
Como Maria, usuária em trânsito, quero acessar o app facilmente no celular para consultar o clima sem esforço em qualquer momento.

## Acceptance Criteria

### AC-01: Busca e validação de entrada
- Given que o usuário acessa a tela inicial, when digita apenas espaços ou valor vazio, then a busca não deve ser enviada e o sistema deve exibir mensagem de validação.
- Given que o usuário enviar uma busca válida, when a resposta for recebida, then o sistema deve renderizar até 5 resultados ou a mensagem de ausência de resultados.

### AC-02: Seleção de cidade em resultado único ou múltiplo
- Given que a geocodificação retorna mais de um resultado, when o usuário clica em uma cidade, then o clima da cidade selecionada deve ser carregado.
- Given que a geocodificação retorna apenas um resultado, when a resposta for processada, then esse resultado deve ser selecionado automaticamente e carregado sem interação extra.

### AC-03: Clima atual
- Given que a cidade foi identificada, when os dados forem carregados com sucesso, then a tela deve exibir, no mínimo, nome da cidade, temperatura atual e condição climática.
- Given que a API retorna dados complementares, when a resposta for processada, then os campos extras devem aparecer somente se forem válidos e não nulos.

### AC-04: Previsão de 5 dias
- Given que a previsão for carregada, when a lista de 5 dias for renderizada, then cada item deve incluir data, condição climática, temperatura mínima e máxima.
- Given a cidade válida, when a previsão for exibida, then ela deve cobrir exatamente o dia atual e os próximos 4 dias, sem extrapolar o período definido.

### AC-05: Conversão de unidade
- Given que o valor padrão do app é Celsius, when o usuário ativa Fahrenheit, then todas as temperaturas da tela devem ser convertidas imediatamente para a nova unidade.
- Given que o usuário retorna para Celsius, when a troca for acionada, then a aplicação deve reverter a conversão de forma consistente em todos os indicadores visíveis.

### AC-06: Estados de erro e carregamento
- Given que a requisição está em andamento, when a loading for disparado, then um indicador visível deve aparecer enquanto os dados são carregados.
- Given que a API retorna erro ou excede o limite de tempo, when a solicitação falhar, then a aplicação deve apresentar uma mensagem de erro com opção de tentar novamente.
- Given que não houver resultado para a busca, when o processamento terminar, then a interface deve exibir mensagem informativa e manter os campos ativos para nova tentativa.

### AC-07: Responsividade
- Given que a aplicação é visualizada em 375px de largura, when o usuário realiza a busca e consulta o clima, then os principais elementos continuam acessíveis sem zoom manual.
- Given que a interface em desktop é aberta em 1280px, when a cidade for selecionada, then o layout deve manter proporção adequada entre os blocos de previsão e clima atual.

## Non-Functional Requirements

### NFR-01: Performance
A aplicação deve responder rapidamente às interações principais em redes móveis e em conexões de internet típicas.

Critérios de aceitação:
- A consulta de cidade e a renderização dos dados devem completar em até 3 segundos em 95% dos acessos em rede 4G estável.
- O carregamento inicial da tela não deve bloquear a interação com a interface principal.

### NFR-02: Responsividade
O app deve funcionar corretamente em dispositivos móveis, tablets e desktops.

Critérios de aceitação:
- O layout deve permanecer funcional em 375px, 768px e 1280px de largura.
- O conteúdo essencial da jornada não pode ficar oculto em mobile.

### NFR-03: Acessibilidade
A solução deve seguir práticas mínimas de acessibilidade para uso por pessoas com diferentes necessidades.

Critérios de aceitação:
- Todo controle interativo deve possuir label acessível e foco visível.
- O contraste mínimo do texto deve atender padrão WCAG AA para texto normal.
- A navegação por teclado deve funcionar em todos os controles principais.

### NFR-04: Confiabilidade
A aplicação deve tratar falhas de rede e respostas incompletas sem quebrar a UI.

Critérios de aceitação:
- Respostas vazias ou nulas da API devem ser tratadas com fallback sem quebrar a renderização.
- Falhas de rede ou timeout não devem deixar the UI em estado inconsistente.

### NFR-05: Manutenibilidade
O código deve ser organizado por responsabilidade, permitindo evolução incremental sem reescrita massiva.

Critérios de aceitação:
- A lógica de busca, conversão de unidade e renderização do clima devem estar separadas em módulos ou funções reutilizáveis.
- Mudanças de API ou de layout não devem exigir reescrita da estrutura principal do app.

## Edge Cases

1. Input vazio
   - O usuário envia uma busca com espaços, vazio ou sem texto útil.
   - O sistema deve bloquear a requisição e exibir mensagem de validação curta e informativa.

2. Cidade inexistente
   - O termo pesquisado não corresponde a nenhuma cidade conhecida.
   - O sistema deve exibir mensagem de “Nenhuma cidade encontrada” sem quebrar o layout.

3. Caracteres especiais e acentos
   - O usuário pesquisa nomes com acento, hífen, apóstrofo ou espaços extras.
   - O sistema deve normalizar a string para envio e tratamento da API.

4. Falha de API
   - A requisição retorna erro HTTP, resposta inválida ou falha de rede.
   - O sistema deve mostrar erro de carregamento e permitir nova tentativa.

5. Timeout
   - A consulta excede o tempo configurado para resposta.
   - O sistema deve exibir erro de timeout e manter a interface acessível.

6. Geocoding sem resultado
   - A API retorna lista vazia para a cidade pesquisada.
   - O sistema deve mostrar mensagem clara de ausência de resultados.

7. Resposta parcial
   - A API retorna alguns campos vazios ou ausentes.
   - O sistema deve renderizar os dados disponíveis e exibir fallback para valores faltantes.

8. Conversão em decimal
   - A temperatura convertida possui valor decimal.
   - O sistema deve formatar o número com precisão legível e consistente, sem gerar ambiguidade visual.

## Assumptions

1. O usuário principal acessa a solução em navegador via mobile.
2. A API Open-Meteo será utilizada diretamente no cliente, sem backend próprio.
3. O MVP não inclui autenticação, favoritos, histórico persistente ou alertas meteorológicos severos.
4. A interface será entregue em português do Brasil.
5. O padrão da aplicação é Celsius e a conversão para Fahrenheit é uma funcionalidade de alternância.
6. A previsão cobrirá o dia atual e os próximos 4 dias.
7. O produto deve ser acessível em navegadores modernos atuais.

## Risks

1. Dependência externa de API
   - A API pode ficar indisponível ou responder lentamente.
   - Mitigação: tratamento de erro, timeout, fallback e ações de retry.

2. Ambiguidade em resultados de geocoding
   - Cidades com nomes repetidos podem levar a seleção errada.
   - Mitigação: mostrar resultados relevantes e exigir seleção explícita quando houver múltiplos itens.

3. Falhas em mobile
   - Layout e interação podem falhar em resoluções menores.
   - Mitigação: testes em múltiplos breakpoints e dispositivos reais.

4. Dados incompletos da fonte
   - Algumas respostas podem omitir campos esperados.
   - Mitigação: validação defensiva e renderização com fallback.

## Out of Scope

1. Autenticação.
2. Persistência no servidor.
3. Histórico de busca persistente.
4. Favoritos ou cidades salvas por usuário.
5. Alertas severos, mapas interativos ou radar climático.
6. Notificações push.
7. Modo offline completo.
8. Suporte multilíngue além do pt-BR no MVP.

## Open Questions

1. A busca deve aceitar apenas cidades ou também municípios, regiões e estados?
2. A aplicação deve usar geolocalização automática em uma etapa futura?
3. A previsão deve incluir umidade, vento e sensação térmica em todos os estados ou apenas quando houver dados?
4. O cliente deseja a futura adição de favoritos e histórico de buscas?
5. Existe exigência formal de conformidade com WCAG 2.1?
6. Qual navegador e versão mínima são exigidos para homologação?
7. Qual é o tempo máximo aceitável para timeout da API em produção?
8. Há necessidade de coleta de logs e métricas para monitoramento de erro?
