# Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou o desenvolvimento de uma aplicação web de previsão do tempo focada em experiência de usuário simples, rápida e funcional em dispositivos móveis. O objetivo principal é disponibilizar ao usuário uma interface que permita localizar cidades, consultar o clima atual e acompanhar a previsão dos próximos 5 dias, além de oferecer conversão entre Celsius e Fahrenheit.

O contexto do produto sugere um uso frequente em cenário de mobilidade, com necessidade de resposta imediata e legibilidade em telas pequenas. A aplicação deve atender usuários que buscam informações meteorológicas de forma prática, sem exigir cadastro, autenticação ou etapas complexas.

Como produto de negócio, a solução deve priorizar acessibilidade, carga rápida e confiabilidade na apresentação dos dados meteorológicos. A utilização de uma API pública, como Open-Meteo, é uma alternativa adequada para reduzir custos e acelerar a entrega sem comprometer o valor funcional mínimo esperado.

## Requisitos Funcionais

1. Busca de cidades
   - O usuário deve conseguir pesquisar por nome de cidade.
   - A aplicação deve apresentar resultados relevantes com base na consulta do usuário.
   - O sistema deve suportar buscas com nomes incompletos ou parcialmente digitados, conforme a API de geocodificação disponível.

2. Visualização do clima atual
   - Após selecionar uma cidade, o usuário deve visualizar as condições climáticas atuais.
   - O sistema deve exibir pelo menos informações como temperatura, condição do clima e, se possível, dados complementares como umidade, vento ou sensação térmica.
   - A interface deve indicar claramente o estado atual da previsão.

3. Previsão de 5 dias
   - A aplicação deve mostrar a previsão para os próximos 5 dias.
   - Cada dia deve possuir informações resumidas e legíveis para o usuário.
   - A previsão deve considerar a estrutura temporal da API e permitir uma leitura clara por período.

4. Alternância entre Celsius e Fahrenheit
   - O usuário deve poder trocar a unidade de temperatura entre Celsius e Fahrenheit.
   - A conversão deve refletir em toda a interface relevante, incluindo clima atual e previsão.
   - O comportamento deve ser consistente e intuitivo.

5. Experiência mobile
   - A aplicação deve ser responsiva e adequada para uso em dispositivos móveis.
   - Os componentes devem ser legíveis em telas pequenas e manter navegação simples.
   - O layout deve respeitar boas práticas de usabilidade mobile, como espaçamento adequado, botões de fácil toque e leitura sem zoom.

6. Estados de uso
   - A aplicação deve tratar corretamente os estados de carregamento, erro e ausência de resultado.
   - Caso a busca não retorne dados, o sistema deve informar ao usuário de forma clara.
   - Em caso de falha na API ou conexão, a aplicação deve comunicar o problema sem quebrar a experiência.

## Requisitos Não-Funcionais

1. Performance
   - A aplicação deve carregar rapidamente e responder de forma ágil às buscas do usuário.
   - O tempo de carregamento inicial e das consultas deve ser otimizado para uso em redes móveis.

2. Usabilidade
   - A interface deve ser intuitiva e acessível para usuários sem conhecimento técnico.
   - A estrutura visual deve ser clara, com foco em legibilidade e navegação simplificada.

3. Responsividade
   - A solução deve funcionar em smartphones, tablets e desktops, priorizando a adaptação mobile.
   - O layout deve ajustar-se ao tamanho da tela sem perda de funcionalidade.

4. Confiabilidade
   - A aplicação deve lidar com falhas de rede, respostas vazias ou erros de API sem deixar a interface inconsistente.
   - As informações exibidas devem ser consistentes com os dados recebidos.

5. Acessibilidade
   - A aplicação deve utilizar labels, contraste adequado e elementos interativos acessíveis.
   - A navegação por teclado e leitura por telas de apoio deve ser considerada.

6. Manutenibilidade
   - O código deve seguir boas práticas de organização, separação por responsabilidades e reutilização de componentes.
   - A estrutura deve facilitar futuras evoluções, como histórico de buscas, favoritos, alertas climáticos ou novos filtros.

## Riscos

1. Dependência de API externa
   - O serviço de dados meteorológicos pode apresentar indisponibilidade, latência elevada ou mudanças na estrutura de resposta.
   - Isso pode afetar diretamente o comportamento da aplicação e a qualidade dos dados exibidos.

