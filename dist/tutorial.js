// Guided discovery only: never starts a journey or changes points/consents.
(() => {
  const storageKey = 'soulmove-tutorial-v1';
  const shell = document.querySelector('.prototype-shell');
  const launcher = document.querySelector('#tutorial-start');
  const steps = [
    {screen:'feed', target:'[aria-label="Atividades"]', title:'Vamos conhecer o SoulMove?', text:'Toque na chama para abrir as Missões da SoulUP.', click:'Abrir Missões'},
    {screen:'missions', target:'.native-mission:has([data-action="move-home"])', title:'Seu caminho começa aqui', text:'Em Mobilidade, toque em Começar para acessar o SoulMove. As outras missões continuam aqui na SoulUP.', click:'Abrir Mobilidade'},
    {screen:'move-home', target:'.mobility-totals', title:'Acompanhe sua evolução', text:'Aqui você vê suas rotas e o CO₂ evitado estimado. Mais abaixo estão a Liga, as campanhas e a Temporada.'},
    {screen:'move-home', target:'.mobility-start', title:'Agora é com você', text:'Use Iniciar rota para conhecer a jornada livre. Ela soma Pontos de Impacto; as campanhas patrocinadas podem gerar Pontos Soul.', click:'Finalizar tutorial'}
  ];
  let overlay, target, index = 0, returnFocus, busy = false;
  let previousInert = false;
  function remembered() { try { return localStorage.getItem(storageKey) === 'done'; } catch { return false; } }
  function finish() {
    if (!overlay) return;
    overlay.remove(); overlay = null; target = null;
    shell.inert = previousInert;
    window.removeEventListener('resize', place);
    document.removeEventListener('scroll', place, true);
    try { localStorage.setItem(storageKey, 'done'); } catch { /* Storage may be unavailable. */ }
    const focus = document.querySelector(steps[index].target);
    if (returnFocus?.isConnected && returnFocus.getClientRects().length) returnFocus.focus();
    else (focus?.matches('button') ? focus : launcher).focus({preventScroll:true});
  }
  function place() {
    if (!overlay || !target?.isConnected) return;
    const r = target.getBoundingClientRect(), card = overlay.querySelector('.tour-card');
    const width = Math.min(340, window.innerWidth - 24);
    const left = Math.max(12, Math.min(r.left, window.innerWidth - width - 12));
    card.style.width = width + 'px'; card.style.left = left + 'px';
    const height = card.offsetHeight;
    const below = r.bottom + 22 + height <= window.innerHeight - 12;
    card.style.top = Math.max(12, Math.min(below ? r.bottom + 22 : r.top - height - 22, window.innerHeight - height - 12)) + 'px';
    card.classList.toggle('tour-above', !below);
    card.style.setProperty('--tour-arrow', Math.max(24, Math.min(r.left + r.width / 2 - left, width - 24)) + 'px');
    Object.assign(overlay.querySelector('.tour-spot').style, {
      left: (r.left - 6) + 'px', top: (r.top - 6) + 'px', width: (r.width + 12) + 'px', height: (r.height + 12) + 'px'
    });
  }
  function show() {
    const step = steps[index];
    if (state.screen !== step.screen || state.perspective !== 'user') {
      if (step.screen === 'missions') state.missionsFilter = 'all';
      navigate(step.screen);
    }
    target = document.querySelector(step.target);
    if (!target) { finish(); return; }
    target.scrollIntoView({block:'center',behavior:'instant'});
    overlay.innerHTML = `<${step.click?'button type="button"':'div'} class="tour-spot" ${step.click?`aria-label="${step.click}"`:'aria-hidden="true"'}></${step.click?'button':'div'}><section class="tour-card"><h2 id="tour-title">${step.title}</h2><p id="tour-description">${step.text}</p><footer><span>Etapa: ${index + 1}/${steps.length}</span><button type="button" class="tour-skip">Pular</button><button type="button" class="tour-next">${index === steps.length - 1?'Finalizar':'Próximo'}</button></footer></section>`;
    overlay.querySelector('.tour-skip').onclick = finish;
    overlay.querySelector('.tour-next').onclick = next;
    if (step.click) overlay.querySelector('.tour-spot').onclick = next;
    place();
    overlay.querySelector('.tour-next').focus({preventScroll:true});
    requestAnimationFrame(place);
  }
  function next() {
    if (busy) return;
    busy = true;
    if (index === steps.length - 1) finish();
    else { index += 1; show(); }
    requestAnimationFrame(() => { busy = false; });
  }
  function start() {
    if (overlay) return;
    // Keep an active journey intact; guide only its entry point, never reset it.
    returnFocus = document.activeElement;
    previousInert = shell.inert;
    index = 0;
    overlay = document.createElement('div'); overlay.className = 'soulmove-tour';
    overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-labelledby','tour-title'); overlay.setAttribute('aria-describedby','tour-description');
    document.body.append(overlay);
    shell.inert = true;
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); finish(); }
      if (event.key === 'Tab') {
        const buttons = [...overlay.querySelectorAll('button')];
        const first = buttons[0], last = buttons.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
    window.addEventListener('resize', place);
    document.addEventListener('scroll', place, true);
    show();
  }
  launcher.addEventListener('click', start);
  if (!remembered()) start();
})();
