// SoulMove prototype skeleton.
// Product data, demo state and screen rendering are intentionally separated so
// another developer or AI model can evolve the interface without rewriting the flow.

const campaign = {
  sponsor: "VIVA",
  title: "Sua jornada vale mais",
  goal: "Complete 3 jornadas de menor emissão até domingo.",
  reward: "12 Pontos Soul + oferta exclusiva",
  rewardPoints: 12,
  distanceKm: 8.4,
  avoidedKg: 1.1,
  coupon: "MOVE15",
  totalJourneys: 3,
  completedJourneys: 2,
  rankBefore: 24,
  rankAfter: 18,
  activeDays: 2,
};

const baseMetrics = {
  reached: 1240,
  participants: 312,
  started: 274,
  validated: 231,
  benefits: 188,
  offerVisits: 96,
  conversions: 27,
  rankingViews: 418,
  shares: 74,
  visitsFromShares: 129,
};

const initialState = () => ({
  perspective: "user",
  screen: "feed",
  points: 520,
  joined: false,
  consentLocation: false,
  consentRules: false,
  journeyStarted: false,
  journeyProgress: 0,
  validated: false,
  rankingViewed: false,
  rankingVisible: true,
  activeStory: "campaign",
  activePost: "campaign",
  commentsReturn: "feed",
  overlayReturn: "feed",
  likedPosts: [],
  likedClipz: [],
  userComments: {},
  proofType: "",
  walletBalanceVisible: true,
  marketplaceQuery: "",
  marketplaceCategory: "Todos",
  sharePublished: false,
  shareChannel: "",
  benefitUnlocked: false,
  conversion: false,
});

let state = initialState();
let journeyTimers = [];
let toastTimer;

const root = document.querySelector("#prototype-root");
const toast = document.querySelector("#toast");

