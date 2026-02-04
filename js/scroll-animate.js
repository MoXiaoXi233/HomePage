(() => {
  const selector = '[data-aos]';
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const prepare = (el) => {
    if (el.classList.contains('scroll-prepare')) return;
    el.classList.add('scroll-prepare');
  };

  const reveal = (el) => {
    el.classList.add('is-visible');
  };

  const observeElements = (root = document) => {
    const elements = Array.from(root.querySelectorAll(selector));
    if (!elements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((el) => {
        prepare(el);
        reveal(el);
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            reveal(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12,
      }
    );

    elements.forEach((el) => {
      prepare(el);
      observer.observe(el);
    });
  };

  const init = () => observeElements(document);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  document.addEventListener('pjax:complete', () => observeElements(document));
})();
