document.addEventListener('DOMContentLoaded', () => {
  /* ===== Theme Toggle ===== */
  const themeBtn = document.getElementById('theme-toggle-btn');
  let currentTheme = localStorage.getItem('theme') || 'dark';

  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (themeBtn) {
      themeBtn.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }

  // Apply initial theme
  applyTheme(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  /* ===== Language Switcher ===== */
  function setLanguage(lang) {
    document.querySelectorAll('[data-ko]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (!val) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.innerHTML = val;
      }
    });

    const langKoBtn = document.getElementById('lang-ko');
    const langEnBtn = document.getElementById('lang-en');
    if (langKoBtn) langKoBtn.classList.toggle('active', lang === 'ko');
    if (langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');

    localStorage.setItem('lang', lang);
  }

  // Language buttons click handlers
  const langKoBtn = document.getElementById('lang-ko');
  const langEnBtn = document.getElementById('lang-en');

  if (langKoBtn) {
    langKoBtn.addEventListener('click', () => setLanguage('ko'));
  }
  if (langEnBtn) {
    langEnBtn.addEventListener('click', () => setLanguage('en'));
  }

  // Apply initial language
  const savedLang = localStorage.getItem('lang') || 'ko';
  setLanguage(savedLang);

  /* ===== Mobile Navigation Menu Toggle ===== */
  const navToggle = document.getElementById('nav-toggle');
  const navbar = document.querySelector('.navbar');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      navbar.classList.toggle('nav-open');
    });

    // Close menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('nav-open');
      });
    });
  }

  /* ===== Visitor Counter ===== */
  async function loadVisitorCount() {
    const visitorCountEl = document.getElementById('visitor-count');
    if (!visitorCountEl) return;

    try {
      const KEY = 'visitor_counted';
      const EXPIRE = 24 * 60 * 60 * 1000;
      const last = localStorage.getItem(KEY);
      const isNew = !last || (Date.now() - parseInt(last, 10)) > EXPIRE;
      const endpoint = isNew ? '/api/view' : '/api/view?readonly=true';
      const res = await fetch(endpoint);
      if (!res.ok) return;
      const data = await res.json();
      if (typeof data.value !== 'undefined') {
        visitorCountEl.textContent = data.value.toLocaleString();
        if (isNew) localStorage.setItem(KEY, Date.now().toString());
      }
    } catch (e) {
      console.error("Failed to load visitor count:", e);
    }
  }
  loadVisitorCount();

  /* ===== FAQ Accordion Logic ===== */
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all FAQ items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      // If clicked item wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  /* ===== Contact Form Submission ===== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = this.querySelector('.submit-btn');
      const lang = localStorage.getItem('lang') || 'ko';
      btn.textContent = lang === 'ko' ? '전송 중...' : 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.name.value,
            email: this.email.value,
            type: this['inquiry-type'].value,
            message: this.message.value
          })
        });
        if (res.ok) {
          btn.textContent = lang === 'ko' ? '✓ 전송 완료' : '✓ Sent';
          this.reset();
        } else {
          throw new Error();
        }
      } catch (err) {
        btn.textContent = lang === 'ko' ? '다시 시도해주세요' : 'Try Again';
        btn.disabled = false;
      }
    });
  }

  /* ===== Game Embed Logic ===== */
  const profileView = document.getElementById('profile-view');
  const gameView = document.getElementById('game-view');
  const gameIframe = document.getElementById('game-iframe');
  const gameTitle = document.getElementById('game-title');
  const closeGameBtn = document.getElementById('close-game-btn');

  const gameTitles = {
    tetris: '🧱 테트리스',
    omok: '⚫ 오목',
    sudoku: '🔢 수도쿠'
  };

  function startEmbeddedGame(gameId) {
    if (!profileView || !gameView || !gameIframe || !gameTitle) return;

    // Show game view, hide profile view
    profileView.style.display = 'none';
    gameView.style.display = 'flex';

    // Set game title
    gameTitle.textContent = gameTitles[gameId] || '🎮 미니게임';

    // Load game URL in iframe
    gameIframe.src = `${gameId}.html`;
  }

  function closeEmbeddedGame() {
    if (!profileView || !gameView || !gameIframe) return;

    // Show profile view, hide game view
    profileView.style.display = 'block';
    gameView.style.display = 'none';

    // Reset iframe src
    gameIframe.src = '';

    // Clear query param
    const url = new URL(window.location);
    url.searchParams.delete('game');
    window.history.replaceState({}, '', url);
  }

  if (closeGameBtn) {
    closeGameBtn.addEventListener('click', closeEmbeddedGame);
  }

  // Intercept click on game dropdown links
  const gameLinks = document.querySelectorAll('.game-link');
  gameLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const gameId = link.getAttribute('data-game');
      
      // If we are on index.html, load game inline
      if (profileView && gameView) {
        e.preventDefault();
        startEmbeddedGame(gameId);
        
        // Update URL query param without reloading
        const url = new URL(window.location);
        url.searchParams.set('game', gameId);
        window.history.pushState({}, '', url);
      }
    });
  });

  // Check URL query parameters on load
  const urlParams = new URLSearchParams(window.location.search);
  const gameParam = urlParams.get('game');
  if (gameParam && gameTitles[gameParam]) {
    startEmbeddedGame(gameParam);
  }
});