function icon(name, size = 20) {
  const icons = {
    wallet: '<rect x="2" y="5" width="20" height="15" rx="3"/><path d="M16 10h6v5h-6a2.5 2.5 0 0 1 0-5Z"/><path d="M5 5V3h13v2"/>',
    bag: '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-3-2-6-5-9 0 3-2 4-3 5 0-3-1-6-3-8 0 5-4 7-4 12 0 4 4 7 8 7Z"/>',
    house: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
    users: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-4 2-6 6-6s6 2 6 6"/><path d="M15 15c3 0 5 2 5 5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
    message: '<path d="M4 4h16v12H8l-4 4V4Z"/>',
    badge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.2-1.3-2-3-2s-3 .8-3 2 1.3 2 3 2 3 .8 3 2-1.3 2-3 2-3-.8-3-2"/>',
    leaf: '<path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M4 21c3-6 7-9 13-12"/>',
    ellipsis: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    heart: '<path d="M20.5 9c0 6-8.5 11-8.5 11S3.5 15 3.5 9A4.5 4.5 0 0 1 12 6.8 4.5 4.5 0 0 1 20.5 9Z"/>',
    arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9H8a2.5 2.5 0 1 1 4-2.5V9Zm0 0h4a2.5 2.5 0 1 0-4-2.5V9Z"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    video: '<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 9 4-2v10l-4-2"/>',
    share: '<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3 8 8 10 5-2 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    cart: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2 11h11l2-8H6"/>',
    trophy: '<path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 12v5M8 21h8M9 17h6"/>',
    trend: '<path d="m4 16 5-5 4 4 7-8"/><path d="M15 7h5v5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',
    camera: '<path d="M4 7h4l2-2h4l2 2h4v12H4V7Z"/><circle cx="12" cy="13" r="4"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 17 5-4 4 3 3-2 6 4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.7"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6"/>',
    bulb: '<path d="M9 18h6M10 22h4"/><path d="M8.5 15.5A6 6 0 1 1 15.5 15.5C14.6 16.1 14 17 14 18h-4c0-1-.6-1.9-1.5-2.5Z"/>',
    bolt: '<path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/>',
    sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  };
  const path = icons[name] || icons.target;
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function clearJourneyTimers() {
  journeyTimers.forEach(clearTimeout);
  journeyTimers = [];
}

function systemBar() {
  return '<div class="system-bar"><span>19:20</span><span>5G&nbsp;&nbsp;29%</span></div>';
}

function topBar() {
  return `<header class="app-topbar">
    <button class="balance-pill" type="button" data-action="wallet">${icon("wallet", 18)}<span>${state.points} Pts</span></button>
    <button class="icon-button" type="button" aria-label="Marketplace" data-action="marketplace">${icon("bag")}</button>
    <span class="top-spacer"></span>
    <button class="icon-button" type="button" aria-label="Pesquisar" data-action="prototype-notice" data-message="Busca representada apenas visualmente nesta demonstração">${icon("search")}</button>
    <button class="icon-button" type="button" aria-label="Atividades" data-action="prototype-notice" data-message="Você está em uma sequência de 2 dias">${icon("flame")}</button>
    <span class="avatar" aria-label="Perfil">CE</span>
  </header>`;
}

function bottomNav(active) {
  return `<nav class="bottom-nav" aria-label="Navegação da SoulUP">
    <button class="nav-button ${active === "feed" ? "active" : ""}" type="button" data-nav="feed" aria-label="Início">${icon("house")}</button>
    <button class="nav-button ${active === "communities" ? "active" : ""}" type="button" data-nav="communities" aria-label="Comunidades">${icon("users")}</button>
    <button class="nav-button" type="button" data-action="prototype-notice" data-message="Criação de conteúdo simulada neste protótipo" aria-label="Criar conteúdo"><span class="nav-plus">${icon("plus")}</span></button>
    <button class="nav-button ${active === "clipz" ? "active" : ""}" type="button" data-nav="clipz" aria-label="Clipz">${icon("play")}</button>
    <button class="nav-button" type="button" data-action="prototype-notice" data-message="Mensagens não fazem parte desta demonstração" aria-label="Conversas">${icon("message")}</button>
  </nav>`;
}

function phone(content, options = {}) {
  const showTop = options.top !== false;
  const showBottom = options.bottom !== false;
  return `<div class="user-stage"><section class="phone" aria-label="Aplicativo SoulUP com SoulMove">
    ${systemBar()}
    ${showTop ? topBar() : ""}
    <main class="phone-main">${content}</main>
    ${showBottom ? bottomNav(options.active || "feed") : ""}
  </section></div>`;
}

function isLiked(collection, id) { return state[collection].includes(id); }
function completedUserJourneys() { return Math.min(campaign.totalJourneys, campaign.completedJourneys + (state.validated ? 1 : 0)); }

function socialActions(id, baseLikes, baseComments, collection = "likedPosts") {
  const liked = isLiked(collection, id);
  const comments = baseComments + (state.userComments[id] ? 1 : 0);
  const likeAction = collection === "likedClipz" ? "toggle-clipz-like" : "toggle-post-like";
  return `<div class="post-actions social-actions"><button class="social-button ${liked ? "active" : ""}" type="button" data-action="${likeAction}" data-id="${id}" aria-label="Curtir">${icon("heart")}<span>${baseLikes + (liked ? 1 : 0)}</span></button><button class="social-button" type="button" data-action="open-comments" data-id="${id}" aria-label="Comentários">${icon("message")}<span>${comments}</span></button><button class="social-button" type="button" data-action="share-post" aria-label="Compartilhar">${icon("share")}</button></div>`;
}

function renderFeed() {
  return phone(`
    <section class="stories" aria-label="Stories">
      <button class="story" type="button" data-action="open-story" data-story="ads"><span class="story-ring"><span class="story-core">${icon("badge")}</span></span><span class="story-label">Ads</span></button>
      <button class="story" type="button" data-action="open-story" data-story="campaign"><span class="story-ring"><span class="story-core story-photo"></span></span><span class="story-label">SoulMove</span></button>
      <button class="story" type="button" data-action="open-story" data-story="community"><span class="story-ring"><span class="story-core story-community">${icon("users")}</span></span><span class="story-label">Mobilidade</span></button>
      <button class="story" type="button" data-action="open-story" data-story="marketplace"><span class="story-ring"><span class="story-core story-market">${icon("bag")}</span></span><span class="story-label">Benefícios</span></button>
      <button class="story" type="button" data-action="prototype-notice" data-message="Criação de story simulada neste protótipo"><span class="story-ring muted"><span class="story-core">${icon("plus")}</span></span><span class="story-label">Seu story</span></button>
    </section>
    <article class="feed-post">
      <header class="post-head"><span class="post-avatar user-one">LS</span><div class="post-author"><strong>Luiza Santos</strong><span>Comunidade Mobilidade em movimento • 18 min</span></div>${icon("ellipsis")}</header>
      <div class="organic-post-card"><span>${icon("flame", 24)}</span><small>META DA SEMANA</small><h2>Dois dias escolhendo um caminho mais leve para a cidade.</h2><p>Pequenas escolhas ficam melhores quando a comunidade acompanha.</p></div>
      ${socialActions("community", 42, 6)}
      <p class="caption"><strong>Luiza Santos</strong> Começando a semana com constância 💙</p>
    </article>
    <article class="feed-post campaign-post">
      <header class="post-head"><span class="post-avatar brand">${icon("leaf", 18)}</span><div class="post-author"><strong>${campaign.sponsor}</strong><span>Patrocinado • campanha demonstrativa</span></div>${icon("ellipsis")}</header>
      <button class="campaign-art" type="button" data-action="open-campaign"><img src="./assets/soulmove-campaign.webp" alt="Passageira utilizando transporte público em uma cidade"><span class="campaign-art-overlay"><span><small>DESAFIO SOULMOVE</small><h1>${campaign.title}</h1><p>Três jornadas de menor emissão nesta semana.</p></span><span class="campaign-reward">+${campaign.rewardPoints} Pontos Soul + benefício</span></span></button>
      ${socialActions("campaign", 186, 23)}
      <button class="feed-cta" type="button" data-action="open-campaign">Conhecer a campanha ${icon("arrow", 17)}</button>
      <p class="caption"><strong>${campaign.sponsor}</strong> Reconheça deslocamentos que já fazem parte da sua rotina.</p>
    </article>
    <article class="feed-post">
      <header class="post-head"><span class="post-avatar user-two">RM</span><div class="post-author"><strong>Rafael Martins</strong><span>Compartilhou uma conquista SoulMove • 1 h</span></div>${icon("ellipsis")}</header>
      <button class="achievement-post" type="button" data-action="ranking"><span class="achievement-label">${icon("check", 15)} JORNADA VALIDADA</span><h2>${campaign.title}</h2><div class="achievement-stats"><div><strong>7,1 km</strong><span>transporte público</span></div><div><strong>+${campaign.rewardPoints}</strong><span>Pontos Soul</span></div><div><strong>#12</strong><span>ranking</span></div></div><p>2 de 3 jornadas concluídas</p></button>
      ${socialActions("achievement", 73, 11)}
      <p class="caption"><strong>Rafael Martins</strong> Mais uma jornada concluída! 🌿</p>
    </article>
    <article class="feed-post">
      <header class="post-head"><span class="post-avatar market-avatar">${icon("bag", 18)}</span><div class="post-author"><strong>Soul Marketplace</strong><span>Benefícios para a comunidade • 3 h</span></div>${icon("ellipsis")}</header>
      <button class="marketplace-post-card" type="button" data-action="marketplace"><small>NOVAS OFERTAS</small><h2>Seus Pontos Soul também viram benefícios.</h2><p>Conheça recompensas de mobilidade, bem-estar e consumo consciente.</p><span>Explorar marketplace ${icon("chevron", 16)}</span></button>
      ${socialActions("marketplace", 91, 14)}
    </article>`, { active: "feed" });
}

function renderCommunities() {
  return phone(`<section class="page">
    <header class="page-title-row"><div><h1>Comunidades</h1><p class="page-subtitle">Encontre, participe e crie comunidades que combinam com você.</p></div>${icon("search")}</header>
    <section class="community-hero">${icon("users", 24)}<h2>Mobilidade em movimento</h2><p>Participe de missões e acompanhe conquistas da comunidade SoulMove.</p><button class="light-button" type="button" data-action="open-campaign">Ver missão da comunidade</button></section>
    <h2 class="section-heading">Missão em destaque</h2>
    <button class="mission-line" type="button" data-action="open-campaign"><span class="mission-logo">${icon("leaf")}</span><span class="mission-copy"><strong>${campaign.title}</strong><span>3 jornadas • Pontos Soul • oferta exclusiva</span></span>${icon("chevron")}</button>
  </section>`, { active: "communities" });
}

function clipzSide(id, likes, comments) {
  const liked = isLiked("likedClipz", id);
  return `<div class="clipz-side"><button class="${liked ? "active" : ""}" type="button" data-action="toggle-clipz-like" data-id="${id}">${icon("heart")}<span>${likes + (liked ? 1 : 0)}</span></button><button type="button" data-action="open-comments" data-id="${id}">${icon("message")}<span>${comments + (state.userComments[id] ? 1 : 0)}</span></button><button type="button" data-action="share-post">${icon("share")}<span>Enviar</span></button></div>`;
}

function renderClipz() {
  return phone(`<section class="clipz-screen"><header class="clipz-head"><span></span><div class="clipz-tabs"><button class="clipz-tab active" type="button">Clipz</button><button class="clipz-tab" type="button" data-action="prototype-notice" data-message="Filtro Amigos representado visualmente">Amigos</button></div><button class="create-clip" type="button" data-action="prototype-notice" data-message="Criação de Clipz simulada"><span class="create-circle">${icon("video")}</span>CRIAR</button></header>
    <div class="clipz-feed" aria-label="Conteúdos Clipz roláveis">
      <article class="clipz-slide clipz-routine"><div class="clipz-copy"><small>@luizasantos • COMUNIDADE</small><h1>Minha cidade começa nas escolhas da rotina</h1><p>Hoje fui de transporte público e aproveitei o caminho para desacelerar.</p><span class="clipz-hint">Role para ver o próximo Clipz ↓</span></div>${clipzSide("clipz-routine", 324, 38)}<div class="clipz-user"><span class="post-avatar user-one">LS</span><div><strong>Luiza Santos</strong><br><small>#MobilidadeEmMovimento</small></div></div></article>
      <article class="clipz-slide clipz-campaign"><img src="./assets/soulmove-campaign.webp" alt="Passageira em transporte público"><div class="clipz-shade"></div><div class="clipz-copy"><small>${campaign.sponsor} • CONTEÚDO PATROCINADO</small><h1>Sua jornada vale mais</h1><p>Complete três jornadas, receba ${campaign.rewardPoints} Pontos Soul e desbloqueie uma oferta.</p><button class="dark-outline-button" type="button" data-action="open-campaign">Participar da missão</button></div>${clipzSide("clipz-campaign", 512, 64)}<div class="clipz-user"><span class="post-avatar brand">${icon("leaf", 18)}</span><div><strong>${campaign.sponsor}</strong><br><small>Campanha demonstrativa</small></div></div></article>
      <article class="clipz-slide clipz-achievement"><div class="clipz-copy"><small>@rafaelmartins • CONQUISTA SOULMOVE</small><span class="clipz-check">${icon("check", 22)}</span><h1>Jornada validada</h1><div class="clipz-result-grid"><div><strong>7,1 km</strong><span>transporte público</span></div><div><strong>+${campaign.rewardPoints}</strong><span>Pontos Soul</span></div><div><strong>#12</strong><span>ranking</span></div></div><p>Constância que vira conquista e inspira a comunidade.</p><button class="dark-outline-button" type="button" data-action="open-campaign">Conhecer o desafio</button></div>${clipzSide("clipz-achievement", 271, 29)}<div class="clipz-user"><span class="post-avatar user-two">RM</span><div><strong>Rafael Martins</strong><br><small>2 de 3 jornadas</small></div></div></article>
    </div>
  </section>`, { top: false, active: "clipz" });
}

function innerScreen(title, body, footer = "") {
  return phone(`<header class="inner-header"><button class="icon-button" type="button" data-action="back">${icon("back")}</button><strong>${title}</strong><span></span></header>${body}${footer}`, { top: false, bottom: false });
}

function renderCampaignDetail() {
  return innerScreen("Campanha", `<section class="page">
    <div class="campaign-visual"><small>Campanha demonstrativa • ${campaign.sponsor}</small><h1>${campaign.title}</h1><p>Transforme deslocamentos que já fazem parte da sua rotina em impacto e benefícios.</p></div>
    <div class="info-row">${icon("target")}<div><strong>Meta da campanha</strong><span>${campaign.goal}</span></div></div>
    <div class="info-row">${icon("gift")}<div><strong>Recompensa demonstrativa</strong><span>${campaign.reward}.</span></div></div>
    <div class="info-row">${icon("shield")}<div><strong>Privacidade</strong><span>A marca recebe resultados agregados, nunca seu trajeto individual.</span></div></div>
    <div class="info-row">${icon("route")}<div><strong>Prova principal</strong><span>Telemetria — GPS, tempo e velocidade — combinada com checkpoints em sequência.</span></div></div>
    <div class="info-row">${icon("camera")}<div><strong>Prova complementar opcional</strong><span>Ao finalizar, você poderá anexar uma foto ou um vídeo. Isso não é obrigatório para concluir a jornada.</span></div></div>
    <div class="info-row">${icon("trophy")}<div><strong>Ranking da campanha</strong><span>Jornadas válidas e constância aproximam você da meta. Distância e velocidade não definem a posição.</span><button class="inline-link" type="button" data-action="ranking">Ver ranking da comunidade</button></div></div>
  </section>`, `<footer class="sticky-action"><button class="primary-button" type="button" data-action="join">${state.joined ? "Continuar campanha" : "Participar da campanha"}</button></footer>`);
}

function renderConsent() {
  const enabled = state.consentLocation && state.consentRules;
  return innerScreen("Permissões", `<section class="form-section">
    <h1>Antes de começar</h1><p>Você controla os dados utilizados para validar sua participação.</p>
    <label class="consent-option"><input type="checkbox" data-consent="location" ${state.consentLocation ? "checked" : ""}><span><strong>Localização durante a jornada</strong><span>Permite registrar GPS, tempo e checkpoints somente enquanto a missão estiver ativa.</span></span></label>
    <label class="consent-option"><input type="checkbox" data-consent="rules" ${state.consentRules ? "checked" : ""}><span><strong>Regras da campanha</strong><span>Confirmo que li os critérios de validação e de concessão da recompensa.</span></span></label>
    <div class="privacy-note">O patrocinador verá apenas indicadores agregados. A câmera será solicitada somente se você optar por uma prova complementar; o anexo não será exibido à marca.</div>
  </section>`, `<footer class="sticky-action"><button class="primary-button" type="button" data-action="consent-continue" ${enabled ? "" : "disabled"}>Confirmar e continuar</button></footer>`);
}

function renderReady() {
  return innerScreen("SoulMove", `<section class="form-section">
    <h1>Pronto para sua jornada?</h1><p>Inicie quando já estiver preparado para o deslocamento. Você não precisa acompanhar o celular durante o percurso.</p>
    <div class="ready-summary"><div class="ready-row"><span>Campanha</span><strong>${campaign.title}</strong></div><div class="ready-row"><span>Meta</span><strong>3 jornadas</strong></div><div class="ready-row"><span>Prova principal</span><strong>Telemetria + checkpoints</strong></div><div class="ready-row"><span>Recompensa</span><strong>${campaign.reward}</strong></div></div>
    <div class="proof-explainer"><span>${icon("shield", 22)}</span><div><strong>A validação principal acontece em segundo plano</strong><p>Foto ou vídeo poderão ser adicionados ao final apenas como prova complementar.</p></div></div>
    <div class="privacy-note">Para a demonstração, o protótipo reproduzirá uma sequência simulada de localização.</div>
  </section>`, `<footer class="sticky-action"><button class="primary-button" type="button" data-action="start-journey">Iniciar jornada demonstrativa</button></footer>`);
}

function renderJourney() {
  return phone(`<section class="journey-page">
    <div class="journey-status"><span class="status-dot"></span>Telemetria em andamento</div><h1>Continue seu deslocamento</h1><p>GPS, tempo, velocidade e checkpoints são registrados em segundo plano. Não interaja com o celular durante o percurso.</p>
    <div class="checkpoint-track"><div class="track-line"><div class="track-progress" id="track-progress"></div><span class="checkpoint" data-checkpoint="1">${icon("pin", 16)}</span><span class="checkpoint" data-checkpoint="2">${icon("pin", 16)}</span><span class="checkpoint" data-checkpoint="3">${icon("pin", 16)}</span><span class="checkpoint" data-checkpoint="4">${icon("check", 16)}</span></div></div>
    <div class="journey-metrics"><div class="journey-metric"><strong id="journey-time">00:00</strong><span>tempo simulado</span></div><div class="journey-metric"><strong id="journey-distance">0,0 km</strong><span>distância</span></div><div class="journey-metric"><strong id="journey-checkpoints">0/4</strong><span>checkpoints</span></div></div>
    <button class="primary-button" id="finish-journey" type="button" data-action="finish-journey" disabled>Concluir prova principal</button>
  </section>`, { top: false, bottom: false });
}

function renderProof() {
  const selected = state.proofType;
  return innerScreen("Provas da jornada", `<section class="page proof-page"><span class="proof-complete">${icon("check", 22)}</span><h1>Prova principal recebida</h1><p class="page-subtitle">A telemetria e os quatro checkpoints já são suficientes para enviar esta jornada à validação.</p>
    <div class="primary-proof"><div>${icon("route", 22)}<span><strong>Telemetria</strong><small>GPS, tempo e velocidade</small></span>${icon("check", 18)}</div><div>${icon("pin", 22)}<span><strong>Checkpoints</strong><small>4 pontos em sequência</small></span>${icon("check", 18)}</div></div>
    <div class="optional-proof-heading"><div><h2>Prova complementar</h2><p>Foto ou vídeo são opcionais e reforçam a análise quando o desafio solicitar contexto adicional.</p></div><span>OPCIONAL</span></div>
    <div class="proof-options"><button class="${selected === "Foto" ? "selected" : ""}" type="button" data-action="select-proof" data-proof="Foto">${icon("camera", 23)}<strong>Foto</strong><small>Captura simulada</small></button><button class="${selected === "Vídeo" ? "selected" : ""}" type="button" data-action="select-proof" data-proof="Vídeo">${icon("video", 23)}<strong>Vídeo</strong><small>Registro simulado</small></button></div>
    ${selected ? `<div class="proof-selected">${icon(selected === "Foto" ? "image" : "video", 22)}<span><strong>${selected} adicionada</strong><small>Prova complementar demonstrativa pronta para envio.</small></span><button type="button" data-action="remove-proof">Remover</button></div>` : `<div class="proof-empty">Você pode continuar sem anexar nenhuma mídia.</div>`}
    <div class="privacy-note">A prova complementar seria utilizada somente na validação e seguiria regras de retenção. Ela não seria entregue ao patrocinador.</div>
  </section>`, `<footer class="sticky-action"><button class="primary-button" type="button" data-action="submit-proof">${selected ? `Enviar ${selected.toLowerCase()} e validar` : "Validar sem prova complementar"}</button></footer>`);
}

function renderValidation() {
  return phone(`<section class="validation-page"><div class="spinner" aria-hidden="true"></div><h1>Validando sua jornada</h1><p>O SoulMove está conferindo as evidências e aplicando as regras antifraude.</p><div class="validation-list"><div class="validation-label">PROVA PRINCIPAL</div><div class="validation-item complete">${icon("check")} Telemetria: GPS, tempo e velocidade</div><div class="validation-item complete">${icon("check")} Checkpoints e sequência compatível</div><div class="validation-label complementary">PROVA COMPLEMENTAR</div><div class="validation-item ${state.proofType ? "complete" : "optional"}">${icon(state.proofType ? "check" : "camera")} ${state.proofType ? `${state.proofType} demonstrativa anexada` : "Não anexada — etapa opcional"}</div></div></section>`, { top: false, bottom: false });
}

function renderResult() {
  return phone(`<section class="success-page"><span class="success-icon">${icon("check", 36)}</span><h1>Jornada validada!</h1><p>Os sinais da demonstração atingiram o nível de confiança necessário.</p>
    <div class="result-summary"><div><strong>+${campaign.rewardPoints}</strong><span>Pontos Soul</span></div><div><strong>${campaign.distanceKm.toFixed(1).replace(".", ",")} km</strong><span>distância</span></div><div><strong>${campaign.avoidedKg.toFixed(1).replace(".", ",")} kg</strong><span>CO₂ estimado*</span></div></div>
    <button class="wallet-credit-link" type="button" data-action="wallet-detail">${icon("wallet", 18)} <span><strong>+${campaign.rewardPoints} Pontos Soul creditados</strong><small>Ver movimentação na carteira</small></span>${icon("chevron", 17)}</button>
    <button class="rank-update" type="button" data-action="ranking"><span class="rank-position">#${campaign.rankAfter}</span><span><strong>Você subiu ${campaign.rankBefore - campaign.rankAfter} posições</strong><small>${completedUserJourneys()} de ${campaign.totalJourneys} jornadas • ${campaign.activeDays + 1} dias em movimento</small></span>${icon("chevron")}</button>
    <div class="action-stack"><button class="primary-button" type="button" data-action="benefit">Ver benefício desbloqueado</button><button class="secondary-button" type="button" data-action="ranking">Ver ranking da campanha</button><button class="secondary-button" type="button" data-action="share">Criar cartão compartilhável</button></div>
    <p class="page-subtitle" style="margin-top:14px">*Estimativa demonstrativa, não auditada e sem geração de crédito de carbono.</p>
  </section>`, { top: false, bottom: false });
}

const rankingLeaders = [
  { position: 1, name: "Marina S.", journeys: 3, days: 3, initials: "MS" },
  { position: 2, name: "Rafael M.", journeys: 3, days: 3, initials: "RM" },
  { position: 3, name: "Bianca L.", journeys: 3, days: 2, initials: "BL" },
];

const rankingNearby = [
  { position: 17, name: "Diego N.", journeys: 2, days: 2, initials: "DN" },
  { position: 18, name: "Você", journeys: 2, days: 2, initials: "CE", current: true },
  { position: 19, name: "Aline P.", journeys: 2, days: 1, initials: "AP" },
];

function renderRanking() {
  const completed = completedUserJourneys();
  const currentRank = state.validated ? campaign.rankAfter : campaign.rankBefore;
  const rankGain = state.validated ? campaign.rankBefore - campaign.rankAfter : 0;
  const podium = rankingLeaders.map(person => `<article class="podium-card position-${person.position}"><span class="podium-place">${person.position}º</span><span class="ranking-avatar">${person.initials}</span><strong>${person.name}</strong><small>${person.journeys}/${campaign.totalJourneys} jornadas</small><span>${person.days} dias ativos</span></article>`).join("");
  const nearby = rankingNearby.map(person => { const position = state.validated ? person.position : person.position + 6; return `<article class="ranking-row ${person.current ? "current" : ""}"><strong class="ranking-position">${position}º</strong><span class="ranking-avatar">${person.initials}</span><span class="ranking-name"><strong>${person.name}</strong><small>${person.current ? completed : person.journeys}/${campaign.totalJourneys} jornadas • ${person.current && state.validated ? person.days + 1 : person.days} dias ativos</small></span>${person.current && state.validated ? `<span class="ranking-rise">${icon("trend", 16)} +${rankGain}</span>` : ""}</article>`; }).join("");
  return innerScreen("Ranking", `<section class="page ranking-page">
    <div class="ranking-hero"><span>${icon("trophy", 25)}</span><div><small>${campaign.sponsor} • campanha demonstrativa</small><h1>${campaign.title}</h1><p>Classificação por jornadas válidas e constância.</p></div></div>
    <div class="your-rank"><div><span>Sua posição</span><strong>#${currentRank}</strong></div><div><span>Evolução</span><strong>${rankGain ? `+${rankGain}` : "—"}</strong></div><div><span>Progresso</span><strong>${completed}/${campaign.totalJourneys}</strong></div></div>
    <h2 class="section-heading">Destaques da comunidade</h2><div class="podium">${podium}</div>
    <h2 class="section-heading">Perto de você</h2><div class="ranking-list">${nearby}</div>
    <button class="secondary-button" type="button" data-action="ranking-rules">Como funciona o ranking?</button>
  </section>`);
}

function renderRankingRules() {
  return innerScreen("Critérios do ranking", `<section class="page ranking-rules"><h1>Competição sem incentivar viagens extras</h1><p class="page-subtitle">O ranking reconhece o cumprimento da missão, não quem percorre a maior distância.</p>
    <div class="info-row">${icon("shield")}<div><strong>Somente jornadas validadas</strong><span>Deslocamentos reprovados pelas regras antifraude não alteram a classificação.</span></div></div>
    <div class="info-row">${icon("clock")}<div><strong>Limite diário</strong><span>No máximo uma jornada pontuável por dia, conforme as regras desta campanha.</span></div></div>
    <div class="info-row">${icon("trend")}<div><strong>Constância como desempate</strong><span>Quem cumpre a missão em dias diferentes ganha destaque sem precisar viajar mais.</span></div></div>
    <div class="info-row">${icon("route")}<div><strong>Distância não dá vantagem</strong><span>Quilômetros, velocidade e estimativa ambiental não determinam a posição.</span></div></div>
    <label class="visibility-control"><span><strong>Aparecer no ranking</strong><small>Você pode ocultar sua posição sem perder recompensas.</small></span><input type="checkbox" data-preference="ranking" ${state.rankingVisible ? "checked" : ""}></label>
  </section>`);
}

function renderShare() {
  const completed = completedUserJourneys();
  return innerScreen("Compartilhar", `<section class="page share-page"><h1>Mostre sua conquista</h1><p class="page-subtitle">O cartão apresenta seu resultado sem revelar trajeto ou localização.</p>
    <div class="share-card"><div class="share-card-head"><span class="share-brand">${icon("leaf", 22)} SOULMOVE</span><small>${campaign.sponsor} • CAMPANHA DEMONSTRATIVA</small></div><span class="share-status">${icon("check", 14)} Jornada validada</span><h2>${campaign.title}</h2><p>Mais uma escolha de mobilidade reconhecida.</p>
      <div class="share-stats"><div><strong>${campaign.distanceKm.toFixed(1).replace(".", ",")} km</strong><span>transporte público</span></div><div><strong>+${campaign.rewardPoints}</strong><span>Pontos Soul</span></div><div><strong>${campaign.avoidedKg.toFixed(1).replace(".", ",")} kg*</strong><span>CO₂ estimado</span></div></div>
      <div class="share-progress"><div><span>Progresso da missão</span><strong>${completed} de ${campaign.totalJourneys} jornadas</strong></div><div class="share-progress-track"><span style="width:${Math.round(completed / campaign.totalJourneys * 100)}%"></span></div></div>
      <div class="share-achievements"><span>${icon("trophy", 16)} #${campaign.rankAfter} no ranking</span><span>${icon("trend", 16)} +${campaign.rankBefore - campaign.rankAfter} posições</span><span>${icon("flame", 16)} ${campaign.activeDays + (state.validated ? 1 : 0)} dias em movimento</span></div>
      <div class="share-invite">Participe deste desafio na SoulUP</div><small class="share-disclaimer">*Estimativa demonstrativa. Nenhum trajeto individual é compartilhado.</small>
    </div>
    <h2 class="share-heading">Onde compartilhar?</h2><div class="share-options"><button type="button" data-action="publish-share" data-channel="Clipz"><span>${icon("play")}</span><strong>Clipz</strong></button><button type="button" data-action="publish-share" data-channel="Comunidade"><span>${icon("users")}</span><strong>Comunidade</strong></button><button type="button" data-action="publish-share" data-channel="Compartilhamento externo"><span>${icon("globe")}</span><strong>Outros apps</strong></button></div>
    <button class="secondary-button" type="button" data-action="benefit">Continuar sem publicar</button>
  </section>`);
}

function renderBenefit() {
  const actionLabel = state.benefitUnlocked ? "Ver oferta ativada" : "Ativar benefício";
  return innerScreen("Marketplace", `<section class="page"><div class="page-title-row"><div><h1>Benefício desbloqueado</h1><p class="page-subtitle">Disponível após a validação da campanha.</p></div>${icon("bag")}</div><article class="benefit-card"><div class="benefit-brand">V</div><h2>15% de desconto</h2><p>Oferta demonstrativa da ${campaign.sponsor} para participantes que concluíram a jornada.</p><div class="coupon"><span>Cupom da campanha</span><code>${campaign.coupon}</code></div><button class="primary-button" type="button" data-action="activate-offer">${actionLabel}</button></article><div class="privacy-note">A conversão poderá ser atribuída por link, cupom ou leitura fiscal quando houver integração técnica.</div></section>`);
}

function renderOffer() {
  return innerScreen("Oferta", `<section class="success-page"><span class="success-icon">${icon("gift", 34)}</span><h1>Oferta ativada</h1><p>O cupom está disponível para esta campanha demonstrativa.</p><div class="coupon" style="width:100%; margin-top:22px"><span>Código</span><code>${campaign.coupon}</code><button class="icon-button" type="button" data-action="copy-coupon" aria-label="Copiar cupom">${icon("copy")}</button></div><div class="action-stack"><button class="primary-button" type="button" data-action="register-conversion">Registrar compra demonstrativa</button><button class="secondary-button" type="button" data-action="open-business">Abrir SoulBusiness</button></div></section>`);
}

function renderConversion() {
  return phone(`<section class="success-page"><span class="success-icon">${icon("cart", 34)}</span><h1>Conversão registrada</h1><p>O protótipo vinculou o evento à campanha sem compartilhar o trajeto individual.</p><div class="result-summary"><div><strong>1</strong><span>oferta acessada</span></div><div><strong>1</strong><span>cupom utilizado</span></div><div><strong>1</strong><span>conversão atribuída</span></div></div><div class="action-stack"><button class="primary-button" type="button" data-action="open-business">Ver resultado no SoulBusiness</button><button class="secondary-button" type="button" data-action="reset">Reiniciar demonstração</button></div></section>`, { top: false, bottom: false });
}

const storyContent = {
  ads: { owner: "Soul Ads", meta: "Conteúdo demonstrativo", title: "Benefícios que combinam com você", text: "Descubra ofertas e missões disponíveis no ecossistema SoulUP.", action: "marketplace", label: "Explorar benefícios", className: "story-ads" },
  campaign: { owner: campaign.sponsor, meta: "Patrocinado • campanha demonstrativa", title: campaign.title, text: `Complete três jornadas e receba ${campaign.rewardPoints} Pontos Soul mais uma oferta exclusiva.`, action: "open-campaign", label: "Conhecer campanha", className: "story-campaign" },
  community: { owner: "Mobilidade em movimento", meta: "Comunidade SoulUP", title: "Sua conquista inspira novas jornadas", text: "Compartilhe progresso, acompanhe o ranking e mantenha a constância.", action: "communities", label: "Abrir comunidade", className: "story-community-view" },
  marketplace: { owner: "Soul Marketplace", meta: "Benefícios demonstrativos", title: "Pontos que viram novas possibilidades", text: "Explore ofertas de mobilidade, bem-estar e consumo consciente.", action: "marketplace", label: "Ver marketplace", className: "story-market-view" },
};

function renderStory() {
  const story = storyContent[state.activeStory] || storyContent.campaign;
  return `<div class="user-stage"><section class="phone"><section class="ad-story ${story.className}">${state.activeStory === "campaign" ? '<img src="./assets/soulmove-campaign.webp" alt="Passageira utilizando transporte público">' : ""}<div class="story-overlay"></div><div class="story-progress"><span></span></div><header class="ad-head"><span class="post-avatar brand">${icon(state.activeStory === "marketplace" ? "bag" : state.activeStory === "community" ? "users" : "leaf", 18)}</span><div><strong>${story.owner}</strong><small>${story.meta}</small></div><button class="icon-button" type="button" data-action="close-story" aria-label="Fechar">${icon("close")}</button></header><div class="ad-copy"><small>${state.activeStory === "campaign" ? "DESAFIO SOULMOVE" : "SOULUP"}</small><h1>${story.title}</h1><p>${story.text}</p><button class="dark-outline-button" type="button" data-action="${story.action}">${story.label}</button></div></section></section></div>`;
}

const commentSets = {
  community: [["AM", "Ana M.", "Também estou tentando manter a constância esta semana!"], ["JV", "João V.", "A comunidade ajuda muito a continuar."]],
  campaign: [["BC", "Bianca C.", "Gostei de poder participar usando um trajeto que já faço."], ["RF", "Rafa F.", "A recompensa aparece depois das três jornadas?"]],
  achievement: [["LS", "Luiza S.", "Parabéns pela evolução no ranking!"], ["AM", "Ana M.", "Mais uma concluída 💙"]],
  marketplace: [["DN", "Diego N.", "As ofertas de mobilidade são as minhas favoritas."], ["BL", "Bia L.", "Boa forma de usar os pontos."]],
  "clipz-routine": [["RM", "Rafael M.", "A cidade fica diferente quando a gente observa o caminho."], ["AP", "Aline P.", "Muito bom!"]],
  "clipz-campaign": [["MS", "Marina S.", "Já completei a primeira jornada."], ["DN", "Diego N.", "Vou participar!"]],
  "clipz-achievement": [["LS", "Luiza S.", "Que evolução!"], ["BC", "Bianca C.", "Rumo à terceira jornada."]],
};

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));
}

