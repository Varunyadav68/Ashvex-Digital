const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const toast = document.querySelector('.toast');
const contactForm = document.querySelector('#contactForm');
const copyPhoneButton = document.querySelector('.copy-phone');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => toast.classList.remove('show'), 3000);
}

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

copyPhoneButton.addEventListener('click', async () => {
  const phoneNumber = copyPhoneButton.dataset.phone;
  try {
    await navigator.clipboard.writeText(phoneNumber);
    showToast('Phone number copied: ' + phoneNumber);
  } catch {
    showToast('Call us at: ' + phoneNumber);
  }
});

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name').trim();
  const submitButton = contactForm.querySelector('.submit-button');

  submitButton.disabled = true;
  submitButton.innerHTML = 'Sending...';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Form submission failed');
    }

    showToast(`Thanks, ${name}! We will contact you soon.`);
    contactForm.reset();
  } catch {
    showToast('Message could not be sent. Please call us directly.');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send enquiry <span>↗</span>';
  }
});

document.querySelector('#currentYear').textContent = new Date().getFullYear();
