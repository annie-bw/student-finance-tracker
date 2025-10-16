let transactions = [];
let editingId = null;

// Regex patterns
const REGEX_PATTERNS = {
  description: /^\S(?:.*\S)?$/, // No leading/trailing spaces
  amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/, // valid number (2 decimal palces)
  date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, // accepot only YYYY-MM-DD format
  category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, //letters, spaces, hyphens only
  duplicateWords: /\b(\w+)\s+\1\b/i // catch duplicate consecutive words
};

function loadTransactions() {
  const saved = localStorage.getItem('transactions');
  if (saved) {
    transactions = JSON.parse(saved);
  }
}

function saveTransactionsToStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction(transactionData) {
  const baseCurrency = getBaseCurrency();
  const convertedAmount = convertToBaseCurrency(transactionData.amount, transactionData.currency);

  if (convertedAmount === null) {
    return {
      success: false,
      message: `Conversion rate not set for ${transactionData.currency} → ${baseCurrency}`
    };
  }

  const now = new Date().toISOString(); // ← ADD THIS LINE

  const transaction = {
    id: editingId || Date.now(),
    date: transactionData.date,
    description: transactionData.description,
    category: transactionData.category,
    amount: transactionData.amount,
    currency: transactionData.currency,
    amountInRWF: convertedAmount,
    type: transactionData.type,
    createdAt: editingId ? (getTransaction(editingId)?.createdAt || now) : now, 
    updatedAt: now
  };

  if (editingId) {
    const index = transactions.findIndex(t => t.id === editingId);
    if (index !== -1) {
      transactions[index] = transaction;
    }
    editingId = null;
  } else {
    transactions.push(transaction);
  }

  saveTransactionsToStorage();
  return { success: true, transaction };
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactionsToStorage();
}

function getTransaction(id) {
  return transactions.find(t => t.id === id);
}

function calculateTotals() {
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals = {};

  if (typeof transactions === 'undefined' || !Array.isArray(transactions)) {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      savings: 0,
      budgetCap: 0,
      remainingBudget: 0,
      topCategory: null,
      topAmount: 0,
      categoryTotals: {}
    };
  }

  transactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amountInRWF || 0;
    } else if (t.type === 'expense') {
      totalExpenses += t.amountInRWF || 0;
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + (t.amountInRWF || 0);
    }
  });

  const savings = totalIncome - totalExpenses;
  const budgetCap = getBudgetCap();
  const remainingBudget = budgetCap - totalExpenses;

  let topCategory = null;
  let topAmount = 0;
  for (const [category, amount] of Object.entries(categoryTotals)) {
    if (amount > topAmount) {
      topAmount = amount;
      topCategory = category;
    }
  }

  return {
    totalIncome,
    totalExpenses,
    savings,
    budgetCap,
    remainingBudget,
    topCategory,
    topAmount,
    categoryTotals
  };
}

function getSpendingByDate() {
  const spendingByDate = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const dateStr = new Date(t.date).toDateString();
      spendingByDate[dateStr] = (spendingByDate[dateStr] || 0) + t.amountInRWF;
    }
  });
  return spendingByDate;
}

// check each feild with specific regex
function validateField(fieldName, value) {
  switch(fieldName) {
    case 'description':
      // Check for leading/trailing spaces and duplicate words
      if (!REGEX_PATTERNS.description.test(value)) {
        return { valid: false, message: 'Description cannot have leading/trailing spaces' };
      }
      if (REGEX_PATTERNS.duplicateWords.test(value)) {
        return { valid: false, message: 'Description contains duplicate consecutive words' };
      }
      return { valid: true };

    case 'amount':
      if (!REGEX_PATTERNS.amount.test(value)) {
        return { valid: false, message: 'Amount must be a valid number (e.g., 100 or 100.50)' };
      }
      return { valid: true };

    case 'date':
      if (!REGEX_PATTERNS.date.test(value)) {
        return { valid: false, message: 'Date must be in YYYY-MM-DD format' };
      }
      return { valid: true };

    case 'category':
      if (!REGEX_PATTERNS.category.test(value)) {
        return { valid: false, message: 'Category can only contain letters, spaces, and hyphens' };
      }
      return { valid: true };

    default:
      return { valid: true };
  }
}