function renderComments() {
  const comments = commentSets[state.activePost] || commentSets.campaign;
  const userComment = state.userComments[state.activePost];
  return innerScreen("Comentários", `<section class="page comments-page"><h1>Conversa da comunidade</h1><p class="page-subtitle">Conteúdo demonstrativo para representar a interação na SoulUP.</p><div class="comments-list">${comments.map(([initials, name, message]) => `<article class="comment"><span class="post-avatar">${initials}</span><div><strong>${name}</strong><p>${message}</p><button type="button" data-action="prototype-notice" data-message="Resposta simulada">Responder</button></div></article>`).join("")}${userComment ? `<article class="comment own"><span class="post-avatar user-current">CE</span><div><strong>Você</strong><p>${escapeHtml(userComment)}</p></div></article>` : ""}</div><div class="comment-compose"><input id="comment-input" type="text" maxlength="80" placeholder="Escreva um comentário" aria-label="Comentário"><button type="button" data-action="send-comment" aria-label="Enviar comentário">${icon("arrow")}</button></div></section>`);
}

function renderWallet() {
  return phone(`<section class="wallet-overlay-page">
    <article class="wallet-floating-card"><span class="wallet-watermark">S</span><button class="wallet-close" type="button" data-action="close-wallet" aria-label="Fechar carteira">${icon("close", 27)}</button><small>MINHA CARTEIRA</small><div class="wallet-card-label"><strong>Saldo</strong><button type="button" data-action="toggle-wallet-balance" aria-label="Mostrar ou ocultar saldo">${icon("eye", 21)}</button></div><div class="wallet-cash-balance">${state.walletBalanceVisible ? "R$ 5,02" : "R$ ••••"}</div><button class="wallet-access" type="button" data-action="wallet-detail">Acessar carteira</button></article>
    <div class="wallet-shortcuts" aria-label="Ações da carteira"><button type="button" data-action="prototype-notice" data-message="Saque via PIX representado apenas visualmente"><span>${icon("wallet", 27)}</span><strong>Sacar via<br>PIX</strong></button><button type="button" data-action="prototype-notice" data-message="Leitura de cupom fiscal simulada"><span>${icon("receipt", 27)}</span><strong>Ler Cupom<br>Fiscal</strong></button><button type="button" data-action="prototype-notice" data-message="Vale energia representado apenas visualmente"><span>${icon("bulb", 28)}</span><strong>Resgatar Vale<br>Energia</strong></button><button type="button" data-action="prototype-notice" data-message="Pagamento de conta representado apenas visualmente"><span>${icon("bolt", 28)}</span><strong>Pagar Conta<br>de Luz</strong></button></div>
    <button class="wallet-points-preview" type="button" data-action="wallet-detail"><span>${icon("badge", 23)}</span><div><small>SALDO EM RECOMPENSAS</small><strong>${state.points} Pontos Soul</strong><p>${state.validated ? `Última entrada: +${campaign.rewardPoints} pela jornada SoulMove` : "Veja suas últimas movimentações"}</p></div>${icon("chevron", 18)}</button>
  </section>`, { active: "feed" });
}

