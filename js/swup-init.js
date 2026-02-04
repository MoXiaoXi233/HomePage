(() => {
  if (typeof Swup !== 'function') return;

  const plugins = [];

  if (typeof SwupScrollPlugin === 'function') {
    plugins.push(
      new SwupScrollPlugin({
        doScrollingRightAway: false,
        animateScroll: { betweenPages: true, samePageWithHash: true, samePage: true },
        markScrollTarget: true,
      })
    );
  }

  if (typeof SwupPreloadPlugin === 'function') {
    plugins.push(
      new SwupPreloadPlugin({
        throttle: 5,
        preloadHoveredLinks: true,
        preloadVisibleLinks: {
          threshold: 0.2,
          delay: 500,
          containers: ['#swup'],
          ignore: (el) => el.getAttribute('href')?.startsWith('#'),
        },
        preloadInitialPage: true,
      })
    );
  }

  if (typeof SwupHeadPlugin === 'function') {
    plugins.push(
      new SwupHeadPlugin({
        persistAssets: true,
        awaitAssets: false,
        attributes: [],
      })
    );
  }

  const swup = new Swup({
    containers: ['#swup'],
    plugins,
    cache: true,
    preload: true,
    resolveUrl: (url) => {
      const resolved = new URL(url, window.location.origin);
      return resolved.pathname + resolved.search + resolved.hash;
    },
    linkSelector:
      "a[href]:not([data-no-swup]):not([target='_blank']):not(a[href^='#'])",
    animateHistoryBrowsing: true,
    native: true,
    animationSelector: false,
  });

  window.swupInstance = swup;

  const syncThemeIcon = () => {
    if (typeof updateIcon !== 'function') return;
    const savedTheme = localStorage.getItem('theme') || 'auto';
    updateIcon(savedTheme);
  };

  document.addEventListener('swup:contentReplaced', syncThemeIcon);
  document.addEventListener('swup:page:view', syncThemeIcon);
})();
