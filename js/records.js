// is regex search is enabled?
let isRegexMode = false;
let currentRegexPattern = null;

function renderTransactions(filtered = null) {
  const tbody = document.querySelector("#recordsTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  const toDisplay = filtered || transactions;

  if (toDisplay.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="7" style="text-align: center; padding: 20px; color: #999;">No transactions yet</td>`;
    tbody.appendChild(row);
    return;
  }

  toDisplay.forEach(t => {
    if (!t.id || !t.date || !t.description || !t.category || !t.type || t.amountInRWF === undefined) {
      return;
    }

    let description = t.description;

    //  if regex search is active,highlight matches
    if (isRegexMode && currentRegexPattern) {
      description = highlightMatches(t.description, currentRegexPattern);
    }

    const row = document.createElement("tr");
    row.dataset.id = t.id;
//citing chat GPT, this is how to get the date of today and do live search//
    row.innerHTML = `
      <td>${new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</
       td>
      <td>${description}</td>
      <td><span class="badge">${t.category}</span></td>
      <td style="color:${t.type === "income" ? "green" : "red"}">${t.type}</td>
      <td>${t.amountInRWF.toFixed(2)}</td>
      <td>RWF</td>
      <td class="action-section">
        <div class="buttons-grid">
          <button class="action-btn edit-btn" data-id="${t.id}" title="Edit">✏️</button>
          <button class="action-btn delete-btn" data-id="${t.id}" title="Delete">🗑️</button>
        </div>

      </td>
    `;
    tbody.appendChild(row);
  });
}

// show regex matches with mark tags
function highlightMatches(text, regex) {
  try {
    // Store text content safely
    const matches = [];
    let match;
    const regexGlobal = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');

    while ((match = regexGlobal.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0]
      });
    }

    if (matches.length === 0) return text;

    // make it a string
    let result = '';
    let lastIndex = 0;

    matches.forEach(m => {
      result += text.substring(lastIndex, m.start);
      result += `<mark style="background-color: #ffeb3b; padding: 2px 4px; border-radius: 2px;">${m.text}</mark>`;
      lastIndex = m.end;
    });
    result += text.substring(lastIndex);

    return result;
  } catch (e) {
    return text;
  }
}

function applyFilters() {
  if (typeof transactions === 'undefined') return;

  const searchInput = document.querySelector('[placeholder="Search transaction..."]');
  const searchTerm = searchInput ? searchInput.value : '';
  const categoryFilter = document.getElementById('category-filter').value;
  const fromDate = document.getElementById('from').value;
  const toDate = document.getElementById('to').value;
  const typeFilter = document.getElementById('type').value;
  const sortFilter = document.getElementById('sort').value;

  let filtered = transactions;

  // see if pattern looks like regex (contains special characters)
  const regexIndicators = /[.*+?^${}()|[\]\\]/;
  if (searchTerm && regexIndicators.test(searchTerm)) {
    try {
      const flags = 'i'; // Case insensitive by default
      const regex = new RegExp(searchTerm, flags);
      currentRegexPattern = regex;
      isRegexMode = true;

      filtered = transactions.filter(t => regex.test(t.description));

      // show green error border
      searchInput.style.borderLeft = '4px solid #4CAF50';
      searchInput.title = 'Regex mode active';
    } catch (e) {
      // show red error border
      searchInput.style.borderLeft = '4px solid #dc3545';
      searchInput.title = 'Invalid regex pattern: ' + e.message;
      isRegexMode = false;
      currentRegexPattern = null;

      //go back to normal search
      filtered = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  } else {
    // normal text search
    isRegexMode = false;
    currentRegexPattern = null;
    searchInput.style.borderLeft = '';
    searchInput.title = '';

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  // apply other filters
  filtered = filtered.filter(t => {
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const transDate = new Date(t.date);
    const matchesFromDate = !fromDate || transDate >= new Date(fromDate);
    const matchesToDate = !toDate || transDate <= new Date(toDate);

    return matchesCategory && matchesType && matchesFromDate && matchesToDate;
  });

  // apply sorting
  filtered.sort((a, b) => {
    switch(sortFilter) {
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'high':
        return b.amountInRWF - a.amountInRWF;
      case 'low':
        return a.amountInRWF - b.amountInRWF;
      case 'category-sort':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  renderTransactions(filtered);
}

setTimeout(() => {
  const filterInputs = document.querySelectorAll('[placeholder="Search transaction..."], #category-filter, #from, #to, #type, #sort');
  filterInputs.forEach(input => {
    if (input) {
      input.addEventListener('change', applyFilters);
      input.addEventListener('keyup', applyFilters);
    }
  });

  const clearFiltersBtn = document.querySelector('button[type="clear"]');
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', function(e) {
      e.preventDefault();
      const searchInput = document.querySelector('[placeholder="Search transaction..."]');
      if (searchInput) {
        searchInput.value = '';
        searchInput.style.borderLeft = '';
        searchInput.title = '';
      }
      document.getElementById('category-filter').value = 'all';
      document.getElementById('from').value = '';
      document.getElementById('to').value = '';
      document.getElementById('type').value = 'all';
      document.getElementById('sort').value = 'newest';
      isRegexMode = false;
      currentRegexPattern = null;
      renderTransactions();
    });
  }
}, 200);

setTimeout(() => {
  const recordsTableBody = document.querySelector("#recordsTable tbody");
  if (recordsTableBody) {
    recordsTableBody.addEventListener("click", function(e) {
      const button = e.target.closest('.action-btn');
      if (!button) return;
      const id = parseInt(button.dataset.id);

      if (button.classList.contains("delete-btn")) {
        if (confirm("Are you sure you want to delete this transaction?")) {
          if (typeof deleteTransaction === 'function') {
            deleteTransaction(id);
          }
          renderTransactions();
          if (typeof refreshAllPages === 'function') {
            refreshAllPages();
          }
        }
      } else if (button.classList.contains("edit-btn")) {
        if (typeof getTransaction === 'function') {
          const transaction = getTransaction(id);
          if (transaction) {
            editingId = id;
            document.getElementById("date").value = transaction.date;
            document.getElementById("description").value = transaction.description;
            document.getElementById("category").value = transaction.category;
            document.getElementById("amount").value = transaction.amount;
            document.getElementById("currency").value = transaction.currency;
            document.getElementById("transactionType").value = transaction.type;

            const addBtn = document.getElementById("addBtn");
            addBtn.textContent = "Update Transaction";

            document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
            document.getElementById('transaction').style.display = 'block';
            document.getElementById("transactionForm").scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    });
  }
}, 200);

function exportToCSV() {
  if (typeof transactions === 'undefined' || transactions.length === 0) {
    alert("No transactions to export!");
    return;
  }

  try {
    const headers = ["Date", "Description", "Category", "Type", "Amount (RWF)"];
    let csvContent = headers.map(h => `"${h}"`).join(",") + "\n";

    transactions.forEach(t => {
// skip incomplete entries
        //citing w3 schools, this is a way to avoid console errors

      if (!t.date || !t.description || !t.category || !t.type || t.amountInRWF === undefined) {
        return;
      }

      const row = [
        new Date(t.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        `"${t.description}"`,
        t.category,
        t.type,
        t.amountInRWF.toFixed(2)
      ];
      csvContent += row.join(",") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("CSV exported successfully!");
  } catch (error) {
    console.error('CSV export error:', error);
    alert("Error exporting CSV");
  }
}

const csvExportBtn = document.getElementById('csvExportBtn');
if (csvExportBtn) {
  csvExportBtn.addEventListener('click', exportToCSV);
}
