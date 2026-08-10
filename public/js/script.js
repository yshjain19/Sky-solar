document.addEventListener('DOMContentLoaded', () => {
  // 1. Global Navbar scroll shading
  handleNavbarScroll();

  // 2. Portfolio/Showcase Filters
  initProjectFilters();

  // 3. Scroll Reveal and Count-Ups
  initScrollAnimations();

  // 4. Savings Calculator Logic
  initSavingsCalculator();

  // 5. Check hash routes for tab activation
  checkTabFromHash();
});

/**
 * Handle navbar translucency toggling
 */
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar-custom');
  if (!navbar) return;

  const toggleScrollClass = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  };

  window.addEventListener('scroll', toggleScrollClass);
  toggleScrollClass();
}

/**
 * Client-Side Tab switching for Solar Solutions Page
 * @param {string} tabName ('solutions', 'systems', 'calculator')
 */
window.switchSolarTab = function(tabName) {
  // Hide all sections, remove active class on all buttons
  document.querySelectorAll('.solar-section-content').forEach(el => el.classList.add('d-none'));
  document.querySelectorAll('[id^="tab-"]').forEach(btn => btn.classList.remove('active'));

  // Show selected section, add active class to button
  const activeBtn = document.getElementById(`tab-${tabName}-btn`);
  const activeSec = document.getElementById(`section-${tabName}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activeSec) {
    activeSec.classList.remove('d-none');
    // Force trigger reflow and class add for fade animations
    activeSec.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('revealed'));
  }

  // Smooth scroll to the tab buttons top
  const scrollOffset = 140; // Offset for navbar height
  const topPos = activeBtn ? activeBtn.getBoundingClientRect().top + window.scrollY - scrollOffset : 0;
  window.scrollTo({ top: topPos, behavior: 'smooth' });
};

/**
 * Select tab on page load if URL hash matches
 */
function checkTabFromHash() {
  const hash = window.location.hash;
  if (hash === '#systems') {
    switchSolarTab('systems');
  } else if (hash === '#calculator') {
    switchSolarTab('calculator');
  } else if (hash === '#solutions') {
    switchSolarTab('solutions');
  }
}

// Watch for hash changes on the page
window.addEventListener('hashchange', checkTabFromHash);

/**
 * Portfolio project gallery filtering
 */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  const projectItems = document.querySelectorAll('.project-item');
  if (filterButtons.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Animate counters and fade reveals on scroll
 */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in-up');
  const counters = document.querySelectorAll('.counter-val, .counter-value');

  // Reveal Observer
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.05 });

  fadeElements.forEach(el => revealObserver.observe(el));

  // Counter count-up observer
  const countUp = (counter) => {
    const target = +counter.getAttribute('data-target');
    const speed = 100; 
    const increment = target / speed;

    const updateCount = () => {
      const currentValue = +counter.innerText.replace(/[^\d]/g, '');
      if (currentValue < target) {
        const nextValue = Math.ceil(currentValue + increment);
        if (nextValue >= target) {
          counter.innerText = target.toLocaleString('en-IN') + (counter.getAttribute('data-target') === '25' ? ' Years' : '+');
        } else {
          counter.innerText = nextValue.toLocaleString('en-IN') + '+';
          setTimeout(updateCount, 15);
        }
      } else {
        counter.innerText = target.toLocaleString('en-IN') + (counter.getAttribute('data-target') === '25' ? ' Years' : '+');
      }
    };
    
    updateCount();
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  counters.forEach(c => counterObserver.observe(c));
}

/**
 * Solar Savings Calculator Client Math
 */
function initSavingsCalculator() {
  const form = document.getElementById('solar-calc-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const cityInput = document.getElementById('calc-city');
    const billInput = document.getElementById('calc-bill');
    const propInput = document.getElementById('calc-property');
    const areaInput = document.getElementById('calc-area');

    let isValid = true;

    // Simple validation feedback UI
    [cityInput, billInput, propInput, areaInput].forEach(input => {
      if (!input.value || (input.type === 'number' && parseFloat(input.value) <= 0)) {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (!isValid) return;

    const bill = parseFloat(billInput.value);
    const area = parseFloat(areaInput.value);

    // Business calculations
    const tariff = 8.0;
    const monthlyUnits = bill / tariff;
    const unitsPerKwMonth = 120;
    const sqFtPerKw = 100;

    let targetCapacity = monthlyUnits / unitsPerKwMonth;
    const maxCapacityByArea = area / sqFtPerKw;

    let finalCapacity = Math.min(targetCapacity, maxCapacityByArea);
    finalCapacity = Math.max(1.0, Math.round(finalCapacity * 2) / 2); // nearest 0.5 kW

    const monthlyGeneration = finalCapacity * unitsPerKwMonth;
    const monthlySavings = Math.min(bill, monthlyGeneration * tariff);
    const annualSavings = monthlySavings * 12;

    const systemCost = finalCapacity * 60000;
    const paybackYears = systemCost / annualSavings;
    const co2ReductionTons = (monthlyGeneration * 12 * 0.82) / 1000;

    // Update UI elements
    document.getElementById('result-capacity').innerText = `${finalCapacity.toFixed(1)} kW`;
    document.getElementById('result-generation').innerText = `${Math.round(monthlyGeneration).toLocaleString('en-IN')} kWh`;
    document.getElementById('result-monthly-savings').innerText = `₹${Math.round(monthlySavings).toLocaleString('en-IN')}`;
    document.getElementById('result-annual-savings').innerText = `₹${Math.round(annualSavings).toLocaleString('en-IN')}`;
    document.getElementById('result-payback').innerText = `${paybackYears.toFixed(1)} Years`;
    document.getElementById('result-co2').innerText = `${co2ReductionTons.toFixed(2)} Tons`;

    // Dynamic quote prefill routing link
    const quoteBtn = document.getElementById('detailed-quote-btn');
    if (quoteBtn) {
      quoteBtn.setAttribute('href', `/contact?bill=${bill}&property=${propInput.value}&city=${encodeURIComponent(cityInput.value)}`);
    }
  });
}