function renderWalletDetail() {
  return innerScreen("Minha carteira", `<section class="page wallet-detail-page"><div class="wallet-points-balance"><span>${icon("badge", 25)}</span><div><small>SALDO EM RECOMPENSAS</small><strong>${state.points} <em>Pontos Soul</em></strong></div><button type="button" data-action="marketplace">Usar pontos</button></div><div class="wallet-money-summary"><span>Saldo para saque</span><strong>${state.walletBalanceVisible ? "R$ 5,02" : "R$ ••••"}</strong><button type="button" data-action="toggle-wallet-balance" aria-label="Mostrar ou ocultar saldo">${icon("eye", 19)}</button></div><h2 class="section-heading">Movimentações</h2><div class="wallet-history">${state.validated ? `<article class="wallet-entry highlight"><span>${icon("leaf")}</span><div><strong>Jornada SoulMove validada</strong><small>Hoje • ${campaign.title}</small></div><b>+${campaign.rewardPoints}</b></article>` : ""}<article class="wallet-entry"><span>${icon("badge")}</span><div><strong>Missão semanal</strong><small>Ontem • Comunidade</small></div><b>+8</b></article><article class="wallet-entry debit"><span>${icon("bag")}</span><div><strong>Benefício utilizado</strong><small>03 set • Marketplace</small></div><b>-10</b></article><article class="wallet-entry"><span>${icon("heart")}</span><div><strong>Engajamento no Clipz</strong><small>01 set • Recompensa</small></div><b>+4</b></article></div>${state.validated ? `<div class="wallet-credit-note">${icon("check")} O crédito de +${campaign.rewardPoints} Pontos Soul foi registrado nesta demonstração.</div>` : ""}</section>`);
}

