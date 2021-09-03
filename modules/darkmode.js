const DarkMode = {
  themeIcon: document.querySelector('#header i'),

  setTheme() {
    document.body.dataset.theme = this.getStorage();

    if (this.getStorage() === 'light') {
      this.themeIcon.classList.remove('fa-sun');
      this.themeIcon.classList.add('fa-moon');
    } else {
      this.themeIcon.classList.remove('fa-moon');
      this.themeIcon.classList.add('fa-sun');
    }
  },

  getStorage() {
    return localStorage.getItem('theme') || 'light';
  },

  setStorage(theme) {
    localStorage.setItem('theme', theme);
  },

  addEventListener() {
    this.themeIcon.addEventListener('click', () => {
      if (this.getStorage() === 'light') {
        this.setStorage('dark');
        this.setTheme();
      } else {
        this.setStorage('light');
        this.setTheme();
      }
    });
  },

  init() {
    this.setTheme();
    this.addEventListener();
  },
};

export default DarkMode;
