(() => {
  const sections = [...document.querySelectorAll('.tutorial-section')];
  const links = [...document.querySelectorAll('.chapter-list a')];
  const menu = document.querySelector('#menu');
  const menuButton = document.querySelector('.menu-button');
  const search = document.querySelector('#search');
  const noResults = document.querySelector('#no-results');
  const progressText = document.querySelector('#progress-text');
  const progressBar = document.querySelector('#progress-bar');
  const resetButton = document.querySelector('#reset-progress');
  const previousLink = document.querySelector('#previous-chapter');
  const nextLink = document.querySelector('#next-chapter');
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  const closeLightbox = document.querySelector('#close-lightbox');
  const storageKey = 'chant-orties-tutoriel-progress-v1';
  const completableSections = sections.filter((section) => section.id !== 'bienvenue');

  let completed = new Set();
  try { completed = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch (_) { completed = new Set(); }

  function updateProgress() {
    document.querySelectorAll('[data-complete]').forEach((button) => {
      const done = completed.has(button.dataset.complete);
      button.classList.toggle('is-complete', done);
      button.textContent = done ? '✓ Chapitre terminé' : 'Marquer ce chapitre comme terminé';
      button.setAttribute('aria-pressed', String(done));
    });
    links.forEach((link) => link.classList.toggle('completed', completed.has(link.hash.slice(1))));
    const count = completed.size;
    progressText.textContent = `${count} chapitre${count > 1 ? 's' : ''} terminé${count > 1 ? 's' : ''} sur ${completableSections.length}`;
    progressBar.style.width = `${Math.round(count / completableSections.length * 100)}%`;
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
  }

  function currentIndex() {
    const hash = location.hash || '#bienvenue';
    const index = sections.findIndex((section) => `#${section.id}` === hash);
    return index < 0 ? 0 : index;
  }

  function updateChapterNavigation() {
    const index = currentIndex();
    links.forEach((link) => link.classList.toggle('active', link.hash === `#${sections[index].id}`));
    const previous = sections[Math.max(0, index - 1)];
    const next = sections[Math.min(sections.length - 1, index + 1)];
    previousLink.href = `#${previous.id}`;
    previousLink.textContent = index === 0 ? '↑ Début du guide' : `← ${previous.dataset.title}`;
    nextLink.href = `#${next.id}`;
    nextLink.textContent = index === sections.length - 1 ? '✓ Fin du guide' : `${next.dataset.title} →`;
  }

  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  links.forEach((link) => link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  document.querySelectorAll('[data-complete]').forEach((button) => button.addEventListener('click', () => {
    const id = button.dataset.complete;
    completed.has(id) ? completed.delete(id) : completed.add(id);
    updateProgress();
  }));

  resetButton.addEventListener('click', () => {
    completed.clear();
    updateProgress();
  });

  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase('fr');
    let visible = 0;
    sections.forEach((section) => {
      const haystack = `${section.dataset.title || ''} ${section.dataset.keywords || ''} ${section.textContent}`.toLocaleLowerCase('fr');
      const match = !query || haystack.includes(query);
      section.hidden = !match;
      if (match) visible += 1;
    });
    noResults.hidden = visible !== 0;
    links.forEach((link) => {
      const target = document.querySelector(link.hash);
      link.parentElement.hidden = Boolean(target?.hidden);
    });
  });

  document.querySelectorAll('.image-button').forEach((button) => button.addEventListener('click', () => {
    lightboxImage.src = button.dataset.image;
    lightboxImage.alt = button.dataset.alt || '';
    lightboxCaption.textContent = button.dataset.alt || 'Capture agrandie';
    lightbox.showModal();
    closeLightbox.focus();
  }));

  closeLightbox.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', () => { lightboxImage.src = 'assets/images/01-connexion.webp'; });
  window.addEventListener('hashchange', updateChapterNavigation);

  updateProgress();
  updateChapterNavigation();
})();
