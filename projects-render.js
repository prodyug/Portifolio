const projectGrid = document.querySelector('#project-grid');
const projectList = Array.isArray(projects) ? projects : [];
const filterButtons = [...document.querySelectorAll('.filter-button')];
const emptyState = document.querySelector('.projects-empty');
const projectCards = [];

function getProjectCategory(project) {
  const value = `${project.type || ''} ${project.title || ''}`.toLowerCase();
  if (/e-commerce|ecommerce|loja/.test(value)) return 'commerce';
  if (/educa|estudo|ia|agente/.test(value)) return 'learning';
  return 'system';
}

function makeProjectCard(project, index) {
  const card = document.createElement('article');
  card.className = 'project-card reveal';
  card.dataset.category = getProjectCategory(project);
  card.style.setProperty('--card-index', index);

  const imageLink = document.createElement('a');
  imageLink.className = 'project-image';
  imageLink.href = project.url || project.github || '#contato';
  imageLink.setAttribute('aria-label', `Abrir projeto: ${project.title}`);
  if (project.url || project.github) {
    imageLink.target = '_blank';
    imageLink.rel = 'noreferrer';
  }

  const imageSource = project.images?.[0] || project.image;
  if (imageSource) {
    const image = document.createElement('img');
    image.src = imageSource;
    image.alt = `Tela do projeto ${project.title}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      image.remove();
      addImagePlaceholder(imageLink, project.title);
    }, { once: true });
    imageLink.append(image);
  } else {
    addImagePlaceholder(imageLink, project.title);
  }

  const info = document.createElement('div');
  info.className = 'project-info';
  const meta = document.createElement('div');
  meta.className = 'project-meta';
  const category = document.createElement('span');
  category.textContent = project.type || 'Projeto';
  const year = document.createElement('span');
  year.textContent = project.year || '';
  meta.append(category, year);

  const title = document.createElement('h3');
  title.textContent = project.title || 'Projeto';
  const description = document.createElement('p');
  description.textContent = project.description || '';
  const tags = document.createElement('div');
  tags.className = 'project-tags';
  (project.technologies || []).slice(0, 4).forEach((technology) => {
    const tag = document.createElement('span');
    tag.textContent = technology;
    tags.append(tag);
  });

  const actions = document.createElement('div');
  actions.className = 'project-actions';
  if (project.url) actions.append(createProjectLink(project.url, 'Ver projeto'));
  if (project.github) actions.append(createProjectLink(project.github, 'Código', 'secondary'));

  info.append(meta, title, description, tags, actions);
  card.append(imageLink, info);
  return card;
}

function addImagePlaceholder(container, title) {
  const placeholder = document.createElement('span');
  placeholder.className = 'project-image-placeholder';
  placeholder.textContent = (title || 'Projeto').trim().slice(0, 2).toUpperCase();
  placeholder.setAttribute('aria-hidden', 'true');
  container.append(placeholder);
}

function createProjectLink(url, label, extraClass = '') {
  const link = document.createElement('a');
  link.className = `project-link ${extraClass}`.trim();
  link.href = url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = label;
  return link;
}

if (projectGrid) {
  projectList.forEach((project, index) => {
    const card = makeProjectCard(project, index);
    projectCards.push(card);
    projectGrid.append(card);
  });

  const categories = ['all', 'system', 'commerce', 'learning'];
  categories.forEach((category) => {
    const count = category === 'all' ? projectCards.length : projectCards.filter((card) => card.dataset.category === category).length;
    const countTarget = document.querySelector(`[data-filter-count="${category}"]`);
    if (countTarget) countTarget.textContent = String(count).padStart(2, '0');
  });

  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle('is-active', isSelected);
      filterButton.setAttribute('aria-pressed', String(isSelected));
    });
    let visibleCount = 0;
    projectCards.forEach((card) => {
      const visible = selected === 'all' || card.dataset.category === selected;
      card.hidden = !visible;
      if (visible) {
        visibleCount += 1;
        card.classList.remove('filter-enter');
        requestAnimationFrame(() => card.classList.add('filter-enter'));
      }
    });
    if (emptyState) emptyState.hidden = visibleCount > 0;
  }));
}