const marketplaceStores = [
  { name: "Move+", initials: "M+", cashback: "2,0% de volta", category: "Mobilidade", className: "move" },
  { name: "Vida Farma", initials: "VF", cashback: "2,5% de volta", category: "Bem-estar", className: "health" },
  { name: "Casa Verde", initials: "CV", cashback: "3,0% de volta", category: "Casa", className: "home" },
  { name: "Estilo Livre", initials: "EL", cashback: "4,0% de volta", category: "Acessórios", className: "style" },
  { name: "Clube Urbano", initials: "CU", cashback: "1,5% de volta", category: "Acessórios", className: "urban" },
  { name: "Auto Bem", initials: "AB", cashback: "2,3% de volta", category: "Automotivo", className: "auto" },
  { name: "Pet & Cia", initials: "PC", cashback: "2,0% de volta", category: "Casa", className: "pet" },
  { name: "Bem Natural", initials: "BN", cashback: "4,2% de volta", category: "Bem-estar", className: "natural" },
];

function filteredMarketplaceStores() {
  const query = state.marketplaceQuery.trim().toLocaleLowerCase("pt-BR");
  return marketplaceStores.filter(store => (state.marketplaceCategory === "Todos" || store.category === state.marketplaceCategory) && (!query || store.name.toLocaleLowerCase("pt-BR").includes(query)));
}

