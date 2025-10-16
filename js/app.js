document.addEventListener('DOMContentLoaded', function() {
  console.log(' APP INITIALIZATION START');//this is to confirm it started

  if (typeof loadTransactions === 'function') {
    loadTransactions();
    console.log('✓ Transactions loaded');
  }

  if (typeof loadAllSettings === 'function') {
    loadAllSettings();
    console.log('✓ Settings loaded');
  }

  setTimeout(() => {
    if (typeof renderTransactions === 'function') {
      renderTransactions();
      console.log('✓ Records rendered');
    }

    if (typeof updateDashboard === 'function') {
      updateDashboard();
      console.log('✓ Dashboard updated');
    }

    if (typeof updateSavingsPage === 'function') {
      updateSavingsPage();
      console.log('✓ Savings updated');
    }

    console.log('=== APP INITIALIZATION COMPLETE ===');
  }, 100);
});

const sections = document.querySelectorAll("main section");
const buttons = document.querySelectorAll("nav button");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const page = btn.dataset.page;
    sections.forEach(sec => (sec.style.display = "none"));
    const activeSection = document.getElementById(page);

    if (activeSection) {
      activeSection.style.display = "block";

      if (page === 'dashboard' && typeof updateDashboard === 'function') {
        updateDashboard();
      }
      else if (page === 'records' && typeof renderTransactions === 'function') {
        renderTransactions();
      }
      else if (page === 'savings' && typeof updateSavingsPage === 'function') {
        updateSavingsPage();
      }
    }
  });
});

function refreshAllPages() {
  if (typeof renderTransactions === 'function') renderTransactions();
  if (typeof updateDashboard === 'function') updateDashboard();
  if (typeof updateSavingsPage === 'function') updateSavingsPage();
  console.log('✓ All pages refreshed');
}



//citing claude AI to integrate ARIA  and accessibility controls
// ============================================
// ACCESSIBILITY KEYBOARD SHORTCUTS
// ============================================

// Keyboard shortcut handler
document.addEventListener('keydown', function(e) {
  // Check if Alt key is pressed (Option key on Mac)
  if (e.altKey) {
    let targetPage = null;

    switch(e.key.toLowerCase()) {
      case 'd':
        e.preventDefault();
        targetPage = 'dashboard';
        break;

      case 'a':
        e.preventDefault();
        targetPage = 'transaction';
        break;

      case 'r':
        e.preventDefault();
        targetPage = 'records';
        break;

      case 's':
        e.preventDefault();
        targetPage = 'savings';
        break;

      case 't':
        e.preventDefault();
        targetPage = 'settings';
        break;

      case 'i':
        e.preventDefault();
        targetPage = 'about';
        break;
    }

    // Navigate to the target page if one was selected
    if (targetPage) {
      navigateToPage(targetPage);
    }
  }

  // Escape key to cancel edit mode
  if (e.key === 'Escape') {
    if (typeof cancelEdit === 'function') {
      cancelEdit();
    }
  }
});

