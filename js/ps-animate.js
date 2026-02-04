(() => {
  let hasAnimatedOnce = false;
  const ANIM = {
    enter: {
      list: {
        duration: 520,
        stagger: 65,
        y: 48,
        easing: 'cubic-bezier(0.16, 0.55, 0.35, 1)',
        maxItems: 20,
      },
      page: {
        card: {
          duration: 600,
          y: 0,
          scale: 1.2,
          easing: 'ease',
        },
        inner: {
          duration: 380,
          stagger: 40,
          y: 16,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          maxItems: 24,
        },
      },
    },
  };

  const prefersReducedMotion = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TaskScheduler = {
    async run(items, handler, batchSize = 8) {
      if (!items || !items.length) return;
      if (items.length <= batchSize) {
        for (let i = 0; i < items.length; i++) {
          try { handler(items[i], i); } catch {}
        }
        return;
      }
      for (let i = 0; i < items.length; i += batchSize) {
        const end = Math.min(i + batchSize, items.length);
        await new Promise(resolve => {
          requestAnimationFrame(() => {
            for (let j = i; j < end; j++) {
              try { handler(items[j], j); } catch {}
            }
            resolve();
          });
        });
      }
    }
  };

  const AnimController = {
    active: new Set(),
    register(anim, el) {
      if (!anim) return;
      this.active.add(anim);
      const cleanup = () => {
        this.active.delete(anim);
        if (el) {
          el.style.opacity = '';
          el.style.transform = '';
          el.style.willChange = '';
          el.removeAttribute('data-ps-animating');
        }
      };
      anim.onfinish = cleanup;
      anim.oncancel = cleanup;
    },
    stopAll() {
      this.active.forEach(anim => {
        try { anim.cancel(); } catch {}
      });
      this.active.clear();
    }
  };

  const uniqElements = (items) => {
    const seen = new Set();
    const out = [];
    items.forEach(el => {
      if (!el || seen.has(el)) return;
      seen.add(el);
      out.push(el);
    });
    return out;
  };

  const isAnimatable = (el) => {
    if (!el || !(el instanceof Element)) return false;
    if (el.closest('.modal-overlay')) return false;
    return true;
  };

  const collectPageTargets = () => {
    const card = document.querySelector('.Spec_Card .container');
    if (!card) return { card: null, inner: [] };

    const inner = [];
    const header = card.querySelector('.header');
    if (header) inner.push(header);

    const content = card.querySelector('.content');
    if (content) inner.push(...Array.from(content.children));

    const footer = card.querySelector('.footer');
    if (footer) inner.push(footer);

    const toggle = card.querySelector('.theme-toggle-container');
    if (toggle) inner.push(toggle);

    const hint = document.querySelector('.Spec_Card > .scroll-hint');
    if (hint) inner.push(hint);

    return {
      card,
      inner: uniqElements(inner).filter(isAnimatable)
    };
  };

  const collectListTargets = () => {
    const targets = [];
    document.querySelectorAll('.Common_Card > h2').forEach(el => targets.push(el));
    document.querySelectorAll('.about-item, .works-item, .info-card').forEach(el => targets.push(el));
    return uniqElements(targets).filter(isAnimatable);
  };

  const animateLightEnter = async (targets, baseDelay, options) => {
    if (!targets.length) return 0;
    const {
      duration = 380,
      stagger = 40,
      y = 16,
      scale = 1,
      easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    } = options || {};

    const hasScale = scale !== 1;
    const startTransform = hasScale
      ? `translate3d(0,${y}px,0) scale(${scale})`
      : `translate3d(0,${y}px,0)`;
    const keyframes = [
      { opacity: 0, transform: startTransform },
      { opacity: 1, transform: hasScale ? 'translate3d(0,0,0) scale(1)' : 'translate3d(0,0,0)' },
    ];

    await TaskScheduler.run(targets, (el, index) => {
      el.setAttribute('data-ps-animating', '');

      const anim = el.animate(keyframes, {
        duration,
        easing,
        delay: baseDelay + index * stagger,
        fill: 'both',
      });
      AnimController.register(anim, el);
    });

    return baseDelay + duration + Math.max(0, targets.length - 1) * stagger;
  };

  const applyInitialState = (targets, options) => {
    if (!targets.length) return;
    const { y = 16, scale = 1 } = options || {};
    const hasScale = scale !== 1;
    const startTransform = hasScale
      ? `translate3d(0,${y}px,0) scale(${scale})`
      : `translate3d(0,${y}px,0)`;

    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = startTransform;
      el.style.willChange = 'opacity, transform';
    });
  };

  const runEnterAnimation = async () => {
    if (prefersReducedMotion()) return;
    AnimController.stopAll();

    const html = document.documentElement;
    html.classList.add('ps-animating');

    const isInitialLoad = !hasAnimatedOnce;
    const pageTargets = collectPageTargets();
    const listTargets = collectListTargets().slice(0, ANIM.enter.list.maxItems);
    const innerTargets = isInitialLoad ? [] : pageTargets.inner;

    let maxTime = 0;

    if (pageTargets.card) {
      applyInitialState([pageTargets.card], ANIM.enter.page.card);
    }
    if (innerTargets.length) {
      applyInitialState(
        innerTargets.slice(0, ANIM.enter.page.inner.maxItems),
        ANIM.enter.page.inner
      );
    }
    if (listTargets.length) {
      applyInitialState(listTargets, ANIM.enter.list);
    }

    await new Promise(resolve => requestAnimationFrame(resolve));

    if (pageTargets.card) {
      const t = await animateLightEnter([pageTargets.card], 0, ANIM.enter.page.card);
      maxTime = Math.max(maxTime, t);
    }

    if (innerTargets.length) {
      const baseDelay = pageTargets.card ? ANIM.enter.page.card.duration + 60 : 0;
      const t = await animateLightEnter(
        innerTargets.slice(0, ANIM.enter.page.inner.maxItems),
        baseDelay,
        ANIM.enter.page.inner
      );
      maxTime = Math.max(maxTime, t);
    }

    if (listTargets.length) {
      const t = await animateLightEnter(listTargets, 0, ANIM.enter.list);
      maxTime = Math.max(maxTime, t);
    }

    window.setTimeout(() => {
      html.classList.remove('ps-animating');
    }, maxTime + 80);

    hasAnimatedOnce = true;
  };

  const init = () => runEnterAnimation();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  const rerun = () => {
    requestAnimationFrame(() => {
      runEnterAnimation();
    });
  };

  document.addEventListener('swup:contentReplaced', rerun);
  document.addEventListener('swup:page:view', rerun);
})();
