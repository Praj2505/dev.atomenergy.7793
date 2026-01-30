// script.js — handles contact form submission, mobile menu toggle, and UI interactions

document.addEventListener('DOMContentLoaded', () => {
  // Set year in footer
  const y = new Date().getFullYear();
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = y;
  }

  // ===== HEADER SCROLL FADE EFFECT =====
  const siteHeader = document.querySelector('.site-header');
  
  function updateHeaderOpacity() {
    // Get the scroll position (0 at top)
    const scrollTop = window.scrollY;
    
    // Define fade range: starts fading from 0px, fully faded by 500px
    const fadeStart = 0;
    const fadeEnd = 500;
    
    // Calculate opacity (1 = fully visible at top, fades as you scroll)
    let opacity;
    
    if (scrollTop <= fadeStart) {
      // At top: full opacity
      opacity = 1;
    } else if (scrollTop >= fadeEnd) {
      // After fade range: stay at minimum opacity (but keep header visible)
      opacity = 1; // Keep full opacity throughout all sections
    } else {
      // In fade range: smooth transition
      opacity = 1 - ((scrollTop - fadeStart) / (fadeEnd - fadeStart)) * 0.5;
    }
    
    // Apply opacity to the entire header
    siteHeader.style.opacity = opacity;
  }

  // Throttle scroll events for better performance
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
      updateHeaderOpacity();
    });
  });

  // ===== MOBILE MENU TOGGLE =====
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navBack = document.getElementById('nav-back');
  const navLinks = navMenu ? navMenu.querySelectorAll('a') : [];
  const body = document.body;

  // Helper function to close menu
  function closeMenu() {
    if (menuToggle) menuToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    // Allow scrolling again
    body.style.overflow = 'auto';
  }

  // Helper function to open menu
  function openMenu() {
    if (menuToggle) menuToggle.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    // Prevent scrolling when menu is open
    body.style.overflow = 'hidden';
  }

  if (menuToggle && navMenu) {
    // Toggle menu on hamburger click
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (menuToggle.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu on back button click
    if (navBack) {
      navBack.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    }

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
      }
    });

    // Prevent menu from closing when clicking inside nav
    navMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu on window resize (when crossing responsive breakpoint)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });
  }

  // ===== CONTACT FORM =====
  const form = document.getElementById('contact-form');
  if (form) {
    const statusEl = document.getElementById('form-status');

    // Replace this with your Formspree endpoint OR configure Netlify Forms / EmailJS
    // Example Formspree action: https://formspree.io/f/your_form_id
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mvzrdbll';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.textContent = '';
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // Basic client-side validation
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
      fd.append('_replyto', email);
      fd.append('_subject', 'Atom site contact');

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
        statusEl.textContent = 'Thanks — your message has been sent. We will reply shortly.';
        form.reset();
      } catch (err) {
        console.error('Form submit error', err);
        statusEl.style.color = '#ffb3b3';
        statusEl.textContent = 'Sorry — something went wrong. Please try again or email hello@atom.com';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }
});