function renderMarketplace() {
  const stores = filteredMarketplaceStores();
  const categories = ["Todos", "Acessórios", "Automotivo", "Mobilidade", "Bem-estar", "Casa"];
  return innerScreen("Marketplace", `<section class="marketplace-page"><div class="marketplace-webbar"><span class="marketplace-logo">soul <b>UP</b></span><span class="marketplace-cash">R$ 5,02</span><span class="marketplace-profile">${icon("user", 18)}</span></div><div class="market-search"><input id="market-search-input" type="search" maxlength="30" value="${escapeHtml(state.marketplaceQuery)}" placeholder="Busque por lojas aqui" aria-label="Buscar lojas"><button type="button" data-action="apply-market-search" aria-label="Buscar">${icon("search", 19)}</button></div>
    <button class="marketplace-hero" type="button" data-action="open-campaign"><img src="./assets/soulmove-campaign.webp" alt="Campanha demonstrativa SoulMove"><span><small>CAMPANHA SOULMOVE</small><strong>${campaign.title}</strong><p>Complete a jornada e receba +${campaign.rewardPoints} Pontos Soul.</p></span></button><div class="marketplace-dots"><b></b><i></i><i></i><i></i></div>
    <div class="marketplace-content"><header class="marketplace-list-heading"><div><small>CATÁLOGO DEMONSTRATIVO</small><h1>Lojas com cashback</h1></div><button type="button" data-action="prototype-notice" data-message="Ordenação representada visualmente">Ordenar por ${icon("sliders", 16)}</button></header><div class="market-categories">${categories.map(category => `<button class="${state.marketplaceCategory === category ? "active" : ""}" type="button" data-action="select-market-category" data-category="${category}">${category}</button>`).join("")}</div>
      ${stores.length ? `<div class="market-store-grid">${stores.map(store => `<button class="market-store-card" type="button" data-action="prototype-notice" data-message="Loja demonstrativa: ${store.name}"><span class="store-logo ${store.className}">${store.initials}</span><strong>${store.name}</strong><small>${store.cashback}</small></button>`).join("")}</div><div class="market-list-progress"><span>Mostrando ${stores.length} de ${marketplaceStores.length} lojas demonstrativas</span><div><i style="width:${Math.max(18, Math.round(stores.length / marketplaceStores.length * 100))}%"></i></div><button type="button" data-action="load-market-stores">Ver mais lojas</button></div>` : `<div class="market-empty">${icon("search", 28)}<strong>Nenhuma loja encontrada</strong><p>Tente outro nome ou selecione a categoria “Todos”.</p><button type="button" data-action="clear-market-search">Limpar busca</button></div>`}
      <section class="market-offers"><h2>As melhores ofertas estão aqui!</h2><p>Use cupons de desconto e ainda acompanhe os benefícios da campanha.</p><div class="market-coupon-row"><button class="market-coupon campaign" type="button" data-action="${state.benefitUnlocked ? "benefit" : "open-campaign"}"><span class="store-logo viva">V</span><small>${campaign.sponsor} • SOULMOVE</small><strong>Ganhe 15% OFF</strong><p>${state.benefitUnlocked ? `Cupom ${campaign.coupon} desbloqueado.` : "Conclua a missão para liberar a oferta."}</p><b>${state.benefitUnlocked ? "Ver cupom" : "Conhecer missão"}</b></button><button class="market-coupon" type="button" data-action="prototype-notice" data-message="Cupom demonstrativo"><span class="store-logo natural">BN</span><small>BEM NATURAL</small><strong>Ganhe 8% OFF</strong><p>Oferta demonstrativa por tempo limitado.</p><b>Ver oferta</b></button></div></section>
      <div class="market-faq"><h2>Dúvidas frequentes</h2><button type="button" data-action="prototype-notice" data-message="Resposta demonstrativa: o cashback aparece após a confirmação da compra">Em quanto tempo recebo meu cashback? <span>+</span></button><button type="button" data-action="prototype-notice" data-message="Resposta demonstrativa: cupons e cashback dependem das regras da oferta">Também ganho cashback ao usar cupom? <span>+</span></button></div><div class="privacy-note">Lojas, ofertas e valores desta tela são demonstrativos e não representam parcerias ou condições comerciais reais.</div>
    </div></section>`);
}

