const root = document.documentElement;

const themeToggle = document.querySelector('#themeToggle');
const deviceToggle = document.querySelector('#deviceToggle');

function toggleTheme() {
  const current = root.getAttribute('data-theme') || 'light';
  root.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

function toggleDevice() {
  const current = root.getAttribute('data-device') || 'desktop';
  root.setAttribute('data-device', current === 'desktop' ? 'mobile' : 'desktop');
}

themeToggle?.addEventListener('click', toggleTheme);
deviceToggle?.addEventListener('click', toggleDevice);

const modal = document.querySelector('#demoModal');
const openModal = document.querySelector('#openModal');
const closeModal = document.querySelectorAll('[data-close-modal]');

openModal?.addEventListener('click', () => modal?.classList.remove('hidden'));
closeModal.forEach((btn) => btn.addEventListener('click', () => modal?.classList.add('hidden')));

const toastArea = document.querySelector('#toastArea');
const showToast = document.querySelector('#showToast');

showToast?.addEventListener('click', () => {
  if (!toastArea) return;
  const toast = document.createElement('div');
  toast.className = 'ui-toast ui-toast--info';
  toast.textContent = '새 토스트 메시지입니다.';
  toastArea.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
});