2. Ambiguidade na busca de cidades
   - Nomes de cidades podem aparecer em diferentes países ou com múltiplas localizações.
   - Isso pode gerar confusão ao usuário se o sistema não apresentar opções de escolha adequadas.

3. Experiência mobile inconsistente
   - A adaptação para dispositivos móveis pode comprometer legibilidade ou usabilidade se não forem considerados tamanhos de tela, input e interação.

4. Conversão de temperatura
   - A alternância entre Celsius e Fahrenheit pode gerar inconsistência visual se a conversão não for aplicada em todos os pontos relevantes.

5. Dados incompletos ou inconsistentes
   - Algumas APIs podem retornar campos ausentes, valores nulos ou unidades imprevisíveis, exigindo tratamento defensivo no front-end.

6. Validação insuficiente de requisitos
   - Sem uma definição clara de critérios de aceitação e cenários de erro, a entrega pode não atender às expectativas do cliente.

## Perguntas em Aberto

1. A busca deve considerar apenas cidades ou também regiões, estados e países?
2. A aplicação deve permitir busca com geolocalização automática do usuário?
3. A interface deve mostrar apenas temperatura ou também outros indicadores como umidade, vento e índice UV?
4. Existe um requisito explícito para salvamento de cidades favoritas ou histórico de busca?
5. A aplicação precisa ter suporte para idiomas diferentes ou foco inicial em português?
6. Qual nível de disponibilidade e desempenho é esperado para uso em redes móveis lentas?
7. Há alguma exigência de acompanhamento de acessibilidade específica, como WCAG 2.1?
8. A solução deve funcionar apenas em navegador web ou também em aplicativo híbrido/nativo?
9. O cliente deseja que a previsão inclua alertas severos ou apenas dados climáticos gerais?
10. Qual é o público-alvo principal: usuários gerais, turistas, profissionais ou outra categoria?

## Suposições

1. A aplicação será entregue como uma solução web responsiva, com foco principal em smartphones.
2. O uso de uma API meteorológica pública será suficiente para atender o requisito funcional sem a necessidade de backend próprio.
3. O usuário realizará buscas de cidades de forma isolada, sem necessidade de autenticação ou persistência de conta.
4. A conversão de temperatura será tratada em toda a UI relevante e não apenas em um campo específico.
5. A previsão será exibida em um formato resumido diário para os próximos 5 dias, com foco na legibilidade.
6. O produto será entregue em uma versão inicial com escopo funcional básico, sem recursos avançados como alertas climáticos, favoritos ou mapas.
7. A API de dados fornecerá respostas suficientemente confiáveis para uso em ambiente de demonstração e validação.
8. O design e a experiência serão priorizados para mobilidade, mantendo a funcionalidade também em desktop.

## Decisões

1. Fonte de dados: Open-Meteo (sem API key)
   - Justificativa: a API oferece acesso gratuito, sem necessidade de credenciais, e atende ao escopo inicial de consulta de cidade e clima com baixo custo operacional.
   - Resolve: elimina a incerteza sobre a estratégia de integração e reduz o impacto de depender de uma solução paga ou com complexidade de autenticação.

2. "5 dias" = hoje + 4 dias
   - Justificativa: define explicitamente o intervalo da previsão para manter consistência com a API e com a expectativa do usuário, sem ambiguidades na interpretação do escopo.
   - Resolve: responde à pergunta sobre o período de previsão e evita divergência entre o que a equipe implementa e o que o cliente entende por "5 dias".

3. Unidade padrão: Celsius
   - Justificativa: Celsius é a unidade mais comum para uso geral em português e facilita a compreensão para o público local, mantendo a opção de conversão para Fahrenheit como funcionalidade adicional.
   - Resolve: fecha a dúvida sobre a unidade inicial e define o comportamento padrão da interface antes da interação do usuário.

4. Sem autenticação e sem persistência de servidor
   - Justificativa: o escopo do produto é uma aplicação leve de consumo de dados, sem necessidade de perfil do usuário, histórico de dados ou dados privados armazenados em backend.
   - Resolve: responde à questão sobre autenticação e elimina a necessidade de infraestrutura de sessão, banco de dados e persistência server-side no MVP.

5. Idioma da UI: pt-BR
   - Justificativa: o público do projeto e a documentação do treinamento indicam a preferência por interface em português do Brasil, alinhando a experiência com o contexto do usuário.
   - Resolve: fecha a incerteza sobre idioma do sistema e evita retrabalho em textos, labels e mensagens de erro.