function metrics() {
  return {
    reached: baseMetrics.reached,
    participants: baseMetrics.participants + (state.joined ? 1 : 0),
    started: baseMetrics.started + (state.journeyStarted ? 1 : 0),
    validated: baseMetrics.validated + (state.validated ? 1 : 0),
    benefits: baseMetrics.benefits + (state.benefitUnlocked ? 1 : 0),
    offerVisits: baseMetrics.offerVisits + (state.benefitUnlocked ? 1 : 0),
    conversions: baseMetrics.conversions + (state.conversion ? 1 : 0),
    rankingViews: baseMetrics.rankingViews + (state.rankingViewed ? 1 : 0),
    shares: baseMetrics.shares + (state.sharePublished ? 1 : 0),
    visitsFromShares: baseMetrics.visitsFromShares,
  };
}

function pct(value, max) { return Math.max(4, Math.round((value / max) * 100)); }

function renderBusiness() {
  const m = metrics();
  const delta = state.conversion ? "Nova conversão da demonstração registrada" : state.sharePublished ? `Novo cartão compartilhado em ${state.shareChannel}` : state.rankingViewed ? "Nova visualização do ranking registrada" : "Conclua a jornada no app para atualizar este painel";
  return `<div class="business-stage"><section class="business-app" aria-label="Painel SoulBusiness">
    <aside class="business-sidebar"><div class="business-brand">soul<span>business</span></div><nav class="business-nav"><button class="active" type="button">Visão geral</button><button type="button">Campanhas</button><button type="button">Resultados</button></nav></aside>
    <main class="business-main"><header class="business-heading"><div><h1>${campaign.title}</h1><p>${campaign.sponsor} • campanha demonstrativa</p></div><span class="demo-badge">Dados simulados</span></header>
      <section class="metric-grid"><article class="metric-card"><span>Participantes</span><strong>${m.participants}</strong><small>${state.joined ? "+1 nesta demonstração" : "adesões à campanha"}</small></article><article class="metric-card"><span>Jornadas validadas</span><strong>${m.validated}</strong><small>${state.validated ? "+1 nesta demonstração" : "eventos aprovados"}</small></article><article class="metric-card"><span>Benefícios liberados</span><strong>${m.benefits}</strong><small>ofertas desbloqueadas</small></article><article class="metric-card"><span>Conversões atribuídas</span><strong>${m.conversions}</strong><small>${state.conversion ? "+1 nesta demonstração" : "links, cupons ou leitura fiscal"}</small></article></section>
      <section class="dashboard-grid"><article class="dashboard-panel"><h2>Funil da campanha</h2><div class="funnel-row"><span>Alcance</span><div class="funnel-track"><div class="funnel-value" style="width:100%"></div></div><span class="funnel-number">${m.reached}</span></div><div class="funnel-row"><span>Participantes</span><div class="funnel-track"><div class="funnel-value" style="width:${pct(m.participants,m.reached)}%"></div></div><span class="funnel-number">${m.participants}</span></div><div class="funnel-row"><span>Iniciadas</span><div class="funnel-track"><div class="funnel-value" style="width:${pct(m.started,m.reached)}%"></div></div><span class="funnel-number">${m.started}</span></div><div class="funnel-row"><span>Validadas</span><div class="funnel-track"><div class="funnel-value" style="width:${pct(m.validated,m.reached)}%"></div></div><span class="funnel-number">${m.validated}</span></div><div class="funnel-row"><span>Conversões</span><div class="funnel-track"><div class="funnel-value" style="width:${pct(m.conversions,m.reached)}%"></div></div><span class="funnel-number">${m.conversions}</span></div></article>
        <article class="dashboard-panel"><h2>Participação agregada por zona</h2><div class="zone-row"><div class="zone-head"><span>Zona Leste</span><strong>36%</strong></div><div class="zone-bar"><span style="width:36%"></span></div></div><div class="zone-row"><div class="zone-head"><span>Zona Sul</span><strong>28%</strong></div><div class="zone-bar"><span style="width:28%"></span></div></div><div class="zone-row"><div class="zone-head"><span>Zona Norte</span><strong>21%</strong></div><div class="zone-bar"><span style="width:21%"></span></div></div><div class="zone-row"><div class="zone-head"><span>Zona Oeste e Centro</span><strong>15%</strong></div><div class="zone-bar"><span style="width:15%"></span></div></div></article></section>
      <article class="dashboard-panel social-panel"><div><h2>Engajamento social</h2><p>Interações agregadas geradas pela comunidade SoulMove.</p></div><div class="social-metrics"><div><span>Visualizações do ranking</span><strong>${m.rankingViews}</strong><small>${state.rankingViewed ? "+1 nesta demonstração" : "interesse na campanha"}</small></div><div><span>Cartões compartilhados</span><strong>${m.shares}</strong><small>${state.sharePublished ? "+1 nesta demonstração" : "Clipz, comunidades e outros apps"}</small></div><div><span>Acessos por compartilhamento</span><strong>${m.visitsFromShares}</strong><small>atribuição agregada</small></div></div></article>
      <div class="privacy-banner"><strong>Privacidade por design:</strong> este painel apresenta indicadores agregados. O patrocinador não acessa nomes, coordenadas, trajetos individuais nem fotos ou vídeos opcionais.</div><div class="event-log"><strong>Evento da demonstração:</strong> ${delta}.</div>
    </main></section></div>`;
}

