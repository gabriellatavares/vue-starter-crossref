<template>
  <div class="app">
    <header class="site-header">
      <div class="header-inner">
        <RouterLink
          to="/"
          class="wordmark"
          aria-label="Crossref home"
        >
          <span class="wordmark-cross">cross</span><span class="wordmark-ref">ref</span>
        </RouterLink>
        <span class="site-title">Metadata Search</span>
      </div>
    </header>

    <main id="main-content">
      <RouterView />
    </main>

    <footer class="site-footer">
      <p>
        Powered by the <a
          href="https://api.crossref.org"
          target="_blank"
          rel="noopener"
        >
          Crossref REST API
        </a>
      </p>
    </footer>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

:root {
  --font-display: 'Lora', Georgia, serif;
  --font-body: 'Source Sans 3', system-ui, sans-serif;
  --accent: #1a6b55;
  --accent-dark: #134f3e;
  --accent-light: #a8d4c8;
  --accent-faint: #eaf4f1;
  --bg: #f7f5f0;
  --surface: #ffffff;
  --surface-hover: #f3f1ec;
  --border: #e2ddd6;
  --text: #1c1a17;
  --text-secondary: #3d3a34;
  --text-muted: #7a7469;
}

*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0; padding: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
.app { min-height: 100vh; display: flex; flex-direction: column; }

.site-header { background: var(--text); color: #fff; }

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px 24px;
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.wordmark {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  text-decoration: none;
}

.wordmark-cross { color: #fff; }
.wordmark-ref { color: var(--accent-light); }

.site-title {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 400;
  color: rgba(255,255,255,0.55);
  letter-spacing: 0.02em;
}

main { flex: 1; }

.site-footer {
  text-align: center;
  padding: 16px 24px;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
}

.site-footer a { color: var(--accent); text-decoration: none; }
.site-footer a:hover { text-decoration: underline; }
</style>