function showButtonFeedback(button, message, color) {
  const originalText = button.textContent;
  button.textContent = message;
  button.style.backgroundColor = color;
  button.style.color = '#fff';

  setTimeout(() => {
    button.textContent = originalText;
    button.style.backgroundColor = '';
    button.style.color = '';
  }, 2500);
}

// Show validation error near field
function showFieldError(element, message) {
  element.style.border = "2px solid #dc3545";

  // Remove existing error message if any
  const existingError = element.parentElement.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }

  const errorSpan = document.createElement('span');
  errorSpan.className = 'field-error';
  errorSpan.textContent = message;
  errorSpan.style.color = '#dc3545';
  errorSpan.style.fontSize = '0.85em';
  errorSpan.style.display = 'block';
  errorSpan.style.marginTop = '4px';
  element.parentElement.appendChild(errorSpan);
}

// Clear field error
function clearFieldError(element) {
  element.style.border = "";
  const errorSpan = element.parentElement.querySelector('.field-error');
  if (errorSpan) {
    errorSpan.remove();
  }
}

const transactionForm = document.querySelector("#transactionForm form");
if (transactionForm) {
  transactionForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value.trim();
    const category = document.getElementById("category").value;
    const amountInput = document.getElementById("amount");
    const amountStr = amountInput.value.trim();
    const amount = parseFloat(amountStr);
    const currency = document.getElementById("currency").value;
    const type = document.getElementById("transactionType").value;
    const addBtn = document.getElementById("addBtn");

    // Clear previous errors
    document.querySelectorAll('#transactionForm input, #transactionForm select').forEach(el => {
      clearFieldError(el);
    });

    let hasError = false;
    const validations = [];

//citing code with mosh to clear errors so that we prevent the bugs

    // Validate description
    if (!description) {
      showFieldError(document.getElementById("description"), "Description is required");
      hasError = true;
    } else {
      const descValidation = validateField('description', description);
      if (!descValidation.valid) {
        showFieldError(document.getElementById("description"), descValidation.message);
        hasError = true;
      }
    }

    // Validate amount
    if (!amountStr) {
      showFieldError(amountInput, "Amount is required");
      hasError = true;
    } else {
      const amountValidation = validateField('amount', amountStr);
      if (!amountValidation.valid) {
        showFieldError(amountInput, amountValidation.message);
        hasError = true;
      } else if (isNaN(amount) || amount <= 0) {
        showFieldError(amountInput, "Amount must be greater than 0");
        hasError = true;
      }
    }

    // Validate date
    if (!date) {
      showFieldError(document.getElementById("date"), "Date is required");
      hasError = true;
    } else {
      const dateValidation = validateField('date', date);
      if (!dateValidation.valid) {
        showFieldError(document.getElementById("date"), dateValidation.message);
        hasError = true;
      }
    }

    // Validate category
    if (!category) {
      showFieldError(document.getElementById("category"), "Please select a category");
      hasError = true;
    }

    if (hasError) {
      showButtonFeedback(addBtn, " Fix errors above", "#dc3545");
      return;
    }

    const result = addTransaction({
      date,
      description,
      category,
      amount,
      currency,
      type
    });

    if (!result.success) {
      showButtonFeedback(addBtn, result.message, "#dc3545");
      return;
    }

    const isUpdate = editingId !== null;
    showButtonFeedback(addBtn, isUpdate ? "✓ Updated!" : "✓ Added!", "#28a745");

    if (typeof refreshAllPages === 'function') {
      refreshAllPages();
    }

    e.target.reset();
    editingId = null;

    // Reset button text after feedback
    setTimeout(() => {
      addBtn.textContent = "Add Transaction";
    }, 1500);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadTransactions();
});
