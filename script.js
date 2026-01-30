// script.js — handles contact form submission and small UI bits

document.addEventListener('DOMContentLoaded', () => {
  // set year in footer
  const y = new Date().getFullYear();
  document.getElementById('year').textContent = y;

  // contact form
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  // Replace this with your Formspree endpoint OR configure Netlify Forms / EmailJS
  // Example Formspree action: https://formspree.io/f/your_form_id
  // When using Formspree you can enable an auto-reply in the Formspree dashboard to send an automated email to the submitter (using the _replyto field).
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // basic client-side validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      statusEl.textContent = 'Please complete all fields.';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
      return;
    }

    // Build form data
    const fd = new FormData();
    fd.append('name', name);
    fd.append('email', email);
    fd.append('message', message);
    fd.append('_replyto', email); // Formspree: used for automated reply to visitor
    fd.append('_subject', 'Zest‑X site contact');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Network response was not ok');
      }

      // Success
      statusEl.style.color = 'var(--muted)';
      statusEl.textContent = 'Thanks — your message has been sent. We’ll reply shortly.';
      form.reset();

      // Optional: if you want to send the visitor an immediate on-site confirmation, do it here.
    } catch (err) {
      console.error('Form submit error', err);
      statusEl.style.color = '#ffb3b3';
      statusEl.textContent = 'Sorry — something went wrong. Please try again or email hello@zest-x.com';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
});