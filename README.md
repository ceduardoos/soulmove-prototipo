# SoulMove — protótipo Sprint 3

Protótipo navegável HTML/CSS/JavaScript integrado à experiência SoulUP. A versão atual mantém feed, stories, comunidades, três Clipz, carteira, marketplace e arte da campanha, e atualiza as regras da remodelação.

## Experimentar

Sirva `dist` com um servidor estático, por exemplo `python3 -m http.server 4173 --directory dist`. A configuração Vercel existente publica `dist` sem build.

1. No feed, abra **SoulMove**, no topo.
2. Inicie uma **jornada livre** ou abra e aceite uma **campanha**.
3. Autorize o registro, informe linha/sentido e inicie. D01/D02 são linhas fictícias elegíveis da campanha; D03 permite testar uma linha inelegível.
4. Adicione integração para representar outro ônibus na mesma jornada. Encerre, acrescente mídia simulada opcional e envie à validação.
5. Confira resultado, histórico, Liga/Temporada e cartão compartilhável.
6. Na campanha, completar a terceira jornada elegível (o cenário começa com duas anteriores) emite uma única recompensa de 12 Pontos Soul. Abra a oferta, escolha se deseja emitir cupom e simule uma compra confirmada.
7. Na preparação, expanda **Cenário de validação** para testar evidências insuficientes ou incompatibilidade. O histórico permite protocolar contestação.
8. Alterne para **SoulBusiness** para métricas agregadas, rascunho de campanha e encerramento/relatório.

O botão Reiniciar limpa a sessão. Recarregar a página também limpa os dados: não existe banco de dados ou persistência entre sessões.

## Regras representadas

- Jornada livre permanece disponível sem campanha; uma jornada tem um ou vários trechos e um único resultado.
- Ônibus urbano é o modal atual. Espera/caminhada não entram na distância pontuada. Identificação automática e outros modais continuam futuros.
- Pontos de Impacto são distintos de Pontos Soul. Todas as jornadas validadas entram na Liga e na Temporada, sem limite diário; compras/cliques/compartilhamentos não pontuam.
- Liga: segunda a domingo em São Paulo, sem benefício financeiro presumido. Temporada: mensal; a edição com prêmio de energia permanece não habilitada enquanto suas dependências não forem definidas.
- Campanha independente, selecionada antes da jornada; no máximo uma campanha avançada por jornada. Elegibilidade da campanha é distinta da elegibilidade competitiva.
- Reserva de cobertura na adesão, consumo ao emitir uma recompensa, sem nova reserva no início e sem crédito duplicado.
- Consentimento não inicia coleta. Encerramento/cancelamento/revogação interrompem registro. Foto/vídeo são opcionais.
- Validada, inconclusiva, não validada e cancelada são resultados distintos. Contestação registra protocolo sem alterar automaticamente resultado/premiação.
- Oferta aberta, cupom emitido e compra confirmada são eventos separados. Nenhuma compra é obrigatória.
- Consultar ranking não homologa ciclo. Relatório final de campanha exige fechamento e homologação simulada da SoulUP; jornadas/contestações pendentes impedem fechamento definitivo.
- Benefícios emitidos preservam validade após encerramento. Relatórios são agregados, versionados e exportáveis; pequenos recortes são suprimidos.

## Dados e dependências explícitas

Toda a demonstração ocorre em 13/09/2026. O valor de 68 Pontos de Impacto por jornada é um **fixture**, não uma fórmula de produto. A fórmula 0–100, parâmetros de distância/tempo, metodologia de emissões, desempate e política de revisão dependem de validação.

Campanha VIVA, linhas D01–D03, período 10–25/09, validade da oferta até 30/09, orçamento de R$ 12.000 e custo de cobertura de R$ 36 por pacote são **condições fictícias do cenário**, não regras globais aprovadas nem parceria/condição comercial real. R$ 36 não é cotação de Pontos Soul. A regra de todos os trechos elegíveis e o teto de duas jornadas de campanha por dia pertencem apenas ao exemplo.

GPS, checkpoints, validação, mídia, recompensas, publicação Clipz, compra e operação SoulBusiness são simulados. Não há geolocalização real, API oficial de transporte, crédito financeiro, autenticação empresarial ou upload de documentos. Os seletores de perspectiva e homologação servem ao apresentador e não constituem controle de acesso de produção.

Compartilhamento externo usa Web Share quando disponível; a resposta não confirma publicação no destino. O cartão pode ser salvo como SVG. Relatórios são TXT. Nenhum resultado representa crédito de carbono.

## Fontes de continuidade

- Documento do projeto `SoulMove_Sprint3_Em_Desenvolvimento.docx`, versão disponível de 12/09/2026, especialmente seção 2 (mais recente que as seções legadas seguintes).
- Revisão das instruções DA01–DA15 e correções enviadas pelo usuário nesta atualização: DA06 consulta sem homologação; DA07 oferta sem compra obrigatória; orçamento reservado por limite individual; DA10 revisão sem duplicação; DA13 corte, homologação e validade; DA14/DA15 futuros.

A recuperação de contexto não disponibilizou integralmente todos os chats. Essas fontes prevalecem sobre conceitos legados. Não foi alterado o documento acadêmico nesta etapa.

## Arquivos

- `dist/app.js`: componentes e interações originais da experiência SoulUP.
- `dist/sprint3.js`: regras de estado, telas e interações remodeladas; carregado após `app.js`.
- `dist/styles.css`: estilos originais e extensão visual da Sprint 3.
- `dist/assets/soulmove-campaign.webp`: arte original preservada.

## Verificação

Verificação de sintaxe JavaScript e cenários de estado: separação livre/campanha, integração única, teto diário, linha inelegível, recompensa única/reserva, resultados alternativos e conciliação de fechamento. Limitações de verificação visual/publicação devem ser relatadas separadamente da implementação.

### Reconhecimento semanal (lote 3)
Cada uma das duas primeiras rotas livres validadas da semana libera um selo e um cartão com a posição no desbloqueio. Rotas de campanha não consomem esse reconhecimento. O término da jornada, no horário de São Paulo, define sua semana e seu mês. O limite de duas jornadas elegíveis de campanha por dia permanece separado do placar.
