let spendingChart = null;

function updateDashboard() {
  const totals = calculateTotals();
  const baseCurrency = getBaseCurrency();

  const expensesElement = document.querySelector(".finance-summary.expenses h3");
  if (expensesElement) {
    expensesElement.textContent = `${baseCurrency} ${totals.totalExpenses.toFixed(2)}`;
  }

  const savingsElements = document.querySelectorAll(".finance-summary.savings h3");
  savingsElements.forEach(el => {
    el.textContent = `${baseCurrency} ${totals.savings.toFixed(2)}`;
  });

  const topCategoryElement = document.querySelector(".finance-summary.spending h3");
  if (topCategoryElement) {
    topCategoryElement.textContent = totals.topCategory
      ? totals.topCategory.charAt(0).toUpperCase() + totals.topCategory.slice(1)
      : "None";
  }

  const topCategoryAmountElement = document.querySelector(".finance-summary.spending .small-text");
  if (topCategoryAmountElement && totals.topCategory) {
    topCategoryAmountElement.textContent = `${baseCurrency} ${totals.topAmount.toFixed(2)}`;
  }

  const remainingElement = document.querySelector(".finance-summary.remaining h3");
  if (remainingElement) {
    remainingElement.textContent = `${baseCurrency} ${totals.remainingBudget.toFixed(2)}`;
  }

  const capElement = document.querySelector(".finance-summary.remaining .small-text");
  if (capElement) {
    capElement.textContent = `Cap: ${baseCurrency} ${totals.budgetCap.toFixed(2)}`;
  }

  // Update budget status with ARIA announcement
  if (typeof updateBudgetStatus === 'function') {
    updateBudgetStatus();
  }

  updateSpendingChart();
  updateCategoryBreakdown(totals.categoryTotals, totals.budgetCap, baseCurrency);
}

function updateSpendingChart() {
  const canvas = document.getElementById('spendingChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const spendingByDate = getSpendingByDate();

  const today = new Date();
  const dates = [];
  const amounts = [];

  // Generate last 7 days of data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    amounts.push(spendingByDate[dateStr] || 0);
  }

  if (spendingChart) {
    spendingChart.destroy();
  }

  spendingChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: dates,
      datasets: [{
        label: 'Daily Spending (RWF)',
        data: amounts,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toFixed(0);
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `RWF ${context.parsed.y.toFixed(2)}`;
            }
          }
        },
        legend: {
          display: false
        }
      }
    }
  });
}

function updateCategoryBreakdown(categoryTotals, budgetCap, currency) {
  const container = document.getElementById('categoryBreakdown');
  if (!container) return;

  let html = '<h3>Spending by Category</h3>';

  const categories = ['fees', 'others', 'rent', 'books', 'food', 'entertainment', 'transport'];
  const categoryNames = {
    fees: 'Fees',
    others: 'Others',
    rent: 'Rent',
    books: 'Books',
    food: 'Food',
    entertainment: 'Entertainment',
    transport: 'Transport'
  };

  const sortedCategories = categories
    .map(cat => ({ name: cat, amount: categoryTotals[cat] || 0 }))
    .filter(cat => cat.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  sortedCategories.forEach(cat => {
    const percentage = budgetCap > 0 ? (cat.amount / budgetCap) * 100 : 0;
    html += `
      <div class="category-item">
        <p>${categoryNames[cat.name]}</p>
        <div class="bar">
          <div class="fill ${cat.name}" style="width:${Math.min(percentage, 100)}%;"></div>
        </div>
        <span>${currency} ${cat.amount.toFixed(2)} (${percentage.toFixed(1)}%)</span>
      </div>
    `;
  });

  if (sortedCategories.length === 0) {
    html += '<p style="color: #999;">No expenses recorded yet</p>';
  }

  container.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
  updateDashboard();
});
