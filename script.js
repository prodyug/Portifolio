const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const projectGrid = document.querySelector('#project-grid');
const glow = document.querySelector('.cursor-glow');

function createProject(project, index) {
  const article = document.createElement('article');
  article.className = 'project reveal';

  const link = document.createElement('a');
  link.className = 'project-image';
  link.href = project.url || project.github || '#contato';
  link.setAttribute('aria-label', `Abrir ${project.title}`);
  link.style.backgroundColor = project.accent;

  if (project.url || project.github) {
    link.target = '_blank';
    link.rel = 'noreferrer';
  }

  if (project.image) {
    link.style.backgroundImage = `url("${project.image}")`;
  }

  const content = document.createElement('div');
  content.className = 'project-content';
  const top = document.createElement('div');
  const number = document.createElement('span');
  number.className = 'project-number';
  number.textContent = `0${index + 1} / 04`;
  const type = document.createElement('span');
  type.className = 'project-type';
  type.textContent = project.type;
  top.append(number, type);

  const info = document.createElement('div');
  info.className = 'project-info';
  const text = document.createElement('div');
  const title = document.createElement('h3');
  title.className = 'project-title';
  title.textContent = project.title;
  const description = document.createElement('p');
  description.className = 'project-description';
  description.textContent = project.description;
  const open = document.createElement('span');
  open.className = 'project-open';
  open.textContent = '↗';
  text.append(title, description); info.append(text, open);
  content.append(top, info); link.append(content); article.append(link);
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
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});
