const featuredCarousel = document.querySelector('[data-featured-carousel]');
const featuredSlidesHost = document.querySelector('[data-featured-slides]');
const featuredDotsHost = document.querySelector('[data-featured-dots]');
const featuredCount = document.querySelector('[data-featured-count]');

if (featuredCarousel && featuredSlidesHost && Array.isArray(projects) && projects.length) {
  let selectedSlide = 0;
  let rotateTimer;
  let hovered = false;
  let focused = false;
  let visible = false;
  let touchStartX = null;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const featuredProjects = projects.slice(0, 4);
  const slideElements = [];
  const dotElements = [];

  featuredProjects.forEach((project, index) => {
    const slide = document.createElement('article');
    slide.className = `featured-slide${index === 0 ? ' is-active' : ''}`;
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} de ${featuredProjects.length}: ${project.title}`);
    slide.setAttribute('aria-hidden', String(index !== 0));
    slide.inert = index !== 0;

    const visual = document.createElement('div');
    visual.className = 'featured-visual';
    const imagePath = project.images?.[0] || project.image;
    if (imagePath) {
      const image = document.createElement('img');
      image.src = imagePath;
      image.alt = `Captura de tela do projeto ${project.title}`;
      image.loading = index === 0 ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => {
        image.remove();
        visual.classList.add('has-fallback');
      }, { once: true });
      visual.append(image);
    } else {
      visual.classList.add('has-fallback');
    }
    const overlay = document.createElement('div');
    overlay.className = 'featured-visual-overlay';
    visual.append(overlay);

    const info = document.createElement('div');
    info.className = 'featured-info';
    const meta = document.createElement('div');
    meta.className = 'featured-meta';
    const projectType = document.createElement('span');
    projectType.textContent = project.type || 'Projeto';
    const projectYear = document.createElement('span');
    projectYear.textContent = project.year || '';
    meta.append(projectType, projectYear);
    const title = document.createElement('h2');
    title.textContent = project.title;
    const description = document.createElement('p');
    description.textContent = project.description;
    const action = document.createElement('a');
    action.className = 'featured-visit';
    action.href = project.url || project.github || '#projetos';
    action.textContent = 'Explorar projeto';
    if (project.url || project.github) {
      action.target = '_blank';
      action.rel = 'noreferrer';
    }
    action.insertAdjacentHTML('beforeend', ' <span aria-hidden="true">↗</span>');
    info.append(meta, title, description, action);
    slide.append(visual, info);
    featuredSlidesHost.append(slide);
    slideElements.push(slide);

    if (featuredDotsHost) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot${index === 0 ? ' is-active' : ''}`;
      dot.setAttribute('aria-label', `Mostrar projeto ${index + 1}: ${project.title}`);
      dot.setAttribute('aria-pressed', String(index === 0));
      dot.addEventListener('click', () => selectFeatured(index));
      featuredDotsHost.append(dot);
      dotElements.push(dot);
    }
  });

  function selectFeatured(index) {
    selectedSlide = (index + slideElements.length) % slideElements.length;
    slideElements.forEach((slide, slideIndex) => {
      const active = slideIndex === selectedSlide;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.inert = !active;
    });
    dotElements.forEach((dot, dotIndex) => {
      const active = dotIndex === selectedSlide;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-pressed', String(active));
    });
    if (featuredCount) {
      featuredCount.innerHTML = `${String(selectedSlide + 1).padStart(2, '0')} <b>/</b> ${String(slideElements.length).padStart(2, '0')}`;
    }
    updateRotation();
  }

  function mayRotate() {
    return slideElements.length > 1 && visible && !hovered && !focused && !document.hidden && !motionPreference.matches;
  }

  function updateRotation() {
    window.clearInterval(rotateTimer);
    featuredCarousel.classList.remove('is-rotating');
    if (!mayRotate()) return;
    void featuredCarousel.offsetWidth;
    featuredCarousel.classList.add('is-rotating');
    rotateTimer = window.setInterval(() => selectFeatured(selectedSlide + 1), 7000);
  }

  featuredCarousel.querySelector('[data-featured-prev]')?.addEventListener('click', () => selectFeatured(selectedSlide - 1));
  featuredCarousel.querySelector('[data-featured-next]')?.addEventListener('click', () => selectFeatured(selectedSlide + 1));
  featuredCarousel.addEventListener('mouseenter', () => { hovered = true; updateRotation(); });
  featuredCarousel.addEventListener('mouseleave', () => { hovered = false; updateRotation(); });
  featuredCarousel.addEventListener('focusin', () => { focused = true; updateRotation(); });
  featuredCarousel.addEventListener('focusout', (event) => {
    if (!featuredCarousel.contains(event.relatedTarget)) { focused = false; updateRotation(); }
  });
  featuredCarousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectFeatured(selectedSlide - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); selectFeatured(selectedSlide + 1); }
  });
  featuredCarousel.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  featuredCarousel.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    touchStartX = null;
    if (Math.abs(distance) > 48) selectFeatured(selectedSlide + (distance < 0 ? 1 : -1));
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    const carouselObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateRotation();
    }, { threshold: 0.2 });
    carouselObserver.observe(featuredCarousel);
  } else {
    visible = true;
  }
  motionPreference.addEventListener?.('change', updateRotation);
  document.addEventListener('visibilitychange', updateRotation);
  updateRotation();
}
