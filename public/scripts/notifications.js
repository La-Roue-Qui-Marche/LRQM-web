export function showNotification(message, type = 'success') {
  const toast = document.getElementById('notificationToast');
  const toastBody = toast.querySelector('.toast-body');
  const icon = toast.querySelector('.toast-icon');
  const messageEl = toast.querySelector('.toast-message');

  toastBody.className = `toast-body d-flex align-items-center ${type === 'success' ? 'bg-success' : 'bg-danger'} text-white`;
  icon.innerHTML = type === 'success' ? '✓' : '⚠';
  messageEl.textContent = message;

  const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
  bsToast.show();
}
