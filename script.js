document.documentElement.classList.add('js');

// Mobile navigation
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.topnav');
if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  }));
  document.addEventListener('click', (event) => {
    if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
    }
  });
}

// Reveal elements when they enter the viewport
const revealTargets = document.querySelectorAll('.home-intro,.featured-carousel,.section-kicker,.section-heading,.about-copy,.about-art,.skills-panel,.timeline-item,.project-filters,.project-card,.contact-main,.footer-bottom');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 70}ms`);
    revealObserver.observe(element);
  });
} else {
  revealTargets.forEach((element) => element.classList.add('visible'));
}

// Highlight the current section in the navigation
const navLinks = [...document.querySelectorAll('.topnav a')];
const navSections = ['inicio', 'sobre', 'projetos', 'trajetoria', 'contato']
  .map((id) => document.getElementById(id)).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  navSections.forEach((section) => sectionObserver.observe(section));
}

// Keep the copyright year current
const yearElement = document.querySelector('#current-year');
if (yearElement) yearElement.textContent = String(new Date().getFullYear());
