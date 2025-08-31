document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    });
  });

// Simple image lightbox for modal/media images
  function showPopup(src) {
    var popup = document.getElementById('imagePopup');
    if (!popup) return;
    var img = popup.querySelector('img');
    if (img) img.src = src;
    popup.style.display = 'flex';
  }

  function hidePopup() {
    var popup = document.getElementById('imagePopup');
    if (!popup) return;
    popup.style.display = 'none';
  }

  // Close popup when clicking the overlay
  var popup = document.getElementById('imagePopup');
  if (popup) {
    popup.addEventListener('click', function () {
      hidePopup();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hidePopup();
  });

  // Event delegation to intercept clicks on anchors/images inside media sections
  document.addEventListener('click', function (e) {
    // If clicking an anchor inside .mm-figure or .mm-feature
    var anchor = e.target.closest('.mm-figure a, .mm-feature a');
    if (anchor) {
      // prevent opening in a new tab/window
      e.preventDefault();
      e.stopPropagation();
      var src = anchor.getAttribute('href');
      if (!src) {
        var imgChild = anchor.querySelector('img');
        if (imgChild) src = imgChild.getAttribute('src');
      }
      if (src) showPopup(src);
      return;
    }

    // If clicking directly on an image
    var img = e.target.closest('.mm-figure img, .mm-feature img');
    if (img) {
      e.preventDefault();
      e.stopPropagation();
      var srcImg = img.getAttribute('src');
      if (srcImg) showPopup(srcImg);
    }
  });

  // Portfolio: filters + accessibility + reveal on scroll
  (function initPortfolio() {
    var container = document.querySelector('.portfolio-area');
    if (!container) return;

    var buttons = container.querySelectorAll('.btn-filter');
    var cards = container.querySelectorAll('.portfolio-card');

    // Filter handler
    function applyFilter(category) {
      cards.forEach(function (card) {
        var cat = (card.getAttribute('data-category') || '').toLowerCase();
        var match = category === 'all' || cat === category;
        if (match) {
          card.removeAttribute('hidden');
        } else {
          card.setAttribute('hidden', '');
        }
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        // Toggle pressed states
        buttons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        var category = (btn.getAttribute('data-filter') || 'all').toLowerCase();
        applyFilter(category);
      });
    });

    // Initialize filter on load: prefer the button marked active, else the first button
    var initialBtn = container.querySelector('.portfolio-filters .btn-filter.active')
        || container.querySelector('.portfolio-filters .btn-filter');
    if (initialBtn) {
      buttons.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      initialBtn.classList.add('active');
      initialBtn.setAttribute('aria-pressed', 'true');
      var initialCategory = (initialBtn.getAttribute('data-filter') || 'all').toLowerCase();
      applyFilter(initialCategory);
    } else {
      applyFilter('all');
    }


    // Keyboard navigation inside grid
    container.addEventListener('keydown', function (e) {
      var focusCard = document.activeElement.closest('.portfolio-card');
      if (!focusCard) return;

      var items = Array.from(container.querySelectorAll('.portfolio-card:not([hidden])'));
      var idx = items.indexOf(focusCard);
      if (idx === -1) return;

      // Arrow key navigation
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          items[Math.min(idx + 1, items.length - 1)].focus();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          items[Math.max(idx - 1, 0)].focus();
          break;
        default:
          break;
      }
    });

    // Make cards focusable
    cards.forEach(function (card) {
      card.setAttribute('tabindex', '0');
    });

    // Reveal on scroll
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(function (card) {
      io.observe(card);
    });
  })();



});
