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
    title: 'Дорогой участник',
    subtitle: 'Это приложение поможет тебе на пути знакомства с самим собой. Не спеши, иначе не успеешь разглядеть самого важного человека — себя.',
    theme: 'theme-home'
  },
  'full-path': {
    title: 'Полный путь',
    subtitle: 'Выверенный маршрут, который глубоко, через правду и постепенность, помогает становиться свободнее.',
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
    subtitle: 'Вспомогательные таблицы, списки и практики, чтобы всё было в одном месте.',
    theme: 'theme-materials'
  },
  addiction: {
    title: 'Работа с зависимостью',
    subtitle: 'Здесь собрано всё важное для тяги, срыва, восстановления, мотивации и удержания пути.',
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

function listItem(item) {
  return `
    <a class="list-item" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
      <span class="list-item-title">${escapeHtml(item.title)}</span>
      <span class="list-item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
    </a>
  `;
}

function pathListItem(item) {
  const progressKey = `progress_${item.id}`;
  const checked = localStorage.getItem(progressKey) === '1';

  return `
    <div class="list-item-wrap">
      <label class="list-check" aria-label="Отметить как пройденное">
        <input type="checkbox" data-progress-id="${escapeHtml(item.id)}" ${checked ? 'checked' : ''}>
        <span></span>
      </label>

      <a class="list-item ${checked ? 'is-completed' : ''}" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">
        <span class="list-item-title">${escapeHtml(item.title)}</span>
        <span class="list-item-type">${TYPE_LABELS[item.type] || 'Материал'}</span>
      </a>
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
  const items = (phase.items || [])
    .map(id => ITEMS.get(id))
    .filter(Boolean)
    .map(pathListItem)
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
        <div class="list-wrap">${items}</div>
      </div>
    </details>
  `;
}

function renderHome() {
  const hero = window.APP_DATA.sections.find(section => section.id === 'full-path');
  const secondary = window.APP_DATA.sections.filter(section => section.id !== 'full-path');
  const topTiles = secondary.slice(0, 4);
  const bottomTile = secondary[4];

  return `
    <section class="view-shell">
      <section class="hero-card clickable fade-up fade-1" data-view="full-path">
        <div class="hero-kicker">Главный маршрут</div>
        <h2>${escapeHtml(hero.title)}</h2>
        <p>${escapeHtml(hero.description)}</p>
        <button class="primary-btn" data-view="full-path">${escapeHtml(hero.cta || 'Открыть')}</button>
      </section>

      <section class="secondary-grid fade-up fade-2">
        ${topTiles.map(section => `
          <article class="mini-card clickable" data-view="${escapeHtml(section.id)}">
            <div class="mini-title">${escapeHtml(section.title)}</div>
          </article>
        `).join('')}
      </section>

      ${bottomTile ? `
      <section class="wide-tile-wrap fade-up fade-3">
        <article class="mini-card mini-card-wide clickable" data-view="${escapeHtml(bottomTile.id)}">
          <div class="mini-title">${escapeHtml(bottomTile.title)}</div>
        </article>
      </section>` : ''}

      <section class="roadmap-preview fade-up fade-4">
        <div class="section-heading">
          <h3>Карта проекта</h3>
          <p>Весь путь можно расширять и наполнять годами, не ломая структуру.</p>
        </div>
        <div class="preview-list">
          ${window.APP_DATA.phases.map((phase, index) => `
            <div class="preview-row ${phase.status === 'planned' ? 'is-planned' : ''}">
              <span>${index + 1}. ${escapeHtml(phase.title.replace(/^Этап\\s\\d+\\.\\s*/, ''))}</span>
              <span>${phase.status === 'planned' ? 'в разработке' : 'доступно'}</span>
            </div>
          `).join('')}
        </div>
      </section>
    </section>
  `;
}

function renderFullPath() {
  return `
    <section class="view-shell">
      <section class="section-heading wide fade-up fade-1">
        <h3>Полный маршрут</h3>
        <p>Весь путь проходит через размышления, лекции, медитации и практики, которые в нужной последовательности открывают знания о себе. Не торопитесь и отмечайте пройденное галочками.</p>
      </section>
      <section class="phases-stack fade-up fade-2">
        ${window.APP_DATA.phases.map(phase => phase.status === 'planned' ? plannedPhaseCard(phase) : availablePhaseCard(phase)).join('')}
      </section>
    </section>
  `;
}

function renderCurated(viewId) {
  const ids = window.APP_DATA.curated[viewId] || [];
  const items = ids
    .map(id => ITEMS.get(id))
    .filter(Boolean)
    .map(listItem)
    .join('');

  return `
    <section class="view-shell">
      <section class="list-wrap fade-up fade-1">${items}</section>
    </section>
  `;
}

function bindProgressChecks() {
  document.querySelectorAll('[data-progress-id]').forEach(input => {
    input.addEventListener('change', (event) => {
      const id = event.target.dataset.progressId;
      const key = `progress_${id}`;
      localStorage.setItem(key, event.target.checked ? '1' : '0');

      const listItemNode = event.target.closest('.list-item-wrap')?.querySelector('.list-item');
      if (listItemNode) {
        listItemNode.classList.toggle('is-completed', event.target.checked);
      }
    });
  });
}

function animateContentSwap(root, html) {
  root.classList.remove('is-visible');
  requestAnimationFrame(() => {
    root.innerHTML = html;
    requestAnimationFrame(() => {
      root.classList.add('is-visible');
      bindClicks();
      bindProgressChecks();
    });
  });
}

function renderView() {
  const root = byId('app');
  const meta = VIEW_META[state.activeView] || VIEW_META.home;

  document.body.className = meta.theme;
  byId('pageTitle').textContent = meta.title;
  byId('pageTitle').classList.toggle('is-letter-title', state.activeView === 'home');
  byId('pageSubtitle').textContent = meta.subtitle;
  byId('backBtn').hidden = state.activeView === 'home';

  let html = '';
  if (state.activeView === 'home') {
    html = renderHome();
  } else if (state.activeView === 'full-path') {
    html = renderFullPath();
  } else {
    html = renderCurated(state.activeView);
  }

  animateContentSwap(root, html);
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

  const root = byId('app');
  root.classList.add('app-fade');
  renderView();
});
