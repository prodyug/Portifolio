const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const projectGrid = document.querySelector('#project-grid');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function createProject(project, index) {
  const article = document.createElement('article');
  article.className = 'project reveal';
  article.style.setProperty('--project-accent', project.accent || '#303a54');

  const link = document.createElement('a');
  link.className = 'project-image';
  link.href = project.url || project.github || '#contato';
  link.setAttribute('aria-label', 'Abrir ' + project.title);

  if (project.url || project.github) {
    link.target = '_blank';
    link.rel = 'noreferrer';
  }

  const images = project.images || [project.image].filter(Boolean);
  images.forEach(function (image, imageIndex) {
    const media = document.createElement('span');
    media.className = 'project-media' + (imageIndex === 0 ? ' is-active' : '');
    media.style.backgroundImage = 'url("' + image + '")';
    media.setAttribute('aria-hidden', 'true');
    link.append(media);
  });

  const content = document.createElement('div');
  content.className = 'project-content';
  const top = document.createElement('div');
  top.className = 'project-meta';
  const number = document.createElement('span');
  number.className = 'project-number';
  number.textContent = '0' + (index + 1) + ' / 04';
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
  const stack = document.createElement('p');
  stack.className = 'project-stack';
  stack.textContent = project.technologies.join(' / ');
  const open = document.createElement('span');
  open.className = 'project-open';
  open.textContent = '↗';
  open.setAttribute('aria-hidden', 'true');
  text.append(title, description, stack);
  info.append(text, open);
  content.append(top, info);
  link.append(content);
  article.append(link);
  return article;
}

projects.forEach(function (project, index) {
  projectGrid.append(createProject(project, index));
});

toggle.addEventListener('click', function () {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.nav a').forEach(function (link) {
  link.addEventListener('click', function () {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  });
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.focus();
  }
});

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function (element) {
  revealObserver.observe(element);
});

const projectObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
  });
}, { threshold: 0.35 });

document.querySelectorAll('.project').forEach(function (project) {
  projectObserver.observe(project);
});

if (!reduceMotion) {
  window.setInterval(function () {
    document.querySelectorAll('.project.in-view').forEach(function (project) {
      if (project.matches(':hover')) return;
      const slides = project.querySelectorAll('.project-media');
      if (slides.length < 2) return;
      let activeSlide = Array.from(slides).findIndex(function (slide) {
        return slide.classList.contains('is-active');
      });
      slides[activeSlide].classList.remove('is-active');
      activeSlide = (activeSlide + 1) % slides.length;
      slides[activeSlide].classList.add('is-active');
    });
  }, 4200);
}

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
  const scene = document.querySelector('.statue-scene');
  scene.addEventListener('pointermove', function (event) {
    const bounds = scene.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    scene.style.setProperty('--pointer-rotate-x', (x * 7).toFixed(2) + 'deg');
    scene.style.setProperty('--pointer-rotate-y', (y * -5).toFixed(2) + 'deg');
  });
  scene.addEventListener('pointerleave', function () {
    scene.style.setProperty('--pointer-rotate-x', '0deg');
    scene.style.setProperty('--pointer-rotate-y', '0deg');
  });

  document.querySelectorAll('.project').forEach(function (project) {
    project.addEventListener('pointermove', function (event) {
      const bounds = project.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      project.style.setProperty('--mouse-x', (x * 100).toFixed(1) + '%');
      project.style.setProperty('--mouse-y', (y * 100).toFixed(1) + '%');
      project.style.setProperty('--tilt-x', ((x - .5) * 3).toFixed(2) + 'deg');
      project.style.setProperty('--tilt-y', ((y - .5) * -3).toFixed(2) + 'deg');
    });
    project.addEventListener('pointerleave', function () {
      project.style.setProperty('--tilt-x', '0deg');
      project.style.setProperty('--tilt-y', '0deg');
    });
  });
}
