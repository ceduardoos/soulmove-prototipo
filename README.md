# SoulMove — protótipo-base

Protótipo HTML/CSS/JavaScript da jornada SoulMove, construído para demonstrar a integração da funcionalidade com a interface atual da SoulUP e servir como base para evolução posterior.

## Objetivo do protótipo

Demonstrar, por meio de cliques e estados simulados, o ciclo completo:

1. exploração da experiência SoulUP com feed rolável, stories, Comunidades, Clipz, carteira e marketplace;
2. descoberta de uma campanha patrocinada nesses pontos de contato;
3. visualização da campanha;
4. aceite das regras e consentimento de localização;
5. início de uma jornada demonstrativa;
6. coleta da prova principal por telemetria e checkpoints;
7. inclusão opcional de foto ou vídeo como prova complementar;
8. validação antifraude simulada;
9. crédito demonstrativo de **+12 Pontos Soul**;
10. evolução e consulta do ranking da campanha;
11. criação de um cartão enriquecido e compartilhamento no Clipz, comunidade ou outros aplicativos;
12. desbloqueio de benefício;
13. registro de conversão;
14. atualização do SoulBusiness, incluindo métricas sociais agregadas.

## Estrutura

- `dist/index.html`: estrutura principal e controles do protótipo.
- `dist/styles.css`: sistema visual inspirado nas referências da SoulUP.
- `dist/app.js`: dados da campanha, estado da demonstração, telas e interações.
- `dist/assets/soulmove-campaign.webp`: arte original da campanha demonstrativa.
- `.openai/hosting.json`: configuração de publicação.

## O que é funcional

- navegação entre feed, cinco stories, Comunidades, três Clipz, carteira e marketplace;
- curtidas, comentários demonstrativos e rolagem de conteúdo;
- carteira inspirada no fluxo real da SoulUP, com cartão de saldo, quatro atalhos e extrato de Pontos Soul;
- marketplace em formato de catálogo, com busca, categorias, grade de lojas, ofertas e dúvidas frequentes;
- consentimentos obrigatórios;
- simulação progressiva da jornada;
- escolha opcional entre foto, vídeo ou nenhuma prova complementar;
- tela de validação;
- atualização de pontos e registro de +12 Pontos Soul na carteira;
- ranking por jornadas válidas e constância, com controle de visibilidade;
- cartão com progresso, posição, conquista e impacto estimado;
- opções simuladas de compartilhamento;
- benefício e cupom;
- registro de conversão;
- atualização dos indicadores no SoulBusiness;
- reinício da demonstração.

## O que está simulado

- telemetria, GPS e checkpoints;
- captura e envio de foto ou vídeo;
- integração com SPTrans;
- motor antifraude;
- crédito real de pontos;
- publicação real no Clipz;
- cupom, leitura fiscal e compra;
- métricas da campanha;
- cálculo de emissões evitadas.
- participantes, posições e métricas sociais do ranking.

## Pontos de extensão

O arquivo `app.js` começa com três estruturas centrais:

- `campaign`: textos e parâmetros da campanha;
- `baseMetrics`: dados demonstrativos do SoulBusiness;
- `state`: situação atual da jornada.

Para uma evolução posterior, preserve o fluxo e substitua gradualmente:

1. renderização por componentes;
2. dados estáticos por uma API;
3. sequência simulada por geolocalização real;
4. regras visuais por um serviço de validação;
5. atualização local por persistência em banco;
6. cupom simulado por integração de marketplace ou leitura fiscal.

## Restrições de produto que devem ser preservadas

- SoulMove é uma funcionalidade integrada à SoulUP, não um aplicativo separado.
- Não substitui aplicativos de rota e não vende passagens.
- O patrocinador recebe apenas resultados agregados.
- Trajetos individuais não aparecem no SoulBusiness.
- O impacto ambiental é uma estimativa demonstrativa, não crédito de carbono.
- O custo das recompensas pertence ao orçamento da campanha patrocinada.
- Telemetria e checkpoints são a prova principal; foto ou vídeo são complementares e opcionais.
- A mídia opcional é tratada na validação e não é entregue ao patrocinador.
- A conversão comercial complementa a mobilidade; não substitui o diferencial do SoulMove.
- O ranking não premia distância ou velocidade: considera jornadas válidas, limite diário e constância.
- Cartões compartilháveis não exibem origem, destino, trajeto ou horário exato.
