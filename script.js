const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const projectGrid = document.querySelector('#project-grid');

function createProject(project, index) {
  const article = document.createElement('article');
  article.className = `project reveal${index === 0 ? ' project-large' : ''}`;
  const link = document.createElement('a');
  link.className = 'project-image project-template';
  link.href = project.url || project.github || '#contato';
  link.setAttribute('aria-label', `Ver ${project.title}`);
  if (project.url || project.github) { link.target = '_blank'; link.rel = 'noreferrer'; }
  if (project.image) { link.style.backgroundImage = `linear-gradient(rgba(23,32,32,.08),rgba(23,32,32,.08)),url("${project.image}")`; link.classList.add('has-image'); }
  else link.style.setProperty('--project-accent', project.accent);

  const indexLabel = document.createElement('span');
  indexLabel.className = 'project-index';
  indexLabel.textContent = `0${index + 1} / SEU PROJETO`;
  const visual = document.createElement('div');
  visual.className = 'template-visual';
  const visualTitle = document.createElement('strong');
  visualTitle.textContent = project.title;
  const description = document.createElement('p');
  description.textContent = project.description;
  visual.append(visualTitle, description);
  const view = document.createElement('span');
  view.className = 'view-project';
  view.textContent = project.url || project.github ? 'Ver projeto ↗' : 'Adicionar link ↗';
  link.append(indexLabel, visual, view);

  const meta = document.createElement('div');
  meta.className = 'project-meta';
  const text = document.createElement('div');
  const title = document.createElement('h3'); title.textContent = project.title;
  const stack = document.createElement('p'); stack.textContent = `${project.type} · ${project.technologies.join(' · ')}`;
  const year = document.createElement('span'); year.textContent = project.year;
  text.append(title, stack); meta.append(text, year); article.append(link, meta);
  return article;
}

projects.forEach((project, index) => projectGrid.append(createProject(project, index)));

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nav a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