function renderUser() {
  const renderers = {
    feed: renderFeed,
    communities: renderCommunities,
    clipz: renderClipz,
    story: renderStory,
    campaign: renderCampaignDetail,
    consent: renderConsent,
    ready: renderReady,
    journey: renderJourney,
    proof: renderProof,
    validation: renderValidation,
    result: renderResult,
    ranking: renderRanking,
    "ranking-rules": renderRankingRules,
    share: renderShare,
    benefit: renderBenefit,
    offer: renderOffer,
    conversion: renderConversion,
    comments: renderComments,
    wallet: renderWallet,
    "wallet-detail": renderWalletDetail,
    marketplace: renderMarketplace,
  };
  return (renderers[state.screen] || renderFeed)();
}

function render() {
  document.querySelectorAll("[data-perspective]").forEach(button => button.classList.toggle("active", button.dataset.perspective === state.perspective));
  root.innerHTML = state.perspective === "business" ? renderBusiness() : renderUser();
  if (state.perspective === "user" && state.screen === "journey") runJourneySimulation();
}

function navigate(screen) {
  clearJourneyTimers();
  state.screen = screen;
  state.perspective = "user";
  render();
}

function runJourneySimulation() {
  clearJourneyTimers();
  const steps = [25, 50, 75, 100];
  steps.forEach((progress, index) => {
    const timer = setTimeout(() => {
      state.journeyProgress = progress;
      const track = document.querySelector("#track-progress");
      if (!track) return;
      track.style.width = `${progress}%`;
      const completed = progress / 25;
      document.querySelectorAll("[data-checkpoint]").forEach((point, pointIndex) => point.classList.toggle("done", pointIndex < completed));
      document.querySelector("#journey-time").textContent = `00:0${index + 2}`;
      document.querySelector("#journey-distance").textContent = `${(campaign.distanceKm * progress / 100).toFixed(1).replace(".", ",")} km`;
      document.querySelector("#journey-checkpoints").textContent = `${completed}/4`;
      if (progress === 100) document.querySelector("#finish-journey").disabled = false;
    }, 650 * (index + 1));
    journeyTimers.push(timer);
  });
}

function toggleStateList(key, id) {
  const values = state[key];
  state[key] = values.includes(id) ? values.filter(value => value !== id) : [...values, id];
  render();
}

function beginValidation() {
  navigate("validation");
  journeyTimers.push(setTimeout(() => {
    state.validated = true;
    state.benefitUnlocked = true;
    state.points = 520 + campaign.rewardPoints;
    state.screen = "result";
    render();
  }, 1800));
}

document.addEventListener("click", event => {
  const perspective = event.target.closest("[data-perspective]");
  if (perspective) {
    clearJourneyTimers();
    state.perspective = perspective.dataset.perspective;
    render();
    return;
  }

  const nav = event.target.closest("[data-nav]");
  if (nav) { navigate(nav.dataset.nav); return; }

  const actionElement = event.target.closest("[data-action]");
  if (!actionElement || actionElement.disabled) return;
  const action = actionElement.dataset.action;

  const actions = {
    "open-story": () => { state.activeStory = actionElement.dataset.story || "campaign"; navigate("story"); },
    "close-story": () => navigate("feed"),
    "open-campaign": () => navigate("campaign"),
    communities: () => navigate("communities"),
    back: () => {
      if (state.screen === "comments") { navigate(state.commentsReturn || "feed"); return; }
      if (state.screen === "wallet" || state.screen === "marketplace") { navigate(state.overlayReturn || "feed"); return; }
      if (state.screen === "wallet-detail") { navigate(state.overlayReturn === "result" ? "result" : "wallet"); return; }
      const history = { story: "feed", campaign: "feed", consent: "campaign", ready: "consent", proof: "journey", ranking: state.validated ? "result" : "campaign", "ranking-rules": "ranking", share: "result", benefit: state.validated ? "result" : "feed", offer: "benefit" };
      navigate(history[state.screen] || "feed");
    },
    join: () => { state.joined = true; navigate(state.consentRules && state.consentLocation ? "ready" : "consent"); },
    "consent-continue": () => navigate("ready"),
    "start-journey": () => { state.journeyStarted = true; state.journeyProgress = 0; navigate("journey"); },
    "finish-journey": () => navigate("proof"),
    "select-proof": () => { state.proofType = actionElement.dataset.proof || "Foto"; render(); },
    "remove-proof": () => { state.proofType = ""; render(); },
    "submit-proof": beginValidation,
    ranking: () => { state.rankingViewed = true; navigate("ranking"); },
    "ranking-rules": () => navigate("ranking-rules"),
    share: () => navigate("share"),
    "publish-share": () => { state.sharePublished = true; state.shareChannel = actionElement.dataset.channel || "Clipz"; showToast(`Cartão compartilhado em ${state.shareChannel}`); setTimeout(() => navigate("result"), 700); },
    wallet: () => { state.overlayReturn = state.screen === "wallet" ? "feed" : state.screen; navigate("wallet"); },
    "close-wallet": () => navigate(state.overlayReturn || "feed"),
    "wallet-detail": () => { if (state.screen !== "wallet") state.overlayReturn = state.screen; navigate("wallet-detail"); },
    "toggle-wallet-balance": () => { state.walletBalanceVisible = !state.walletBalanceVisible; render(); },
    marketplace: () => { state.overlayReturn = state.screen === "marketplace" ? "feed" : state.screen; navigate("marketplace"); },
    "apply-market-search": () => { const input = document.querySelector("#market-search-input"); state.marketplaceQuery = input?.value || ""; render(); },
    "clear-market-search": () => { state.marketplaceQuery = ""; state.marketplaceCategory = "Todos"; render(); },
    "select-market-category": () => { state.marketplaceCategory = actionElement.dataset.category || "Todos"; render(); },
    "load-market-stores": () => showToast("Catálogo demonstrativo exibido por completo"),
    benefit: () => navigate(state.benefitUnlocked ? "benefit" : "campaign"),
    "activate-offer": () => { state.benefitUnlocked = true; navigate("offer"); },
    "copy-coupon": () => {
      if (navigator.clipboard) navigator.clipboard.writeText(campaign.coupon).catch(() => {});
      showToast("Cupom copiado");
    },
    "register-conversion": () => { state.conversion = true; navigate("conversion"); },
    "toggle-post-like": () => toggleStateList("likedPosts", actionElement.dataset.id),
    "toggle-clipz-like": () => toggleStateList("likedClipz", actionElement.dataset.id),
    "open-comments": () => { state.activePost = actionElement.dataset.id || "campaign"; state.commentsReturn = state.screen; navigate("comments"); },
    "send-comment": () => {
      const input = document.querySelector("#comment-input");
      const value = input?.value.trim();
      if (!value) { showToast("Escreva um comentário primeiro"); return; }
      state.userComments[state.activePost] = value;
      render();
      showToast("Comentário adicionado à demonstração");
    },
    "share-post": () => showToast("Opções de compartilhamento abertas na demonstração"),
    "prototype-notice": () => showToast(actionElement.dataset.message || "Interação demonstrativa"),
    "open-business": () => { clearJourneyTimers(); state.perspective = "business"; render(); },
    reset: () => { clearJourneyTimers(); state = initialState(); render(); showToast("Demonstração reiniciada"); },
  };

  if (actions[action]) actions[action]();
});

document.addEventListener("change", event => {
  const consent = event.target.closest("[data-consent]");
  const preference = event.target.closest("[data-preference]");
  if (!consent && !preference) return;
  if (consent?.dataset.consent === "location") state.consentLocation = consent.checked;
  if (consent?.dataset.consent === "rules") state.consentRules = consent.checked;
  if (preference?.dataset.preference === "ranking") {
    state.rankingVisible = preference.checked;
    showToast(preference.checked ? "Sua posição está visível" : "Sua posição foi ocultada");
  }
  render();
});

render();
