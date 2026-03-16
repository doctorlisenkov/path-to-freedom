const state = {
  activeView: 'home'
};

const TYPE_LABELS = {
  meditation: 'Медитация',
  lecture: 'Лекция',
  practice: 'Практика',
  material: 'Материал',
  podcast: 'Размышление'
};

const VIEW_META = {
  home: {
    title: 'Путь к свободе',
    subtitle: 'Главный вход в навигатор. Здесь ты можешь идти по полному маршруту или выбрать более короткий способ входа.',
    theme: 'theme-home'
  },
  'full-path': {
    title: 'Полный путь',
    subtitle: 'Большая карта проекта: пройди этапы последовательно или вернись в нужную точку.',
    theme: 'theme-path'
  },
  meditations: {
    title: 'Медитации',
    subtitle: 'Практики для замедления, контакта с собой и выхода в наблюдателя.',
    theme: 'theme-meditations'
  },
  lectures: {
    title: 'Лекции',
    subtitle: 'Структурные материалы для глубокого понимания и вдумчивого изучения.',
    theme: 'theme-lectures'
  },
  practices: {
    title: 'Практики и техники',
    subtitle: 'Телесные и прикладные инструменты, которые можно брать в жизнь сразу.',
    theme: 'theme-practices'
  },
  materials: {
    title: 'Материалы',
    subtitle: 'Вспомогательные таблицы, списки и раздаточные опоры.',
    theme: 'theme-materials'
  },
  start: {
    title: 'С чего начать',
    subtitle: 'Быстрый мягкий вход в проект, если человек только пришёл и ещё не знает, куда смотреть.',
    theme: 'theme-start'
  }
};

function byId(id) {
  return document.getElementById(id);
}

function itemMap() {
  const map = new Map();
  window.APP_DATA.items.forEach(item => map.set(item.id, item));
  return map;
}

const ITEMS = itemMap();

function fmtNumber(value) {
  return String(value).padStart(2, '0');
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cardForItem(item) {
  return `
    <a class="item-card" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
      <div class="item-topline">
        <span class="item-number">#${fmtNumber(item.number)}</span>
        <span class="item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
      </div>
      <div class="item-title">${escapeHtml(item.title)}</div>
      ${item.desc ? `<div class="item-desc">${escapeHtml(item.desc)}</div>` : ''}
      <div class="item-link">Открыть в Telegram</div>
    </a>
  `;
}

function plannedPhaseCard(phase) {
  return `
    <details class="phase phase-planned">
      <summary>
        <div>
          <div class="phase-title">${escapeHtml(phase.title)}</div>
          <div class="phase-desc">${escapeHtml(phase.description)}</div>
        </div>
        <span class="phase-badge">Скоро</span>
      </summary>
      <div class="phase-content">
        <div class="planned-copy">Этап уже заложен в маршрут и будет постепенно наполняться новыми материалами.</div>
        <div class="topic-list">
          ${(phase.topics || []).map(topic => `<span class="topic-chip">${escapeHtml(topic)}</span>`).join('')}
        </div>
      </div>
    </details>
  `;
}

function availablePhaseCard(phase) {
  const cards = (phase.items || [])
    .map(id => ITEMS.get(id))
    .filter(Boolean)
    .map(cardForItem)
    .join('');

  return `
    <details class="phase" open>
      <summary>
        <div>
          <div class="phase-title">${escapeHtml(phase.title)}</div>
          <div class="phase-desc">${escapeHtml(phase.description)}</div>
        </div>
        <span class="phase-badge">${(phase.items || []).length} материалов</span>
      </summary>
      <div class="phase-content">
        <div class="items-grid">${cards}</div>
      </div>
    </details>
  `;
}

function renderHome() {
  const hero = window.APP_DATA.sections.find(section => section.id === 'full-path');
  const secondary = window.APP_DATA.sections.filter(section => section.id !== 'full-path');

  return `
    <section class="hero-card clickable" data-view="full-path">
      <div class="hero-kicker">Главный маршрут</div>
      <h2>${escapeHtml(hero.title)}</h2>
      <p>${escapeHtml(hero.description)}</p>
      <button class="primary-btn" data-view="full-path">${escapeHtml(hero.cta || 'Открыть')}</button>
    </section>

    <section class="secondary-grid">
      ${secondary.map(section => `
        <article class="mini-card clickable" data-view="${escapeHtml(section.id)}">
          <div class="mini-title">${escapeHtml(section.title)}</div>
          <div class="mini-desc">${escapeHtml(section.description)}</div>
        </article>
      `).join('')}
    </section>

    <section class="roadmap-preview">
      <div class="section-heading">
        <h3>Карта проекта</h3>
        <p>Весь путь можно расширять и наполнять годами, не ломая структуру.</p>
      </div>
      <div class="preview-list">
        ${window.APP_DATA.phases.map((phase, index) => `
          <div class="preview-row ${phase.status === 'planned' ? 'is-planned' : ''}">
            <span>${index + 1}. ${escapeHtml(phase.title.replace(/^Этап\s\d+\.\s*/, ''))}</span>
            <span>${phase.status === 'planned' ? 'в разработке' : 'доступно'}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderFullPath() {
  return `
    <section class="section-heading wide">
      <h3>Полный маршрут</h3>
      <p>Главный вход в проект. Видны уже готовые этапы и будущие блоки, которые будут раскрываться по мере выхода материалов.</p>
    </section>
    <section class="phases-stack">
      ${window.APP_DATA.phases.map(phase => phase.status === 'planned' ? plannedPhaseCard(phase) : availablePhaseCard(phase)).join('')}
    </section>
  `;
}

function renderCurated(viewId) {
  const ids = window.APP_DATA.curated[viewId] || [];
  const cards = ids
    .map(id => ITEMS.get(id))
    .filter(Boolean)
    .map(cardForItem)
    .join('');

  const introMap = {
    meditations: 'Отдельный путь для состояния, замедления и возвращения к себе.',
    lectures: 'Отдельный путь для тех, кто любит изучать глубоко и системно.',
    practices: 'Здесь собраны техники, которые можно брать прямо в день и использовать в нужный момент.',
    materials: 'Сюда вынесены таблицы, чек-листы и вспомогательные опоры.',
    start: 'Мягкий старт для тех, кто только вошёл в пространство проекта.'
  };

  return `
    <section class="section-heading wide section-hero">
      <h3>${escapeHtml(VIEW_META[viewId].title)}</h3>
      <p>${escapeHtml(introMap[viewId] || '')}</p>
    </section>
    <section class="items-grid">${cards}</section>
  `;
}

function renderView() {
  const root = byId('app');
  const hero = byId('pageHero');
  const meta = VIEW_META[state.activeView] || VIEW_META.home;

  document.body.className = meta.theme;
  byId('pageTitle').textContent = meta.title;
  byId('pageSubtitle').textContent = meta.subtitle;
  byId('backBtn').hidden = state.activeView === 'home';

  if (state.activeView === 'home') {
    root.innerHTML = renderHome();
  } else if (state.activeView === 'full-path') {
    root.innerHTML = renderFullPath();
  } else {
    root.innerHTML = renderCurated(state.activeView);
  }

  bindClicks();
}

function bindClicks() {
  document.querySelectorAll('[data-view]').forEach(node => {
    node.addEventListener('click', (event) => {
      const target = event.target.closest('[data-view]');
      if (!target) return;
      state.activeView = target.dataset.view;
      renderView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  byId('brandTitle').textContent = window.APP_DATA.brand.title;
  byId('backBtn').addEventListener('click', () => {
    state.activeView = 'home';
    renderView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  renderView();
});