// Navigation helper function that works with your existing structure
function navigateToPage(pageId) {
  // Hide all sections
  const sections = document.querySelectorAll("main section");
  sections.forEach(sec => (sec.style.display = "none"));

  // Show selected section
  const activeSection = document.getElementById(pageId);
  if (activeSection) {
    activeSection.style.display = "block";
  }

  // Update active button state
  const buttons = document.querySelectorAll("nav button");
  buttons.forEach(btn => {
    if (btn.dataset.page === pageId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Call page-specific update functions
  if (pageId === 'dashboard' && typeof updateDashboard === 'function') {
    updateDashboard();
  }
  else if (pageId === 'records' && typeof renderTransactions === 'function') {
    renderTransactions();
  }
  else if (pageId === 'savings' && typeof updateSavingsPage === 'function') {
    updateSavingsPage();
  }

  // Focus the first interactive element in the section
  setTimeout(() => {
    const section = document.getElementById(pageId);
    if (section) {
      const firstInput = section.querySelector('input, button, select, textarea');
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, 100);

  // Announce to screen readers
  announceToScreenReader(`Navigated to ${pageId} page`);
}

// Show keyboard shortcuts helper popup
function showKeyboardShortcutsHelper() {
  // Remove existing helper if any
  const existing = document.getElementById('keyboard-shortcuts-help');
  if (existing) {
    existing.remove();
    return;
  }

  const helpText = document.createElement('div');
  helpText.id = 'keyboard-shortcuts-help';
  helpText.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background: rgba(0, 0, 0, 0.95);
    color: white;
    padding: 20px;
    border-radius: 10px;
    font-size: 0.9rem;
    z-index: 10000;
    max-width: 280px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    animation: slideUp 0.3s ease;
  `;

  helpText.innerHTML = `
    <h4 style="margin: 0 0 15px 0; font-size: 1.1rem; color: #d0f9ea;">⌨️ Keyboard Shortcuts</h4>
    <div style="line-height: 2;">
      <div><strong style="color: #0fa67b;">Alt + D</strong> → Dashboard</div>
      <div><strong style="color: #0fa67b;">Alt + A</strong> → Add Transaction</div>
      <div><strong style="color: #0fa67b;">Alt + R</strong> → Records</div>
      <div><strong style="color: #0fa67b;">Alt + S</strong> → Savings</div>
      <div><strong style="color: #0fa67b;">Alt + T</strong> → Settings</div>
      <div><strong style="color: #0fa67b;">Alt + I</strong> → About</div>
      <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2);">
        <strong style="color: #0fa67b;">Tab</strong> → Navigate Elements<br>
        <strong style="color: #0fa67b;">Enter</strong> → Activate/Submit<br>
        <strong style="color: #0fa67b;">Esc</strong> → Cancel Edit
      </div>
    </div>
    <button onclick="this.parentElement.remove()" style="
      margin-top: 15px;
      padding: 8px 12px;
      background: #0fa67b;
      border: none;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      width: 100%;
      font-weight: 600;
      font-size: 0.9rem;
      transition: background 0.2s;
    " onmouseover="this.style.background='#0d8c68'" onmouseout="this.style.background='#0fa67b'">
      Close (or press Esc)
    </button>
  `;

  document.body.appendChild(helpText);

  // Close with Escape key
  const closeHandler = function(e) {
    if (e.key === 'Escape' && document.getElementById('keyboard-shortcuts-help')) {
      helpText.remove();
      document.removeEventListener('keydown', closeHandler);
    }
  };
  document.addEventListener('keydown', closeHandler);
}

// Add floating keyboard shortcuts button
function addKeyboardShortcutsButton() {
  const button = document.createElement('button');
  button.innerHTML = '⌨️';
  button.title = 'View Keyboard Shortcuts (Alt+H)';
  button.setAttribute('aria-label', 'View keyboard shortcuts');
  button.id = 'keyboard-shortcuts-btn';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: #0fa67b;
    color: white;
    border: none;
    font-size: 1.6rem;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(15, 166, 123, 0.4);
    z-index: 9999;
    transition: all 0.3s ease;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1) rotate(5deg)';
    button.style.boxShadow = '0 6px 20px rgba(15, 166, 123, 0.6)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1) rotate(0deg)';
    button.style.boxShadow = '0 4px 16px rgba(15, 166, 123, 0.4)';
  });

  button.addEventListener('click', showKeyboardShortcutsHelper);

  document.body.appendChild(button);

  // Add Alt+H shortcut to toggle help
  document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      showKeyboardShortcutsHelper();
    }
  });
}

// Add animation styles
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Enhanced focus indicators */
    *:focus {
      outline: 3px solid #0fa67b !important;
      outline-offset: 2px !important;
    }

    button:focus,
    input:focus,
    select:focus,
    textarea:focus {
      box-shadow: 0 0 0 4px rgba(15, 166, 123, 0.2) !important;
    }

    /* Skip to main content link */
    .skip-link {
      position: absolute;
      top: -50px;
      left: 10px;
      background: #0fa67b;
      color: white;
      padding: 10px 15px;
      text-decoration: none;
      z-index: 100000;
      border-radius: 5px;
      font-weight: 600;
      transition: top 0.3s;
    }

    .skip-link:focus {
      top: 10px;
    }
  `;
  document.head.appendChild(style);
}

// Add skip link for screen readers
function addSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Ensure main has an ID
  const main = document.querySelector('main');
  if (main) {
    main.id = 'main-content';
    main.setAttribute('role', 'main');
  }
}

// Create ARIA live region for announcements
function createAriaLiveRegion() {
  const liveRegion = document.createElement('div');
  liveRegion.id = 'aria-live-region';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
  `;
  document.body.appendChild(liveRegion);
}

// Announce to screen readers
function announceToScreenReader(message) {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 2000);
  }
}

// Add ARIA labels to dynamically created elements
function enhanceAccessibility() {
  // Run after a delay to ensure elements are loaded
  setTimeout(() => {
    // Add ARIA labels to edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      if (!btn.hasAttribute('aria-label')) {
        btn.setAttribute('aria-label', 'Edit transaction');
        btn.setAttribute('title', 'Edit transaction');
      }
    });

    // Add ARIA labels to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      if (!btn.hasAttribute('aria-label')) {
        btn.setAttribute('aria-label', 'Delete transaction');
        btn.setAttribute('title', 'Delete transaction');
      }
    });

    // Make navigation buttons more accessible
    document.querySelectorAll('nav button').forEach(btn => {
      const page = btn.dataset.page;
      if (page && !btn.hasAttribute('aria-label')) {
        btn.setAttribute('aria-label', `Navigate to ${page} page`);
      }
    });
  }, 500);
}

// Initialize all accessibility features
function initializeAccessibility() {
  console.log('✓ Initializing accessibility features...');

  addAnimationStyles();
  addSkipLink();
  createAriaLiveRegion();
  addKeyboardShortcutsButton();
  enhanceAccessibility();

  // Show help on first visit
  const hasSeenKeyboardHelp = localStorage.getItem('hasSeenKeyboardHelp');
  if (!hasSeenKeyboardHelp) {
    setTimeout(() => {
      showKeyboardShortcutsHelper();
      localStorage.setItem('hasSeenKeyboardHelp', 'true');
    }, 3000); // Show after 3 seconds on first visit
  }

  console.log('✓ Accessibility features loaded');
  announceToScreenReader('Finance Tracker application loaded. Press Alt+H for keyboard shortcuts.');
}

// Run accessibility initialization after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  // DOM already loaded
  initializeAccessibility();
}

// Re-enhance accessibility when pages refresh
const originalRefreshAllPages = refreshAllPages;
if (typeof originalRefreshAllPages === 'function') {
  window.refreshAllPages = function() {
    originalRefreshAllPages();
    enhanceAccessibility();
  };
}

// ============================================
// USAGE SUMMARY
// ============================================
/*
KEYBOARD SHORTCUTS AVAILABLE:
- Alt + D = Dashboard
- Alt + A = Add Transaction
- Alt + R = Records
- Alt + S = Savings
- Alt + T = Settings
- Alt + I = About
- Alt + H = Show/Hide keyboard shortcuts help
- Esc = Cancel edit mode
- Tab = Navigate through elements
- Enter = Submit forms / Activate buttons

FEATURES ADDED:
✓ Keyboard navigation shortcuts
✓ Floating help button (bottom-right)
✓ Screen reader announcements
✓ Enhanced focus indicators
✓ Skip to main content link
✓ ARIA labels on buttons
✓ First-visit tutorial popup

TESTING:
1. Press Alt+D to test navigation
2. Click the ⌨️ button to see shortcuts
3. Press Tab to see focus indicators
4. Use Alt+H to toggle help popup
*/
