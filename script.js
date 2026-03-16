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
    title: 'Дорогой участник!',
    subtitle: 'Это приложение поможет тебе на пути знакомства с самим собой. Не спеши, иначе не успеешь разглядеть самого важного человека - себя.',
    theme: 'theme-home'
  },
  'full-path': {
    title: 'Полный путь',
    subtitle: 'Выверенный маршрут который очень глубоко, через терни и правду позволит стать свободным.',
    theme: 'theme-path'
  },
  meditations: {
    title: 'Медитации',
    subtitle: 'Практики выхода в состояние наблюдателя — в ту точку сознания, из которой человек может по-настоящему увидеть себя.',
    theme: 'theme-meditations'
  },
  lectures: {
    title: 'Лекции',
    subtitle: 'Структурные материалы для глубокого понимания и вдумчивого изучения.',
    theme: 'theme-lectures'
  },
  practices: {
    title: 'Практики и техники',
    subtitle: 'Телесные и прикладные инструменты, которые начинают работать сразу после применения.',
    theme: 'theme-practices'
  },
  materials: {
    title: 'Материалы',
    subtitle: 'Вспомогательные таблицы, списки, практики, чтобы все было в одном месте.',
    theme: 'theme-materials'
  },
  addiction: {
    title: 'Работа с зависимостью',
    subtitle: 'Здесь собрано все в одном месте чтобы справится с тягой , состояние срыва, восстановление после употребления, мотивация и пр.',
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
        <span class="item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
      </div>
      <div class="item-title">${escapeHtml(item.title)}</div>
      ${item.desc ? `<div class="item-desc">${escapeHtml(item.desc)}</div>` : ''}
    </a>
  `;
}

function cardForPathItem(item) {
  const progressKey = `progress_${item.id}`;
  const checked = localStorage.getItem(progressKey) === '1';

  return `
    <div class="item-card-wrap">
      <a class="item-card ${checked ? 'is-completed' : ''}" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
        <div class="item-topline">
          <span class="item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
        </div>
        <div class="item-title">${escapeHtml(item.title)}</div>
        ${item.desc ? `<div class="item-desc">${escapeHtml(item.desc)}</div>` : ''}
      </a>

      <label class="item-check">
        <input type="checkbox" data-progress-id="${escapeHtml(item.id)}" ${checked ? 'checked' : ''}>
        <span></span>
      </label>
    </div>
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
    .map(cardForPathItem)
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
      <p>Весь пуь проходит через размышления, лекции, медитации и практики, которые в нужной последовательности открывают знания о себе. Не торопитесь, отмечайте пройденный путь галочками.</p>
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
    addiction: 'Здесь собраны материалы для тяги, срыва, восстановления и удержания пути.'
  };

  return `
    <section class="section-heading wide section-hero">
      <h3>${escapeHtml(VIEW_META[viewId].title)}</h3>
      <p>${escapeHtml(introMap[viewId] || '')}</p>
    </section>
    <section class="items-grid">${cards}</section>
  `;
}

function bindProgressChecks() {
  document.querySelectorAll('[data-progress-id]').forEach(input => {
    input.addEventListener('change', (event) => {
      const id = event.target.dataset.progressId;
      const key = `progress_${id}`;
      localStorage.setItem(key, event.target.checked ? '1' : '0');

      const card = event.target.closest('.item-card-wrap')?.querySelector('.item-card');
      if (card) {
        card.classList.toggle('is-completed', event.target.checked);
      }
    });
  });
}

function renderView() {
  const root = byId('app');
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
  bindProgressChecks();
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
