const STORAGE_KEYS = {
  BASE_CURRENCY: 'baseCurrency',
  EXCHANGE_RATES: 'exchangeRates',
  BUDGET_CAP: 'budgetCap'
};

let exchangeRates = {};

function loadAllSettings() {
  const savedBaseCurrency = localStorage.getItem(STORAGE_KEYS.BASE_CURRENCY) || 'RWF';
  const baseCurrencySelect = document.getElementById('baseCurrency');
  if (baseCurrencySelect) {
    baseCurrencySelect.value = savedBaseCurrency;
  }

  const savedRates = localStorage.getItem(STORAGE_KEYS.EXCHANGE_RATES);
  if (savedRates) {
    exchangeRates = JSON.parse(savedRates);
  }

  const savedBudgetCap = localStorage.getItem(STORAGE_KEYS.BUDGET_CAP);
  if (savedBudgetCap) {
    const budgetCapInput = document.getElementById('cap');
    if (budgetCapInput) {
      budgetCapInput.value = savedBudgetCap;
    }
  }

  updateCurrencyPreview();
  updateRateLabels();
  updateBudgetStatus();
}

function getBaseCurrency() {
  return localStorage.getItem(STORAGE_KEYS.BASE_CURRENCY) || 'RWF';
}

function setBaseCurrency(currency) {
  localStorage.setItem(STORAGE_KEYS.BASE_CURRENCY, currency);
}

function getBudgetCap() {
  const saved = localStorage.getItem(STORAGE_KEYS.BUDGET_CAP);
  return saved ? parseFloat(saved) : 0;
}

function saveExchangeRate(fromCurrency, rate) {
  const baseCurrency = getBaseCurrency();
  const key = `${fromCurrency}_to_${baseCurrency}`;

  for (const oldKey in exchangeRates) {
    if (oldKey.endsWith(`_to_${baseCurrency}`) && oldKey.startsWith(`${fromCurrency}_`)) {
      delete exchangeRates[oldKey];
    }
  }

  exchangeRates[key] = parseFloat(rate);
  localStorage.setItem(STORAGE_KEYS.EXCHANGE_RATES, JSON.stringify(exchangeRates));
}

function getExchangeRate(fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return 1;
  const key = `${fromCurrency}_to_${toCurrency}`;
  return exchangeRates[key] || null;
}

function convertToBaseCurrency(amount, fromCurrency) {
  const baseCurrency = getBaseCurrency();
  if (fromCurrency === baseCurrency) return amount;
  const rate = getExchangeRate(fromCurrency, baseCurrency);
  if (rate === null) return null;
  return amount * rate;
}

function updateRateLabels() {
  const baseCurrency = getBaseCurrency();
  const currency1Select = document.getElementById('currency-1');
  const currency2Select = document.getElementById('currency-2');
  const rate1Label = document.querySelector('label[for="rate-1"]');
  const rate2Label = document.querySelector('label[for="rate-2"]');

  if (currency1Select && rate1Label) {
    currency1Select.addEventListener('change', function() {
      rate1Label.textContent = `Rate(1 ${this.value}=?${baseCurrency})`;
    });
    rate1Label.textContent = `Rate(1 ${currency1Select.value}=?${baseCurrency})`;
  }

  if (currency2Select && rate2Label) {
    currency2Select.addEventListener('change', function() {
      rate2Label.textContent = `Rate(1 ${this.value}=?${baseCurrency})`;
    });
    rate2Label.textContent = `Rate(1 ${currency2Select.value}=?${baseCurrency})`;
  }
}

function updateCurrencyPreview() {
  const previewContainer = document.querySelector('.currency-preview');
  if (!previewContainer) return;

  let previewHTML = '<h4>Currency Preview</h4>';

  if (Object.keys(exchangeRates).length === 0) {
    previewHTML += '<p style="color: #999;">No exchange rates set yet</p>';
  } else {
    for (const [key, rate] of Object.entries(exchangeRates)) {
      const [fromCurrency, toCurrency] = key.split('_to_');
      previewHTML += `<p>1 ${fromCurrency} = ${rate} ${toCurrency}</p>`;
    }
  }

  previewContainer.innerHTML = previewHTML;
}

// Budget status with ARIA live region
function updateBudgetStatus() {
  let liveRegion = document.getElementById('budget-status-live');

  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'budget-status-live';
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  const budgetCap = getBudgetCap();
  if (budgetCap === 0) return;

  // Calculate current spending
  if (typeof calculateTotals === 'function') {
    const totals = calculateTotals();
    const remaining = budgetCap - totals.totalExpenses;
    const baseCurrency = getBaseCurrency();

    if (remaining < 0) {
      // upon exceeding budget cap- ARIA announce
      liveRegion.setAttribute('aria-live', 'assertive');
      liveRegion.textContent = `Budget exceeded by ${baseCurrency} ${Math.abs(remaining).toFixed(2)}`;
    } else {
      // Under the set budget cap - polite announcement
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.textContent = `Budget remaining: ${baseCurrency} ${remaining.toFixed(2)}`;
    }
  }
}

const settingsForm = document.querySelector('#settings form');
if (settingsForm) {
  settingsForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const baseCurrency = document.getElementById('baseCurrency').value;
    setBaseCurrency(baseCurrency);

    const currency1 = document.getElementById('currency-1').value;
    const rate1 = document.getElementById('rate-1').value;
    const currency2 = document.getElementById('currency-2').value;
    const rate2 = document.getElementById('rate-2').value;

    exchangeRates = {};

    if (currency1 && rate1) {
      const parsedRate1 = parseFloat(rate1);
      if (!isNaN(parsedRate1) && parsedRate1 > 0) {
        saveExchangeRate(currency1, parsedRate1);
      }
    }

    if (currency2 && rate2) {
      const parsedRate2 = parseFloat(rate2);
      if (!isNaN(parsedRate2) && parsedRate2 > 0) {
        saveExchangeRate(currency2, parsedRate2);
      }
    }

    const budgetCap = document.getElementById('cap').value;
    if (budgetCap) {
      localStorage.setItem(STORAGE_KEYS.BUDGET_CAP, budgetCap);
    }

    updateCurrencyPreview();
    updateBudgetStatus();

    const submitBtn = settingsForm.querySelector('button[type="submit"]');
    const originalHTML = submitBtn.innerHTML;

    submitBtn.textContent = 'Settings Saved ✓';
    submitBtn.style.backgroundColor = '#28a745';
    submitBtn.style.color = '#fff';

    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.style.backgroundColor = '';
      submitBtn.style.color = '';
    }, 1500);
  });
}
