function updateSavingsPage() {
  const totals = calculateTotals();
  const baseCurrency = getBaseCurrency();

  const savingsAmountElement = document.querySelector("#savings .current-savings h3");
  if (savingsAmountElement) {
    savingsAmountElement.textContent = `${baseCurrency} ${totals.savings.toFixed(2)}`;
  }

  const incomeAmountElement = document.querySelector("#savings .income .amount");
  if (incomeAmountElement) {
    incomeAmountElement.textContent = `+${baseCurrency} ${totals.totalIncome.toFixed(2)}`;
  }

  const expensesAmountElement = document.querySelector("#savings .expenses .amount");
  if (expensesAmountElement) {
    expensesAmountElement.textContent = `-${baseCurrency} ${totals.totalExpenses.toFixed(2)}`;
  }

  updateRecentContributions(baseCurrency);
}

function updateRecentContributions(currency) {
  if (typeof transactions === 'undefined') return;

  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const bottomSection = document.querySelector("#savings .savings-grid");
  if (!bottomSection) return;

  let html = '<h4>📈 Recent Income Contributions</h4>';

  if (incomeTransactions.length === 0) {
    html += '<p style="color: #999; margin: 10px;">No income recorded yet</p>';
  } else {
    const recentIncome = incomeTransactions.slice(-5).reverse();
    recentIncome.forEach(t => {
      const date = new Date(t.date);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      html += `
        <div class="transaction" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
          <div>
            <p style="margin: 0;"><strong>${t.description}</strong></p>
            <p style="margin: 0; font-size: 0.85em; color: #666;">${dateStr}</p>
          </div>
          <p style="margin: 0; color: green; font-weight: bold;">+${currency} ${t.amountInRWF.toFixed(2)}</p>
        </div>
      `;
    });
  }

  let contributionsSection = document.querySelector("#savings .contributions-section");
  if (!contributionsSection) {
    contributionsSection = document.createElement('div');
    contributionsSection.className = 'contributions-section';
    contributionsSection.style.marginTop = '20px';
    bottomSection.parentElement.insertBefore(contributionsSection, bottomSection.nextElementSibling);
  }

  contributionsSection.innerHTML = `<div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">${html}</div>`;
}

document.addEventListener('DOMContentLoaded', function() {
  updateSavingsPage();
});
