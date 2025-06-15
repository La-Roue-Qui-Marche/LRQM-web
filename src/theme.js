export function setupThemeToggle() {
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  
  const currentTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-bs-theme', currentTheme);
  updateThemeButton(currentTheme);
  
  themeToggle.addEventListener('click', () => {
    const newTheme = html.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
  });
}

function updateThemeButton(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (theme === 'dark') {
    themeToggle.innerHTML = '<span class="theme-icon me-2">☀️</span>Clair';
  } else {
    themeToggle.innerHTML = '<span class="theme-icon me-2">🌙</span>Sombre';
  }
}
