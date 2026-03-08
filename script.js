(function () {
  const THEME_STORAGE_KEY = 'resume-theme';
  const DEFAULT_THEME = 'minimalism';

  const themeNames = {
    'skeuomorphism': 'Skeuomorphism',
    'flat': 'Flat Design',
    'material': 'Material Design',
    'material-you': 'Material You',
    'neumorphism': 'Neumorphism',
    'glassmorphism': 'Glassmorphism',
    'claymorphism': 'Claymorphism',
    'brutalism': 'Neo-Brutalism',
    'minimalism': 'Minimalism',
    'hyperrealism': '3D / Hyper-realism',
    'cyberpunk': 'Cyberpunk',
    'memphism': 'Memphism',
    'terminal': 'Terminal',
    'aurora': 'Aurora',
    'vaporwave': 'Vaporwave',
    'newspaper': 'Newspaper',
    'liquid-metal': 'Liquid Metal',
    'custom': 'Моя тема'
  };

  const toggle = document.querySelector('.theme-picker__toggle');
  const dropdown = document.getElementById('theme-dropdown');
  const list = document.getElementById('theme-list');
  const buttons = document.querySelectorAll('.theme-list__btn');
  const preview = document.getElementById('theme-preview');
  const currentNameEl = document.getElementById('theme-current-name');

  const validThemes = new Set(Array.from(buttons).map(function (b) { return b.getAttribute('data-theme'); }).filter(Boolean));

  function getStoredTheme() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && validThemes.has(stored)) return stored;
    } catch (_) {}
    return null;
  }

  function setTheme(theme) {
    if (!theme) theme = DEFAULT_THEME;
    document.body.classList.add('theme-switching');
    requestAnimationFrame(function () {
      document.body.setAttribute('data-theme', theme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (_) {}
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-theme') === theme ? 'true' : 'false');
      });
      if (currentNameEl) currentNameEl.textContent = themeNames[theme] ? ' · ' + themeNames[theme] : '';
      if (preview && !preview.getAttribute('data-hovering')) preview.setAttribute('data-theme', theme);
      if (typeof initCyberpunkEffects === 'function') initCyberpunkEffects(theme);
      if (theme === 'glassmorphism') {
        if (typeof initLiquidGlassCursor === 'function') initLiquidGlassCursor();
      } else {
        if (typeof removeLiquidGlassCursor === 'function') removeLiquidGlassCursor();
      }
      if (theme === 'custom') {
        if (typeof initCustomTheme === 'function') initCustomTheme();
        if (typeof showCustomBuilderTrigger === 'function') showCustomBuilderTrigger(true);
      } else {
        if (typeof showCustomBuilderTrigger === 'function') showCustomBuilderTrigger(false);
        if (typeof removeCustomCursor === 'function') removeCustomCursor();
      }
      if (theme === 'custom' && typeof getCustomDisplayName === 'function') {
        var name = getCustomDisplayName();
        if (currentNameEl) currentNameEl.textContent = name ? ' · ' + name : ' · Моя тема';
      }
      setTimeout(function () {
        document.body.classList.remove('theme-switching');
      }, 50);
    });
  }

  var panel = dropdown ? dropdown.querySelector('.theme-dropdown__panel') : null;
  function openPicker() {
    if (dropdown) dropdown.hidden = false;
    if (panel) panel.classList.add('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    if (preview) preview.setAttribute('data-theme', document.body.getAttribute('data-theme') || DEFAULT_THEME);
  }

  function closePicker() {
    if (dropdown) dropdown.hidden = true;
    if (panel) panel.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (preview) { preview.removeAttribute('data-hovering'); preview.setAttribute('data-theme', document.body.getAttribute('data-theme') || DEFAULT_THEME); }
    if (toggle && toggle.parentElement) toggle.parentElement.style.setProperty('--theme-picker-hover-accent', '');
  }

  if (toggle && dropdown && buttons.length) {
    toggle.addEventListener('click', function () {
      var isOpen = !dropdown.hidden;
      if (isOpen) closePicker();
      else openPicker();
    });

    buttons.forEach(function (btn) {
      var theme = btn.getAttribute('data-theme');
      var accent = btn.getAttribute('data-accent');

      btn.addEventListener('click', function () {
        if (theme) {
          setTheme(theme);
          closePicker();
        }
      });

      btn.addEventListener('mouseenter', function () {
        if (preview && theme) {
          preview.setAttribute('data-theme', theme);
          preview.setAttribute('data-hovering', 'true');
        }
        if (toggle && toggle.parentElement && accent) {
          toggle.parentElement.style.setProperty('--theme-picker-hover-accent', accent);
        }
      });

      btn.addEventListener('mouseleave', function () {
        if (preview) {
          preview.removeAttribute('data-hovering');
          preview.setAttribute('data-theme', document.body.getAttribute('data-theme') || DEFAULT_THEME);
        }
        if (toggle && toggle.parentElement) {
          toggle.parentElement.style.setProperty('--theme-picker-hover-accent', '');
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (dropdown.hidden) return;
      if (!dropdown.contains(e.target) && !toggle.contains(e.target)) closePicker();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePicker();
    });

    var initial = getStoredTheme() || DEFAULT_THEME;
    setTheme(initial);
  }

  var CUSTOM_THEME_STORAGE_KEY = 'resume-custom-theme';
  var customState = {
    bg: '1', card: '1', text: '1', accent: '1', cursor: '1', anim: '1', cardStyle: '1', divider: '1', font: '1',
    borderWidth: '1', radius: '1', linkStyle: '1', headingStyle: '1', photoFrame: '1', focusRing: '1', transitionSpeed: '1',
    cardHover: '1', sectionTitleStyle: '1', listMarker: '1', shadowStrength: '1', bgPattern: '1', spacing: '1',
    emphasis: '1', buttonStyle: '1', inputStyle: '1', badgeStyle: '1'
  };
  var customStateKeys = Object.keys(customState);
  var customValueMap = {
    bg: { 1: '#fafafa', 2: '#1a1a2e', 3: '#0a0a0a', 4: '#e8e0d5', 5: '#0d0d2b' },
    card: { 1: '#fff', 2: '#16213e', 3: '#111', 4: '#f4f0e8', 5: 'linear-gradient(145deg, #2a2a4e, #1a1a3e)' },
    text: { 1: '#111', 2: '#e8e8e8', 3: '#00ff41', 4: '#2c2419', 5: '#ff71ce' },
    accent: { 1: '#1976d2', 2: '#00d4aa', 3: '#ff6b35', 4: '#ff71ce', 5: '#8b6914' }
  };
  var customTextMutedMap = {
    1: '#666', 2: 'rgba(232,232,232,0.8)', 3: '#00aa2a', 4: '#5c4033', 5: 'rgba(255,113,206,0.8)'
  };
  var customBorderMap = {
    1: '#e5e5e5', 2: 'rgba(255,255,255,0.1)', 3: '#222', 4: '#c4b8a8', 5: 'rgba(255,255,255,0.08)'
  };

  function getCustomDisplayName() {
    try {
      var raw = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
      if (!raw) return '';
      var data = JSON.parse(raw);
      return (data.name && String(data.name).trim()) ? 'Тема від ' + String(data.name).trim() : '';
    } catch (_) { return ''; }
  }

  function applyCustomOptions(state) {
    var root = document.documentElement;
    var bg = customValueMap.bg[state.bg] || customValueMap.bg[1];
    var card = customValueMap.card[state.card] || customValueMap.card[1];
    var text = customValueMap.text[state.text] || customValueMap.text[1];
    var accent = customValueMap.accent[state.accent] || customValueMap.accent[1];
    root.style.setProperty('--custom-bg', bg);
    root.style.setProperty('--custom-card', card);
    root.style.setProperty('--custom-text', text);
    root.style.setProperty('--custom-text-muted', customTextMutedMap[state.text] || customTextMutedMap[1]);
    root.style.setProperty('--custom-accent', accent);
    root.style.setProperty('--custom-border', customBorderMap[state.bg] || customBorderMap[1]);
    root.style.setProperty('--custom-shadow', state.cardStyle === '2' ? '0 8px 24px rgba(0,0,0,0.12)' : (state.cardStyle === '1' ? 'none' : '0 2px 8px rgba(0,0,0,0.06)'));
    root.style.setProperty('--custom-radius', state.cardStyle === '1' ? '0' : '12px');
    var body = document.body;
    ['custom-divider-line', 'custom-divider-gradient', 'custom-divider-dots', 'custom-divider-wave'].forEach(function(c) { body.classList.remove(c); });
    if (state.divider === '2') body.classList.add('custom-divider-line');
    if (state.divider === '3') body.classList.add('custom-divider-gradient');
    if (state.divider === '4') body.classList.add('custom-divider-dots');
    if (state.divider === '5') body.classList.add('custom-divider-wave');
    ['custom-card-shadow', 'custom-card-border', 'custom-card-glass', 'custom-card-gradient'].forEach(function(c) { body.classList.remove(c); });
    if (state.cardStyle === '2') body.classList.add('custom-card-shadow');
    if (state.cardStyle === '3') body.classList.add('custom-card-border');
    if (state.cardStyle === '4') body.classList.add('custom-card-glass');
    if (state.cardStyle === '5') body.classList.add('custom-card-gradient');
    ['custom-anim-off'].forEach(function(c) { body.classList.remove(c); });
    if (state.anim === '1') body.classList.add('custom-anim-off');
    ['custom-cursor-glow', 'custom-cursor-trail', 'custom-cursor-ring', 'custom-cursor-spotlight'].forEach(function(c) { body.classList.remove(c); });
    if (state.cursor === '2') body.classList.add('custom-cursor-glow');
    if (state.cursor === '3') body.classList.add('custom-cursor-trail');
    if (state.cursor === '4') body.classList.add('custom-cursor-ring');
    if (state.cursor === '5') body.classList.add('custom-cursor-spotlight');
    var fontStack = { 1: 'Inter, system-ui, sans-serif', 2: 'Literata, Georgia, serif', 3: 'JetBrains Mono, monospace', 4: 'DM Sans, system-ui, sans-serif', 5: 'Syne, system-ui, sans-serif' };
    root.style.setProperty('--font-body', fontStack[state.font] || fontStack[1]);
    root.style.setProperty('--font-heading', fontStack[state.font] || fontStack[1]);
    var borderW = { 1: '0', 2: '1px', 3: '2px', 4: '3px', 5: '4px' }[state.borderWidth] || '0';
    var radiusV = { 1: '0', 2: '4px', 3: '8px', 4: '12px', 5: '24px' }[state.radius] || '0';
    root.style.setProperty('--custom-border-width', borderW);
    root.style.setProperty('--custom-radius-extra', radiusV);
    ['custom-border-1', 'custom-border-2', 'custom-border-3', 'custom-border-4', 'custom-border-5',
     'custom-radius-1', 'custom-radius-2', 'custom-radius-3', 'custom-radius-4', 'custom-radius-5',
     'custom-link-1', 'custom-link-2', 'custom-link-3', 'custom-link-4', 'custom-link-5',
     'custom-heading-1', 'custom-heading-2', 'custom-heading-3', 'custom-heading-4', 'custom-heading-5',
     'custom-photo-1', 'custom-photo-2', 'custom-photo-3', 'custom-photo-4', 'custom-photo-5',
     'custom-focus-1', 'custom-focus-2', 'custom-focus-3', 'custom-focus-4', 'custom-focus-5',
     'custom-transition-1', 'custom-transition-2', 'custom-transition-3', 'custom-transition-4', 'custom-transition-5',
     'custom-cardhover-1', 'custom-cardhover-2', 'custom-cardhover-3', 'custom-cardhover-4', 'custom-cardhover-5',
     'custom-section-1', 'custom-section-2', 'custom-section-3', 'custom-section-4', 'custom-section-5',
     'custom-list-1', 'custom-list-2', 'custom-list-3', 'custom-list-4', 'custom-list-5',
     'custom-shadow-1', 'custom-shadow-2', 'custom-shadow-3', 'custom-shadow-4', 'custom-shadow-5',
     'custom-bgpattern-1', 'custom-bgpattern-2', 'custom-bgpattern-3', 'custom-bgpattern-4', 'custom-bgpattern-5',
     'custom-spacing-1', 'custom-spacing-2', 'custom-spacing-3', 'custom-spacing-4', 'custom-spacing-5',
     'custom-emphasis-1', 'custom-emphasis-2', 'custom-emphasis-3', 'custom-emphasis-4', 'custom-emphasis-5',
     'custom-button-1', 'custom-button-2', 'custom-button-3', 'custom-button-4', 'custom-button-5',
     'custom-input-1', 'custom-input-2', 'custom-input-3', 'custom-input-4', 'custom-input-5',
     'custom-badge-1', 'custom-badge-2', 'custom-badge-3', 'custom-badge-4', 'custom-badge-5'].forEach(function(c) { body.classList.remove(c); });
    if (state.borderWidth) body.classList.add('custom-border-' + state.borderWidth);
    if (state.radius) body.classList.add('custom-radius-' + state.radius);
    if (state.linkStyle) body.classList.add('custom-link-' + state.linkStyle);
    if (state.headingStyle) body.classList.add('custom-heading-' + state.headingStyle);
    if (state.photoFrame) body.classList.add('custom-photo-' + state.photoFrame);
    if (state.focusRing) body.classList.add('custom-focus-' + state.focusRing);
    if (state.transitionSpeed) body.classList.add('custom-transition-' + state.transitionSpeed);
    if (state.cardHover) body.classList.add('custom-cardhover-' + state.cardHover);
    if (state.sectionTitleStyle) body.classList.add('custom-section-' + state.sectionTitleStyle);
    if (state.listMarker) body.classList.add('custom-list-' + state.listMarker);
    if (state.shadowStrength) body.classList.add('custom-shadow-' + state.shadowStrength);
    if (state.bgPattern) body.classList.add('custom-bgpattern-' + state.bgPattern);
    if (state.spacing) body.classList.add('custom-spacing-' + state.spacing);
    if (state.emphasis) body.classList.add('custom-emphasis-' + state.emphasis);
    if (state.buttonStyle) body.classList.add('custom-button-' + state.buttonStyle);
    if (state.inputStyle) body.classList.add('custom-input-' + state.inputStyle);
    if (state.badgeStyle) body.classList.add('custom-badge-' + state.badgeStyle);
    if (state.cursor !== '1' && document.body.getAttribute('data-theme') === 'custom') initCustomCursor(state.cursor);
    else removeCustomCursor();
  }

  function initCustomTheme() {
    try {
      var raw = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        if (data.options) {
          customStateKeys.forEach(function(k) { customState[k] = '1'; });
          Object.keys(data.options).forEach(function(k) { if (customState.hasOwnProperty(k)) customState[k] = String(data.options[k]); });
        }
      }
    } catch (_) {}
    applyCustomOptions(customState);
    syncCustomBuilderUI();
  }

  function syncCustomBuilderUI() {
    var builder = document.getElementById('custom-builder');
    if (!builder) return;
    builder.querySelectorAll('[data-opt]').forEach(function(row) {
      var opt = row.getAttribute('data-opt');
      var val = customState[opt];
      row.querySelectorAll('.custom-builder__swatch, .custom-builder__opt-btn').forEach(function(btn) {
        var v = btn.getAttribute('data-value');
        btn.classList.toggle('is-active', v === val);
      });
    });
  }

  function showCustomBuilderTrigger(show) {
    var trigger = document.getElementById('custom-builder-trigger');
    if (trigger) trigger.hidden = !show;
  }

  var customCursorRAF = null;
  var customCursorEl = null;
  var customTrailDots = [];
  function initCustomCursor(mode) {
    removeCustomCursor();
    if (mode === '2') customCursorEl = document.getElementById('custom-cursor-glow');
    if (mode === '3') {
      customCursorEl = document.getElementById('custom-cursor-trail');
      for (var i = 0; i < 8; i++) {
        var d = document.createElement('div');
        d.style.cssText = 'position:fixed;width:8px;height:8px;border-radius:50%;background:var(--accent);pointer-events:none;z-index:9999;transition:opacity 0.15s;';
        document.body.appendChild(d);
        customTrailDots.push({ el: d, x: 0, y: 0 });
      }
    }
    if (mode === '4') customCursorEl = document.getElementById('custom-cursor-ring');
    if (mode === '5') customCursorEl = document.getElementById('custom-cursor-spotlight');
    var x = 0, y = 0;
    function update(e) {
      x = e.clientX;
      y = e.clientY;
    }
    function tick() {
      if (document.body.getAttribute('data-theme') !== 'custom') return;
      if (mode === '3' && customTrailDots.length) {
        for (var i = customTrailDots.length - 1; i > 0; i--) {
          customTrailDots[i].x = customTrailDots[i - 1].x;
          customTrailDots[i].y = customTrailDots[i - 1].y;
          customTrailDots[i].el.style.left = customTrailDots[i].x + 'px';
          customTrailDots[i].el.style.top = customTrailDots[i].y + 'px';
          customTrailDots[i].el.style.marginLeft = '-4px';
          customTrailDots[i].el.style.marginTop = '-4px';
          customTrailDots[i].el.style.opacity = (i / customTrailDots.length).toFixed(2);
        }
        customTrailDots[0].x = x;
        customTrailDots[0].y = y;
        customTrailDots[0].el.style.left = x + 'px';
        customTrailDots[0].el.style.top = y + 'px';
        customTrailDots[0].el.style.marginLeft = '-4px';
        customTrailDots[0].el.style.marginTop = '-4px';
        customTrailDots[0].el.style.opacity = '1';
      } else if (customCursorEl) {
        customCursorEl.style.left = x + 'px';
        customCursorEl.style.top = y + 'px';
      }
      customCursorRAF = requestAnimationFrame(tick);
    }
    document.addEventListener('mousemove', update, { passive: true });
    customCursorRAF = requestAnimationFrame(tick);
  }

  function removeCustomCursor() {
    if (customCursorRAF) { cancelAnimationFrame(customCursorRAF); customCursorRAF = null; }
    customCursorEl = null;
    customTrailDots.forEach(function(d) { if (d.el && d.el.parentNode) d.el.parentNode.removeChild(d.el); });
    customTrailDots = [];
    ['custom-cursor-glow', 'custom-cursor-trail', 'custom-cursor-ring', 'custom-cursor-spotlight'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) { el.style.left = ''; el.style.top = ''; }
    });
  }

  (function setupCustomBuilder() {
    var builder = document.getElementById('custom-builder');
    var trigger = document.getElementById('custom-builder-trigger');
    var closeBtn = document.getElementById('custom-builder-close');
    var saveBtn = document.getElementById('custom-theme-save');
    var resetBtn = document.getElementById('custom-theme-reset');
    var nameInput = document.getElementById('custom-theme-name');

    function openBuilder() { if (builder) builder.hidden = false; }
    function closeBuilder() { if (builder) builder.hidden = true; }

    if (trigger) trigger.addEventListener('click', openBuilder);
    if (closeBtn) closeBtn.addEventListener('click', closeBuilder);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && builder && !builder.hidden) { closeBuilder(); e.stopPropagation(); }
    });

    if (builder) {
      builder.querySelectorAll('.custom-builder__row[data-opt]').forEach(function(row) {
        var opt = row.getAttribute('data-opt');
        row.querySelectorAll('.custom-builder__swatch, .custom-builder__opt-btn').forEach(function(btn) {
          btn.addEventListener('click', function() {
            var val = btn.getAttribute('data-value');
            if (customState.hasOwnProperty(opt)) { customState[opt] = val; applyCustomOptions(customState); syncCustomBuilderUI(); }
          });
        });
      });
    }

    if (saveBtn) saveBtn.addEventListener('click', function() {
      var name = nameInput ? nameInput.value.trim() : '';
      try {
        localStorage.setItem(CUSTOM_THEME_STORAGE_KEY, JSON.stringify({ name: name || 'Користувач', options: customState }));
        var currentNameEl = document.getElementById('theme-current-name');
        if (currentNameEl) currentNameEl.textContent = name ? ' · Тема від ' + name : ' · Моя тема';
        var toast = document.getElementById('easter-toast');
        if (toast) { toast.textContent = 'Збережено!'; toast.classList.add('is-visible'); toast.removeAttribute('aria-hidden'); setTimeout(function() { toast.classList.remove('is-visible'); toast.setAttribute('aria-hidden', 'true'); }, 2000); }
      } catch (_) {}
    });

    if (resetBtn) resetBtn.addEventListener('click', function() {
      customStateKeys.forEach(function(k) { customState[k] = '1'; });
      try { localStorage.removeItem(CUSTOM_THEME_STORAGE_KEY); } catch (_) {}
      if (nameInput) nameInput.value = '';
      applyCustomOptions(customState);
      syncCustomBuilderUI();
      var currentNameEl = document.getElementById('theme-current-name');
      if (currentNameEl && document.body.getAttribute('data-theme') === 'custom') currentNameEl.textContent = ' · Моя тема';
    });

    try {
      var raw = localStorage.getItem(CUSTOM_THEME_STORAGE_KEY);
      if (raw) { var d = JSON.parse(raw); if (d.name && nameInput) nameInput.value = d.name; }
    } catch (_) {}
  })();

  var liquidGlassMouseListener = null;
  function initLiquidGlassCursor() {
    var glow = document.getElementById('liquid-glass-glow');
    if (!glow) return;
    document.body.classList.add('has-glass-cursor');
    function update(e) {
      var x = (e.clientX / window.innerWidth) * 100;
      var y = (e.clientY / window.innerHeight) * 100;
      glow.style.setProperty('--mouse-x', x + '%');
      glow.style.setProperty('--mouse-y', y + '%');
    }
    liquidGlassMouseListener = update;
    document.addEventListener('mousemove', update, { passive: true });
  }
  function removeLiquidGlassCursor() {
    document.body.classList.remove('has-glass-cursor');
    if (liquidGlassMouseListener) {
      document.removeEventListener('mousemove', liquidGlassMouseListener);
      liquidGlassMouseListener = null;
    }
    var glow = document.getElementById('liquid-glass-glow');
    if (glow) {
      glow.style.removeProperty('--mouse-x');
      glow.style.removeProperty('--mouse-y');
    }
  }

  function throttleRAF(fn) {
    var scheduled = false;
    return function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        fn();
      });
    };
  }

  /* ---------- Scroll progress (по скролу сторінки) ---------- */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const percent = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
      progressBar.style.width = percent + '%';
    }
    var onScroll = throttleRAF(updateProgress);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  /* ---------- Кнопка «Вгору» ---------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    var updateBackToTop = throttleRAF(function () {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    });
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
  }

  /* ---------- Клік по фото — сюрприз ---------- */
  const profilePhoto = document.getElementById('profile-photo');
  var toastEl = null;
  var toastTimeout = null;
  var photoMessages = [
    'Привіт! 👋',
    'Ти знайшов секрет! 🎉',
    'Клік-клік! ✨',
    'Дякую за клік! 💻',
    'Хорошего дня! ☀️',
    'Код пишеться сам собою 🚀',
    'Тут могла бути реклама 😄',
    'Еaster egg знайдено 🥚'
  ];
  function showPhotoToast() {
    if (toastTimeout) clearTimeout(toastTimeout);
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'photo-toast';
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = photoMessages[Math.floor(Math.random() * photoMessages.length)];
    toastEl.classList.remove('is-visible');
    toastEl.offsetHeight;
    toastEl.classList.add('is-visible');
    toastTimeout = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2000);
  }
  if (profilePhoto) {
    profilePhoto.addEventListener('click', function () {
      this.classList.remove('photo-bounce');
      this.offsetHeight;
      this.classList.add('photo-bounce');
      setTimeout(function () { profilePhoto.classList.remove('photo-bounce'); }, 600);
      showPhotoToast();
    });
    profilePhoto.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  /* ---------- Scroll reveal (ефекти при скролі) ---------- */
  const revealEls = document.querySelectorAll('.reveal-item');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.06
      }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- Кастомний курсор: слід + сіяніє (тільки при hover-пристрої) ---------- */
  var cursorEl = document.getElementById('cursor-effect');
  var trailContainer = document.getElementById('cursor-trail');
  var trailLen = 6;
  var trailDots = [];
  var mouseX = -100;
  var mouseY = -100;
  var trailX = [];
  var trailY = [];
  var rafId = null;

  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorEl) cursorEl.style.opacity = '1';
    if (!rafId) rafId = requestAnimationFrame(updateCursor);
  }

  function updateCursor() {
    rafId = null;
    if (!cursorEl) return;
    cursorEl.style.left = mouseX + 'px';
    cursorEl.style.top = mouseY + 'px';
    for (var i = 0; i < trailLen; i++) {
      var prevX = i === 0 ? mouseX : trailX[i - 1];
      var prevY = i === 0 ? mouseY : trailY[i - 1];
      trailX[i] += (prevX - trailX[i]) * 0.25;
      trailY[i] += (prevY - trailY[i]) * 0.25;
      trailDots[i].style.left = trailX[i] + 'px';
      trailDots[i].style.top = trailY[i] + 'px';
      trailDots[i].style.opacity = '1';
    }
    if (cursorEl.style.opacity !== '0') rafId = requestAnimationFrame(updateCursor);
  }

  function startCursorLoop() {
    if (!rafId) rafId = requestAnimationFrame(updateCursor);
  }

  function initCursor() {
    if (!cursorEl || !trailContainer) return;
    if (!window.matchMedia('(hover: hover)').matches) return;
    document.body.classList.add('has-cursor-effect');
    for (var i = 0; i < trailLen; i++) {
      var dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      trailContainer.appendChild(dot);
      trailDots.push(dot);
      trailX.push(-100);
      trailY.push(-100);
    }
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseenter', function () {
      cursorEl.style.opacity = '1';
      startCursorLoop();
    });
    document.documentElement.addEventListener('mouseleave', function () {
      cursorEl.style.opacity = '0';
      trailDots.forEach(function (d) { d.style.opacity = '0'; });
    });
    window.addEventListener('blur', function () {
      cursorEl.style.opacity = '0';
      trailDots.forEach(function (d) { d.style.opacity = '0'; });
    });
    var hoverables = document.querySelectorAll('a, button, [role="button"], .resume__photo-wrap');
    hoverables.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorEl.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { cursorEl.classList.remove('cursor-hover'); });
    });
  }

  initCursor();

  /* ---------- Кіберпанк: матриця + гліч на заголовках ---------- */
  var matrixChars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF';
  var matrixColumns = [];
  var glitchInterval = null;

  function initCyberpunkEffects(theme) {
    var decor = document.getElementById('cyberpunk-decor');
    if (!decor) return;
    while (decor.firstChild) decor.removeChild(decor.firstChild);
    matrixColumns = [];
    if (glitchInterval) {
      clearInterval(glitchInterval);
      glitchInterval = null;
    }
    var titles = document.querySelectorAll('.resume__section-title');
    var photoWrap = document.getElementById('profile-photo');
    titles.forEach(function (t) { t.classList.remove('glitch-active'); });
    if (photoWrap) photoWrap.classList.remove('glitch-active');
    if (theme !== 'cyberpunk') return;
    var maxCols = window.innerWidth < 480 ? 8 : window.innerWidth < 720 ? 12 : 18;
    var colCount = Math.min(maxCols, Math.floor(window.innerWidth / 28));
    for (var i = 0; i < colCount; i++) {
      var col = document.createElement('div');
      col.className = 'matrix-column';
      col.style.left = (i * (100 / colCount)) + '%';
      col.style.animationDuration = (4 + Math.random() * 6) + 's';
      col.style.animationDelay = Math.random() * 5 + 's';
      var len = 12 + Math.floor(Math.random() * 10);
      var str = '';
      for (var j = 0; j < len; j++) {
        str += matrixChars[Math.floor(Math.random() * matrixChars.length)] + '\n';
      }
      col.textContent = str;
      decor.appendChild(col);
      matrixColumns.push(col);
    }
    var glitchTargets = Array.from(titles);
    if (photoWrap) glitchTargets.push(photoWrap);
    glitchInterval = setInterval(function () {
      if (document.body.getAttribute('data-theme') !== 'cyberpunk') return;
      glitchTargets.forEach(function (el) { el.classList.remove('glitch-active'); });
      var r = glitchTargets[Math.floor(Math.random() * glitchTargets.length)];
      if (r) {
        r.classList.add('glitch-active');
        setTimeout(function () { r.classList.remove('glitch-active'); }, 350);
      }
    }, 2500);
  }

  initCyberpunkEffects(document.body.getAttribute('data-theme') || DEFAULT_THEME);
  var resizeCyberpunk = (function () {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(function () {
        if (document.body.getAttribute('data-theme') === 'cyberpunk') {
          initCyberpunkEffects('cyberpunk');
        }
      }, 150);
    };
  })();
  window.addEventListener('resize', resizeCyberpunk);

  var miniGameOverlay = document.getElementById('mini-game-overlay');
  var miniGameArea = document.getElementById('mini-game-area');
  var miniGameScore = document.getElementById('mini-game-score');
  var miniGameTitle = document.getElementById('mini-game-title');
  var miniGameBtn = document.getElementById('mini-game-btn');
  var miniGameClose = document.getElementById('mini-game-close');

  function getTheme() {
    return document.body.getAttribute('data-theme') || DEFAULT_THEME;
  }

  function openMiniGame() {
    if (!miniGameOverlay || !miniGameArea) return;
    miniGameOverlay.removeAttribute('hidden');
    miniGameTitle.textContent = 'Міні-гра';
    miniGameScore.textContent = '';
    miniGameArea.innerHTML = '';
    runThemeGame(getTheme());
  }

  function closeMiniGame() {
    if (miniGameOverlay) miniGameOverlay.setAttribute('hidden', '');
  }

  function runThemeGame(theme) {
    var games = {
      'skeuomorphism': gameSkeuo,
      'flat': gameFlat,
      'material': gameMaterial,
      'material-you': gameMaterialYou,
      'neumorphism': gameNeumorphism,
      'glassmorphism': gameGlassmorphism,
      'claymorphism': gameClaymorphism,
      'brutalism': gameBrutalism,
      'minimalism': gameMinimalism,
      'hyperrealism': gameHyperrealism,
      'cyberpunk': gameCyberpunk,
      'memphism': gameMemphism,
      'terminal': gameTerminal,
      'aurora': gameAurora,
      'vaporwave': gameVaporwave,
      'newspaper': gameNewspaper,
      'liquid-metal': gameLiquidMetal,
      'custom': gameMinimalism
    };
    var fn = games[theme] || gameMinimalism;
    if (fn) fn();
  }

  function showGameResult(text, isWin) {
    var el = document.createElement('p');
    el.className = 'mini-game-result';
    el.textContent = text;
    if (isWin) el.style.color = 'var(--accent)';
    miniGameArea.appendChild(el);
  }

  function gameSkeuo() {
    miniGameTitle.textContent = 'Знайди пари';
    var ids = [0,0,1,1,2,2,3,3];
    for (var i = ids.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = ids[i]; ids[i] = ids[j]; ids[j] = t;
    }
    var opened = [];
    var pairs = 0;
    var moves = 0;
    var emoji = ['📜','🃏','📎','✉️'];
    function updateScore() {
      miniGameScore.textContent = 'Пари: ' + pairs + ' / 4  ·  Ходи: ' + moves;
    }
    ids.forEach(function(id, idx) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'mini-game-card';
      card.dataset.id = id;
      card.dataset.idx = idx;
      card.textContent = '?';
      card.style.animationDelay = (idx * 0.05) + 's';
      card.addEventListener('click', function() {
        if (this.classList.contains('flipped') || opened.length >= 2) return;
        moves++;
        this.classList.add('flipped');
        this.textContent = emoji[id];
        opened.push(this);
        if (opened.length === 2) {
          if (opened[0].dataset.id === opened[1].dataset.id) {
            pairs++;
            updateScore();
            opened = [];
            if (pairs === 4) {
              miniGameScore.textContent = 'Перемога за ' + moves + ' ходів!';
              showGameResult('Всі пари знайдені!', true);
            }
          } else {
            opened[0].classList.add('mismatch');
            opened[1].classList.add('mismatch');
            setTimeout(function() {
              opened[0].classList.remove('flipped', 'mismatch'); opened[0].textContent = '?';
              opened[1].classList.remove('flipped', 'mismatch'); opened[1].textContent = '?';
              opened = [];
            }, 600);
          }
        }
      });
      miniGameArea.appendChild(card);
    });
    updateScore();
  }

  function gameFlat() {
    miniGameTitle.textContent = 'Клікни червоний';
    var round = 0;
    var maxRound = 5;
    function next() {
      miniGameArea.innerHTML = '';
      miniGameScore.textContent = 'Раунд ' + (round + 1) + ' / ' + maxRound;
      var n = 9;
      var target = Math.floor(Math.random() * n);
      for (var i = 0; i < n; i++) {
        var el = document.createElement('div');
        el.className = 'mini-game-target';
        el.style.width = '60px';
        el.style.height = '60px';
        el.style.background = i === target ? 'var(--accent)' : 'var(--text-muted)';
        el.style.opacity = i === target ? '1' : '0.3';
        el.style.animation = 'miniGameCellIn 0.3s ease backwards';
        el.style.animationDelay = (i * 0.04) + 's';
        if (i === target) el.style.animation = 'miniGameCellIn 0.3s ease backwards, miniGamePulse 1s ease-in-out infinite 0.3s';
        el.dataset.target = i === target ? '1' : '0';
        el.addEventListener('click', function() {
          if (this.dataset.target === '1') {
            round++;
            if (round >= maxRound) {
              miniGameScore.textContent = 'Усі раунди пройдено!';
              showGameResult('Перемога!', true);
            } else setTimeout(next, 200);
          } else {
            this.style.animation = 'miniGameShake 0.4s ease';
            setTimeout(function() { this.style.animation = ''; }.bind(this), 400);
          }
        });
        miniGameArea.appendChild(el);
      }
    }
    next();
  }

  function gameMaterial() {
    miniGameTitle.textContent = 'Тапай за 5 сек';
    var count = 0;
    var done = false;
    miniGameScore.textContent = 'Чекай старт...';
    var zone = document.createElement('div');
    zone.className = 'mini-game-zone';
    zone.style.width = '200px';
    zone.style.height = '200px';
    zone.style.background = 'var(--bg)';
    zone.style.borderRadius = 'var(--radius)';
    zone.style.display = 'flex';
    zone.style.flexDirection = 'column';
    zone.style.alignItems = 'center';
    zone.style.justifyContent = 'center';
    zone.style.fontSize = '2rem';
    zone.style.gap = '0.5rem';
    zone.innerHTML = '<span class="countdown">3</span>';
    miniGameArea.appendChild(zone);
    var step = 1;
    var countdown = setInterval(function() {
      var span = zone.querySelector('.countdown');
      if (step === 1) { span.textContent = '2'; span.style.animation = 'miniGameCountdown 0.5s ease'; }
      else if (step === 2) { span.textContent = '1'; span.style.animation = 'miniGameCountdown 0.5s ease'; }
      else if (step === 3) {
        span.textContent = 'Тапай!';
        zone.style.cursor = 'pointer';
        zone.addEventListener('click', function tap() {
          if (done) return;
          count++;
          span.textContent = count;
          zone.classList.remove('tap-flash');
          zone.offsetHeight;
          zone.classList.add('tap-flash');
        });
        clearInterval(countdown);
      }
      step++;
    }, 800);
    setTimeout(function() {
      if (!done) {
        done = true;
        clearInterval(countdown);
        miniGameScore.textContent = 'Час вийшов! Результат: ' + count + ' тапів';
        zone.querySelector('.countdown').textContent = count + ' тапів';
        showGameResult(count >= 10 ? 'Непогано!' : 'Спробуй ще!', count >= 10);
      }
    }, 5800);
  }

  function gameMaterialYou() {
    miniGameTitle.textContent = 'Влови коло';
    var score = 0;
    var need = 10;
    miniGameScore.textContent = '0 / ' + need;
    var area = miniGameArea;
    area.style.position = 'relative';
    area.style.height = '220px';
    var progressBar = document.createElement('div');
    progressBar.style.cssText = 'height:6px;background:var(--bg);border-radius:3px;width:100%;max-width:200px;overflow:hidden;margin-bottom:0.5rem;';
    var progressFill = document.createElement('div');
    progressFill.style.cssText = 'height:100%;background:var(--accent);border-radius:3px;width:0%;transition:width 0.2s ease;';
    progressBar.appendChild(progressFill);
    area.appendChild(progressBar);
    var circle = document.createElement('div');
    circle.className = 'mini-game-target';
    circle.style.cssText = 'width:48px;height:48px;border-radius:50%;background:var(--accent);position:absolute;transition:left 0.25s ease, top 0.25s ease;animation:miniGamePulse 0.8s ease-in-out infinite;';
    function move() {
      circle.style.left = (Math.random() * (100 - 12)) + '%';
      circle.style.top = (Math.random() * (100 - 12)) + '%';
    }
    circle.addEventListener('click', function() {
      score++;
      progressFill.style.width = (score / need * 100) + '%';
      miniGameScore.textContent = score + ' / ' + need;
      if (score >= need) {
        miniGameScore.textContent = 'Всі влучення!';
        showGameResult('Перемога!', true);
        circle.style.display = 'none';
      } else move();
    });
    area.appendChild(circle);
    move();
  }

  function gameNeumorphism() {
    miniGameTitle.textContent = 'Утримуй 3 сек';
    miniGameScore.textContent = 'Не відпускай кнопку';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mini-game-hold-btn';
    btn.textContent = 'Утримуй';
    btn.style.transition = 'transform 0.1s, box-shadow 0.1s';
    var start = 0;
    var tmr = null;
    var progressWrap = document.createElement('div');
    progressWrap.className = 'mini-game-hold-progress';
    var progressFill = document.createElement('div');
    progressFill.className = 'mini-game-hold-fill';
    progressWrap.appendChild(progressFill);
    function startHold() {
      start = Date.now();
      btn.textContent = '...';
      btn.style.transform = 'scale(0.98)';
      tmr = setInterval(function() {
        var elapsed = (Date.now() - start) / 1000;
        progressFill.style.width = Math.min(100, (elapsed / 3) * 100) + '%';
        if (elapsed >= 3) {
          clearInterval(tmr);
          tmr = null;
          btn.textContent = 'Готово!';
          btn.style.transform = 'scale(1)';
          miniGameScore.textContent = 'Перемога!';
          showGameResult('Втримав!', true);
        } else btn.textContent = (3 - elapsed).toFixed(1);
      }, 50);
    }
    function cancel() {
      if (tmr) { clearInterval(tmr); tmr = null; }
      progressFill.style.width = '0%';
      btn.style.transform = 'scale(1)';
      if (Date.now() - start < 3000 && start > 0) btn.textContent = 'Утримуй';
    }
    btn.addEventListener('mousedown', function(e) { e.preventDefault(); startHold(); });
    btn.addEventListener('mouseup', cancel);
    btn.addEventListener('mouseleave', cancel);
    btn.addEventListener('touchstart', function(e) { e.preventDefault(); startHold(); }, { passive: false });
    btn.addEventListener('touchend', cancel);
    btn.addEventListener('touchcancel', cancel);
    miniGameArea.appendChild(btn);
    miniGameArea.appendChild(progressWrap);
  }

  function gameGlassmorphism() {
    miniGameTitle.textContent = 'Лопни бульбашки';
    var count = 10;
    miniGameArea.style.position = 'relative';
    miniGameArea.style.height = '220px';
    miniGameScore.textContent = 'Залишилось: ' + count;
    for (var i = 0; i < count; i++) {
      var b = document.createElement('div');
      b.className = 'mini-game-bubble';
      b.style.background = 'rgba(255,255,255,0.4)';
      b.style.border = '1px solid rgba(255,255,255,0.6)';
      b.style.left = (Math.random() * 80 + 10) + '%';
      b.style.top = (Math.random() * 60 + 10) + '%';
      b.style.position = 'absolute';
      b.style.animationDelay = (i * 0.15) + 's';
      b.addEventListener('click', function() {
        if (this.classList.contains('popped')) return;
        this.classList.add('popped');
        count--;
        miniGameScore.textContent = 'Залишилось: ' + count;
        if (count <= 0) {
          miniGameScore.textContent = 'Усі бульбашки лопнули!';
          showGameResult('Перемога!', true);
        }
      });
      miniGameArea.appendChild(b);
    }
  }

  function gameClaymorphism() {
    miniGameTitle.textContent = 'Влучи в blob';
    var score = 0;
    var need = 5;
    miniGameScore.textContent = '0 / ' + need;
    miniGameArea.style.position = 'relative';
    miniGameArea.style.height = '220px';
    var blob = document.createElement('div');
    blob.className = 'mini-game-target';
    blob.style.cssText = 'width:56px;height:56px;border-radius:30px;background:var(--accent);position:absolute;transition:left 0.2s ease, top 0.2s ease, transform 0.15s ease;box-shadow: 6px 6px 12px rgba(0,0,0,0.2);';
    function move() {
      blob.style.left = (Math.random() * (100 - 14)) + '%';
      blob.style.top = (Math.random() * (100 - 14)) + '%';
    }
    blob.addEventListener('click', function() {
      this.style.transform = 'scale(0.85)';
      setTimeout(function() { blob.style.transform = 'scale(1)'; }, 150);
      score++;
      miniGameScore.textContent = score + ' / ' + need;
      if (score >= need) {
        miniGameScore.textContent = 'Усі влучення!';
        showGameResult('Перемога!', true);
        blob.style.display = 'none';
      } else move();
    });
    miniGameArea.appendChild(blob);
    move();
    setInterval(move, 900);
  }

  function gameBrutalism() {
    miniGameTitle.textContent = 'Вдари по квадрату';
    var round = 0;
    var maxRound = 5;
    miniGameScore.textContent = 'Чекай появи...';
    var box = document.createElement('div');
    box.style.cssText = 'width:80px;height:80px;background:#0d0d0d;border:4px solid #0d0d0d;cursor:pointer;display:none;';
    box.addEventListener('click', function() {
      box.style.animation = 'miniGameBrutalHit 0.2s ease';
      setTimeout(function() {
        round++;
        box.style.animation = '';
        box.style.display = 'none';
        miniGameScore.textContent = round + ' / ' + maxRound;
        if (round >= maxRound) {
          miniGameScore.textContent = 'Усі влучення!';
          showGameResult('Перемога!', true);
        } else setTimeout(show, 600 + Math.random() * 1000);
      }, 200);
    });
    function show() {
      miniGameScore.textContent = 'Вдари!';
      box.style.display = 'block';
      box.style.animation = 'miniGameBrutalPop 0.25s ease';
    }
    miniGameArea.appendChild(box);
    setTimeout(show, 800 + Math.random() * 1200);
  }

  function gameMinimalism() {
    miniGameTitle.textContent = 'Клікни крапку';
    var score = 0;
    var need = 5;
    miniGameScore.textContent = '0 / ' + need;
    miniGameArea.style.position = 'relative';
    miniGameArea.style.height = '220px';
    function spawn() {
      var dot = document.createElement('div');
      dot.style.cssText = 'width:14px;height:14px;border-radius:50%;background:var(--text);position:absolute;cursor:pointer;animation:miniGameDotAppear 0.25s ease;';
      dot.style.left = (Math.random() * (100 - 4)) + '%';
      dot.style.top = (Math.random() * (100 - 4)) + '%';
      dot.addEventListener('click', function() {
        this.style.animation = 'miniGamePop 0.2s ease forwards';
        var self = this;
        setTimeout(function() {
          self.remove();
          score++;
          miniGameScore.textContent = score + ' / ' + need;
          if (score >= need) {
            miniGameScore.textContent = 'Усі крапки!';
            showGameResult('Перемога!', true);
          } else spawn();
        }, 180);
      });
      miniGameArea.appendChild(dot);
    }
    spawn();
  }

  function gameHyperrealism() {
    miniGameTitle.textContent = 'Злови зірку';
    miniGameScore.textContent = 'Клікни по зірці, поки вона падає';
    miniGameArea.style.position = 'relative';
    miniGameArea.style.height = '240px';
    miniGameArea.style.overflow = 'hidden';
    var zone = document.createElement('div');
    zone.style.cssText = 'position:absolute;left:0;right:0;bottom:20px;height:50px;border:2px dashed var(--accent);border-radius:8px;opacity:0.5;pointer-events:none;';
    miniGameArea.appendChild(zone);
    var star = document.createElement('div');
    star.textContent = '✦';
    star.style.cssText = 'position:absolute;left:50%;transform:translateX(-50%);top:0;font-size:2rem;color:var(--accent);cursor:pointer;transition:top 2.2s linear;text-shadow:0 0 20px var(--accent);';
    miniGameArea.appendChild(star);
    setTimeout(function() { star.style.top = '160px'; }, 100);
    star.addEventListener('click', function() {
      star.style.transition = 'none';
      star.style.animation = 'miniGamePop 0.3s ease forwards';
      miniGameScore.textContent = 'Влучив!';
      showGameResult('Перемога!', true);
    });
    setTimeout(function() {
      if (star.parentNode && !star.style.animation) {
        miniGameScore.textContent = 'Не встиг — спробуй ще';
        showGameResult('Зірка впала', false);
      }
    }, 2500);
  }

  function gameCyberpunk() {
    miniGameTitle.textContent = 'Введи код';
    var code = '';
    var chars = 'ABCDEF0123456789';
    for (var i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    var codeDisplay = document.createElement('div');
    codeDisplay.style.cssText = 'font-size:2rem;letter-spacing:0.5rem;font-family:var(--font-mono);color:var(--accent);text-shadow:0 0 10px var(--accent);animation:miniGameCodeGlitch 0.15s ease infinite;margin-bottom:1rem;';
    codeDisplay.textContent = code;
    miniGameArea.appendChild(codeDisplay);
    miniGameScore.textContent = 'Запам\'ятай код...';
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'mini-game-input';
    inp.maxLength = 4;
    inp.placeholder = '????';
    inp.style.opacity = '0.3';
    miniGameArea.appendChild(inp);
    setTimeout(function() {
      codeDisplay.style.display = 'none';
      miniGameScore.textContent = 'Введи код:';
      inp.style.opacity = '1';
      inp.focus();
    }, 2500);
    inp.addEventListener('keyup', function() {
      if (this.value.length === 4) {
        if (this.value.toUpperCase() === code) {
          miniGameScore.textContent = 'Доступ дозволено!';
          showGameResult('Перемога!', true);
        } else {
          miniGameScore.textContent = 'Невірно. Код: ' + code;
          showGameResult('Помилка доступу', false);
        }
      }
    });
  }

  function gameMemphism() {
    miniGameTitle.textContent = 'Знайди трикутник';
    var round = 0;
    var maxRound = 3;
    function next() {
      miniGameArea.innerHTML = '';
      miniGameScore.textContent = 'Раунд ' + (round + 1) + ' / ' + maxRound;
      var target = Math.floor(Math.random() * 9);
      for (var i = 0; i < 9; i++) {
        var el = document.createElement('div');
        el.style.cssText = 'width:50px;height:50px;cursor:pointer;display:flex;align-items:center;justify-content:center;animation:miniGameShapeIn 0.35s ease backwards;';
        el.style.animationDelay = (i * 0.05) + 's';
        if (i === target) {
          el.style.width = '0';
          el.style.height = '0';
          el.style.borderLeft = '20px solid transparent';
          el.style.borderRight = '20px solid transparent';
          el.style.borderBottom = '36px solid var(--accent)';
          el.style.background = 'none';
          el.style.animation = 'miniGameShapeIn 0.35s ease backwards, miniGamePulse 1.2s ease-in-out infinite 0.4s';
        } else {
          el.style.borderRadius = '50%';
          el.style.background = 'var(--text-muted)';
          el.style.opacity = '0.5';
        }
        el.addEventListener('click', function() {
          if (this.style.borderBottom) {
            round++;
            if (round >= maxRound) {
              miniGameScore.textContent = 'Усі раунди!';
              showGameResult('Перемога!', true);
            } else setTimeout(next, 150);
          } else {
            this.style.animation = 'miniGameShake 0.4s ease';
            setTimeout(function() { this.style.animation = ''; }.bind(this), 400);
          }
        });
        miniGameArea.appendChild(el);
      }
    }
    next();
  }

  function gameTerminal() {
    miniGameTitle.textContent = 'Введи команду';
    miniGameScore.textContent = 'Набери: HELLO';
    var inp = document.createElement('input');
    inp.type = 'text';
    inp.className = 'mini-game-input';
    inp.placeholder = '> _';
    inp.style.cssText = 'font-family:var(--font-mono);background:#0a0a0a;color:#00ff41;border:1px solid #00ff41;padding:0.5rem 0.75rem;width:100%;max-width:200px;margin-top:0.5rem;';
    miniGameArea.appendChild(inp);
    inp.focus();
    inp.addEventListener('keyup', function() {
      if (this.value.toUpperCase().trim() === 'HELLO') {
        miniGameScore.textContent = '> Access granted.';
        showGameResult('Перемога!', true);
        inp.disabled = true;
      }
    });
  }

  function gameAurora() {
    miniGameTitle.textContent = 'Лови хвилю';
    miniGameScore.textContent = 'Клікни, коли бар зелений';
    var bar = document.createElement('div');
    bar.style.cssText = 'width:100%;height:24px;background:linear-gradient(90deg,#0d0d2b,#1a1a4e,#00d4aa,#1a1a4e);background-size:400% 100%;border-radius:8px;animation:auroraBar 2.5s ease-in-out infinite;margin-top:1rem;';
    miniGameArea.appendChild(bar);
    var hint = document.createElement('p');
    hint.textContent = 'Чекай зелений момент...';
    hint.style.marginTop = '0.5rem';
    hint.style.fontSize = '0.9rem';
    miniGameArea.appendChild(hint);
    var clicked = false;
    bar.addEventListener('click', function() {
      if (clicked) return;
      clicked = true;
      var x = (Date.now() / 100) % 100;
      if (x > 35 && x < 65) {
        miniGameScore.textContent = 'Влучив!';
        showGameResult('Перемога!', true);
      } else {
        miniGameScore.textContent = 'Не в час — спробуй ще';
        showGameResult('Клікни в зелений', false);
      }
    });
  }

  function gameVaporwave() {
    miniGameTitle.textContent = 'Обери сонце';
    miniGameScore.textContent = 'Де справжнє сонце?';
    var others = ['🌙', '⭐', '🌟', '🌜', '✨', '🔮', '💎'];
    var sunIndex = Math.floor(Math.random() * 8);
    var symbols = [];
    for (var i = 0; i < 8; i++) symbols.push(i === sunIndex ? '☀️' : others[Math.floor(Math.random() * others.length)]);
    symbols.forEach(function(sym, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = sym;
      btn.style.cssText = 'font-size:1.8rem;padding:0.5rem;margin:4px;background:rgba(255,113,206,0.2);border:2px solid #ff71ce;border-radius:12px;cursor:pointer;transition:transform 0.2s;';
      btn.addEventListener('click', function() {
        if (idx === sunIndex) {
          miniGameScore.textContent = 'Правильно!';
          showGameResult('Перемога!', true);
        } else {
          this.style.animation = 'miniGameShake 0.4s ease';
          setTimeout(function() { btn.style.animation = ''; }, 400);
        }
      });
      miniGameArea.appendChild(btn);
    });
  }

  function gameNewspaper() {
    miniGameTitle.textContent = 'Знайди заголовок';
    miniGameScore.textContent = 'Клікни на правильний заголовок';
    var headlines = ['Кирило Бахтіяров — Full-Stack', 'Погода на завтра', 'Курс валют', 'Спорт', 'Кирило Бахтіяров — Full-Stack', 'Реклама'];
    var target = 0;
    headlines.forEach(function(text, idx) {
      var el = document.createElement('button');
      el.type = 'button';
      el.textContent = text;
      el.style.cssText = 'display:block;width:100%;padding:0.5rem 0.75rem;margin-bottom:6px;text-align:left;font-family:serif;background:#f4f0e8;border:1px solid #5c4033;color:#5c4033;cursor:pointer;border-radius:2px;';
      if (idx === target) el.dataset.correct = '1';
      el.addEventListener('click', function() {
        if (this.dataset.correct) {
          miniGameScore.textContent = 'Так!';
          showGameResult('Перемога!', true);
        } else {
          this.style.background = '#e8d8c8';
        }
      });
      miniGameArea.appendChild(el);
    });
  }

  function gameLiquidMetal() {
    miniGameTitle.textContent = 'Збери срібло';
    var score = 0;
    var need = 5;
    miniGameScore.textContent = '0 / ' + need;
    miniGameArea.style.position = 'relative';
    miniGameArea.style.height = '200px';
    function drop() {
      var coin = document.createElement('div');
      coin.textContent = '¤';
      coin.style.cssText = 'position:absolute;left:' + (Math.random() * 80 + 10) + '%;top:0;font-size:2rem;color:var(--accent);cursor:pointer;text-shadow:0 0 8px rgba(192,192,192,0.8);animation:liquidMetalDrop 1.2s linear forwards;';
      coin.addEventListener('click', function() {
        if (this.classList.contains('collected')) return;
        this.classList.add('collected');
        this.style.animation = 'miniGamePop 0.25s ease forwards';
        score++;
        miniGameScore.textContent = score + ' / ' + need;
        if (score >= need) {
          miniGameScore.textContent = 'Усі зібрані!';
          showGameResult('Перемога!', true);
        }
        setTimeout(function() { if (coin.parentNode) coin.parentNode.removeChild(coin); }, 260);
      });
      miniGameArea.appendChild(coin);
      if (score < need) setTimeout(drop, 900);
    }
    drop();
  }

  if (miniGameBtn) miniGameBtn.addEventListener('click', openMiniGame);
  if (miniGameClose) miniGameClose.addEventListener('click', closeMiniGame);
  if (miniGameOverlay) {
    miniGameOverlay.addEventListener('click', function(e) {
      if (e.target === miniGameOverlay) closeMiniGame();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && miniGameOverlay && !miniGameOverlay.hasAttribute('hidden')) closeMiniGame();
    });
  }

  /* ---------- Час читання ---------- */
  (function() {
    var el = document.getElementById('reading-time');
    if (!el) return;
    var content = document.querySelector('.resume__content');
    if (!content) return;
    var text = content.innerText || content.textContent || '';
    var words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
    var min = Math.max(1, Math.ceil(words / 200));
    el.textContent = '~' + min + ' хв читання';
  })();

  /* ---------- Копіювання контактів по кліку ---------- */
  (function() {
    var copyToast = null;
    var copyToastTmr = null;
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a.copy-on-click');
      if (!link) return;
      var toCopy = link.getAttribute('data-copy') || link.href || link.textContent.trim();
      if (!toCopy) return;
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(toCopy).then(function() {
          if (copyToastTmr) clearTimeout(copyToastTmr);
          if (!copyToast) {
            copyToast = document.createElement('div');
            copyToast.className = 'copy-toast';
            copyToast.setAttribute('aria-live', 'polite');
            document.body.appendChild(copyToast);
          }
          copyToast.textContent = 'Скопійовано';
          copyToast.classList.add('is-visible');
          copyToastTmr = setTimeout(function() {
            copyToast.classList.remove('is-visible');
          }, 1800);
        }).catch(function() { window.location.href = link.href; });
      } else {
        window.location.href = link.href;
      }
    });
  })();

  /* ---------- Ripple на клік (картки, кнопки теми, back-to-top) ---------- */
  function createRipple(e, parent) {
    if (!parent || parent.querySelector('.ripple')) return;
    var rect = parent.getBoundingClientRect();
    var x = (e.clientX !== undefined ? e.clientX : e.touches && e.touches[0] && e.touches[0].clientX) - rect.left;
    var y = (e.clientY !== undefined ? e.clientY : e.touches && e.touches[0] && e.touches[0].clientY) - rect.top;
    var size = Math.max(rect.width, rect.height) * 0.6;
    var ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (x - size / 2) + 'px';
    ripple.style.top = (y - size / 2) + 'px';
    parent.style.position = parent.style.position || 'relative';
    if (getComputedStyle(parent).overflow === 'visible') parent.style.overflow = 'hidden';
    parent.appendChild(ripple);
    setTimeout(function() {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 520);
  }
  document.addEventListener('click', function(e) {
    var t = e.target.closest('.resume__card, .theme-list__btn, .back-to-top');
    if (t) createRipple(e, t);
  }, false);

  /* ---------- Konami code — easter egg ---------- */
  var konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var konamiIndex = 0;
  var easterToast = document.getElementById('easter-toast');
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        if (easterToast) {
          easterToast.textContent = 'Konami! 🎮';
          easterToast.classList.add('is-visible');
          easterToast.removeAttribute('aria-hidden');
          setTimeout(function() {
            easterToast.classList.remove('is-visible');
            easterToast.setAttribute('aria-hidden', 'true');
          }, 2200);
        }
      }
    } else {
      konamiIndex = 0;
    }
  });

  /* ---------- Друк ---------- */
  var printBtn = document.getElementById('print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      window.print();
    });
  }

  /* ---------- Індикатор поточної секції ---------- */
  (function() {
    var indicator = document.getElementById('section-indicator');
    if (!indicator) return;
    var sections = [
      { id: 'education-heading', label: 'Освіта' },
      { id: 'skills-heading', label: 'Навички' },
      { id: 'experience-heading', label: 'Досвід' },
      { id: 'about-heading', label: 'Про себе' }
    ];
    var headings = sections.map(function(s) { return document.getElementById(s.id); }).filter(Boolean);
    if (!headings.length) return;
    var checkVisible = function() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop < 80) {
        indicator.classList.remove('is-visible');
        indicator.setAttribute('aria-hidden', 'true');
        return;
      }
      var viewMid = scrollTop + window.innerHeight * 0.35;
      var current = null;
      headings.forEach(function(h) {
        var top = h.getBoundingClientRect().top + scrollTop;
        if (viewMid >= top) current = h.id;
      });
      if (current) {
        var found = sections.filter(function(s) { return s.id === current; })[0];
        if (found) {
          indicator.textContent = found.label;
          indicator.classList.add('is-visible');
          indicator.removeAttribute('aria-hidden');
        }
      } else {
        indicator.classList.remove('is-visible');
        indicator.setAttribute('aria-hidden', 'true');
      }
    };
    window.addEventListener('scroll', throttleRAF(checkVisible), { passive: true });
    window.addEventListener('resize', checkVisible);
    checkVisible();
  })();

  /* ---------- Підказка клавіатурних скорочень (? ) ---------- */
  (function() {
    var overlay = document.getElementById('shortcuts-overlay');
    var closeBtn = document.getElementById('shortcuts-close');
    function openShortcuts() {
      if (!overlay) return;
      overlay.hidden = false;
      overlay.classList.add('is-visible');
    }
    function closeShortcuts() {
      if (!overlay) return;
      overlay.classList.remove('is-visible');
      overlay.hidden = true;
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        var tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea') return;
        e.preventDefault();
        if (overlay && overlay.hidden) openShortcuts();
        else closeShortcuts();
      }
      if (e.key === 'Escape' && overlay && !overlay.hidden) { closeShortcuts(); e.stopPropagation(); }
    });
    if (closeBtn) closeBtn.addEventListener('click', closeShortcuts);
    if (overlay) overlay.addEventListener('click', function(e) { if (e.target === overlay) closeShortcuts(); });
  })();
})();
