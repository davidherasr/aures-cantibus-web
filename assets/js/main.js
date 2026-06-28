(() => {
  const DATA = window.AURES_DATA || {};
  const $ = (selector, ctx = document) => ctx.querySelector(selector);
  const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));
  const fmtDate = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
  const fmtShortMonth = new Intl.DateTimeFormat('es-ES', { month: 'short' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const state = {
    lightboxItems: [],
    lightboxIndex: 0
  };

  const escapeHTML = (str = '') => String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const eventDate = (event) => new Date(`${event.date}T${event.time || '00:00'}:00`);
  const isUpcoming = (event) => event.status === 'proximo' || eventDate(event) >= today;

  const sortEvents = (events) => [...events].sort((a, b) => eventDate(a) - eventDate(b));
  const sortEventsDesc = (events) => [...events].sort((a, b) => eventDate(b) - eventDate(a));

  function dateBox(dateString) {
    const date = new Date(`${dateString}T12:00:00`);
    const day = String(date.getDate()).padStart(2, '0');
    const month = fmtShortMonth.format(date).replace('.', '').toUpperCase();
    const year = date.getFullYear();
    return `
      <div class="date-box" aria-hidden="true">
        <span>
          <span class="day">${day}</span>
          <span class="month">${month}</span>
          <span class="year">${year}</span>
        </span>
      </div>`;
  }

  function eventCard(event, compact = false) {
    const statusClass = isUpcoming(event) ? 'green' : 'gold';
    const statusText = isUpcoming(event) ? 'Próximo' : 'Realizado';
    return `
      <article class="event-card reveal">
        ${dateBox(event.date)}
        <div class="event-body">
          <span class="card-kicker">${escapeHTML(event.type)}</span>
          <h3>${escapeHTML(event.title)}</h3>
          <div class="event-meta">
            <span>${fmtDate.format(new Date(`${event.date}T12:00:00`))}</span>
            <span>·</span>
            <span>${escapeHTML(event.time || 'Hora por confirmar')}</span>
            <span>·</span>
            <span>${escapeHTML(event.place)}</span>
          </div>
          <p>${escapeHTML(compact ? event.short : event.description)}</p>
          <div class="tag-row">
            <span class="tag ${statusClass}">${statusText}</span>
            <span class="tag">${escapeHTML(event.city)}</span>
          </div>
          <div class="tag-row" style="margin-top: 16px">
            <a class="btn btn-small btn-dark" href="agenda.html?id=${encodeURIComponent(event.id)}">Ver detalles</a>
            ${event.mapUrl ? `<a class="btn btn-small btn-line" href="${escapeHTML(event.mapUrl)}" target="_blank" rel="noopener">Cómo llegar</a>` : ''}
            ${isUpcoming(event) ? `<button class="btn btn-small btn-line" data-calendar="${escapeHTML(event.id)}">Añadir al calendario</button>` : ''}
          </div>
        </div>
      </article>`;
  }

  function galleryCard(gallery) {
    return `
      <a class="gallery-card reveal" href="galeria.html?id=${encodeURIComponent(gallery.id)}" aria-label="Ver galería: ${escapeHTML(gallery.title)}">
        <img src="${escapeHTML(gallery.cover)}" alt="${escapeHTML(gallery.title)}" loading="lazy">
        <div class="gallery-card-content">
          <span class="card-kicker">${escapeHTML(gallery.category)}</span>
          <h3>${escapeHTML(gallery.title)}</h3>
          <div class="gallery-meta">
            <span>${fmtDate.format(new Date(`${gallery.date}T12:00:00`))}</span>
            <span>·</span>
            <span>${escapeHTML(gallery.place)}</span>
          </div>
          <p>${escapeHTML(gallery.lead)}</p>
        </div>
      </a>`;
  }

  function newsCard(item) {
    return `
      <article class="news-card reveal">
        <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}" loading="lazy">
        <div>
          <span class="tag gold">${escapeHTML(item.tag)}</span>
          <h3>${escapeHTML(item.title)}</h3>
          <div class="event-meta"><span>${fmtDate.format(new Date(`${item.date}T12:00:00`))}</span></div>
          <p>${escapeHTML(item.excerpt)}</p>
        </div>
      </article>`;
  }

  function initHeader() {
    const header = $('.site-header');
    const nav = $('.main-nav');
    const toggle = $('.nav-toggle');
    if (!header) return;

    const current = location.pathname.split('/').pop() || 'index.html';
    $$('.main-nav a').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === current || (current === '' && href === 'index.html')) link.setAttribute('aria-current', 'page');
    });

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
      });
      nav.addEventListener('click', (e) => {
        if (e.target.matches('a')) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  function initReveals() {
    const elements = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach(el => observer.observe(el));
  }

  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length) return;
    const animate = (el) => {
      const target = Number(el.dataset.count || 0);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const duration = 1100;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => observer.observe(el));
  }

  function initParallax() {
    const img = $('.hero-bg img');
    if (!img || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.addEventListener('scroll', () => {
      const offset = Math.min(window.scrollY * 0.08, 70);
      img.style.transform = `scale(1.05) translateY(${offset}px)`;
    }, { passive: true });
  }

  function initCarousels() {
    $$('.carousel-shell').forEach(shell => {
      const track = $('.carousel-track', shell);
      if (!track) return;
      const prev = $('[data-carousel-prev]', shell);
      const next = $('[data-carousel-next]', shell);
      const scrollBy = () => Math.min(track.clientWidth * 0.82, 430);
      prev?.addEventListener('click', () => track.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
      next?.addEventListener('click', () => track.scrollBy({ left: scrollBy(), behavior: 'smooth' }));
    });
  }

  function renderHome() {
    const nextEventPanel = $('#next-event-panel');
    const featuredEvent = sortEvents(DATA.events || []).find(isUpcoming) || sortEventsDesc(DATA.events || [])[0];
    if (nextEventPanel && featuredEvent) {
      nextEventPanel.innerHTML = `
        ${dateBox(featuredEvent.date)}
        <div class="next-title">${escapeHTML(featuredEvent.title)}</div>
        <p class="next-meta">${escapeHTML(featuredEvent.place)} · ${escapeHTML(featuredEvent.city)}<br>${escapeHTML(featuredEvent.time || 'Hora por confirmar')}</p>
        <a class="btn btn-small btn-cream" href="agenda.html?id=${encodeURIComponent(featuredEvent.id)}">Ver detalles</a>`;
    }

    const homeFeatured = $('#home-feature-event');
    if (homeFeatured && featuredEvent) {
      homeFeatured.innerHTML = `
        <div class="feature-event-media">
          <img src="${escapeHTML(featuredEvent.image)}" alt="${escapeHTML(featuredEvent.title)}" loading="lazy">
        </div>
        <div class="feature-event-content">
          <span class="card-kicker">${escapeHTML(featuredEvent.eyebrow || featuredEvent.type)}</span>
          <h3>${escapeHTML(featuredEvent.title)}</h3>
          <div class="event-meta" style="margin: 16px 0">
            <span>${fmtDate.format(new Date(`${featuredEvent.date}T12:00:00`))}</span>
            <span>·</span>
            <span>${escapeHTML(featuredEvent.time || 'Hora por confirmar')}</span>
            <span>·</span>
            <span>${escapeHTML(featuredEvent.place)}</span>
          </div>
          <p>${escapeHTML(featuredEvent.description)}</p>
          <div class="hero-actions" style="margin-top: 18px">
            <a class="btn btn-primary" href="agenda.html?id=${encodeURIComponent(featuredEvent.id)}">Ver actuación</a>
            ${featuredEvent.mapUrl ? `<a class="btn btn-line" href="${escapeHTML(featuredEvent.mapUrl)}" target="_blank" rel="noopener">Cómo llegar</a>` : ''}
          </div>
        </div>`;
    }

    const eventsHome = $('#events-home');
    if (eventsHome) {
      const upcoming = sortEvents(DATA.events || []).filter(isUpcoming).slice(0, 3);
      eventsHome.innerHTML = upcoming.length ? upcoming.map(e => eventCard(e, true)).join('') : `<div class="empty-state">No hay próximas actuaciones publicadas todavía.</div>`;
    }

    const galleryHome = $('#gallery-home');
    if (galleryHome) {
      const galleries = (DATA.galleries || []).filter(g => g.featured).concat((DATA.galleries || []).filter(g => !g.featured)).slice(0, 6);
      galleryHome.innerHTML = galleries.map(galleryCard).join('');
    }

    const newsHome = $('#news-home');
    if (newsHome) newsHome.innerHTML = (DATA.news || []).slice(0, 2).map(newsCard).join('');
  }

  function renderAgenda() {
    const container = $('#agenda-root');
    if (!container) return;
    const id = new URLSearchParams(location.search).get('id');
    const events = DATA.events || [];
    if (id) {
      const event = events.find(e => e.id === id);
      container.innerHTML = event ? `
        <article class="card detail-hero-card reveal">
          <img src="${escapeHTML(event.image)}" alt="${escapeHTML(event.title)}">
          <div class="detail-info">
            <span class="card-kicker">${escapeHTML(event.type)}</span>
            <h2>${escapeHTML(event.title)}</h2>
            <div class="event-meta">
              <span>${fmtDate.format(new Date(`${event.date}T12:00:00`))}</span><span>·</span><span>${escapeHTML(event.time || 'Hora por confirmar')}</span><span>·</span><span>${escapeHTML(event.place)}</span>
            </div>
            <p>${escapeHTML(event.description)}</p>
            <div class="tag-row">
              <span class="tag ${isUpcoming(event) ? 'green' : 'gold'}">${isUpcoming(event) ? 'Próximo' : 'Realizado'}</span>
              <span class="tag">${escapeHTML(event.city)}</span>
              <span class="tag gold">${escapeHTML(event.type)}</span>
            </div>
            <div class="hero-actions" style="margin-top: 22px">
              ${event.mapUrl ? `<a class="btn btn-dark" href="${escapeHTML(event.mapUrl)}" target="_blank" rel="noopener">Cómo llegar</a>` : ''}
              ${event.programUrl ? `<a class="btn btn-line" href="${escapeHTML(event.programUrl)}">Descargar programa</a>` : ''}
              ${isUpcoming(event) ? `<button class="btn btn-line" data-calendar="${escapeHTML(event.id)}">Añadir al calendario</button>` : ''}
              <a class="btn btn-line" href="agenda.html">Volver a agenda</a>
            </div>
          </div>
        </article>
        <section class="section section-tight" style="width: 100%; padding-bottom: 0">
          <div class="section-head">
            <div>
              <span class="section-kicker">Más agenda</span>
              <h2 class="section-title" style="font-size: clamp(2.2rem, 4vw, 4.2rem)">Otras actuaciones</h2>
            </div>
          </div>
          <div class="grid grid-2">${sortEvents(events.filter(e => e.id !== id)).slice(0, 2).map(e => eventCard(e, true)).join('')}</div>
        </section>` : `<div class="empty-state">No he encontrado esta actuación. <a href="agenda.html">Volver a la agenda</a>.</div>`;
      initReveals();
      return;
    }

    const types = ['Todos', ...new Set(events.map(e => e.type))];
    container.innerHTML = `
      <div class="filters reveal" aria-label="Filtros de agenda">
        ${types.map((type, i) => `<button class="filter-chip ${i === 0 ? 'is-active' : ''}" data-event-filter="${escapeHTML(type)}">${escapeHTML(type)}</button>`).join('')}
      </div>
      <div id="event-list" class="grid grid-2"></div>`;

    const list = $('#event-list');
    const renderList = (type = 'Todos') => {
      const filtered = type === 'Todos' ? events : events.filter(e => e.type === type);
      const ordered = [...sortEvents(filtered.filter(isUpcoming)), ...sortEventsDesc(filtered.filter(e => !isUpcoming(e)))];
      list.innerHTML = ordered.length ? ordered.map(e => eventCard(e, false)).join('') : `<div class="empty-state">No hay actuaciones en esta categoría.</div>`;
      bindCalendarButtons();
      initReveals();
    };
    $$('[data-event-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('[data-event-filter]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderList(btn.dataset.eventFilter);
      });
    });
    renderList();
  }

  function renderGallery() {
    const root = $('#gallery-root');
    if (!root) return;
    const id = new URLSearchParams(location.search).get('id');
    const galleries = DATA.galleries || [];
    if (id) {
      const gallery = galleries.find(g => g.id === id);
      root.innerHTML = gallery ? `
        <article class="card detail-hero-card reveal">
          <img src="${escapeHTML(gallery.cover)}" alt="${escapeHTML(gallery.title)}">
          <div class="detail-info">
            <span class="card-kicker">${escapeHTML(gallery.category)}</span>
            <h2>${escapeHTML(gallery.title)}</h2>
            <div class="event-meta"><span>${fmtDate.format(new Date(`${gallery.date}T12:00:00`))}</span><span>·</span><span>${escapeHTML(gallery.place)}</span></div>
            <p>${escapeHTML(gallery.description)}</p>
            <div class="hero-actions" style="margin-top: 22px">
              <a class="btn btn-dark" href="galeria.html">Volver a galerías</a>
              <button class="btn btn-line" data-share-gallery="${escapeHTML(gallery.id)}">Compartir</button>
            </div>
          </div>
        </article>
        <section class="section section-tight" style="width:100%; padding-bottom:0">
          <div class="masonry" id="gallery-images">
            ${gallery.images.map((img, index) => `
              <figure class="masonry-item reveal" data-lightbox-index="${index}">
                <img src="${escapeHTML(img.src)}" alt="${escapeHTML(img.caption)}" loading="lazy">
                <figcaption class="masonry-caption">${escapeHTML(img.caption)}</figcaption>
              </figure>`).join('')}
          </div>
        </section>` : `<div class="empty-state">No he encontrado esta galería. <a href="galeria.html">Volver a galerías</a>.</div>`;
      if (gallery) setupLightbox(gallery.images);
      initReveals();
      return;
    }

    const categories = ['Todas', ...new Set(galleries.map(g => g.category))];
    root.innerHTML = `
      <div class="filters reveal" aria-label="Filtros de galería">
        ${categories.map((category, i) => `<button class="filter-chip ${i === 0 ? 'is-active' : ''}" data-gallery-filter="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join('')}
      </div>
      <div id="gallery-list" class="carousel-track" style="grid-auto-columns:minmax(300px, 380px)"></div>`;
    const list = $('#gallery-list');
    const renderList = (category = 'Todas') => {
      const filtered = category === 'Todas' ? galleries : galleries.filter(g => g.category === category);
      list.innerHTML = filtered.map(galleryCard).join('');
      initReveals();
    };
    $$('[data-gallery-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('[data-gallery-filter]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        renderList(btn.dataset.galleryFilter);
      });
    });
    renderList();
  }

  function renderRepertoire() {
    const root = $('#repertoire-root');
    if (!root) return;
    const repertoire = DATA.repertoire || [];
    const categories = ['Todas', ...new Set(repertoire.map(item => item.category))];
    const origins = ['Todos los orígenes', ...new Set(repertoire.map(item => item.origin).filter(Boolean))];
    root.innerHTML = `
      <div class="filters reveal">
        <input class="search-input" id="repertoire-search" type="search" placeholder="Buscar obra, compositor, origen..." aria-label="Buscar en repertorio">
        <select class="select-input" id="repertoire-origin" aria-label="Filtrar por origen">
          ${origins.map(origin => `<option value="${escapeHTML(origin)}">${escapeHTML(origin)}</option>`).join('')}
        </select>
      </div>
      <div class="filters reveal" aria-label="Categorías de repertorio">
        ${categories.map((category, i) => `<button class="filter-chip ${i === 0 ? 'is-active' : ''}" data-repertoire-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join('')}
      </div>
      <div class="result-count" id="repertoire-count"></div>
      <div style="overflow-x:auto">
        <table class="repertoire-table" aria-describedby="repertoire-count">
          <thead>
            <tr><th>Obra</th><th>Compositor / arreglo</th><th>Categoría</th><th>Origen</th><th>Época</th></tr>
          </thead>
          <tbody id="repertoire-list"></tbody>
        </table>
      </div>`;

    let currentCategory = 'Todas';
    const search = $('#repertoire-search');
    const origin = $('#repertoire-origin');
    const list = $('#repertoire-list');
    const count = $('#repertoire-count');

    const render = () => {
      const query = (search.value || '').trim().toLowerCase();
      const selectedOrigin = origin.value;
      const filtered = repertoire.filter(item => {
        const haystack = `${item.title} ${item.composer} ${item.category} ${item.origin} ${item.period}`.toLowerCase();
        const matchQuery = !query || haystack.includes(query);
        const matchCategory = currentCategory === 'Todas' || item.category === currentCategory;
        const matchOrigin = selectedOrigin === 'Todos los orígenes' || item.origin === selectedOrigin;
        return matchQuery && matchCategory && matchOrigin;
      });
      count.textContent = `${filtered.length} obra${filtered.length === 1 ? '' : 's'} visibles`;
      list.innerHTML = filtered.map(item => `
        <tr>
          <td>${escapeHTML(item.title)}</td>
          <td>${escapeHTML(item.composer)}</td>
          <td><span class="tag">${escapeHTML(item.category)}</span></td>
          <td>${escapeHTML(item.origin)}</td>
          <td>${escapeHTML(item.period)}</td>
        </tr>`).join('') || `<tr><td colspan="5">No hay resultados con estos filtros.</td></tr>`;
    };

    $$('[data-repertoire-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('[data-repertoire-category]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentCategory = btn.dataset.repertoireCategory;
        render();
      });
    });
    search.addEventListener('input', render);
    origin.addEventListener('change', render);
    render();
  }

  function renderTimeline() {
    const root = $('#timeline-root');
    if (!root) return;
    root.innerHTML = (DATA.timeline || []).map(item => `
      <div class="timeline-item reveal">
        <div class="timeline-year">${escapeHTML(item.year)}</div>
        <div class="timeline-card">
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.text)}</p>
        </div>
      </div>`).join('');
  }

  function renderFaqs() {
    const root = $('#faq-root');
    if (!root) return;
    root.innerHTML = (DATA.faqs || []).map((item, index) => `
      <div class="accordion-item ${index === 0 ? 'is-open' : ''}">
        <button class="accordion-button" type="button" aria-expanded="${index === 0 ? 'true' : 'false'}">
          <span>${escapeHTML(item.q)}</span>
          <span class="accordion-icon">+</span>
        </button>
        <div class="accordion-panel">${escapeHTML(item.a)}</div>
      </div>`).join('');
    $$('.accordion-button', root).forEach(button => {
      button.addEventListener('click', () => {
        const item = button.closest('.accordion-item');
        const open = item.classList.toggle('is-open');
        button.setAttribute('aria-expanded', String(open));
      });
    });
  }

  function renderNewsPage() {
    const root = $('#news-root');
    if (!root) return;
    root.innerHTML = (DATA.news || []).map(newsCard).join('') || `<div class="empty-state">No hay noticias publicadas.</div>`;
  }

  function setupLightbox(items) {
    state.lightboxItems = items || [];
    const lb = $('#lightbox');
    if (!lb) return;
    $$('#gallery-images [data-lightbox-index]').forEach(item => {
      item.addEventListener('click', () => openLightbox(Number(item.dataset.lightboxIndex)));
    });
  }

  function openLightbox(index) {
    const lb = $('#lightbox');
    if (!lb || !state.lightboxItems.length) return;
    state.lightboxIndex = index;
    updateLightbox();
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const item = state.lightboxItems[state.lightboxIndex];
    const img = $('#lightbox-img');
    const caption = $('#lightbox-caption');
    if (!item || !img || !caption) return;
    img.src = item.src;
    img.alt = item.caption || '';
    caption.textContent = item.caption || '';
  }

  function closeLightbox() {
    const lb = $('#lightbox');
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function navLightbox(direction) {
    if (!state.lightboxItems.length) return;
    state.lightboxIndex = (state.lightboxIndex + direction + state.lightboxItems.length) % state.lightboxItems.length;
    updateLightbox();
  }

  function initLightboxControls() {
    $('#lightbox-close')?.addEventListener('click', closeLightbox);
    $('#lightbox-prev')?.addEventListener('click', () => navLightbox(-1));
    $('#lightbox-next')?.addEventListener('click', () => navLightbox(1));
    $('#lightbox')?.addEventListener('click', (e) => { if (e.target.id === 'lightbox') closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!$('#lightbox')?.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navLightbox(-1);
      if (e.key === 'ArrowRight') navLightbox(1);
    });
  }

  function bindCalendarButtons() {
    $$('[data-calendar]').forEach(button => {
      button.addEventListener('click', () => {
        const event = (DATA.events || []).find(e => e.id === button.dataset.calendar);
        if (event) downloadICS(event);
      });
    });
  }

  function toICSDate(event) {
    const date = new Date(`${event.date}T${event.time || '00:00'}:00`);
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
  }

  function downloadICS(event) {
    const start = toICSDate(event);
    const endDate = new Date(eventDate(event).getTime() + 90 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    const end = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aures Cantibus//Agenda//ES',
      'BEGIN:VEVENT',
      `UID:${event.id}@aurescantibus.es`,
      `DTSTAMP:${start}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.place}, ${event.city}`,
      `DESCRIPTION:${event.short || event.description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || '';
      const motive = data.get('motive') || 'Consulta web';
      const message = data.get('message') || '';
      const email = data.get('email') || '';
      const phone = data.get('phone') || '';
      const subject = encodeURIComponent(`[Web Aures Cantibus] ${motive}`);
      const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nMotivo: ${motive}\n\nMensaje:\n${message}`);
      const status = $('#form-status');
      if (status) {
        status.classList.add('is-visible');
        status.textContent = 'Se abrirá tu aplicación de correo con el mensaje preparado. Para un envío real sin correo local, conecta Formspree, Netlify Forms o un backend.';
      }
      window.location.href = `mailto:${DATA.site?.contactEmail || 'contacto@aurescantibus.es'}?subject=${subject}&body=${body}`;
    });
  }

  function initVoiceCards() {
    $$('[data-voice]').forEach(card => {
      card.addEventListener('click', () => {
        const target = $(`#voice-${card.dataset.voice}`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  function initShareButtons() {
    $$('[data-share-gallery]').forEach(button => {
      button.addEventListener('click', async () => {
        const gallery = (DATA.galleries || []).find(g => g.id === button.dataset.shareGallery);
        const shareData = { title: gallery?.title || document.title, text: gallery?.lead || '', url: location.href };
        if (navigator.share) {
          await navigator.share(shareData).catch(() => {});
        } else {
          await navigator.clipboard?.writeText(location.href);
          button.textContent = 'Enlace copiado';
        }
      });
    });
  }

  function initCookieBanner() {
    const banner = $('#cookie-banner');
    const btn = $('#cookie-accept');
    if (!banner || !btn) return;
    const accepted = localStorage.getItem('aures_cookie_ok') === '1';
    if (!accepted) banner.classList.add('is-visible');
    btn.addEventListener('click', () => {
      localStorage.setItem('aures_cookie_ok', '1');
      banner.classList.remove('is-visible');
    });
  }

  function fillSiteVariables() {
    $$('[data-site]').forEach(el => {
      const key = el.dataset.site;
      if (DATA.site?.[key] !== undefined) el.textContent = DATA.site[key];
    });
    $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
    $$('[data-contact-email]').forEach(el => {
      const email = DATA.site?.contactEmail || 'contacto@aurescantibus.es';
      el.textContent = email;
      if (el.tagName === 'A') el.href = `mailto:${email}`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    fillSiteVariables();
    initHeader();
    initParallax();
    renderHome();
    renderAgenda();
    renderGallery();
    renderRepertoire();
    renderTimeline();
    renderFaqs();
    renderNewsPage();
    initCarousels();
    initCounters();
    initLightboxControls();
    initContactForm();
    initVoiceCards();
    initShareButtons();
    initCookieBanner();
    bindCalendarButtons();
    initReveals();
  });
})();
