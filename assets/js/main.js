(() => {
  const DATA = window.AURES_DATA || {};
  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));
  const fmtDate = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const fmtMonth = new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' });
  const fmtShortMonth = new Intl.DateTimeFormat('es-ES', { month: 'short' });
  const today = new Date(); today.setHours(0,0,0,0);
  const state = { lightboxItems: [], lightboxIndex: 0 };

  const escapeHTML = (str = '') => String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const eventDate = (event) => new Date(`${event.date}T${event.time || '00:00'}:00`);
  const isUpcoming = (event) => ['proximo','reservado','por-confirmar'].includes(event.status) || eventDate(event) >= today;
  const sortEvents = (events) => [...events].sort((a,b) => eventDate(a)-eventDate(b));
  const sortEventsDesc = (events) => [...events].sort((a,b) => eventDate(b)-eventDate(a));
  const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  function dateBox(dateString){
    const d = new Date(`${dateString}T12:00:00`);
    return `<div class="date-box" aria-hidden="true"><span><span class="day">${String(d.getDate()).padStart(2,'0')}</span><span class="month">${fmtShortMonth.format(d).replace('.','').toUpperCase()}</span><span class="year">${d.getFullYear()}</span></span></div>`;
  }

  function eventStatus(event){
    if(event.status === 'reservado') return ['gold','Reservada'];
    if(isUpcoming(event)) return ['green','Próxima'];
    return ['','Realizada'];
  }

  function eventCard(event, compact=false){
    const [cls,status] = eventStatus(event);
    return `<article class="event-card event-card-compact reveal">
      ${dateBox(event.date)}
      <div class="event-body">
        <span class="card-kicker">${escapeHTML(event.type)}</span>
        <h3>${escapeHTML(event.title)}</h3>
        <div class="event-meta"><span>${fmtDate.format(new Date(`${event.date}T12:00:00`))}</span><span>·</span><span>${escapeHTML(event.time || 'Hora por confirmar')}</span><span>·</span><span>${escapeHTML(event.place)}</span></div>
        <p>${escapeHTML(compact ? event.short : event.description)}</p>
        <div class="tag-row"><span class="tag ${cls}">${status}</span><span class="tag">${escapeHTML(event.city)}</span>${event.galleryId ? `<span class="tag gold">Con galería</span>` : ''}</div>
        <div class="tag-row event-actions">
          <a class="btn btn-small btn-dark" href="agenda.html?id=${encodeURIComponent(event.id)}">Ver detalles</a>
          ${event.mapUrl ? `<a class="btn btn-small btn-line" href="${escapeHTML(event.mapUrl)}" target="_blank" rel="noopener">Cómo llegar</a>` : ''}
          ${event.programUrl ? `<a class="btn btn-small btn-line" href="${escapeHTML(event.programUrl)}">Programa</a>` : ''}
          ${isUpcoming(event) ? `<button class="btn btn-small btn-line" data-calendar="${escapeHTML(event.id)}">Añadir</button>` : ''}
          <button class="btn btn-small btn-line" data-share-event="${escapeHTML(event.id)}">Compartir</button>
        </div>
      </div>
    </article>`;
  }

  function galleryCard(gallery){
    return `<a class="gallery-card gallery-card-archive reveal" href="galeria.html?id=${encodeURIComponent(gallery.id)}" aria-label="Ver memoria: ${escapeHTML(gallery.title)}">
      <img src="${escapeHTML(gallery.cover)}" alt="${escapeHTML(gallery.title)}" loading="lazy">
      <div class="gallery-card-content"><span class="card-kicker">${escapeHTML(gallery.category)}</span><h3>${escapeHTML(gallery.title)}</h3><div class="gallery-meta"><span>${fmtDate.format(new Date(`${gallery.date}T12:00:00`))}</span><span>·</span><span>${escapeHTML(gallery.place)}</span></div><p>${escapeHTML(gallery.lead)}</p><span class="memory-link">Ver memoria</span></div>
    </a>`;
  }

  function newsCard(item){ return `<article class="news-card reveal"><img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy"><div><span class="tag gold">${escapeHTML(item.tag)}</span><h3>${escapeHTML(item.title)}</h3><div class="event-meta"><span>${fmtDate.format(new Date(`${item.date}T12:00:00`))}</span></div><p>${escapeHTML(item.excerpt)}</p></div></article>`; }

  function fillSiteVariables(){
    $$('[data-site]').forEach(el => { const key = el.dataset.site; if(DATA.site?.[key] !== undefined) el.textContent = DATA.site[key]; });
    $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
    $$('[data-contact-email]').forEach(el => { const email = DATA.site?.contactEmail || 'contacto@aurescantibus.es'; el.textContent = email; if(el.tagName === 'A') el.href = `mailto:${email}`; });
    $$('[data-site-link="facebook"]').forEach(el => { if(DATA.site?.facebookUrl && DATA.site.facebookUrl !== '#') el.href = DATA.site.facebookUrl; });
  }

  function initHeader(){
    const header = $('.site-header'), nav = $('.main-nav'), toggle = $('.nav-toggle'); if(!header) return;
    const current = location.pathname.split('/').pop() || 'index.html';
    $$('.main-nav a').forEach(link => { const href = link.getAttribute('href'); if(href === current || (current === '' && href === 'index.html')) link.setAttribute('aria-current','page'); });
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30); onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
    if(toggle && nav){ toggle.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); }); nav.addEventListener('click', e => { if(e.target.matches('a')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); } }); }
  }

  function initReveals(){ const els = $$('.reveal'); if(!('IntersectionObserver' in window)){ els.forEach(el=>el.classList.add('is-visible')); return; } const io = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); } }), {threshold:.12}); els.forEach(el=>io.observe(el)); }
  function initCounters(){ const counters = $$('[data-count]'); if(!counters.length || !('IntersectionObserver' in window)) return; const animate = el => { const target=Number(el.dataset.count||0), prefix=el.dataset.prefix||'', suffix=el.dataset.suffix||''; const start=performance.now(); const tick=now => { const p=Math.min((now-start)/1100,1); el.textContent=`${prefix}${Math.round(target*(1-Math.pow(1-p,3)))}${suffix}`; if(p<1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }; const io=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); } }),{threshold:.4}); counters.forEach(el=>io.observe(el)); }
  function initParallax(){ const img=$('.hero-bg img'); if(!img || matchMedia('(prefers-reduced-motion: reduce)').matches) return; window.addEventListener('scroll',()=>{ img.style.transform=`scale(1.05) translateY(${Math.min(window.scrollY*.08,70)}px)`; },{passive:true}); }
  function initScrollProgress(){ const bar=$('.scroll-progress span'); if(!bar) return; const update=()=>{ const max=document.documentElement.scrollHeight-window.innerHeight; bar.style.width=`${max>0?Math.min(window.scrollY/max,1)*100:0}%`; }; update(); window.addEventListener('scroll', update, {passive:true}); window.addEventListener('resize', update); }
  function initAmbientSpotlight(){ const s=$('.ambient-spotlight'); if(!s || matchMedia('(pointer: coarse)').matches) return; window.addEventListener('pointermove',e=>{ document.documentElement.style.setProperty('--spot-x',`${e.clientX}px`); document.documentElement.style.setProperty('--spot-y',`${e.clientY}px`); },{passive:true}); }
  function initMagneticButtons(){ if(matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return; $$('.magnetic').forEach(el=>{ el.addEventListener('pointermove',e=>{ const r=el.getBoundingClientRect(); el.style.transform=`translate(${((e.clientX-r.left-r.width/2)/r.width)*8}px, ${((e.clientY-r.top-r.height/2)/r.height)*7}px)`; }); el.addEventListener('pointerleave',()=>{ el.style.transform=''; }); }); }
  function initCarousels(){ $$('.carousel-shell').forEach(shell => { const track=$('.carousel-track',shell); if(!track) return; const prev=$('[data-carousel-prev]'), next=$('[data-carousel-next]'); const amt=()=>Math.min(track.clientWidth*.82,460); prev?.addEventListener('click',()=>track.scrollBy({left:-amt(),behavior:'smooth'})); next?.addEventListener('click',()=>track.scrollBy({left:amt(),behavior:'smooth'})); }); }

  function renderHome(){
    const featured = sortEvents(DATA.events||[]).find(isUpcoming) || sortEventsDesc(DATA.events||[])[0];
    const nextPanel=$('#next-event-panel'); if(nextPanel && featured){ nextPanel.innerHTML=`${dateBox(featured.date)}<div class="next-title">${escapeHTML(featured.title)}</div><p class="next-meta">${escapeHTML(featured.place)} · ${escapeHTML(featured.city)}<br>${escapeHTML(featured.time || 'Hora por confirmar')}</p><a class="btn btn-small btn-cream" href="agenda.html?id=${encodeURIComponent(featured.id)}">Ver detalles</a>`; }
    const homeFeature=$('#home-feature-event'); if(homeFeature && featured){ homeFeature.innerHTML=`<div class="feature-event-media"><img src="${escapeHTML(featured.image)}" alt="${escapeHTML(featured.title)}" loading="lazy"></div><div class="feature-event-content"><span class="card-kicker">${escapeHTML(featured.eyebrow || featured.type)}</span><h3>${escapeHTML(featured.title)}</h3><div class="event-meta" style="margin:16px 0"><span>${fmtDate.format(new Date(`${featured.date}T12:00:00`))}</span><span>·</span><span>${escapeHTML(featured.time||'Hora por confirmar')}</span><span>·</span><span>${escapeHTML(featured.place)}</span></div><p>${escapeHTML(featured.description)}</p><div class="hero-actions" style="margin-top:18px"><a class="btn btn-primary" href="agenda.html?id=${encodeURIComponent(featured.id)}">Ver actuación</a>${featured.mapUrl?`<a class="btn btn-line" href="${escapeHTML(featured.mapUrl)}" target="_blank" rel="noopener">Cómo llegar</a>`:''}</div></div>`; }
    const homeEvents=$('#events-home'); if(homeEvents){ const up=sortEvents(DATA.events||[]).filter(isUpcoming).slice(0,3); homeEvents.innerHTML=up.length?up.map(e=>eventCard(e,true)).join(''):`<div class="empty-state">Próximamente anunciaremos nuevas actuaciones. Mientras tanto, puedes consultar el archivo coral o contactar para propuestas culturales.</div>`; }
    const gh=$('#gallery-home'); if(gh){ const galleries=(DATA.galleries||[]).filter(g=>g.featured).concat((DATA.galleries||[]).filter(g=>!g.featured)).slice(0,6); gh.innerHTML=galleries.map(galleryCard).join(''); }
    renderRepertoireSpotlight();
  }

  function monthCalendar(baseDate, events){
    const y=baseDate.getFullYear(), m=baseDate.getMonth();
    const first=new Date(y,m,1), last=new Date(y,m+1,0);
    const startOffset=(first.getDay()+6)%7; // Monday start
    const eventMap = new Map(events.map(e => [e.date, e]));
    let cells='';
    for(let i=0;i<startOffset;i++) cells += '<span class="calendar-cell is-muted"></span>';
    for(let d=1; d<=last.getDate(); d++){
      const date=new Date(y,m,d), key=dateKey(date), event=eventMap.get(key), past=date<today;
      const cls = event ? 'is-busy' : (past ? 'is-past' : 'is-free');
      const label = event ? `${d} · ${event.title}` : `${d} disponible`;
      cells += `<button class="calendar-cell ${cls}" title="${escapeHTML(label)}" ${event?`data-jump-event="${escapeHTML(event.id)}"`:''}><span>${d}</span></button>`;
    }
    return `<article class="calendar-month reveal"><h3>${fmtMonth.format(first)}</h3><div class="calendar-week"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div><div class="calendar-grid">${cells}</div></article>`;
  }

  function renderAgenda(){
    const root=$('#agenda-root'); if(!root) return; const id=new URLSearchParams(location.search).get('id'); const events=DATA.events||[];
    if(id){ const event=events.find(e=>e.id===id); root.innerHTML = event ? `<article class="card detail-hero-card reveal"><img src="${escapeHTML(event.image)}" alt="${escapeHTML(event.title)}"><div class="detail-info"><span class="card-kicker">${escapeHTML(event.type)}</span><h2>${escapeHTML(event.title)}</h2><div class="event-meta"><span>${fmtDate.format(new Date(`${event.date}T12:00:00`))}</span><span>·</span><span>${escapeHTML(event.time || 'Hora por confirmar')}</span><span>·</span><span>${escapeHTML(event.place)}</span></div><p>${escapeHTML(event.description)}</p><div class="tag-row"><span class="tag ${eventStatus(event)[0]}">${eventStatus(event)[1]}</span><span class="tag">${escapeHTML(event.city)}</span><span class="tag gold">${escapeHTML(event.type)}</span></div><div class="hero-actions" style="margin-top:22px">${event.mapUrl?`<a class="btn btn-dark" href="${escapeHTML(event.mapUrl)}" target="_blank" rel="noopener">Cómo llegar</a>`:''}${event.programUrl?`<a class="btn btn-line" href="${escapeHTML(event.programUrl)}">Descargar programa</a>`:''}${isUpcoming(event)?`<button class="btn btn-line" data-calendar="${escapeHTML(event.id)}">Añadir al calendario</button>`:''}<button class="btn btn-line" data-share-event="${escapeHTML(event.id)}">Compartir</button>${event.galleryId?`<a class="btn btn-line" href="galeria.html?id=${encodeURIComponent(event.galleryId)}">Ver galería</a>`:''}<a class="btn btn-line" href="agenda.html">Volver</a></div></div></article>` : `<div class="empty-state">No he encontrado esta actuación. <a href="agenda.html">Volver a la agenda</a>.</div>`; bindCalendarButtons(); initShareButtons(); initReveals(); return; }
    const future=sortEvents(events.filter(isUpcoming)); const past=sortEventsDesc(events.filter(e=>!isUpcoming(e)));
    const types=['Todas','Próximas','Realizadas',...new Set(events.map(e=>e.type))];
    const base = new Date(today.getFullYear(), today.getMonth(), 1);
    root.innerHTML = `<div class="agenda-dashboard"><div class="agenda-intro reveal"><span class="section-kicker">Consulta rápida</span><h2 class="section-title">Agenda útil, compacta y con disponibilidad.</h2><p class="section-lead">Las tarjetas se reducen para no ocupar media página por concierto. El calendario marca las fechas ocupadas y deja visibles los días disponibles.</p><div class="calendar-legend"><span><i class="busy"></i>Ocupada</span><span><i class="free"></i>Disponible</span><span><i class="past"></i>Pasada</span></div></div><div class="availability-panel reveal"><strong>${future.length}</strong><span>fechas próximas o reservadas</span><p>Si no hay conciertos confirmados, la web muestra un mensaje digno y empuja al archivo o al contacto.</p></div></div><div class="calendar-board" id="calendar-board">${[0,1,2].map(n=>monthCalendar(new Date(base.getFullYear(), base.getMonth()+n,1), future)).join('')}</div><div class="filters reveal" aria-label="Filtros de agenda">${types.map((t,i)=>`<button class="filter-chip ${i===0?'is-active':''}" data-event-filter="${escapeHTML(t)}">${escapeHTML(t)}</button>`).join('')}</div><div id="event-list" class="agenda-list-compact"></div>`;
    const list=$('#event-list'); const renderList=(filter='Todas')=>{ let filtered=events; if(filter==='Próximas') filtered=events.filter(isUpcoming); else if(filter==='Realizadas') filtered=events.filter(e=>!isUpcoming(e)); else if(filter!=='Todas') filtered=events.filter(e=>e.type===filter); const ordered=[...sortEvents(filtered.filter(isUpcoming)),...sortEventsDesc(filtered.filter(e=>!isUpcoming(e)))]; list.innerHTML=ordered.length?ordered.map(e=>eventCard(e,false)).join(''):`<div class="empty-state">No hay actuaciones en esta categoría.</div>`; bindCalendarButtons(); initShareButtons(); initReveals(); };
    $$('[data-event-filter]').forEach(btn=>btn.addEventListener('click',()=>{ $$('[data-event-filter]').forEach(b=>b.classList.remove('is-active')); btn.classList.add('is-active'); renderList(btn.dataset.eventFilter); }));
    $$('[data-jump-event]').forEach(btn=>btn.addEventListener('click',()=>{ location.href=`agenda.html?id=${encodeURIComponent(btn.dataset.jumpEvent)}`; })); renderList();
  }

  function renderGallery(){
    const root=$('#gallery-root'); if(!root) return; const id=new URLSearchParams(location.search).get('id'); const galleries=DATA.galleries||[];
    if(id){ const i=galleries.findIndex(g=>g.id===id), g=galleries[i]; const prev=galleries[(i-1+galleries.length)%galleries.length], next=galleries[(i+1)%galleries.length]; root.innerHTML = g ? `<article class="card detail-hero-card reveal"><img src="${escapeHTML(g.cover)}" alt="${escapeHTML(g.title)}"><div class="detail-info"><span class="card-kicker">${escapeHTML(g.category)}</span><h2>${escapeHTML(g.title)}</h2><div class="event-meta"><span>${fmtDate.format(new Date(`${g.date}T12:00:00`))}</span><span>·</span><span>${escapeHTML(g.place)}</span></div><p>${escapeHTML(g.description)}</p><div class="hero-actions" style="margin-top:22px"><a class="btn btn-dark" href="galeria.html">Volver a galerías</a><button class="btn btn-line" data-share-gallery="${escapeHTML(g.id)}">Compartir</button><a class="btn btn-line" href="galeria.html?id=${encodeURIComponent(prev.id)}">Anterior</a><a class="btn btn-line" href="galeria.html?id=${encodeURIComponent(next.id)}">Siguiente</a></div></div></article><section class="section section-tight" style="width:100%;padding-bottom:0"><div class="masonry" id="gallery-images">${g.images.map((img,index)=>`<figure class="masonry-item reveal" data-lightbox-index="${index}"><img src="${escapeHTML(img.src)}" alt="${escapeHTML(img.caption)}" loading="lazy"><figcaption class="masonry-caption">${escapeHTML(img.caption)}</figcaption></figure>`).join('')}</div></section>` : `<div class="empty-state">No he encontrado esta galería. <a href="galeria.html">Volver a galerías</a>.</div>`; if(g) setupLightbox(g.images); initShareButtons(); initReveals(); return; }
    const cats=['Todas','Zamora','Navidad','Semana Santa','Encuentros corales','Archivo histórico'];
    root.innerHTML=`<div class="archive-heading reveal"><span class="section-kicker">Archivo</span><h2 class="section-title">Actuaciones con fecha, lugar y memoria.</h2><p class="section-lead">Cada tarjeta abre una memoria concreta, con contexto y fotos navegables.</p></div><div class="filters reveal" aria-label="Filtros de galería">${cats.map((c,i)=>`<button class="filter-chip ${i===0?'is-active':''}" data-gallery-filter="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('')}</div><div id="gallery-list" class="gallery-grid-archive"></div>`;
    const list=$('#gallery-list'); const renderList=(cat='Todas')=>{ let filtered=galleries; if(cat==='Zamora') filtered=galleries.filter(g=>(g.region||g.place||'').includes('Zamora')); else if(cat!=='Todas') filtered=galleries.filter(g=>g.category===cat); list.innerHTML=filtered.length?filtered.map(galleryCard).join(''):`<div class="empty-state">No hay galerías en este filtro.</div>`; initReveals(); }; $$('[data-gallery-filter]').forEach(btn=>btn.addEventListener('click',()=>{ $$('[data-gallery-filter]').forEach(b=>b.classList.remove('is-active')); btn.classList.add('is-active'); renderList(btn.dataset.galleryFilter); })); renderList();
  }

  function renderRepertoireSpotlight(){ const root=$('#repertoire-spotlight'); if(!root) return; const items=(DATA.repertoire||[]).filter(i=>i.featured).slice(0,6); root.innerHTML=items.map(i=>`<div class="score-item"><div><strong>${escapeHTML(i.title)}</strong><span>${escapeHTML(i.composer)} · ${escapeHTML(i.origin)}</span></div><em>${escapeHTML(i.category)}</em></div>`).join(''); }
  function renderFeaturedRepertoirePage(){ const root=$('#featured-repertoire-page'); if(!root) return; const cats=['Música sacra','Renacimiento y música antigua','Canción popular zamorana','Villancicos y Navidad','Grandes obras','Autores vinculados a Zamora']; root.innerHTML=`<div class="repertoire-editorial reveal"><span class="section-kicker">Familias de repertorio</span><h2 class="section-title">Antes de buscar, entiende el mapa musical.</h2><div class="rep-family-grid">${cats.map((cat,i)=>`<article class="rep-family-card"><span>0${i+1}</span><h3>${escapeHTML(cat)}</h3><p>${escapeHTML(familyDescription(cat))}</p></article>`).join('')}</div></div>`; }
  function familyDescription(cat){ return { 'Música sacra':'Obras litúrgicas, motetes, Ave María y piezas de recogimiento.', 'Renacimiento y música antigua':'Cancioneros, polifonía antigua y autores históricos.', 'Canción popular zamorana':'Raíz territorial, memoria popular y repertorio de Zamora.', 'Villancicos y Navidad':'Tradición navideña española, europea y coral.', 'Grandes obras':'Piezas reconocibles de mayor formato o presencia escénica.', 'Autores vinculados a Zamora':'Compositores o arreglos con vínculo territorial.' }[cat] || 'Familia musical del repertorio.'; }
  function renderRepertoire(){
    renderFeaturedRepertoirePage(); const root=$('#repertoire-root'); if(!root) return; const rep=DATA.repertoire||[]; const cats=['Todas',...new Set(rep.map(i=>i.category))]; const origins=['Todos los orígenes',...new Set(rep.map(i=>i.origin).filter(Boolean))];
    root.innerHTML=`<div class="filters reveal"><input class="search-input" id="repertoire-search" type="search" placeholder="Buscar obra, compositor, origen..." aria-label="Buscar en repertorio"><select class="select-input" id="repertoire-origin" aria-label="Filtrar por origen">${origins.map(o=>`<option value="${escapeHTML(o)}">${escapeHTML(o)}</option>`).join('')}</select></div><div class="filters reveal" aria-label="Categorías de repertorio">${cats.map((c,i)=>`<button class="filter-chip ${i===0?'is-active':''}" data-repertoire-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('')}</div><div class="result-count" id="repertoire-count"></div><div class="repertoire-cards" id="repertoire-list"></div>`;
    let current='Todas'; const search=$('#repertoire-search'), origin=$('#repertoire-origin'), list=$('#repertoire-list'), count=$('#repertoire-count'); const render=()=>{ const q=(search.value||'').trim().toLowerCase(), o=origin.value; const filtered=rep.filter(i=>{ const hay=`${i.title} ${i.composer} ${i.category} ${i.origin} ${i.period}`.toLowerCase(); return (!q||hay.includes(q)) && (current==='Todas'||i.category===current) && (o==='Todos los orígenes'||i.origin===o); }); count.textContent=`${filtered.length} obra${filtered.length===1?'':'s'} visibles`; list.innerHTML=filtered.map(i=>`<article class="repertoire-card-mini"><span class="tag ${i.featured?'gold':''}">${escapeHTML(i.category)}</span><h3>${escapeHTML(i.title)}</h3><p>${escapeHTML(i.composer)}</p><small>${escapeHTML(i.origin)} · ${escapeHTML(i.period)}</small></article>`).join('') || `<div class="empty-state">No hay resultados con estos filtros.</div>`; };
    $$('[data-repertoire-category]').forEach(btn=>btn.addEventListener('click',()=>{ $$('[data-repertoire-category]').forEach(b=>b.classList.remove('is-active')); btn.classList.add('is-active'); current=btn.dataset.repertoireCategory; render(); })); search.addEventListener('input',render); origin.addEventListener('change',render); render();
  }

  function renderTimeline(){ const root=$('#timeline-root'); if(!root) return; root.innerHTML=(DATA.timeline||[]).map(i=>`<div class="timeline-item reveal"><div class="timeline-year">${escapeHTML(i.year)}</div><div class="timeline-card"><h3>${escapeHTML(i.title)}</h3><p>${escapeHTML(i.text)}</p></div></div>`).join(''); }
  function renderFaqs(){ const root=$('#faq-root'); if(!root) return; root.innerHTML=(DATA.faqs||[]).map((i,n)=>`<div class="accordion-item ${n===0?'is-open':''}"><button class="accordion-button" type="button" aria-expanded="${n===0?'true':'false'}"><span>${escapeHTML(i.q)}</span><span class="accordion-icon">+</span></button><div class="accordion-panel">${escapeHTML(i.a)}</div></div>`).join(''); $$('.accordion-button',root).forEach(btn=>btn.addEventListener('click',()=>{ const item=btn.closest('.accordion-item'); const open=item.classList.toggle('is-open'); btn.setAttribute('aria-expanded',String(open)); })); }
  function renderNewsPage(){ const root=$('#news-root'); if(root) root.innerHTML=(DATA.news||[]).map(newsCard).join('') || `<div class="empty-state">No hay noticias publicadas.</div>`; }

  function setupLightbox(items){ state.lightboxItems=items||[]; const lb=$('#lightbox'); if(!lb) return; $$('#gallery-images [data-lightbox-index]').forEach(item=>item.addEventListener('click',()=>openLightbox(Number(item.dataset.lightboxIndex)))); }
  function openLightbox(index){ const lb=$('#lightbox'); if(!lb || !state.lightboxItems.length) return; state.lightboxIndex=index; updateLightbox(); lb.classList.add('is-open'); document.body.style.overflow='hidden'; }
  function updateLightbox(){ const item=state.lightboxItems[state.lightboxIndex], img=$('#lightbox-img'), cap=$('#lightbox-caption'); if(!item || !img || !cap) return; img.src=item.src; img.alt=item.caption||''; cap.textContent=item.caption||''; }
  function closeLightbox(){ const lb=$('#lightbox'); if(!lb) return; lb.classList.remove('is-open'); document.body.style.overflow=''; }
  function navLightbox(dir){ if(!state.lightboxItems.length) return; state.lightboxIndex=(state.lightboxIndex+dir+state.lightboxItems.length)%state.lightboxItems.length; updateLightbox(); }
  function initLightboxControls(){ $('#lightbox-close')?.addEventListener('click',closeLightbox); $('#lightbox-prev')?.addEventListener('click',()=>navLightbox(-1)); $('#lightbox-next')?.addEventListener('click',()=>navLightbox(1)); $('#lightbox')?.addEventListener('click',e=>{ if(e.target.id==='lightbox') closeLightbox(); }); document.addEventListener('keydown',e=>{ if(!$('#lightbox')?.classList.contains('is-open')) return; if(e.key==='Escape') closeLightbox(); if(e.key==='ArrowLeft') navLightbox(-1); if(e.key==='ArrowRight') navLightbox(1); }); }

  function bindCalendarButtons(){ $$('[data-calendar]').forEach(button=>button.addEventListener('click',()=>{ const e=(DATA.events||[]).find(ev=>ev.id===button.dataset.calendar); if(e) downloadICS(e); })); }
  function toICSDate(event){ const d=eventDate(event), pad=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`; }
  function downloadICS(event){ const start=toICSDate(event), endD=new Date(eventDate(event).getTime()+90*60*1000), pad=n=>String(n).padStart(2,'0'); const end=`${endD.getFullYear()}${pad(endD.getMonth()+1)}${pad(endD.getDate())}T${pad(endD.getHours())}${pad(endD.getMinutes())}00`; const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Aures Cantibus//Agenda//ES','BEGIN:VEVENT',`UID:${event.id}@aurescantibus.es`,`DTSTAMP:${start}`,`DTSTART:${start}`,`DTEND:${end}`,`SUMMARY:${event.title}`,`LOCATION:${event.place}, ${event.city}`,`DESCRIPTION:${event.short || event.description}`,'END:VEVENT','END:VCALENDAR'].join('\r\n'); const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'}), url=URL.createObjectURL(blob), a=document.createElement('a'); a.href=url; a.download=`${event.id}.ics`; a.click(); URL.revokeObjectURL(url); }
  function initShareButtons(){ $$('[data-share-gallery]').forEach(btn=>btn.addEventListener('click',async()=>{ const g=(DATA.galleries||[]).find(x=>x.id===btn.dataset.shareGallery); await shareItem(btn, g?.title||document.title, g?.lead||'', location.href); })); $$('[data-share-event]').forEach(btn=>btn.addEventListener('click',async()=>{ const e=(DATA.events||[]).find(x=>x.id===btn.dataset.shareEvent); const url=`${location.origin}${location.pathname.replace(/[^/]*$/,'')}agenda.html?id=${encodeURIComponent(e?.id||'')}`; await shareItem(btn, e?.title||document.title, e?.short||'', url); })); }
  async function shareItem(btn,title,text,url){ const data={title,text,url}; if(navigator.share){ await navigator.share(data).catch(()=>{}); } else { await navigator.clipboard?.writeText(url); btn.textContent='Enlace copiado'; setTimeout(()=>btn.textContent='Compartir',1500); } }
  function initContactForm(){ const form=$('#contact-form'); if(!form) return; form.addEventListener('submit',e=>{ e.preventDefault(); const d=new FormData(form), subject=encodeURIComponent(`[Web Aures Cantibus] ${d.get('motive')||'Consulta'}`), body=encodeURIComponent(`Nombre: ${d.get('name')||''}\nEmail: ${d.get('email')||''}\nTeléfono: ${d.get('phone')||''}\nMotivo: ${d.get('motive')||''}\n\nMensaje:\n${d.get('message')||''}`); const status=$('#form-status'); if(status){ status.classList.add('is-visible'); status.textContent='Se abrirá tu aplicación de correo con el mensaje preparado. Para envío directo real, conecta Formspree, Netlify Forms o backend.'; } location.href=`mailto:${DATA.site?.contactEmail || 'contacto@aurescantibus.es'}?subject=${subject}&body=${body}`; }); }
  function initCookieBanner(){ const b=$('#cookie-banner'), btn=$('#cookie-accept'); if(!b||!btn) return; if(localStorage.getItem('aures_cookie_ok')!=='1') b.classList.add('is-visible'); btn.addEventListener('click',()=>{ localStorage.setItem('aures_cookie_ok','1'); b.classList.remove('is-visible'); }); }
  function enhanceContactEmail(){ $$('[data-contact-email]').forEach(link=>{ const parent=link.parentElement; if(!parent||parent.querySelector('.copy-email')) return; const btn=document.createElement('button'); btn.type='button'; btn.className='btn btn-small btn-line copy-email'; btn.textContent='Copiar correo'; btn.addEventListener('click',async()=>{ try{ await navigator.clipboard.writeText(DATA.site?.contactEmail || 'contacto@aurescantibus.es'); btn.textContent='Correo copiado'; setTimeout(()=>btn.textContent='Copiar correo',1600); }catch{ btn.textContent=DATA.site?.contactEmail || 'contacto@aurescantibus.es'; } }); parent.appendChild(btn); }); }

  document.addEventListener('DOMContentLoaded', () => {
    fillSiteVariables(); initScrollProgress(); initAmbientSpotlight(); initHeader(); initParallax(); initMagneticButtons();
    renderHome(); renderAgenda(); renderGallery(); renderRepertoire(); renderTimeline(); renderFaqs(); renderNewsPage();
    initCarousels(); initCounters(); initLightboxControls(); initContactForm(); initCookieBanner(); bindCalendarButtons(); initShareButtons(); enhanceContactEmail(); initReveals();
  });
})();
